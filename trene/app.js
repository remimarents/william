const STORAGE_KEY = "william-trene-v1";
const AUTH_KEY = "william-trene-auth-v1";
const AUTH_USER = "williamberner";
const AUTH_PASSWORD_HASH = "c4dc08362079d1937a6e12c2ee0be77b70dbdb7e5d8ac7bd63b24122a7f25f16";
const APP_URL = "https://remimarents.github.io/william/trene/";
const DEFAULT_NTFY_TOPIC = "william-trene-wb-8v4k9m2p";
const FRIEND_REQUEST_PHONE = "91666666";
const DAY_MS = 24 * 60 * 60 * 1000;

const defaultState = {
  version: 1,
  profile: {
    name: "William",
    pushBase: 15,
    situpBase: 0,
    sets: 2,
    goal: 100,
    ntfyTopic: DEFAULT_NTFY_TOPIC,
    remindersEnabled: true,
    reminderTime: "19:30",
    photoEvery: 10
  },
  history: [],
  notifications: {
    scheduledFor: ""
  },
  pendingPhoto: null
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
  coachFeedback: document.querySelector("#coachFeedback"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackStats: document.querySelector("#feedbackStats"),
  feedbackBody: document.querySelector("#feedbackBody"),
  effortInput: document.querySelector("#effortInput"),
  photoCheckin: document.querySelector("#photoCheckin"),
  photoHint: document.querySelector("#photoHint"),
  photoInput: document.querySelector("#photoInput"),
  dailyHint: document.querySelector("#dailyHint"),
  nextPushGoal: document.querySelector("#nextPushGoal"),
  situpStatus: document.querySelector("#situpStatus"),
  statsGrid: document.querySelector("#statsGrid"),
  graphBars: document.querySelector("#graphBars"),
  graphCaption: document.querySelector("#graphCaption"),
  motivationCard: document.querySelector("#motivationCard"),
  historyList: document.querySelector("#historyList"),
  milestones: document.querySelector("#milestones"),
  factList: document.querySelector("#factList"),
  exportButton: document.querySelector("#exportButton"),
  logoutButton: document.querySelector("#logoutButton"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsDialog: document.querySelector("#settingsDialog"),
  saveSettingsButton: document.querySelector("#saveSettingsButton"),
  nameInput: document.querySelector("#nameInput"),
  pushBaseInput: document.querySelector("#pushBaseInput"),
  situpBaseInput: document.querySelector("#situpBaseInput"),
  setsInput: document.querySelector("#setsInput"),
  ntfyTopicInput: document.querySelector("#ntfyTopicInput"),
  remindersInput: document.querySelector("#remindersInput"),
  reminderTimeInput: document.querySelector("#reminderTimeInput"),
  testNtfyButton: document.querySelector("#testNtfyButton"),
  friendNameInput: document.querySelector("#friendNameInput"),
  friendUsernameInput: document.querySelector("#friendUsernameInput"),
  friendEmailInput: document.querySelector("#friendEmailInput"),
  requestFriendButton: document.querySelector("#requestFriendButton"),
  badges: {
    first: document.querySelector("#badgeFirst"),
    week: document.querySelector("#badgeWeek"),
    fifty: document.querySelector("#badgeFifty"),
    hundred: document.querySelector("#badgeHundred")
  }
};

let state = loadState();

const factDeck = [
  {
    title: "Hypertrofi forklart enkelt",
    text: "Muskler vokser når kroppen får et tydelig signal om at den må bli sterkere, og deretter får nok mat og søvn til å bygge seg opp igjen. For deg er nøkkelen jevn progresjon, god teknikk og nok energi."
  },
  {
    title: "Failure er et verktøy, ikke et mål",
    text: "Du må ikke trene til failure for å få effekt. Spesielt når du bygger vane og teknikk er det smart å stoppe med 1-3 gode reps igjen. Failure kan brukes sjelden på siste sett, men ikke hvis formen ryker."
  },
  {
    title: "Form slår ego",
    text: "Riktig utførelse gir bedre treningssignal og lavere skaderisiko. Hvis du må velge mellom pen teknikk og flere stygge reps, velg teknikk. En stygg rep teller ikke mer fordi den var tung."
  },
  {
    title: "Pauser er lov",
    text: "Alle reps må ikke tas som ett langt sett. Målet kan være 2 x 18, 3 x 12 eller små pauser. Pauser gjør at flere reps blir teknisk gode, og gode reps bygger best."
  },
  {
    title: "Tunge dager har en jobb",
    text: "Hvis kroppen kjennes tung: gjør minimumsøkten, del opp settene, eller ta 70 prosent av målet med perfekt form. Det holder streaken og trener hjernen på å møte opp."
  },
  {
    title: "Hvile er del av programmet",
    text: "En 13-åring kan være aktiv hver dag, men samme muskler trenger også rolige dager. Derfor kan WB Trene ha lette dager. Smerte i ledd eller skarp smerte betyr stopp, ikke press."
  },
  {
    title: "Mat er byggemateriale",
    text: "Vil du ha maks effekt av innsatsen: spis vanlige gode måltider med protein, karbohydrater, frukt/grønt og drikk vann. Trening sender signalet; mat og søvn bygger resultatet."
  },
  {
    title: "Programmet er kartet",
    text: "Å følge programmet er viktig fordi små steg over tid slår tilfeldige maksøkter. Men programmet er ikke sjefen over kroppen. Juster ned når formen eller energien sier fra."
  }
];

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
    return parsed?.version === 1 ? normalizeState(parsed) : structuredClone(defaultState);
  } catch {
    return structuredClone(defaultState);
  }
}

function normalizeState(value) {
  return {
    ...structuredClone(defaultState),
    ...value,
    profile: {
      ...defaultState.profile,
      ...(value.profile || {})
    },
    notifications: {
      ...defaultState.notifications,
      ...(value.notifications || {})
    },
    history: Array.isArray(value.history) ? value.history.map(normalizeEntry) : []
  };
}

function normalizeEntry(entry) {
  const sets = entry.sets || entry.targets?.sets || defaultState.profile.sets;
  const targetPush = entry.targets?.pushupsPerSet || entry.pushupsPerSet || defaultState.profile.pushBase;
  const targetSit = entry.targets?.situpsPerSet || entry.situpsPerSet || 0;
  return {
    ...entry,
    sets,
    targets: {
      sets,
      pushupsPerSet: targetPush,
      situpsPerSet: targetSit
    },
    actual: {
      pushupsPerSet: entry.actual?.pushupsPerSet || entry.pushupsPerSet || targetPush,
      pushupsTotal: entry.actual?.pushupsTotal || (entry.pushupsPerSet || targetPush) * sets,
      situpsPerSet: entry.actual?.situpsPerSet || entry.situpsPerSet || targetSit,
      situpsTotal: entry.actual?.situpsTotal || (entry.situpsPerSet || targetSit) * sets
    },
    effort: entry.effort || "passe",
    photo: entry.photo || null
  };
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
  return Math.max(state.profile.pushBase, ...state.history.map((entry) => entry.actual?.pushupsPerSet || entry.pushupsPerSet || 0));
}

function bestSitups() {
  return Math.max(state.profile.situpBase, ...state.history.map((entry) => entry.actual?.situpsPerSet || entry.situpsPerSet || 0));
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
  renderPhotoCheckin();
  renderBadges(streak, pushBest);
  renderStats();
  renderMotivation(todayWorkout);
  renderCoachFeedback();
  renderHistory();
  renderMilestones(pushBest);
  renderFacts();
}

function renderExercises(workout) {
  const exercises = [
    {
      name: "Pushups",
      detail: `Mål: ${workout.sets} × ${workout.pushupsPerSet}. Juster hvis du tok flere eller færre.`,
      value: workout.pushupsPerSet,
      id: "actualPushInput"
    },
    {
      name: "Situps",
      detail: workout.situpsPerSet > 0 ? `Mål: ${workout.sets} × ${workout.situpsPerSet}` : "Test startnivå: skriv hvor mange du tok i ett kontrollert sett",
      value: workout.situpsPerSet > 0 ? workout.situpsPerSet : "",
      id: "actualSitupInput"
    }
  ];

  els.exerciseList.innerHTML = exercises.map((exercise) => `
    <article class="exercise-row">
      <span>
        <span class="exercise-name">${exercise.name}</span>
        <span class="exercise-detail">${exercise.detail}</span>
      </span>
      <input class="actual-input" id="${exercise.id}" type="number" inputmode="numeric" min="0" max="200" value="${exercise.value}" aria-label="Faktisk ${exercise.name} per sett" />
    </article>
  `).join("");
}

function renderPhotoCheckin() {
  const nextWorkout = state.history.length + 1;
  const isDue = nextWorkout % state.profile.photoEvery === 0;
  els.photoCheckin.classList.toggle("is-due", isDue);
  els.photoHint.textContent = state.pendingPhoto
    ? "Bilde er valgt for denne økten."
    : `Økt ${nextWorkout}: ${isDue ? "ta gjerne et bilde i dag." : `neste bilde ved økt ${Math.ceil(nextWorkout / state.profile.photoEvery) * state.profile.photoEvery}.`}`;
}

function renderStats() {
  const entries = sortedHistory();
  const last7 = entries.slice(0, 7);
  const doneLast7 = last7.length;
  const pushTotal = entries.reduce((sum, entry) => sum + (entry.actual?.pushupsTotal || 0), 0);
  const sitTotal = entries.reduce((sum, entry) => sum + (entry.actual?.situpsTotal || 0), 0);
  const photos = entries.filter((entry) => entry.photo).length;

  els.statsGrid.innerHTML = [
    ["Siste 7 dager", `${doneLast7}/7`],
    ["Pushups totalt", pushTotal],
    ["Situps totalt", sitTotal],
    ["Bilder lagret", photos]
  ].map(([label, value]) => `
    <article class="stat-card">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");

  renderGraph(entries);
}

function renderGraph(entries) {
  const recent = [...entries].reverse().slice(-10);
  const max = Math.max(1, ...recent.map((entry) => entry.actual?.pushupsTotal || 0));

  if (!recent.length) {
    els.graphBars.innerHTML = "";
    els.graphCaption.textContent = "Fullfør noen økter for å bygge grafen.";
    return;
  }

  els.graphBars.innerHTML = recent.map((entry) => {
    const total = entry.actual?.pushupsTotal || 0;
    const height = Math.max(10, Math.round((total / max) * 100));
    const day = new Intl.DateTimeFormat("no-NO", { day: "numeric", month: "short" }).format(dateKeyToLocalDate(entry.date));
    return `
      <div class="bar-item">
        <span class="bar-value">${total}</span>
        <span class="bar" style="height: ${height}%"></span>
        <span class="bar-day">${day}</span>
      </div>
    `;
  }).join("");
  els.graphCaption.textContent = "Grafen viser faktisk antall pushups totalt per fullførte økt.";
}

function renderMotivation(workout) {
  const messages = [
    {
      title: "Tren smart",
      text: "Små økninger slår store skippertak. En kontrollert økt som blir gjort teller mer enn en perfekt plan som blir droppet."
    },
    {
      title: "Teknikk først",
      text: "Pushups trener bryst, skuldre, armer og kjernemuskler når kroppen holdes strak. Stopp settet når formen begynner å falle."
    },
    {
      title: "Restitusjon hjelper",
      text: workout.isRecovery ? "I dag er lettere med vilje. Lett dag holder vanen i gang uten å tømme kroppen." : "Hvis økten kjennes tung, registrer det som tung. Da kan planen justeres roligere."
    }
  ];
  const message = messages[state.history.length % messages.length];
  els.motivationCard.innerHTML = `<span>${message.title}</span><p>${message.text}</p>`;
}

function renderCoachFeedback() {
  const todayEntry = state.history.find((entry) => entry.date === isoDate());
  els.coachFeedback.classList.toggle("is-visible", Boolean(todayEntry));

  if (!todayEntry) {
    els.feedbackTitle.textContent = "Etter økten";
    els.feedbackStats.innerHTML = "";
    els.feedbackBody.textContent = "Når dagens økt er fullført får du kort feedback her med tallene dine og et relevant fakta-poeng.";
    return;
  }

  const totalWorkouts = state.history.length;
  const pushTotal = todayEntry.actual.pushupsTotal;
  const sitTotal = todayEntry.actual.situpsTotal;
  const pushBest = bestPushups();
  const goalGap = Math.max(0, state.profile.goal - pushBest);
  const fact = coachFactFor(todayEntry, totalWorkouts);

  els.feedbackTitle.textContent = "Økten er logget";
  els.feedbackStats.innerHTML = [
    ["I dag", `${pushTotal} pushups${sitTotal ? ` + ${sitTotal} situps` : ""}`],
    ["Streak", `${currentStreak()} dager`],
    ["Beste sett", `${pushBest}/${state.profile.goal}`],
    ["Igjen til 100", goalGap]
  ].map(([label, value]) => `
    <article class="feedback-stat">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");
  els.feedbackBody.innerHTML = `<strong>${fact.title}</strong> ${fact.text}`;
}

function coachFactFor(entry, totalWorkouts) {
  if (entry.effort === "tung") return factDeck[4];
  if (totalWorkouts % 10 === 0) return factDeck[0];
  if (totalWorkouts % 7 === 0) return factDeck[5];
  if (entry.actual.pushupsTotal < entry.targets.pushupsPerSet * entry.targets.sets) return factDeck[7];
  if (totalWorkouts < 5) return factDeck[2];
  return factDeck[totalWorkouts % factDeck.length];
}

function renderFacts() {
  const totalWorkouts = state.history.length;
  const selected = [
    factDeck[0],
    factDeck[1],
    factDeck[2],
    factDeck[3],
    totalWorkouts >= 7 ? factDeck[5] : factDeck[4],
    factDeck[6]
  ];

  els.factList.innerHTML = selected.map((fact) => `
    <article class="fact-item">
      <strong>${fact.title}</strong>
      <p>${fact.text}</p>
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
          <span>Mål ${entry.targets.sets} × ${entry.targets.pushupsPerSet}, gjort ${entry.actual.pushupsTotal} pushups${entry.actual.situpsTotal ? ` · ${entry.actual.situpsTotal} situps` : " · situps test senere"} · ${entry.effort}</span>
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
  const actualPushupsPerSet = clamp(Number(document.querySelector("#actualPushInput")?.value), 0, 200);
  const actualSitupsPerSet = clamp(Number(document.querySelector("#actualSitupInput")?.value), 0, 200);
  const streakBefore = currentStreak();
  const actualPushupsTotal = actualPushupsPerSet * workout.sets;
  const actualSitupsTotal = actualSitupsPerSet * workout.sets;
  const targetPushupsTotal = workout.pushupsPerSet * workout.sets;
  const hitTargetBonus = actualPushupsTotal >= targetPushupsTotal ? 10 : 0;
  const xp = 20 + Math.min(30, actualPushupsPerSet) + hitTargetBonus + (streakBefore >= 2 ? 10 : 0);

  state.history.push({
    date: isoDate(),
    sets: workout.sets,
    pushupsPerSet: workout.pushupsPerSet,
    situpsPerSet: workout.situpsPerSet,
    targets: {
      sets: workout.sets,
      pushupsPerSet: workout.pushupsPerSet,
      situpsPerSet: workout.situpsPerSet
    },
    actual: {
      pushupsPerSet: actualPushupsPerSet,
      pushupsTotal: actualPushupsTotal,
      situpsPerSet: actualSitupsPerSet,
      situpsTotal: actualSitupsTotal
    },
    effort: els.effortInput.value,
    photo: state.pendingPhoto,
    xp
  });

  state.pendingPhoto = null;
  saveState();
  render();
  sendCompletionMessage(actualPushupsTotal, actualSitupsTotal);
}

function openSettings() {
  els.nameInput.value = state.profile.name;
  els.pushBaseInput.value = state.profile.pushBase;
  els.situpBaseInput.value = state.profile.situpBase;
  els.setsInput.value = state.profile.sets;
  els.ntfyTopicInput.value = state.profile.ntfyTopic;
  els.remindersInput.checked = state.profile.remindersEnabled;
  els.reminderTimeInput.value = state.profile.reminderTime;
  els.settingsDialog.showModal();
}

function saveSettings(event) {
  event.preventDefault();

  state.profile = {
    ...state.profile,
    name: els.nameInput.value.trim() || "William",
    pushBase: clamp(Number(els.pushBaseInput.value), 1, 100),
    situpBase: clamp(Number(els.situpBaseInput.value), 0, 100),
    sets: clamp(Number(els.setsInput.value), 1, 5),
    ntfyTopic: sanitizeTopic(els.ntfyTopicInput.value) || DEFAULT_NTFY_TOPIC,
    remindersEnabled: els.remindersInput.checked,
    reminderTime: els.reminderTimeInput.value || "19:30"
  };

  saveState();
  els.settingsDialog.close();
  sendReminderConfig();
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

function sanitizeTopic(value) {
  return value.trim().replace(/[^a-zA-Z0-9_-]/g, "");
}

async function sendNtfy({ title, message, tags = "muscle", priority = "default", delay = "" }) {
  const topic = sanitizeTopic(state.profile.ntfyTopic);
  if (!topic) return false;

  const headers = {
    Title: title,
    Tags: tags,
    Priority: priority,
    Click: APP_URL
  };

  if (delay) headers.Delay = delay;

  try {
    const response = await fetch(`https://ntfy.sh/${topic}`, {
      method: "POST",
      headers,
      body: message
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function scheduleReminderIfNeeded() {
  if (!state.profile.remindersEnabled || completedToday()) return;
  const today = isoDate();
  if (state.notifications.scheduledFor === today) return;
  const delay = reminderDelay();

  const ok = await sendNtfy({
    title: "Trene i dag?",
    message: "Hvis økten ikke er gjort ennå: ta bare dagens mål rolig og trykk Fullfør etterpå.",
    tags: "muscle,alarm_clock",
    priority: "default",
    delay
  });

  if (ok) {
    state.notifications.scheduledFor = today;
    saveState();
  }
}

function reminderDelay() {
  const [hours, minutes] = state.profile.reminderTime.split(":").map(Number);
  const target = new Date();
  target.setHours(hours || 19, minutes || 30, 0, 0);
  const diffMs = target.getTime() - Date.now();
  if (diffMs <= 0) return "";
  const minutesUntil = Math.max(1, Math.round(diffMs / 60000));
  return `${minutesUntil}m`;
}

function sendCompletionMessage(pushupsTotal, situpsTotal) {
  if (!state.profile.remindersEnabled) return;

  const streak = currentStreak();
  const message = situpsTotal > 0
    ? `Økt fullført ${isoDate()}: ${pushupsTotal} pushups og ${situpsTotal} situps. Streak: ${streak} dager.`
    : `Økt fullført ${isoDate()}: ${pushupsTotal} pushups. Streak: ${streak} dager.`;

  sendNtfy({
    title: "Bra jobbet",
    message,
    tags: "muscle,white_check_mark",
    priority: "low"
  });
}

function sendReminderConfig() {
  sendNtfy({
    title: "Trene-config",
    message: JSON.stringify({
      type: "william-trene-config",
      enabled: state.profile.remindersEnabled,
      reminderTime: state.profile.reminderTime
    }),
    tags: "gear",
    priority: "min"
  });
}

async function testNtfy() {
  const previousTopic = state.profile.ntfyTopic;
  state.profile.ntfyTopic = sanitizeTopic(els.ntfyTopicInput.value) || DEFAULT_NTFY_TOPIC;
  const ok = await sendNtfy({
    title: "Trene-test",
    message: "Dette er en test fra Williams treningsapp.",
    tags: "muscle"
  });
  state.profile.ntfyTopic = previousTopic;
  els.testNtfyButton.textContent = ok ? "Test sendt" : "Kunne ikke sende";
  window.setTimeout(() => {
    els.testNtfyButton.textContent = "Test ntfy";
  }, 2200);
}

function requestFriendAccount() {
  const name = els.friendNameInput.value.trim();
  const username = els.friendUsernameInput.value.trim();
  const email = els.friendEmailInput.value.trim();

  if (!name || !username || !email) {
    els.requestFriendButton.textContent = "Fyll ut alt";
    window.setTimeout(() => {
      els.requestFriendButton.textContent = "Spør om brukerkonto";
    }, 2200);
    return;
  }

  const body = [
    "Hei! Kan du lage en WB Trene-brukerkonto til en kompis?",
    "",
    `Navn: ${name}`,
    `Ønsket brukernavn: ${username}`,
    `E-post til passord: ${email}`,
    "",
    "Han skal ha egen trening, egen logg og egne mål."
  ].join("\n");

  window.location.href = `sms:${FRIEND_REQUEST_PHONE}&body=${encodeURIComponent(body)}`;
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const image = new Image();
    image.addEventListener("load", () => {
      const maxSide = 900;
      const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      state.pendingPhoto = canvas.toDataURL("image/jpeg", 0.72);
      saveState();
      renderPhotoCheckin();
    });
    image.src = reader.result;
  });
  reader.readAsDataURL(file);
}

els.completeButton.addEventListener("click", completeWorkout);
els.loginForm.addEventListener("submit", handleLogin);
els.logoutButton.addEventListener("click", logout);
els.settingsButton.addEventListener("click", openSettings);
els.saveSettingsButton.addEventListener("click", saveSettings);
els.exportButton.addEventListener("click", exportData);
els.testNtfyButton.addEventListener("click", testNtfy);
els.photoInput.addEventListener("change", handlePhotoChange);
els.requestFriendButton.addEventListener("click", requestFriendAccount);

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
