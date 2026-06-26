#!/usr/bin/env node

import { execFile } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const config = {
  appUrl: process.env.APP_URL || "https://marents.no/trening/",
  timezone: process.env.TZ_NAME || "Europe/Oslo",
  defaultReminderTime: process.env.DEFAULT_REMINDER_TIME || "19:30",
  statePath: process.env.STATE_PATH || `${process.env.HOME}/.william-trene-reminder-state.json`,
  sshHost: process.env.MARENTS_SSH_HOST || "marents",
  remoteProgressDir: process.env.TRAINING_PROGRESS_DIR || "/home/marentsn/.ordreise-sync/trening-progress",
  testRecipient: process.env.IMESSAGE_RECIPIENT || ""
};

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const force = args.has("--force");
const test = args.has("--test");

const messages = [
  "Dagens økt er liten nok til å starte nå. Ta den rolig, registrer faktisk antall, og hold streaken i live.",
  "Bare start med første sett. Når kroppen er i gang, er resten enklere.",
  "Målet er ikke å makse hver dag. Målet er å møte opp, gjøre jobben, og bygge styrke jevnt.",
  "Teknikk først: strak kropp, kontrollerte reps, og stopp før formen ryker.",
  "To minutter med startmotstand er ofte den tyngste delen. Åpne appen og ta dagens mål."
];

function localDate(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: config.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${byType.year}-${byType.month}-${byType.day}`;
}

function localTimeMinutes(date = new Date()) {
  const parts = new Intl.DateTimeFormat("sv-SE", {
    timeZone: config.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).formatToParts(date);
  const byType = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return Number(byType.hour) * 60 + Number(byType.minute);
}

function pickMessage(dateKey, accountEmail = "") {
  const seed = [...`${dateKey}:${accountEmail}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return messages[seed % messages.length];
}

function normalizeReminderTime(value) {
  return typeof value === "string" && /^\d{2}:\d{2}$/.test(value) ? value : config.defaultReminderTime;
}

function reminderIsDue(reminderTime) {
  const [hours, minutes] = normalizeReminderTime(reminderTime).split(":").map(Number);
  return localTimeMinutes() >= hours * 60 + minutes;
}

function sanitizeRecipient(value) {
  return String(value || "").trim().replace(/[^\p{L}\p{N}@+._ -]/gu, "").slice(0, 90);
}

function userLabel(state) {
  return state?.profile?.name || state?.accountEmail || "Trening";
}

function completedForDate(state, dateKey) {
  const history = Array.isArray(state?.history) ? state.history : [];
  return history.some((entry) => entry && entry.date === dateKey);
}

function latestEntryForDate(state, dateKey) {
  const history = Array.isArray(state?.history) ? state.history : [];
  return history
    .filter((entry) => entry && entry.date === dateKey)
    .sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")))[0] || null;
}

function formatCompletionSummary(state, dateKey) {
  const entry = latestEntryForDate(state, dateKey);
  const exercises = entry?.actual?.exercises || {};
  const summary = Object.entries(exercises)
    .filter(([, value]) => Number(value?.total || 0) > 0)
    .map(([key, value]) => `${value.total} ${key}`)
    .join(", ");
  return summary ? `Registrert: ${summary}.` : "Økten er registrert.";
}

async function readState() {
  try {
    return JSON.parse(await readFile(config.statePath, "utf8"));
  } catch {
    return {};
  }
}

async function writeState(state) {
  await writeFile(config.statePath, `${JSON.stringify(state, null, 2)}\n`);
}

async function fetchRemoteTrainingStates() {
  const remoteScript = [
    `dir=${shellQuote(config.remoteProgressDir)}`,
    "[ -d \"$dir\" ] || exit 0",
    "find \"$dir\" -maxdepth 1 -type f -name '*.json' -print0 | while IFS= read -r -d '' file; do",
    "  printf '%s\\t' \"$(basename \"$file\")\"",
    "  base64 < \"$file\" | tr -d '\\n'",
    "  printf '\\n'",
    "done"
  ].join("\n");
  const { stdout } = await execFileAsync("ssh", [config.sshHost, remoteScript], { maxBuffer: 20 * 1024 * 1024 });
  return stdout
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [fileName, encoded] = line.split("\t");
      try {
        return {
          fileName,
          state: JSON.parse(Buffer.from(encoded || "", "base64").toString("utf8"))
        };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

async function sendImessage(recipient, body) {
  const cleanRecipient = sanitizeRecipient(recipient);
  if (!cleanRecipient) return false;

  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, recipient: cleanRecipient, body }, null, 2));
    return true;
  }

  const script = `
on run argv
  set targetRecipient to item 1 of argv
  set bodyText to item 2 of argv
  tell application "Messages"
    set targetService to 1st service whose service type = iMessage
    set targetBuddy to buddy targetRecipient of targetService
    send bodyText to targetBuddy
  end tell
end run
`;
  await execFileAsync("osascript", ["-e", script, cleanRecipient, body], { maxBuffer: 1024 * 1024 });
  return true;
}

async function handleQueuedTests(remoteStates, reminderState) {
  let sentCount = 0;
  reminderState.testRequests = reminderState.testRequests || {};

  for (const { state } of remoteStates) {
    const email = String(state.accountEmail || state.profile?.userId || "").toLowerCase();
    const requestedAt = String(state.notifications?.imessageTestRequestedAt || "");
    const alreadySentAt = reminderState.testRequests[email] || "";
    const recipient = sanitizeRecipient(state.profile?.imessageRecipient);
    if (!email || !requestedAt || requestedAt <= alreadySentAt || !recipient) continue;

    const body = `Test fra Trening: Mac mini kan sende iMessage-påminnelser til ${userLabel(state)}. ${config.appUrl}`;
    await sendImessage(recipient, body);
    reminderState.testRequests[email] = requestedAt;
    sentCount += 1;
  }

  return sentCount;
}

async function handleDailyReminders(remoteStates, reminderState) {
  const today = localDate();
  let sentCount = 0;
  reminderState.dailyReminders = reminderState.dailyReminders || {};

  for (const { state } of remoteStates) {
    const profile = state.profile || {};
    const email = String(state.accountEmail || profile.userId || "").toLowerCase();
    const recipient = sanitizeRecipient(profile.imessageRecipient);
    const reminderTime = normalizeReminderTime(profile.reminderTime);
    const key = `${email || recipient}:${today}`;
    if (!email || !recipient) continue;
    if (profile.remindersEnabled === false) continue;
    if (!force && reminderState.dailyReminders[key]) continue;
    if (!force && !reminderIsDue(reminderTime)) continue;
    if (!force && completedForDate(state, today)) {
      reminderState.lastSkippedCompleted = { email, date: today, summary: formatCompletionSummary(state, today) };
      continue;
    }

    const body = `Trening: ${pickMessage(today, email)} ${config.appUrl}`;
    await sendImessage(recipient, body);
    reminderState.dailyReminders[key] = new Date().toISOString();
    sentCount += 1;
  }

  return sentCount;
}

async function sendManualTest(remoteStates) {
  const target =
    sanitizeRecipient(config.testRecipient) ||
    remoteStates.map(({ state }) => sanitizeRecipient(state.profile?.imessageRecipient)).find(Boolean);
  if (!target) {
    throw new Error("Mangler iMessage-mottaker. Sett IMESSAGE_RECIPIENT eller legg mottaker i Trening-innstillinger.");
  }
  await sendImessage(target, `Test fra Mac mini-påminneren for Trening. ${config.appUrl}`);
  console.log(`${dryRun ? "dry-run test prepared" : "test iMessage sent"} to ${target}`);
}

async function main() {
  const reminderState = await readState();
  const remoteStates = await fetchRemoteTrainingStates();

  if (test) {
    await sendManualTest(remoteStates);
    return;
  }

  const testCount = await handleQueuedTests(remoteStates, reminderState);
  const reminderCount = await handleDailyReminders(remoteStates, reminderState);

  if (!dryRun) await writeState(reminderState);
  console.log(`${dryRun ? "dry-run checked" : "checked"} ${remoteStates.length} training users; ${testCount} tests, ${reminderCount} reminders`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
