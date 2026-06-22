const STORAGE_KEY = "william-trene-v1";
const AUTH_KEY = "william-trene-auth-v1";
const AUTH_USER = "williamberner";
const AUTH_PASSWORD_HASH = "c4dc08362079d1937a6e12c2ee0be77b70dbdb7e5d8ac7bd63b24122a7f25f16";
const DAY_MS = 24 * 60 * 60 * 1000;

const defaultState = {
  version: 1,
  profile: {
    name: "William",
    pushBase: 15,
    situpBase: 0,
    sets: 2,
    goal: 100
  },
  history: []
};

const els = {
  appShell: document.querySelector("#appShell"),
  loginShell: document.querySelector("#loginShell"),
  loginForm: document.querySelector("#loginForm"),
  usernameInput: document.querySelector("#usernameInput"),
  passwordInput: document.querySelector("#passwordInput"),
  loginError: document.querySelector("#loginError"),
  todayLabel: document.querySelector("#todayLabel"),
  streakDays: document.querySelector("#streakDays"),
  xpTotal: document.querySelector("#xpTotal"),
  bestPushups: document.querySelector("#bestPushups"),
  goalPercent: document.querySelector("#goalPercent"),
  goalFill: document.querySelector("#goalFill"),
  title: document.querySelector("#todayWorkoutTitle"),
  exerciseList: document.querySelector("#exerciseList"),
  completeButton: document.querySelector("#completeButton"),
  dailyHint: document.querySelector("#dailyHint"),
  nextPushGoal: document.querySelector("#nextPushGoal"),
  situpStatus: document.querySelector("#situpStatus"),
  historyList: document.querySelector("#historyList"),
  milestones: document.querySelector("#milestones"),
  exportButton: document.querySelector("#exportButton"),
  logoutButton: document.querySelector("#logoutButton"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsDialog: document.querySelector("#settingsDialog"),
  saveSettingsButton: document.querySelector("#saveSettingsButton"),
  nameInput: document.querySelector("#nameInput"),
  pushBaseInput: document.querySelector("#pushBaseInput"),
  situpBaseInput: document.querySelector("#situpBaseInput"),
  setsInput: document.querySelector("#setsInput"),
  badges: {
    first: document.querySelector("#badgeFirst"),
    week: document.querySelector("#badgeWeek"),
    fifty: document.querySelector("#badgeFifty"),
    hundred: document.querySelector("#badgeHundred")
  }
};

let state = loadState();

async function hashText(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isAuthenticated() {
  return localStorage.getItem(AUTH_KEY) === AUTH_PASSWORD_HASH;
}

function setAuthenticated() {
  localStorage.setItem(AUTH_KEY, AUTH_PASSWORD_HASH);
  showApp();
}

function showApp() {
  els.loginShell.classList.add("is-unlocked");
  els.appShell.classList.remove("is-locked");
  els.appShell.removeAttribute("aria-hidden");
}

function showLogin() {
  els.appShell.classList.add("is-locked");
  els.appShell.setAttribute("aria-hidden", "true");
  els.loginShell.classList.remove("is-unlocked");
  els.passwordInput.value = "";
  els.usernameInput.focus();
}

async function handleLogin(event) {
  event.preventDefault();
  els.loginError.textContent = "";

  const username = els.usernameInput.value.trim().toLowerCase();
  const passwordHash = await hashText(els.passwordInput.value);

  if (username === AUTH_USER && passwordHash === AUTH_PASSWORD_HASH) {
    setAuthenticated();
    return;
  }

  els.loginError.textContent = "Feil brukernavn eller passord.";
  els.passwordInput.value = "";
  els.passwordInput.focus();
}

function logout() {
  localStorage.removeItem(AUTH_KEY);
  showLogin();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return parsed?.version === 1 ? parsed : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function isoDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function dateKeyToLocalDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatDate(key) {
  return new Intl.DateTimeFormat("no-NO", {
    weekday: "short",
    day: "numeric",
    month: "short"
  }).format(dateKeyToLocalDate(key));
}

function completedToday() {
  return state.history.some((entry) => entry.date === isoDate());
}

function sortedHistory() {
  return [...state.history].sort((a, b) => b.date.localeCompare(a.date));
}

function currentStreak() {
  const days = new Set(state.history.map((entry) => entry.date));
  let count = 0;
  let cursor = new Date();

  while (days.has(isoDate(cursor))) {
    count += 1;
    cursor = new Date(cursor.getTime() - DAY_MS);
  }

  return count;
}

function bestPushups() {
  return Math.max(state.profile.pushBase, ...state.history.map((entry) => entry.pushupsPerSet || 0));
}

function bestSitups() {
  return Math.max(state.profile.situpBase, ...state.history.map((entry) => entry.situpsPerSet || 0));
}

function xpTotal() {
  return state.history.reduce((sum, entry) => sum + entry.xp, 0);
}

function workoutForToday() {
  const doneCount = state.history.length;
  const best = bestPushups();
  const isRecovery = doneCount > 0 && (doneCount + 1) % 7 === 0;
  const pushupsPerSet = Math.min(
    state.profile.goal,
    Math.max(1, isRecovery ? Math.max(state.profile.pushBase, best - 2) : best + (doneCount % 2 === 0 ? 1 : 0))
  );
  const situpsPerSet = state.profile.situpBase > 0 ? Math.min(state.profile.goal, Math.max(state.profile.situpBase, bestSitups() + (doneCount % 3 === 0 ? 1 : 0))) : 0;

  return {
    sets: state.profile.sets,
    pushupsPerSet,
    situpsPerSet,
    isRecovery
  };
}

function render() {
  const todayWorkout = workoutForToday();
  const streak = currentStreak();
  const pushBest = bestPushups();
  const goalProgress = Math.min(100, Math.round((pushBest / state.profile.goal) * 100));

  els.todayLabel.textContent = new Intl.DateTimeFormat("no-NO", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  els.streakDays.textContent = streak;
  els.xpTotal.textContent = xpTotal();
  els.bestPushups.textContent = pushBest;
  els.goalPercent.textContent = `${goalProgress}%`;
  els.goalFill.style.width = `${goalProgress}%`;
  els.title.textContent = completedToday() ? "Dagens økt er fullført" : `${state.profile.name}, dagens økt`;
  els.nextPushGoal.textContent = todayWorkout.pushupsPerSet;
  els.situpStatus.textContent = state.profile.situpBase > 0 ? todayWorkout.situpsPerSet : "Test";
  els.completeButton.disabled = completedToday();
  els.completeButton.textContent = completedToday() ? "Fullført i dag" : "Fullfør økten";
  els.dailyHint.textContent = todayWorkout.isRecovery
    ? "Litt lettere dag i dag. Hold streaken, ikke maks ut."
    : "Stopp hvis teknikken faller. Kvalitet teller mer enn fart.";

  renderExercises(todayWorkout);
  renderBadges(streak, pushBest);
  renderHistory();
  renderMilestones(pushBest);
}

function renderExercises(workout) {
  const exercises = [
    {
      name: "Pushups",
      detail: `${workout.sets} sett med rolig pause`,
      count: `${workout.sets} × ${workout.pushupsPerSet}`
    },
    {
      name: "Situps",
      detail: workout.situpsPerSet > 0 ? `${workout.sets} sett` : "Finn startnivået: gjør maks kontrollert i ett sett",
      count: workout.situpsPerSet > 0 ? `${workout.sets} × ${workout.situpsPerSet}` : "Test"
    }
  ];

  els.exerciseList.innerHTML = exercises.map((exercise) => `
    <article class="exercise-row">
      <span>
        <span class="exercise-name">${exercise.name}</span>
        <span class="exercise-detail">${exercise.detail}</span>
      </span>
      <span class="rep-count">${exercise.count}</span>
    </article>
  `).join("");
}

function renderBadges(streak, pushBest) {
  els.badges.first.classList.toggle("is-earned", state.history.length >= 1);
  els.badges.week.classList.toggle("is-earned", streak >= 7);
  els.badges.fifty.classList.toggle("is-earned", pushBest >= 50);
  els.badges.hundred.classList.toggle("is-earned", pushBest >= 100);
}

function renderHistory() {
  const history = sortedHistory().slice(0, 21);
  els.historyList.innerHTML = history.length
    ? history.map((entry) => `
        <li>
          <strong>${formatDate(entry.date)} · ${entry.xp} XP</strong>
          <span>${entry.sets} × ${entry.pushupsPerSet} pushups${entry.situpsPerSet ? ` · ${entry.sets} × ${entry.situpsPerSet} situps` : " · situps test senere"}</span>
        </li>
      `).join("")
    : "<li><strong>Ingen økter ennå</strong><span>Første fullføring starter streaken.</span></li>";
}

function renderMilestones(pushBest) {
  const targets = [20, 30, 50, 75, 100];
  els.milestones.innerHTML = targets.map((target) => {
    const isDone = pushBest >= target;
    const missing = Math.max(0, target - pushBest);
    return `
      <article class="milestone">
        <strong>${target} reps ${isDone ? "klart" : ""}</strong>
        <span>${isDone ? "Låst opp." : `${missing} igjen med dagens beste nivå.`}</span>
      </article>
    `;
  }).join("");
}

function completeWorkout() {
  if (completedToday()) return;

  const workout = workoutForToday();
  const streakBefore = currentStreak();
  const xp = 20 + Math.min(30, workout.pushupsPerSet) + (streakBefore >= 2 ? 10 : 0);

  state.history.push({
    date: isoDate(),
    sets: workout.sets,
    pushupsPerSet: workout.pushupsPerSet,
    situpsPerSet: workout.situpsPerSet,
    xp
  });

  saveState();
  render();
}

function openSettings() {
  els.nameInput.value = state.profile.name;
  els.pushBaseInput.value = state.profile.pushBase;
  els.situpBaseInput.value = state.profile.situpBase;
  els.setsInput.value = state.profile.sets;
  els.settingsDialog.showModal();
}

function saveSettings(event) {
  event.preventDefault();

  state.profile = {
    ...state.profile,
    name: els.nameInput.value.trim() || "William",
    pushBase: clamp(Number(els.pushBaseInput.value), 1, 100),
    situpBase: clamp(Number(els.situpBaseInput.value), 0, 100),
    sets: clamp(Number(els.setsInput.value), 1, 5)
  };

  saveState();
  els.settingsDialog.close();
  render();
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, Math.round(value)));
}

function switchTab(tabName) {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.tab === tabName);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("is-active", panel.id === `${tabName}Panel`);
  });
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `william-trene-${isoDate()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

els.completeButton.addEventListener("click", completeWorkout);
els.loginForm.addEventListener("submit", handleLogin);
els.logoutButton.addEventListener("click", logout);
els.settingsButton.addEventListener("click", openSettings);
els.saveSettingsButton.addEventListener("click", saveSettings);
els.exportButton.addEventListener("click", exportData);

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

if (isAuthenticated()) {
  showApp();
} else {
  showLogin();
}

render();
