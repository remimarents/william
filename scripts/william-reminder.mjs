#!/usr/bin/env node

const config = {
  topic: process.env.NTFY_TOPIC || "william-trene-wb-8v4k9m2p",
  appUrl: process.env.APP_URL || "https://remimarents.github.io/william/trene/",
  timezone: process.env.TZ_NAME || "Europe/Oslo",
  defaultReminderTime: process.env.DEFAULT_REMINDER_TIME || "19:30",
  statePath: process.env.STATE_PATH || `${process.env.HOME}/.william-trene-reminder-state.json`
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

function pickMessage(dateKey) {
  const seed = [...dateKey].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return messages[seed % messages.length];
}

async function fetchRecentNtfyMessages() {
  const url = `https://ntfy.sh/${encodeURIComponent(config.topic)}/json?poll=1&since=72h`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ntfy poll failed: ${response.status} ${response.statusText}`);
  }

  const text = await response.text();
  return text
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((message) => message.event === "message");
}

function normalizeReminderConfig(value = {}) {
  const reminderTime = typeof value.reminderTime === "string" && /^\d{2}:\d{2}$/.test(value.reminderTime)
    ? value.reminderTime
    : config.defaultReminderTime;
  return {
    enabled: value.enabled !== false,
    reminderTime
  };
}

function latestReminderConfig(messagesToCheck, state) {
  const fallback = normalizeReminderConfig(state.reminderConfig);
  return messagesToCheck
    .filter((message) => message.title === "Trene-config" && message.message)
    .sort((a, b) => (a.time || 0) - (b.time || 0))
    .reduce((current, message) => {
      try {
        const parsed = JSON.parse(message.message);
        if (parsed.type !== "william-trene-config") return current;
        return normalizeReminderConfig(parsed);
      } catch {
        return current;
      }
    }, fallback);
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

function reminderIsDue(reminderTime) {
  const [hours, minutes] = reminderTime.split(":").map(Number);
  return localTimeMinutes() >= hours * 60 + minutes;
}

function hasCompletionForToday(messagesToCheck, today) {
  return messagesToCheck.some((message) => {
    const messageDate = message.time ? localDate(new Date(message.time * 1000)) : "";
    const title = message.title || "";
    const body = message.message || "";
    return messageDate === today && (title === "Bra jobbet" || body.includes(`Økt fullført ${today}`));
  });
}

async function readState() {
  try {
    const file = await import("node:fs/promises");
    return JSON.parse(await file.readFile(config.statePath, "utf8"));
  } catch {
    return {};
  }
}

async function writeState(state) {
  const file = await import("node:fs/promises");
  await file.writeFile(config.statePath, `${JSON.stringify(state, null, 2)}\n`);
}

async function publishReminder(today) {
  const body = test
    ? "Dette er en test fra Mac mini-påminneren."
    : pickMessage(today);

  const headers = {
    Title: test ? "Trene-test fra Mac mini" : "Trene i dag?",
    Tags: test ? "computer,muscle" : "muscle,alarm_clock",
    Priority: test ? "default" : "high",
    Click: config.appUrl
  };

  if (dryRun) {
    console.log(JSON.stringify({ dryRun: true, topic: config.topic, headers, body }, null, 2));
    return true;
  }

  const response = await fetch(`https://ntfy.sh/${encodeURIComponent(config.topic)}`, {
    method: "POST",
    headers,
    body
  });

  if (!response.ok) {
    throw new Error(`ntfy publish failed: ${response.status} ${response.statusText}`);
  }

  return true;
}

async function main() {
  const today = localDate();
  const state = await readState();

  if (test) {
    await publishReminder(today);
    console.log("test notification sent");
    return;
  }

  if (!force && state.lastReminderSent === today) {
    console.log(`reminder already sent for ${today}`);
    return;
  }

  const recentMessages = await fetchRecentNtfyMessages();
  const reminderConfig = latestReminderConfig(recentMessages, state);
  state.reminderConfig = reminderConfig;

  if (!reminderConfig.enabled) {
    console.log("reminders disabled by app config");
    await writeState(state);
    return;
  }

  if (!force && !reminderIsDue(reminderConfig.reminderTime)) {
    console.log(`not due yet; reminder time is ${reminderConfig.reminderTime}`);
    await writeState(state);
    return;
  }

  if (!force && hasCompletionForToday(recentMessages, today)) {
    console.log(`workout already completed for ${today}`);
    state.lastSkippedCompleted = today;
    await writeState(state);
    return;
  }

  await publishReminder(today);
  if (!dryRun) {
    state.lastReminderSent = today;
    await writeState(state);
  }
  console.log(`${dryRun ? "dry-run reminder checked" : "reminder sent"} for ${today}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
