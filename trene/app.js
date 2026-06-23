const STORAGE_KEY = "william-trene-v1";
const AUTH_KEY = "william-trene-auth-v1";
const AUTH_USER_KEY = "william-trene-user-v1";
const SYNC_SESSION_KEY = "william-trene-sync-session-v1";
const AUTH_USER = "williamberner";
const AUTH_PASSWORD_HASH = "c4dc08362079d1937a6e12c2ee0be77b70dbdb7e5d8ac7bd63b24122a7f25f16";
const APP_URL = "https://remimarents.github.io/william/trene/";
const DEFAULT_NTFY_TOPIC = "william-trene-wb-8v4k9m2p";
const DEFAULT_SYNC_URL = "https://william-trene-sync.marents.no";
const FRIEND_REQUEST_PHONE = "91666666";
const DAY_MS = 24 * 60 * 60 * 1000;
const BASE_EXERCISE_KEYS = ["pushups", "situps"];
const EXTRA_EXERCISE_KEYS = ["kneboy", "utfall", "planke", "sideplanke", "rygghev", "mountain", "dips", "hollow", "burpees", "roing"];
const ALL_EXERCISE_KEYS = [...BASE_EXERCISE_KEYS, ...EXTRA_EXERCISE_KEYS];
const EXERCISE_PROGRAM_DEFAULTS = {
  pushups: { start: 15, goal: 100, supportSets: 2, unit: "reps" },
  situps: { start: 15, goal: 100, supportSets: 2, unit: "reps" },
  kneboy: { start: 15, goal: 100, supportSets: 2, unit: "reps" },
  utfall: { start: 8, goal: 50, supportSets: 2, unit: "reps/side" },
  planke: { start: 30, goal: 180, supportSets: 2, unit: "sek" },
  sideplanke: { start: 20, goal: 120, supportSets: 2, unit: "sek/side" },
  rygghev: { start: 12, goal: 60, supportSets: 2, unit: "reps" },
  mountain: { start: 20, goal: 100, supportSets: 2, unit: "reps/side" },
  dips: { start: 8, goal: 50, supportSets: 2, unit: "reps" },
  hollow: { start: 20, goal: 120, supportSets: 2, unit: "sek" },
  burpees: { start: 5, goal: 30, supportSets: 2, unit: "reps" },
  roing: { start: 3, goal: 15, supportSets: 2, unit: "reps" }
};

const defaultState = {
  version: 1,
  profile: {
    name: "William",
    pushBase: 15,
    pushTestMax: 29,
    situpBase: 15,
    sets: 2,
    goal: 100,
    ntfyTopic: DEFAULT_NTFY_TOPIC,
    remindersEnabled: true,
    reminderTime: "19:30",
    photoEvery: 10,
    userId: AUTH_USER,
    syncEnabled: true,
    syncUrl: DEFAULT_SYNC_URL,
    syncToken: "",
    enabledExercises: BASE_EXERCISE_KEYS,
    exerciseSettings: structuredClone(EXERCISE_PROGRAM_DEFAULTS)
  },
  history: [],
  photos: [],
  notifications: {
    scheduledFor: ""
  },
  pendingPhoto: null
};

const els = {
  appShell: document.querySelector("#appShell"),
  loginShell: document.querySelector("#loginShell"),
  loginForm: document.querySelector("#loginForm"),
  helpPopover: document.querySelector("#helpPopover"),
  helpPopoverText: document.querySelector("#helpPopoverText"),
  helpPopoverClose: document.querySelector("#helpPopoverClose"),
  exerciseGuidePopover: document.querySelector("#exerciseGuidePopover"),
  exerciseGuideClose: document.querySelector("#exerciseGuideClose"),
  exerciseGuideTitle: document.querySelector("#exerciseGuideTitle"),
  exerciseGuideMedia: document.querySelector("#exerciseGuideMedia"),
  exerciseGuideImage: document.querySelector("#exerciseGuideImage"),
  exerciseGuideMuscles: document.querySelector("#exerciseGuideMuscles"),
  exerciseGuideWhy: document.querySelector("#exerciseGuideWhy"),
  exerciseGuideHow: document.querySelector("#exerciseGuideHow"),
  exerciseGuideMistakes: document.querySelector("#exerciseGuideMistakes"),
  exerciseManagerButton: document.querySelector("#exerciseManagerButton"),
  openExerciseManagerFromSettings: document.querySelector("#openExerciseManagerFromSettings"),
  exerciseManagerPopover: document.querySelector("#exerciseManagerPopover"),
  exerciseManagerClose: document.querySelector("#exerciseManagerClose"),
  exerciseManagerList: document.querySelector("#exerciseManagerList"),
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
  exerciseGraphDeck: document.querySelector("#exerciseGraphDeck"),
  progressPhotoInput: document.querySelector("#progressPhotoInput"),
  progressPhotoHint: document.querySelector("#progressPhotoHint"),
  photoGallery: document.querySelector("#photoGallery"),
  motivationCard: document.querySelector("#motivationCard"),
  homeFactList: document.querySelector("#homeFactList"),
  planSummary: document.querySelector("#planSummary"),
  planPhases: document.querySelector("#planPhases"),
  historyList: document.querySelector("#historyList"),
  milestones: document.querySelector("#milestones"),
  factList: document.querySelector("#factList"),
  exportButton: document.querySelector("#exportButton"),
  logoutButton: document.querySelector("#logoutButton"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsDialog: document.querySelector("#settingsDialog"),
  settingsForm: document.querySelector(".settings-form"),
  closeSettingsButton: document.querySelector("#closeSettingsButton"),
  nameInput: document.querySelector("#nameInput"),
  toggleCapacityButton: document.querySelector("#toggleCapacityButton"),
  capacityFields: document.querySelector("#capacityFields"),
  exerciseSettingsFields: document.querySelector("#exerciseSettingsFields"),
  ntfyTopicInput: document.querySelector("#ntfyTopicInput"),
  remindersInput: document.querySelector("#remindersInput"),
  reminderTimeInput: document.querySelector("#reminderTimeInput"),
  testNtfyButton: document.querySelector("#testNtfyButton"),
  syncStatus: document.querySelector("#syncStatus"),
  friendFields: document.querySelector("#friendFields"),
  friendNameInput: document.querySelector("#friendNameInput"),
  friendUsernameInput: document.querySelector("#friendUsernameInput"),
  friendEmailInput: document.querySelector("#friendEmailInput"),
  friendRequestStatus: document.querySelector("#friendRequestStatus"),
  requestFriendButton: document.querySelector("#requestFriendButton"),
  badges: {
    first: document.querySelector("#badgeFirst"),
    week: document.querySelector("#badgeWeek"),
    fifty: document.querySelector("#badgeFifty"),
    hundred: document.querySelector("#badgeHundred")
  }
};

let state = loadState();

function validExerciseKeys(keys) {
  if (!Array.isArray(keys)) return [...BASE_EXERCISE_KEYS];
  return [...new Set(keys.filter((key) => ALL_EXERCISE_KEYS.includes(key)))];
}

function enabledExerciseKeys() {
  return validExerciseKeys(state.profile.enabledExercises);
}

function normalizeExerciseSettings(profile = {}) {
  const saved = profile.exerciseSettings || {};
  return Object.fromEntries(ALL_EXERCISE_KEYS.map((key) => {
    const defaults = EXERCISE_PROGRAM_DEFAULTS[key];
    const value = saved[key] || {};
    const legacyStart = key === "pushups"
      ? profile.pushBase
      : key === "situps"
      ? profile.situpBase
      : undefined;
    const legacyGoal = (key === "pushups" || key === "situps") ? profile.goal : undefined;
    const start = clamp(Number(value.start ?? legacyStart ?? defaults.start), 0, 500);
    const goal = Math.max(start || 1, clamp(Number(value.goal ?? legacyGoal ?? defaults.goal), 1, 500));
    const supportSets = clamp(Number(value.supportSets ?? defaults.supportSets), 0, 4);
    return [key, {
      ...defaults,
      start,
      goal,
      supportSets,
      unit: defaults.unit
    }];
  }));
}

function exerciseSetting(key) {
  return state.profile.exerciseSettings?.[key] || EXERCISE_PROGRAM_DEFAULTS[key];
}

const exerciseGuides = {
  pushups: {
    title: "Pushups",
    image: "./assets/exercises/pushups.jpg",
    imageAlt: "Instruksjonsbilde for pushups.",
    muscles: "Bryst, fremside skuldre, triceps og kjernemuskler. Mage, rumpe og rygg jobber også for å holde kroppen strak.",
    why: "Pushups er en effektiv pressøvelse uten utstyr. Den bygger styrke i overkroppen og lærer kroppen å holde spenning fra skuldre til føtter.",
    how: [
      "Start i topposisjon med hendene litt bredere enn skuldrene.",
      "Hold kroppen i en rett linje fra hode til hæler.",
      "Senk deg kontrollert til brystet nærmer seg gulvet.",
      "Press opp igjen uten at hoften henger eller skyter opp først.",
      "Stopp settet når teknikken ikke lenger er god."
    ],
    mistakes: [
      "Hoften henger ned eller rumpen skyves høyt opp.",
      "Albuene peker rett ut til siden i stedet for litt skrått bakover.",
      "Reps blir for korte og brystet kommer ikke langt nok ned.",
      "Hodet skyves frem i stedet for at nakken holdes lang."
    ]
  },
  situps: {
    title: "Situps",
    image: "./assets/exercises/situps.jpg",
    imageAlt: "Instruksjonsbilde for situps.",
    muscles: "Magemuskler, spesielt rette magemuskler. Hoftebøyerne hjelper også, og kjernen jobber med kontroll.",
    why: "Situps bygger utholdenhet og kontroll i mageområdet. De passer godt i programmet fordi de er enkle å måle og kan progresseres mot ett langt sett.",
    how: [
      "Ligg på ryggen med bøyde knær og føttene i gulvet.",
      "Stram magen lett før du starter.",
      "Rull eller løft overkroppen kontrollert opp.",
      "Senk rolig ned igjen uten å kaste kroppen bakover.",
      "Hold tempoet jevnt og stopp hvis korsrygg eller nakke tar over."
    ],
    mistakes: [
      "Rykk med nakken eller dra hardt i hodet.",
      "Bruk fart i stedet for kontroll.",
      "La føttene sprette opp for hver repetisjon.",
      "Fortsette når korsryggen gjør vondt eller teknikken faller."
    ]
  },
  kneboy: {
    title: "Knebøy",
    image: "./assets/exercises/kneboy.jpg",
    imageAlt: "Instruksjonsbilde for knebøy.",
    muscles: "Lår, setemuskler, hofter og kjerne. Ryggen jobber også med å holde overkroppen stabil.",
    why: "Knebøy gjør programmet mer komplett fordi beina også får trening. Øvelsen bygger styrke, kontroll og arbeidskapasitet uten utstyr.",
    how: [
      "Stå med føttene omtrent skulderbredde.",
      "Hold brystet opp og vekten på hele foten.",
      "Sett hoften bak og ned som om du skal sette deg.",
      "La knærne følge samme retning som tærne.",
      "Press kontrollert opp igjen."
    ],
    mistakes: [
      "Knær faller innover.",
      "Hælene slipper gulvet.",
      "Ryggen krummes fordi du mister kontroll.",
      "Du går fortere ned enn du klarer å kontrollere."
    ]
  },
  utfall: {
    title: "Utfall",
    image: "./assets/exercises/utfall.jpg",
    imageAlt: "Instruksjonsbilde for utfall.",
    muscles: "Lår, setemuskler, hofter, legger og kjerne. Balansen trenes ekstra fordi ett bein jobber mer av gangen.",
    why: "Utfall bygger bein og balanse samtidig. Det avslører forskjeller mellom høyre og venstre side og gir god kontrolltrening.",
    how: [
      "Stå oppreist og ta et kontrollert steg frem.",
      "Senk kroppen til begge knær er bøyd.",
      "Hold fremre kne over foten.",
      "Press deg tilbake med fremre bein.",
      "Bytt bein eller gjør samme antall på hver side."
    ],
    mistakes: [
      "Fremre kne faller innover.",
      "Steget blir så kort at balansen forsvinner.",
      "Overkroppen kollapser fremover.",
      "Du dytter fra med bakre bein i stedet for å bruke fremre bein."
    ]
  },
  planke: {
    title: "Planke",
    image: "./assets/exercises/planke.jpg",
    imageAlt: "Instruksjonsbilde for planke.",
    muscles: "Mage, dype kjernemuskler, skuldre, setemuskler og ryggstabilitet.",
    why: "Planke gjør pushups og situps bedre fordi kroppen lærer å holde en sterk, rett linje under belastning.",
    how: [
      "Legg albuene under skuldrene.",
      "Strekk beina bakover og stå på tærne.",
      "Hold kroppen rett fra hode til hæler.",
      "Stram mage og rumpe lett.",
      "Pust rolig og stopp før hoften synker."
    ],
    mistakes: [
      "Hoften henger ned.",
      "Rumpen løftes for høyt.",
      "Skuldrene trekkes opp mot ørene.",
      "Du holder for lenge etter at teknikken er borte."
    ]
  },
  sideplanke: {
    title: "Sideplanke",
    image: "./assets/exercises/sideplanke.jpg",
    imageAlt: "Instruksjonsbilde for sideplanke.",
    muscles: "Skrå magemuskler, side av kjernen, skuldre, hofter og ryggstabilitet.",
    why: "Sideplanke bygger stabilitet på sidene av kroppen. Det gjør kjernen mer komplett enn bare vanlige situps og planke.",
    how: [
      "Ligg på siden med albuen under skulderen.",
      "Strekk beina og løft hoften fra gulvet.",
      "Hold kroppen lang og rett.",
      "Hold samme tid på begge sider.",
      "Bruk knærne i gulvet hvis full variant blir for tung."
    ],
    mistakes: [
      "Hoften faller ned mot gulvet.",
      "Kroppen roterer frem eller bak.",
      "Albuen ligger for langt unna skulderen.",
      "Du holder pusten."
    ]
  },
  rygghev: {
    title: "Rygghev",
    image: "./assets/exercises/rygghev.jpg",
    imageAlt: "Instruksjonsbilde for rygghev.",
    muscles: "Korsrygg, setemuskler, bakside kropp og øvre rygg. Nakken jobber med å holde hodet rolig.",
    why: "Rygghev balanserer mye magearbeid. En sterk bakside gjør kjernen mer robust og kan gjøre holdningen bedre.",
    how: [
      "Ligg på magen med hendene lett ved siden av hodet.",
      "Hold nakken lang og blikket ned.",
      "Stram setet lett og løft brystet rolig.",
      "Hold kort på toppen.",
      "Senk kontrollert ned igjen."
    ],
    mistakes: [
      "Du kaster hodet bakover.",
      "Du løfter for høyt og mister kontroll.",
      "Beina spenner så mye at korsryggen kjennes vond.",
      "Du bruker fart i stedet for muskelkontroll."
    ]
  },
  mountain: {
    title: "Mountain climbers",
    image: "./assets/exercises/mountain-climbers.jpg",
    imageAlt: "Instruksjonsbilde for mountain climbers.",
    muscles: "Kjerne, hoftebøyere, skuldre, bryst og triceps. Pulsen trenes også.",
    why: "Mountain climbers kombinerer styrke og kondisjon. Den trener evnen til å holde pushup-posisjon mens beina beveger seg.",
    how: [
      "Start i topposisjonen av en pushup.",
      "Hold hendene under skuldrene.",
      "Trekk ett kne kontrollert frem mot brystet.",
      "Sett foten tilbake og bytt bein.",
      "Hold hoften lav og tempoet så kontrollert at formen holder."
    ],
    mistakes: [
      "Hoften hopper høyt opp og ned.",
      "Skuldrene havner langt bak hendene.",
      "Knærne kastes frem uten kontroll.",
      "Tempoet blir viktigere enn teknikken."
    ]
  },
  dips: {
    title: "Dips på benk",
    image: "./assets/exercises/dips-pa-benk.jpg",
    imageAlt: "Instruksjonsbilde for dips på benk.",
    muscles: "Triceps, skuldre og bryst. Kjernen jobber for å holde kroppen stabil.",
    why: "Dips gir ekstra press-styrke som kan hjelpe pushups. Den trener spesielt triceps, som ofte blir begrensende i høye pushup-tall.",
    how: [
      "Bruk en stødig benk eller stol.",
      "Plasser hendene på kanten og flytt hoften litt frem.",
      "Senk kroppen rolig ved å bøye albuene.",
      "Press opp igjen uten å låse skuldrene hardt.",
      "Gjør varianten lettere ved å ha føttene nærmere kroppen."
    ],
    mistakes: [
      "Du går for dypt og irriterer skuldrene.",
      "Skuldrene trekkes opp mot ørene.",
      "Benk eller stol er ikke stabil.",
      "Du bruker sprett i bunnen."
    ]
  },
  hollow: {
    title: "Hollow hold",
    image: "./assets/exercises/hollow-hold.jpg",
    imageAlt: "Instruksjonsbilde for hollow hold.",
    muscles: "Mage, dype kjernemuskler, hoftebøyere og kroppskontroll gjennom hele forsiden.",
    why: "Hollow hold bygger sterk magekontroll. Det lærer kroppen å holde spenning, som er nyttig i både situps, pushups og senere mer avanserte øvelser.",
    how: [
      "Ligg på ryggen og press korsryggen lett mot gulvet.",
      "Løft skuldre og bein litt fra gulvet.",
      "Hold armene over hodet eller langs siden.",
      "Hold kort og pent.",
      "Bøy knærne hvis strake bein blir for tungt."
    ],
    mistakes: [
      "Korsryggen slipper gulvet.",
      "Beina senkes så lavt at du mister spenningen.",
      "Nakken jobber mer enn magen.",
      "Du holder for lenge med dårlig form."
    ]
  },
  burpees: {
    title: "Burpees",
    image: "./assets/exercises/burpees.jpg",
    imageAlt: "Instruksjonsbilde for burpees.",
    muscles: "Bein, bryst, skuldre, triceps, kjerne og kondisjonssystemet.",
    why: "Burpees gir mye arbeid på kort tid og trener hele kroppen. Den passer best når teknikken i grunnøvelsene allerede sitter.",
    how: [
      "Start stående.",
      "Sett hendene i gulvet.",
      "Gå eller hopp kontrollert tilbake til plankeposisjon.",
      "Gå eller hopp føttene frem igjen.",
      "Reis deg kontrollert. Legg til lite hopp hvis teknikken er god."
    ],
    mistakes: [
      "Du haster så mye at ryggen kollapser.",
      "Du lander tungt uten kontroll.",
      "Pushup-delen presses inn selv om den ødelegger formen.",
      "Du fortsetter etter at pulsen gjør teknikken rotete."
    ]
  },
  roing: {
    title: "Pullups eller roing",
    image: "./assets/exercises/pullups-roing.jpg",
    imageAlt: "Instruksjonsbilde for pullups eller roing.",
    muscles: "Rygg, lats, biceps, underarmer, bakside skuldre og kjerne.",
    why: "Pullups eller roing balanserer all press-treningen fra pushups og dips. Trekk-styrke er viktig for skuldre og holdning.",
    how: [
      "Bruk en stabil stang, ringer eller solid bordkant.",
      "Start med strake armer og kontrollerte skuldre.",
      "Trekk brystet mot stangen eller kanten.",
      "Senk rolig ned igjen.",
      "Velg enklere vinkel eller hjelp hvis du ikke klarer gode reps."
    ],
    mistakes: [
      "Utstyret er ikke stabilt nok.",
      "Du rykker med hoften for å komme opp.",
      "Skuldrene trekkes ukontrollert opp mot ørene.",
      "Du senker deg ikke kontrollert."
    ]
  }
};

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
  },
  {
    title: "Du gjør dette for deg selv",
    text: "Ingen andre kan ta repsene for deg. Når du åpner appen og gjør økten, trener du på å stole på deg selv: Jeg gjør det jeg har bestemt, også når ingen følger med."
  },
  {
    title: "Når du ikke orker, teller det ekstra",
    text: "På lette dager trener du muskler. På dager du ikke orker, trener du viljestyrke. Da trenger du ikke knuse rekorder; du trenger å møte opp og gjøre en ærlig minimumsøkt."
  },
  {
    title: "Viljestyrke kan brukes flere steder",
    text: "Den samme ferdigheten du trener her brukes i lekser, prøver, gaming-trening, rydding og andre mål: starte selv, holde fokus, tåle at det er litt ubehagelig, og fullføre."
  },
  {
    title: "Maks effekt per innsats",
    text: "Smart innsats er ikke å gjøre mest mulig hver dag. Det er å gjøre nok, ofte nok, med god form, mat og søvn. Da får du både sterkere kropp og bedre vane."
  }
];

async function hashText(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isAuthenticated() {
  if (localStorage.getItem(AUTH_KEY) !== AUTH_PASSWORD_HASH) return false;
  if (!localStorage.getItem(AUTH_USER_KEY)) localStorage.setItem(AUTH_USER_KEY, AUTH_USER);
  return localStorage.getItem(AUTH_USER_KEY) === AUTH_USER;
}

function setAuthenticated(username) {
  localStorage.setItem(AUTH_KEY, AUTH_PASSWORD_HASH);
  localStorage.setItem(AUTH_USER_KEY, username);
  showApp();
}

function showApp() {
  els.loginShell.classList.add("is-unlocked");
  els.appShell.classList.remove("is-locked");
  els.appShell.removeAttribute("aria-hidden");
  syncPull({ silent: true });
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
  const password = els.passwordInput.value;
  const passwordHash = await hashText(password);

  if (username === AUTH_USER && passwordHash === AUTH_PASSWORD_HASH) {
    setAuthenticated(username);
    await startSyncSession(username, password);
    els.passwordInput.value = "";
    syncPull({ silent: true });
    return;
  }

  els.loginError.textContent = "Feil brukernavn eller passord.";
  els.passwordInput.value = "";
  els.passwordInput.focus();
}

function logout() {
  const confirmed = window.confirm("Vil du logge ut av WB Trene? Treningsdata beholdes, men du må logge inn igjen på denne enheten.");
  if (!confirmed) return;
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(SYNC_SESSION_KEY);
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
  const savedProfile = value.profile || {};
  const hasSavedPushTestMax = Object.prototype.hasOwnProperty.call(savedProfile, "pushTestMax");
  const exerciseSettings = normalizeExerciseSettings(savedProfile);
  const migratedProfile = {
    ...savedProfile,
    pushTestMax: hasSavedPushTestMax ? savedProfile.pushTestMax : defaultState.profile.pushTestMax,
    situpBase: !hasSavedPushTestMax && savedProfile.situpBase === 0
      ? defaultState.profile.situpBase
      : savedProfile.situpBase,
    enabledExercises: validExerciseKeys(savedProfile.enabledExercises),
    exerciseSettings,
    pushBase: exerciseSettings.pushups.start,
    situpBase: exerciseSettings.situps.start,
    goal: exerciseSettings.pushups.goal
  };

  return {
    ...structuredClone(defaultState),
    ...value,
    profile: {
      ...defaultState.profile,
      ...migratedProfile
    },
    notifications: {
      ...defaultState.notifications,
      ...(value.notifications || {})
    },
    history: Array.isArray(value.history) ? value.history.map(normalizeEntry) : [],
    photos: Array.isArray(value.photos) ? value.photos.map(normalizePhoto) : []
  };
}

function normalizePhoto(photo) {
  return {
    date: photo.date || isoDate(),
    workoutNumber: clamp(Number(photo.workoutNumber), 0, 1000),
    label: photo.label || "Bilde",
    dataUrl: photo.dataUrl || photo.photo || ""
  };
}

function numberOrFallback(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeEntry(entry) {
  const sets = entry.sets || entry.targets?.sets || defaultState.profile.sets;
  const targetPush = entry.targets?.pushupsPerSet || entry.pushupsPerSet || defaultState.profile.pushBase;
  const targetSit = entry.targets?.situpsPerSet || entry.situpsPerSet || 0;
  const targetPushTotal = entry.targets?.pushupsTotal || targetPush * sets;
  const targetSitTotal = entry.targets?.situpsTotal || targetSit * sets;
  const normalizedPhoto = typeof entry.photo === "string"
    ? {
        dataUrl: entry.photo,
        label: entry.workoutNumber ? `Økt ${entry.workoutNumber}` : "Bilde",
        workoutNumber: entry.workoutNumber || 0
      }
    : entry.photo || null;
  const legacyExerciseMode = !entry.actual?.exercises;
  const actualPushMain = numberOrFallback(entry.actual?.pushupsPerSet ?? entry.pushupsPerSet, legacyExerciseMode ? targetPush : 0);
  const actualPushTotal = numberOrFallback(entry.actual?.pushupsTotal, legacyExerciseMode ? targetPushTotal : actualPushMain);
  const actualSitMain = numberOrFallback(entry.actual?.situpsPerSet ?? entry.situpsPerSet, legacyExerciseMode ? targetSit : 0);
  const actualSitTotal = numberOrFallback(entry.actual?.situpsTotal, legacyExerciseMode ? targetSitTotal : actualSitMain);
  const exercises = { ...(entry.actual?.exercises || {}) };
  if (legacyExerciseMode || actualPushMain > 0 || actualPushTotal > 0) {
    exercises.pushups = {
      main: numberOrFallback(exercises.pushups?.main, actualPushMain),
      total: numberOrFallback(exercises.pushups?.total, actualPushTotal)
    };
  }
  if (legacyExerciseMode || actualSitMain > 0 || actualSitTotal > 0) {
    exercises.situps = {
      main: numberOrFallback(exercises.situps?.main, actualSitMain),
      total: numberOrFallback(exercises.situps?.total, actualSitTotal)
    };
  }
  return {
    ...entry,
    id: entry.id || `${entry.date || isoDate()}-${entry.workoutNumber || 1}`,
    updatedAt: entry.updatedAt || entry.date || isoDate(),
    sets,
    targets: {
      sets,
      pushupsPerSet: targetPush,
      pushupsTotal: targetPushTotal,
      situpsPerSet: targetSit,
      situpsTotal: targetSitTotal
    },
    actual: {
      pushupsPerSet: actualPushMain,
      pushupsTotal: actualPushTotal,
      situpsPerSet: actualSitMain,
      situpsTotal: actualSitTotal,
      exercises
    },
    effort: entry.effort || "passe",
    photo: normalizedPhoto
  };
}

function saveState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleSyncPush();
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
  return [...state.history].sort((a, b) =>
    b.date.localeCompare(a.date) || String(b.updatedAt || "").localeCompare(String(a.updatedAt || ""))
  );
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

function bestPushupsSet() {
  return Math.max(
    exerciseSetting("pushups").start,
    state.profile.pushTestMax || 0,
    ...state.history.map((entry) => entry.actual?.pushupsPerSet || entry.pushupsPerSet || 0)
  );
}

function bestControlledPushupsSet() {
  return Math.max(exerciseSetting("pushups").start, ...state.history.map((entry) => entry.actual?.pushupsPerSet || entry.pushupsPerSet || 0));
}

function bestSitupsSet() {
  return Math.max(exerciseSetting("situps").start, ...state.history.map((entry) => entry.actual?.situpsPerSet || entry.situpsPerSet || 0));
}

function bestMainSetPair() {
  return Math.min(bestPushupsSet(), bestSitupsSet());
}

function xpTotal() {
  return state.history.reduce((sum, entry) => sum + entry.xp, 0);
}

function exerciseLabel(key) {
  return exerciseGuides[key]?.title || key;
}

function actualExerciseEntries(entry) {
  const exercises = entry.actual?.exercises || {};
  return Object.entries(exercises)
    .filter(([, value]) => Number(value?.main || 0) > 0 || Number(value?.total || 0) > 0)
    .map(([key, value]) => ({
      key,
      name: exerciseLabel(key),
      main: Number(value.main || 0),
      total: Number(value.total || 0)
    }));
}

function actualExerciseSummary(entry) {
  const exercises = actualExerciseEntries(entry);
  if (!exercises.length) return "Ingen øvelser registrert";
  return exercises.map((exercise) => `${exercise.total} ${exercise.name.toLowerCase()}`).join(" + ");
}

function actualMainSummary(entry) {
  const exercises = actualExerciseEntries(entry);
  if (!exercises.length) return "Ingen hovedsett";
  return exercises.map((exercise) => `${exercise.name}: ${exercise.main}`).join(" · ");
}

function activeExerciseTotal(entries) {
  return entries.reduce((sum, entry) =>
    sum + actualExerciseEntries(entry).reduce((entrySum, exercise) => entrySum + exercise.total, 0), 0
  , 0);
}

function bestActiveExerciseMain() {
  return Math.max(0, ...state.history.flatMap((entry) => actualExerciseEntries(entry).map((exercise) => exercise.main)));
}

function bestExerciseMain(key) {
  if (key === "pushups") return bestControlledPushupsSet();
  if (key === "situps") return bestSitupsSet();
  return Math.max(
    exerciseSetting(key).start,
    ...state.history.map((entry) => Number(entry.actual?.exercises?.[key]?.main || 0))
  );
}

function workoutForToday() {
  const doneCount = state.history.length;
  const isRecovery = doneCount > 0 && (doneCount + 1) % 7 === 0;
  const exerciseTargets = Object.fromEntries(ALL_EXERCISE_KEYS.map((key) => [key, plannedExerciseForToday(key, doneCount, isRecovery)]));
  const pushTarget = exerciseTargets.pushups;
  const sitTarget = exerciseTargets.situps;

  return {
    sets: 1,
    pushupsPerSet: pushTarget.main,
    pushupsTotal: pushTarget.total,
    pushSupport: pushTarget.support,
    situpsPerSet: sitTarget.main,
    situpsTotal: sitTarget.total,
    sitSupport: sitTarget.support,
    exerciseTargets,
    isRecovery
  };
}

function plannedExerciseForToday(key, doneCount, isRecovery) {
  const setting = exerciseSetting(key);
  const main = nextMainSetTarget(setting.start, bestExerciseMain(key), doneCount, isRecovery, setting.goal);
  const support = supportPlan(main, setting.supportSets);
  return {
    key,
    main,
    total: main + support.total,
    support,
    unit: setting.unit,
    goal: setting.goal
  };
}

function nextMainSetTarget(startValue, bestValue, doneCount, isRecovery, goal = state.profile.goal) {
  const progressStep = doneCount > 0 && doneCount % 2 === 0 ? 1 : 0;
  const target = isRecovery
    ? Math.max(startValue, bestValue - 3)
    : Math.max(startValue, bestValue + progressStep);
  return Math.min(goal, target);
}

function supportPlan(mainSetTarget, preferredSets = 2) {
  if (!mainSetTarget) return { sets: 0, reps: 0, total: 0 };
  if (!preferredSets) return { sets: 0, reps: 0, total: 0 };
  if (mainSetTarget >= 90) return { sets: Math.min(1, preferredSets), reps: Math.max(10, Math.round(mainSetTarget * 0.25)), total: Math.max(10, Math.round(mainSetTarget * 0.25)) };
  if (mainSetTarget >= 70) return { sets: Math.min(1, preferredSets), reps: Math.round(mainSetTarget * 0.35), total: Math.round(mainSetTarget * 0.35) };
  if (mainSetTarget >= 45) {
    const sets = Math.min(2, preferredSets);
    const reps = Math.round(mainSetTarget * 0.4);
    return { sets, reps, total: reps * sets };
  }
  if (mainSetTarget >= 30) {
    const sets = Math.min(2, preferredSets);
    const reps = Math.round(mainSetTarget * 0.5);
    return { sets, reps, total: reps * sets };
  }
  const earlySupportReps = Math.max(8, Math.round(mainSetTarget * 0.55));
  return {
    sets: preferredSets,
    reps: earlySupportReps,
    total: earlySupportReps * preferredSets
  };
}

function render() {
  const todayWorkout = workoutForToday();
  const streak = currentStreak();
  const pushBest = bestPushupsSet();
  const pairBest = bestMainSetPair();
  const hasExercises = enabledExerciseKeys().length > 0;
  const goalProgress = Math.min(100, Math.round((pairBest / state.profile.goal) * 100));

  els.todayLabel.textContent = new Intl.DateTimeFormat("no-NO", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  els.streakDays.textContent = streak;
  els.xpTotal.textContent = xpTotal();
  els.bestPushups.textContent = `${pushBest}/${bestSitupsSet()}`;
  els.goalPercent.textContent = `${goalProgress}%`;
  els.goalFill.style.width = `${goalProgress}%`;
  els.title.textContent = completedToday() ? "Dagens økt er fullført" : `${state.profile.name}, dagens økt`;
  els.nextPushGoal.textContent = todayWorkout.pushupsPerSet;
  els.situpStatus.textContent = state.profile.situpBase > 0 ? todayWorkout.situpsPerSet : "Test";
  els.completeButton.disabled = completedToday() || !hasExercises;
  els.completeButton.textContent = completedToday() ? "Fullført i dag" : hasExercises ? "Fullfør økten" : "Velg minst én øvelse";
  els.dailyHint.textContent = !hasExercises
    ? "Trykk + for å velge øvelser før økten kan fullføres."
    : todayWorkout.isRecovery
    ? "Litt lettere dag i dag. Hold streaken, ikke maks ut."
    : "Stopp hvis teknikken faller. Kvalitet teller mer enn fart.";

  renderExercises(todayWorkout);
  renderPhotoCheckin();
  renderBadges(streak, pairBest);
  renderStats();
  renderMotivation(todayWorkout);
  renderCoachFeedback();
  renderHistory();
  renderPlanOverview(todayWorkout, pairBest);
  renderMilestones(pairBest);
  renderFacts();
}

function renderExercises(workout) {
  const exercises = enabledExerciseKeys().map((key) => exerciseTargetForToday(key, workout));

  if (!exercises.length) {
    els.exerciseList.innerHTML = `
      <article class="exercise-row empty-exercise-row">
        <span>
          <span class="exercise-name">Ingen øvelser valgt</span>
          <span class="exercise-detail">Trykk + eller gå til Innstillinger → Treningsøvelser for å slå på øvelser.</span>
        </span>
      </article>
    `;
    return;
  }

  els.exerciseList.innerHTML = exercises.map((exercise) => `
    <article class="exercise-row">
      <span>
        <span class="exercise-title-row">
          <span class="exercise-name">${exercise.name}</span>
          <button class="exercise-guide-button" type="button" data-exercise-guide="${exercise.key}" aria-label="Åpne instruksjon for ${exercise.name}">Instruksjon</button>
        </span>
        <span class="exercise-detail">${exercise.detail}</span>
      </span>
      <span class="exercise-inputs">
        <label>
          Hovedsett ${infoButton("Hovedsett er første sammenhengende sett. Dette tallet teller mot 1 x 100.")}
          <input class="actual-input" id="${exercise.mainId}" data-exercise-main="${exercise.key}" type="number" inputmode="numeric" min="0" max="300" value="${exercise.mainValue}" aria-label="Faktisk ${exercise.name} i hovedsett" />
        </label>
        <label>
          Totalt ${infoButton("Totalt er hovedsett pluss støtte-sett. Det viser treningsmengde, men teller ikke som 1 x 100.")}
          <input class="actual-input" id="${exercise.totalId}" data-exercise-total="${exercise.key}" type="number" inputmode="numeric" min="0" max="500" value="${exercise.totalValue}" aria-label="Faktisk ${exercise.name} totalt" />
        </label>
      </span>
    </article>
  `).join("");
}

function exerciseTargetForToday(key, workout) {
  const guide = exerciseGuides[key];
  const target = workout.exerciseTargets?.[key] || plannedExerciseForToday(key, state.history.length, workout.isRecovery);
  const support = target.support;
  const detail = supportText(target.main, support, target.unit, target.goal);
  if (key === "pushups") {
    return {
      key,
      name: "Pushups",
      detail,
      mainValue: target.main,
      totalValue: target.total,
      mainId: "actualPushInput",
      totalId: "actualPushTotalInput"
    };
  }
  if (key === "situps") {
    return {
      key,
      name: "Situps",
      detail,
      mainValue: target.main,
      totalValue: target.total,
      mainId: "actualSitupInput",
      totalId: "actualSitupTotalInput"
    };
  }
  return {
    key,
    name: guide?.title || key,
    detail,
    mainValue: target.main,
    totalValue: target.total,
    mainId: `actual-${key}-main`,
    totalId: `actual-${key}-total`
  };
}

function infoButton(message, light = false) {
  return `<button class="info-button${light ? " info-button--light" : ""}" type="button" data-help="${message}" title="${message}" aria-label="${message}">?</button>`;
}

function supportText(mainSet, support, unit = "reps", goal = 100) {
  const unitText = unit === "reps" ? "" : ` ${unit}`;
  if (!support?.sets) return `Hovedsett: ${mainSet}${unitText}. Ingen støtte-sett i dag. Mål: 1 × ${goal}${unitText}.`;
  return `Hovedsett: ${mainSet}${unitText}. Støtte etter pause: ${support.sets} × ${support.reps}${unitText}. Målet er etter hvert å slå dette sammen mot 1 × ${goal}${unitText}.`;
}

function renderPhotoCheckin() {
  const nextWorkout = state.history.length + 1;
  const hasAnyPhoto = allProgressPhotos().length > 0;
  const isStartPhotoDue = !hasAnyPhoto;
  const isProgressPhotoDue = nextWorkout > 1 && nextWorkout % state.profile.photoEvery === 0;
  const isDue = isStartPhotoDue || isProgressPhotoDue;
  els.photoCheckin.classList.toggle("is-due", isDue);
  els.photoHint.textContent = state.pendingPhoto
    ? "Bilde er valgt for denne økten."
    : photoCheckinText(nextWorkout, isStartPhotoDue, isProgressPhotoDue);
}

function photoCheckinText(nextWorkout, isStartPhotoDue, isProgressPhotoDue) {
  if (isStartPhotoDue) {
    return "Ta startbilde før eller etter første økt. Bruk samme speil, lys og avstand senere.";
  }
  if (isProgressPhotoDue) {
    return `Økt ${nextWorkout}: ta nytt bilde etter at øvelsene er logget.`;
  }
  const nextPhotoWorkout = Math.ceil(nextWorkout / state.profile.photoEvery) * state.profile.photoEvery;
  return `Neste bilde blir etter økt ${nextPhotoWorkout}.`;
}

function pendingPhotoLabel(workoutNumber) {
  return workoutNumber <= 1 && allProgressPhotos().length === 0 ? "Startbilde" : `Økt ${workoutNumber}`;
}

function renderStats() {
  const entries = sortedHistory();
  const last7 = entries.slice(0, 7);
  const doneLast7 = last7.length;
  const allExerciseTotal = activeExerciseTotal(entries);
  const bestActiveMain = bestActiveExerciseMain();
  const photos = allProgressPhotos().length;

  els.statsGrid.innerHTML = [
    ["Siste 7 dager", `${doneLast7}/7`, "Hvor mange av de siste sju dagene som er fullført."],
    ["Aktive øvelser totalt", allExerciseTotal, "All registrert treningsmengde fra øvelsene som er logget."],
    ["Beste hovedsett", bestActiveMain, "Beste registrerte hovedsett på tvers av øvelser."],
    ["Bilder lagret", photos, "Startbilde og fremgangsbilder fra speilet."]
  ].map(([label, value, help]) => `
    <article class="stat-card">
      <span>${label} ${infoButton(help)}</span>
      <strong>${value}</strong>
    </article>
  `).join("");

  renderExerciseGraphs(entries);
  renderPhotoGallery();
}

function allProgressPhotos() {
  const savedPhotos = state.photos.map((photo) => ({ ...photo, source: "progress" }));
  const historyPhotos = sortedHistory()
    .filter((entry) => entry.photo)
    .map((entry, index) => ({
      date: entry.date,
      workoutNumber: entry.photo?.workoutNumber || entry.workoutNumber || Math.max(1, state.history.length - index),
      label: entry.photo?.label || `Økt ${entry.photo?.workoutNumber || entry.workoutNumber || Math.max(1, state.history.length - index)}`,
      dataUrl: typeof entry.photo === "string" ? entry.photo : entry.photo?.dataUrl,
      source: "history"
    }));

  return [...savedPhotos, ...historyPhotos]
    .filter((photo) => photo.dataUrl)
    .sort((a, b) => (a.workoutNumber || 0) - (b.workoutNumber || 0) || a.date.localeCompare(b.date));
}

function renderPhotoGallery() {
  const photos = allProgressPhotos();
  const nextWorkout = state.history.length + 1;
  const nextPhotoWorkout = Math.ceil(nextWorkout / state.profile.photoEvery) * state.profile.photoEvery;

  els.progressPhotoHint.textContent = photos.length === 0
    ? "Last opp startbildet her. Ta bildet i speilet med samme lys og vinkel hver gang."
    : `Neste planlagte bilde er ved økt ${nextPhotoWorkout}. Bruk samme lys, vinkel og avstand.`;

  els.photoGallery.innerHTML = photos.length
    ? photos.map((photo, index) => `
        <article class="photo-tile">
          <img src="${photo.dataUrl}" alt="${photo.label}" />
          <span>${index === 0 ? "Start" : photo.label}</span>
          <small>${formatDate(photo.date)}</small>
        </article>
      `).join("")
    : `
        <div class="empty-gallery">
          <strong>Ingen bilder ennå</strong>
          <span>Startbilde legges inn her. Etterpå blir dag 10, 20, 30 osv. lett å sammenligne.</span>
        </div>
      `;
}

function renderExerciseGraphs(entries) {
  const exercises = enabledExerciseKeys().map((key) => exerciseStatsConfig(key));

  els.exerciseGraphDeck.innerHTML = exercises.length
    ? exercises.map((exercise) => renderExerciseGraphCard(entries, exercise)).join("")
    : `<article class="exercise-chart-card"><div class="empty-chart">Ingen øvelser er valgt for statistikk ennå.</div></article>`;
}

function exerciseStatsConfig(key) {
  const guide = exerciseGuides[key];
  return {
    key,
    title: guide?.title || key,
    unit: (guide?.title || key).toLowerCase(),
    help: `Grafen viser hovedsettet for ${guide?.title || key} per fullførte økt.`,
    value: (entry) => exerciseMainValue(entry, key)
  };
}

function exerciseMainValue(entry, key) {
  if (key === "pushups") return entry.actual?.pushupsPerSet || entry.actual?.exercises?.pushups?.main || 0;
  if (key === "situps") return entry.actual?.situpsPerSet || entry.actual?.exercises?.situps?.main || 0;
  return entry.actual?.exercises?.[key]?.main || 0;
}

function renderExerciseGraphCard(entries, exercise) {
  const recent = [...entries]
    .reverse()
    .filter((entry) => exercise.value(entry) > 0)
    .slice(-10);
  const max = Math.max(1, ...recent.map((entry) => exercise.value(entry)));

  const graph = recent.length
    ? recent.map((entry) => {
        const mainSet = exercise.value(entry);
        const height = Math.max(10, Math.round((mainSet / max) * 100));
        const day = new Intl.DateTimeFormat("no-NO", { day: "numeric", month: "short" }).format(dateKeyToLocalDate(entry.date));
        return `
          <div class="bar-item">
            <span class="bar-value">${mainSet}</span>
            <span class="bar" style="height: ${height}%"></span>
            <span class="bar-day">${day}</span>
          </div>
        `;
      }).join("")
    : `<div class="empty-chart">Fullfør noen økter med ${exercise.unit} for å bygge grafen.</div>`;

  const best = recent.length ? Math.max(...recent.map((entry) => exercise.value(entry))) : 0;
  const latest = recent.length ? exercise.value(recent[recent.length - 1]) : 0;

  return `
    <article class="exercise-chart-card">
      <div class="section-heading tight">
        <h4>${exercise.title} ${infoButton(exercise.help)}</h4>
        <span class="chart-label">siste ${recent.length || 10}</span>
      </div>
      <div class="exercise-chart-stats">
        <span>Siste: <strong>${latest}</strong></span>
        <span>Beste: <strong>${best}</strong></span>
      </div>
      <div class="bar-chart" aria-label="Graf over ${exercise.title.toLowerCase()} per økt">${graph}</div>
      <p class="hint">${exercise.help}</p>
    </article>
  `;
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
  const fact = coachFactFor(todayEntry, totalWorkouts);
  const todayTotal = actualExerciseEntries(todayEntry).reduce((sum, exercise) => sum + exercise.total, 0);
  const bestToday = Math.max(0, ...actualExerciseEntries(todayEntry).map((exercise) => exercise.main));

  els.feedbackTitle.textContent = "Økten er logget";
  els.feedbackStats.innerHTML = [
    ["I dag", actualExerciseSummary(todayEntry)],
    ["Beste i dag", bestToday],
    ["Streak", `${currentStreak()} dager`],
    ["Totalt", todayTotal]
  ].map(([label, value]) => `
    <article class="feedback-stat">
      <span>${label}</span>
      <strong>${value}</strong>
    </article>
  `).join("");
  els.feedbackBody.innerHTML = `<strong>${fact.title}</strong> ${fact.text}`;
}

function coachFactFor(entry, totalWorkouts) {
  if (entry.effort === "tung") return factDeck[9];
  if (totalWorkouts % 10 === 0) return factDeck[0];
  if (totalWorkouts % 7 === 0) return factDeck[5];
  if (entry.actual.pushupsPerSet < entry.targets.pushupsPerSet) return factDeck[7];
  if (totalWorkouts % 5 === 0) return factDeck[10];
  if (totalWorkouts % 3 === 0) return factDeck[8];
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
    factDeck[6],
    factDeck[8],
    factDeck[9],
    factDeck[10],
    factDeck[11]
  ];

  const factsHtml = selected.map((fact) => `
    <article class="fact-item">
      <strong>${fact.title}</strong>
      <p>${fact.text}</p>
      <span class="swipe-hint">← Sveip begge veier →</span>
    </article>
  `).join("");

  els.homeFactList.innerHTML = factsHtml;
  els.factList.innerHTML = factsHtml;
}

function renderBadges(streak, pushBest) {
  const badges = [
    {
      el: els.badges.first,
      imageLocked: "./assets/badges/start-locked.jpg",
      imageEarned: "./assets/badges/start-earned.jpg",
      title: "Første økt",
      description: "Fullfør den første registrerte treningen.",
      current: Math.min(state.history.length, 1),
      target: 1,
      unit: "økt"
    },
    {
      el: els.badges.week,
      imageLocked: "./assets/badges/week-locked.jpg",
      imageEarned: "./assets/badges/week-earned.jpg",
      title: "7 dager",
      description: "Hold streaken i en hel uke.",
      current: Math.min(streak, 7),
      target: 7,
      unit: "dager"
    },
    {
      el: els.badges.fifty,
      imageLocked: "./assets/badges/fifty-locked.jpg",
      imageEarned: "./assets/badges/fifty-earned.jpg",
      title: "50 reps",
      description: "Nå 50 i hovedsett for både pushups og situps.",
      current: Math.min(pushBest, 50),
      target: 50,
      unit: "reps"
    },
    {
      el: els.badges.hundred,
      imageLocked: "./assets/badges/hundred-locked.jpg",
      imageEarned: "./assets/badges/hundred-earned.jpg",
      title: "1 × 100",
      description: "Sluttmålet: 100 gode reps i ett sett.",
      current: Math.min(pushBest, 100),
      target: 100,
      unit: "reps"
    }
  ];

  badges.forEach((badge) => {
    const earned = badge.current >= badge.target;
    const progress = Math.min(100, Math.round((badge.current / badge.target) * 100));
    badge.el.classList.toggle("is-earned", earned);
    badge.el.setAttribute("aria-label", `${badge.title}: ${earned ? "oppnådd" : `${badge.current} av ${badge.target} ${badge.unit}`}`);
    badge.el.innerHTML = `
      <span class="badge-art-wrap">
        <img class="badge-art" src="${earned ? badge.imageEarned : badge.imageLocked}" alt="" loading="lazy" />
      </span>
      <span class="badge-status">${earned ? "Oppnådd" : "Låst"}</span>
      <span class="badge-title">${badge.title}</span>
      <span class="badge-description">${badge.description}</span>
      <span class="badge-progress-text">${badge.current}/${badge.target} ${badge.unit}</span>
      <span class="badge-progress" aria-hidden="true"><span style="width: ${progress}%"></span></span>
    `;
  });
}

function renderHistory() {
  const history = sortedHistory().slice(0, 21);
  els.historyList.innerHTML = history.length
    ? history.map((entry) => `
        <li>
          <strong>${formatDate(entry.date)} · ${entry.xp} XP</strong>
          <span>${actualMainSummary(entry)} · totalt ${actualExerciseSummary(entry)} · ${entry.effort}</span>
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

function renderPlanOverview(workout, pushBest) {
  const pushPlan = `1 × ${workout.pushupsPerSet}${workout.pushSupport.sets ? ` + ${workout.pushSupport.sets} × ${workout.pushSupport.reps}` : ""}`;
  const sitPlan = `1 × ${workout.situpsPerSet}${workout.sitSupport.sets ? ` + ${workout.sitSupport.sets} × ${workout.sitSupport.reps}` : ""}`;
  const formText = state.profile.pushTestMax > bestControlledPushupsSet()
    ? `Du har testet ${state.profile.pushTestMax} i ett sett. Daglig hovedsett starter lavere hvis teknikken må bli dypere.`
    : "Daglig mål følger beste kontrollerte hovedsett fra loggen.";

  els.planSummary.innerHTML = [
    ["Testet toppsett", `${state.profile.pushTestMax} pushups`, "Ett sett brukes som kapasitetstest, ikke som daglig fasit.", "Beste test i ett sett. Daglig mål kan ligge lavere hvis teknikken skal bli bedre."],
    ["Dagens pushups", pushPlan, "Første tallet er hovedsettet. Støtte-sett bygger volum etter pause.", "Eksempel: 1 x 24 + 2 x 12 betyr ett hovedsett på 24 og to støtte-sett."],
    ["Dagens situps", sitPlan, "Samme modell: ett hovedsett som gradvis bygges mot 100.", "Situps følger samme modell som pushups."],
    ["Mot 1x100", `${pushBest}/${state.profile.goal}`, formText, "Fremdriften styres av svakeste hovedsett av pushups og situps."]
  ].map(([label, value, text, help]) => `
    <article class="plan-stat">
      <span>${label} ${infoButton(help)}</span>
      <strong>${value}</strong>
      <p>${text}</p>
    </article>
  `).join("");

  els.planPhases.innerHTML = [
    ["1. Hovedsett først", "Dagens første sett er viktigst. Det er tallet som bygges mot 1 × 100."],
    ["2. Støtte-sett underveis", "Ekstra sett etter pause gir treningsvolum uten at hovedsettet må presses stygt hver dag."],
    ["3. Slå sammen gradvis", "Når hovedsettet øker, blir støtte-settene mindre viktige. Programmet flytter kapasitet inn i første sett."],
    ["4. Sluttmål", "Målet er 1 × 100 pushups og 1 × 100 situps med god form. Støtte-sett er bare veien dit."]
  ].map(([title, text]) => `
    <article class="phase-card">
      <strong>${title}</strong>
      <p>${text}</p>
    </article>
  `).join("");
}

function completeWorkout() {
  const activeKeys = enabledExerciseKeys();
  if (completedToday() || !activeKeys.length) return;

  const workout = workoutForToday();
  const workoutNumber = state.history.length + 1;
  const actualPushupsPerSet = clamp(Number(document.querySelector("#actualPushInput")?.value), 0, 200);
  const actualSitupsPerSet = clamp(Number(document.querySelector("#actualSitupInput")?.value), 0, 200);
  const actualPushupsTotal = Math.max(actualPushupsPerSet, clamp(Number(document.querySelector("#actualPushTotalInput")?.value), 0, 300));
  const actualSitupsTotal = Math.max(actualSitupsPerSet, clamp(Number(document.querySelector("#actualSitupTotalInput")?.value), 0, 300));
  const actualExercises = readActualExercises();
  const loggedExercises = Object.values(actualExercises);
  const bestLoggedMain = Math.max(0, ...loggedExercises.map((exercise) => exercise.main || 0));
  const streakBefore = currentStreak();
  const hitTargetBonus = activeKeys.some((key) => Number(actualExercises[key]?.main || 0) >= Number(workout.exerciseTargets?.[key]?.main || 0)) ? 10 : 0;
  const xp = 20 + Math.min(30, bestLoggedMain) + hitTargetBonus + (streakBefore >= 2 ? 10 : 0);
  const now = new Date().toISOString();

  state.history.push({
    id: `${isoDate()}-${now}`,
    date: isoDate(),
    updatedAt: now,
    workoutNumber,
    sets: workout.sets,
    pushupsPerSet: workout.pushupsPerSet,
    situpsPerSet: workout.situpsPerSet,
    targets: {
      sets: workout.sets,
      pushupsPerSet: workout.pushupsPerSet,
      pushupsTotal: workout.pushupsTotal,
      situpsPerSet: workout.situpsPerSet,
      situpsTotal: workout.situpsTotal,
      exercises: workout.exerciseTargets
    },
    actual: {
      pushupsPerSet: actualPushupsPerSet,
      pushupsTotal: actualPushupsTotal,
      situpsPerSet: actualSitupsPerSet,
      situpsTotal: actualSitupsTotal,
      exercises: actualExercises
    },
    effort: els.effortInput.value,
    photo: state.pendingPhoto
      ? {
          dataUrl: state.pendingPhoto,
          label: pendingPhotoLabel(workoutNumber),
          workoutNumber
        }
      : null,
    xp
  });

  state.pendingPhoto = null;
  saveState();
  render();
  sendCompletionMessage(actualExercises);
}

function readActualExercises() {
  const result = {};
  enabledExerciseKeys().forEach((key) => {
    const main = clamp(Number(document.querySelector(`[data-exercise-main="${key}"]`)?.value), 0, 300);
    const total = Math.max(main, clamp(Number(document.querySelector(`[data-exercise-total="${key}"]`)?.value), 0, 500));
    result[key] = { main, total };
  });
  return result;
}

function renderExerciseSettingsFields() {
  els.exerciseSettingsFields.innerHTML = ALL_EXERCISE_KEYS.map((key) => {
    const guide = exerciseGuides[key];
    const setting = exerciseSetting(key);
    const unit = setting.unit === "reps" ? "reps" : setting.unit;
    return `
      <article class="exercise-setting-card">
        <div>
          <strong>${guide?.title || key}</strong>
          <p>Forslag: hovedsett + støtte-sett, målet er 1 × målverdien.</p>
        </div>
        <div class="exercise-setting-grid">
          <label>
            Start (${unit})
            <input data-exercise-setting="${key}" data-exercise-setting-field="start" type="number" inputmode="numeric" min="0" max="500" value="${setting.start}" />
          </label>
          <label>
            Mål (${unit})
            <input data-exercise-setting="${key}" data-exercise-setting-field="goal" type="number" inputmode="numeric" min="1" max="500" value="${setting.goal}" />
          </label>
          <label>
            Støtte-sett
            <input data-exercise-setting="${key}" data-exercise-setting-field="supportSets" type="number" inputmode="numeric" min="0" max="4" value="${setting.supportSets}" />
          </label>
        </div>
      </article>
    `;
  }).join("");
}

function exerciseSettingsFromInputs() {
  const settings = normalizeExerciseSettings(state.profile);
  document.querySelectorAll("[data-exercise-setting][data-exercise-setting-field]").forEach((input) => {
    const key = input.dataset.exerciseSetting;
    const field = input.dataset.exerciseSettingField;
    if (!settings[key]) return;
    if (field === "start") settings[key].start = clamp(Number(input.value), 0, 500);
    if (field === "goal") settings[key].goal = clamp(Number(input.value), 1, 500);
    if (field === "supportSets") settings[key].supportSets = clamp(Number(input.value), 0, 4);
  });

  Object.keys(settings).forEach((key) => {
    settings[key].goal = Math.max(settings[key].start || 1, settings[key].goal);
  });
  return settings;
}

function openSettings() {
  els.nameInput.value = state.profile.name;
  els.ntfyTopicInput.value = state.profile.ntfyTopic;
  els.remindersInput.checked = state.profile.remindersEnabled;
  els.reminderTimeInput.value = state.profile.reminderTime;
  renderExerciseSettingsFields();
  settingsSnapshot = JSON.stringify(settingsValuesFromInputs());
  setSyncStatus(syncIsConfigured()
    ? "Sikkerhetskopi av treningsdata er oppdatert."
    : "Sikkerhetskopi er ikke koblet til ennå. Logg inn på nytt hvis dette vedvarer.");
  closeCapacityFields();
  els.settingsDialog.showModal();
}

function closeCapacityFields() {
  els.capacityFields.hidden = true;
  els.toggleCapacityButton.setAttribute("aria-expanded", "false");
  els.toggleCapacityButton.textContent = "Endre startnivå og mål";
}

function toggleCapacityFields() {
  const willOpen = els.capacityFields.hidden;
  els.capacityFields.hidden = !willOpen;
  els.toggleCapacityButton.setAttribute("aria-expanded", String(willOpen));
  els.toggleCapacityButton.textContent = willOpen ? "Skjul startnivå og mål" : "Endre startnivå og mål";
}

let settingsAutoSaveTimer = null;
let settingsSnapshot = "";

function settingsValuesFromInputs() {
  const exerciseSettings = exerciseSettingsFromInputs();
  return {
    name: els.nameInput.value.trim() || "William",
    pushBase: exerciseSettings.pushups.start,
    pushTestMax: clamp(Number(state.profile.pushTestMax || 29), 1, 100),
    situpBase: exerciseSettings.situps.start,
    sets: 1,
    goal: exerciseSettings.pushups.goal,
    exerciseSettings,
    ntfyTopic: sanitizeTopic(els.ntfyTopicInput.value) || DEFAULT_NTFY_TOPIC,
    remindersEnabled: els.remindersInput.checked,
    reminderTime: els.reminderTimeInput.value || "19:30",
    syncEnabled: true,
    syncUrl: normalizeSyncUrl(state.profile.syncUrl || DEFAULT_SYNC_URL),
    syncToken: state.profile.syncToken || ""
  };
}

function persistSettingsFromInputs() {
  const nextProfile = settingsValuesFromInputs();
  const nextSnapshot = JSON.stringify(nextProfile);
  if (nextSnapshot === settingsSnapshot) return;
  const previousReminderConfig = `${state.profile.remindersEnabled}|${state.profile.reminderTime}`;
  state.profile = {
    ...state.profile,
    ...nextProfile
  };
  settingsSnapshot = nextSnapshot;

  saveState();
  const nextReminderConfig = `${state.profile.remindersEnabled}|${state.profile.reminderTime}`;
  if (previousReminderConfig !== nextReminderConfig) sendReminderConfig();
  render();
}

function scheduleSettingsAutoSave() {
  window.clearTimeout(settingsAutoSaveTimer);
  settingsAutoSaveTimer = window.setTimeout(persistSettingsFromInputs, 350);
}

function closeSettings() {
  window.clearTimeout(settingsAutoSaveTimer);
  persistSettingsFromInputs();
  els.settingsDialog.close();
  closeCapacityFields();
}

function handleSettingsClosed() {
  window.clearTimeout(settingsAutoSaveTimer);
  persistSettingsFromInputs();
  closeCapacityFields();
}

function handleSettingsCancel() {
  window.clearTimeout(settingsAutoSaveTimer);
  persistSettingsFromInputs();
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

function showHelp(message) {
  if (!message) return;
  els.helpPopoverText.textContent = message;
  els.helpPopover.hidden = false;
  window.clearTimeout(showHelp.hideTimer);
  showHelp.hideTimer = window.setTimeout(hideHelp, 9000);
}

function hideHelp() {
  els.helpPopover.hidden = true;
}

function renderListItems(items) {
  return items.map((item) => `<li>${item}</li>`).join("");
}

function showExerciseGuide(key) {
  const guide = exerciseGuides[key];
  if (!guide) return;

  els.exerciseGuideTitle.textContent = guide.title;
  els.exerciseGuideMuscles.textContent = guide.muscles;
  els.exerciseGuideWhy.textContent = guide.why;
  els.exerciseGuideHow.innerHTML = renderListItems(guide.how);
  els.exerciseGuideMistakes.innerHTML = renderListItems(guide.mistakes);

  els.exerciseGuideMedia.hidden = true;
  els.exerciseGuideImage.removeAttribute("src");
  els.exerciseGuideImage.alt = guide.imageAlt || "";

  if (guide.image) {
    els.exerciseGuideImage.onload = () => {
      els.exerciseGuideMedia.hidden = false;
    };
    els.exerciseGuideImage.onerror = () => {
      els.exerciseGuideMedia.hidden = true;
      els.exerciseGuideImage.removeAttribute("src");
    };
    els.exerciseGuideImage.src = guide.image;
  }

  hideHelp();
  els.exerciseGuidePopover.hidden = false;
}

function hideExerciseGuide() {
  els.exerciseGuidePopover.hidden = true;
}

function showExerciseManager() {
  renderExerciseManager();
  hideHelp();
  if (els.settingsDialog.open) {
    els.settingsDialog.close();
  }
  els.exerciseManagerPopover.hidden = false;
}

function hideExerciseManager() {
  els.exerciseManagerPopover.hidden = true;
}

function renderExerciseManager() {
  const active = new Set(enabledExerciseKeys());
  els.exerciseManagerList.innerHTML = ALL_EXERCISE_KEYS.map((key) => {
    const guide = exerciseGuides[key];
    const checked = active.has(key) ? "checked" : "";
    return `
      <article class="exercise-manager-row" data-exercise-manager-guide="${key}" role="button" tabindex="0" aria-label="Åpne instruksjon for ${guide?.title || key}">
        <span class="exercise-manager-info" aria-hidden="true">
          <img src="${guide?.image || "./assets/icon-192.png"}" alt="" loading="lazy" />
        </span>
        <div>
          <strong>${guide?.title || key}</strong>
          <p>${key === "pushups" || key === "situps" ? "Grunnøvelse i programmet." : "Kan legges til tidligere eller senere."}</p>
        </div>
        <label class="switch-label" aria-label="Vis ${guide?.title || key} i dagens oppgave og statistikk">
          <input type="checkbox" data-exercise-toggle="${key}" ${checked} />
          <span></span>
        </label>
      </article>
    `;
  }).join("");
}

function handleExerciseManagerChange(event) {
  const toggle = event.target.closest("[data-exercise-toggle]");
  if (!toggle) return;
  const key = toggle.dataset.exerciseToggle;
  const active = new Set(enabledExerciseKeys());
  if (toggle.checked) {
    active.add(key);
  } else {
    active.delete(key);
  }
  state.profile.enabledExercises = validExerciseKeys([...active]);
  saveState();
  renderExerciseManager();
  render();
}

function handleExerciseManagerClick(event) {
  if (event.target.closest(".switch-label")) return;
  const row = event.target.closest("[data-exercise-manager-guide]");
  if (!row) return;
  showExerciseGuide(row.dataset.exerciseManagerGuide);
}

function handleExerciseManagerKeydown(event) {
  if (event.key !== "Enter" && event.key !== " ") return;
  if (event.target.closest(".switch-label")) return;
  const row = event.target.closest("[data-exercise-manager-guide]");
  if (!row) return;
  event.preventDefault();
  showExerciseGuide(row.dataset.exerciseManagerGuide);
}

function handleExerciseManagerOverlayClick(event) {
  if (event.target === els.exerciseManagerPopover) hideExerciseManager();
}

function handleHelpOverlayClick(event) {
  if (event.target === els.helpPopover) hideHelp();
}

function handleExerciseGuideOverlayClick(event) {
  if (event.target === els.exerciseGuidePopover) hideExerciseGuide();
}

function handleHelpClick(event) {
  const guideButton = event.target.closest("[data-exercise-guide]");
  if (guideButton) {
    event.preventDefault();
    event.stopPropagation();
    showExerciseGuide(guideButton.dataset.exerciseGuide);
    return;
  }

  const button = event.target.closest(".info-button");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();
  showHelp(button.dataset.help || button.title || button.getAttribute("aria-label"));
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

function normalizeSyncUrl(value) {
  return value.trim().replace(/\/+$/, "");
}

function syncIsConfigured() {
  return Boolean(isAuthenticated() && state.profile.syncEnabled && state.profile.syncUrl && currentSyncToken());
}

function syncEndpoint() {
  return `${normalizeSyncUrl(state.profile.syncUrl)}/api/state`;
}

function syncLoginEndpoint() {
  return `${normalizeSyncUrl(state.profile.syncUrl || DEFAULT_SYNC_URL)}/api/login`;
}

function readSyncSession() {
  try {
    const session = JSON.parse(localStorage.getItem(SYNC_SESSION_KEY));
    if (!session?.token || !session?.userId || Date.parse(session.expiresAt || "") <= Date.now()) {
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

function writeSyncSession(session) {
  localStorage.setItem(SYNC_SESSION_KEY, JSON.stringify(session));
}

function currentSyncToken() {
  const session = readSyncSession();
  return session?.token || state.profile.syncToken || "";
}

async function startSyncSession(username, password) {
  try {
    const response = await fetch(syncLoginEndpoint(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload.sessionToken || !payload.userId) throw new Error("missing_session");
    writeSyncSession({
      token: payload.sessionToken,
      userId: payload.userId,
      expiresAt: payload.expiresAt
    });
    state.profile = {
      ...state.profile,
      userId: payload.userId,
      syncEnabled: true,
      syncUrl: normalizeSyncUrl(state.profile.syncUrl || DEFAULT_SYNC_URL),
      syncToken: ""
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSyncStatus("Synk er koblet til innloggingen.");
    return true;
  } catch {
    setSyncStatus("Innlogging virker lokalt, men sync-session kunne ikke hentes.");
    return false;
  }
}

function syncHeaders() {
  return {
    Authorization: `Bearer ${currentSyncToken()}`,
    "X-WB-User": readSyncSession()?.userId || localStorage.getItem(AUTH_USER_KEY) || state.profile.userId || AUTH_USER,
    "Content-Type": "application/json"
  };
}

function publicStateForSync() {
  const copy = structuredClone(state);
  copy.profile = {
    ...copy.profile,
    syncToken: ""
  };
  return copy;
}

function setSyncStatus(message) {
  if (els.syncStatus) els.syncStatus.textContent = message;
}

function mergeEntries(localEntries, remoteEntries) {
  const byDate = new Map();
  [...localEntries, ...remoteEntries].forEach((entry) => {
    const key = entry.date;
    const existing = byDate.get(key);
    if (!existing || Date.parse(entry.updatedAt || entry.date || "") >= Date.parse(existing.updatedAt || existing.date || "")) {
      byDate.set(key, entry);
    }
  });
  return [...byDate.values()].sort((a, b) =>
    a.date.localeCompare(b.date) || String(a.updatedAt || "").localeCompare(String(b.updatedAt || ""))
  );
}

function mergePhotos(localPhotos, remotePhotos) {
  const byKey = new Map();
  const keyFor = (photo) => `${photo.date}|${photo.workoutNumber}|${photo.label}`;
  localPhotos.forEach((photo) => byKey.set(keyFor(photo), photo));
  remotePhotos.forEach((photo) => byKey.set(keyFor(photo), photo));
  return [...byKey.values()].sort((a, b) =>
    a.date.localeCompare(b.date) || Number(a.workoutNumber) - Number(b.workoutNumber)
  );
}

function mergeSyncedState(localValue, remoteValue) {
  const local = normalizeState(localValue);
  const remote = normalizeState(remoteValue);
  const localSync = {
    userId: local.profile.userId,
    syncEnabled: local.profile.syncEnabled,
    syncUrl: local.profile.syncUrl,
    syncToken: local.profile.syncToken
  };
  const remoteIsNewer = Date.parse(remote.updatedAt || "") > Date.parse(local.updatedAt || "");

  return normalizeState({
    ...local,
    ...remote,
    profile: {
      ...(remoteIsNewer ? remote.profile : local.profile),
      ...localSync
    },
    notifications: local.notifications,
    history: mergeEntries(local.history, remote.history),
    photos: mergePhotos(local.photos, remote.photos),
    updatedAt: new Date().toISOString()
  });
}

let syncPushTimer = null;

function scheduleSyncPush() {
  if (!syncIsConfigured()) return;
  window.clearTimeout(syncPushTimer);
  syncPushTimer = window.setTimeout(() => syncPush({ silent: true }), 900);
}

async function syncPull({ silent = false } = {}) {
  if (!syncIsConfigured()) return false;
  try {
    if (!silent) setSyncStatus("Henter synk...");
    const response = await fetch(syncEndpoint(), {
      method: "GET",
      headers: syncHeaders(),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (payload.state) {
      state = mergeSyncedState(state, payload.state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      render();
    }
    setSyncStatus("Sikkerhetskopi av treningsdata er oppdatert.");
    return true;
  } catch {
    setSyncStatus("Sikkerhetskopi er ikke oppdatert akkurat nå.");
    return false;
  }
}

async function syncPush({ silent = false } = {}) {
  if (!syncIsConfigured()) return false;
  try {
    if (!silent) setSyncStatus("Sender synk...");
    const response = await fetch(syncEndpoint(), {
      method: "PUT",
      headers: syncHeaders(),
      body: JSON.stringify({
        updatedBy: state.profile.name || "William",
        updatedByUserId: localStorage.getItem(AUTH_USER_KEY) || state.profile.userId || AUTH_USER,
        state: publicStateForSync()
      })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    setSyncStatus("Sikkerhetskopi av treningsdata er oppdatert.");
    return true;
  } catch {
    setSyncStatus("Sikkerhetskopi er ikke oppdatert akkurat nå.");
    return false;
  }
}

async function syncNow() {
  state.profile = {
    ...state.profile,
    userId: localStorage.getItem(AUTH_USER_KEY) || AUTH_USER,
    syncEnabled: true,
    syncUrl: normalizeSyncUrl(state.profile.syncUrl || DEFAULT_SYNC_URL),
    syncToken: ""
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!currentSyncToken()) {
    setSyncStatus("Logg ut og inn igjen for å hente ny sync-session.");
    return;
  }
  const pulled = await syncPull();
  if (pulled) await syncPush();
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

function sendCompletionMessage(actualExercises) {
  if (!state.profile.remindersEnabled) return;

  const streak = currentStreak();
  const summary = Object.entries(actualExercises)
    .filter(([, value]) => Number(value?.total || 0) > 0)
    .map(([key, value]) => `${value.total} ${exerciseLabel(key).toLowerCase()}`)
    .join(" og ");
  const message = `Økt fullført ${isoDate()}: ${summary || "treningsøkten er logget"}. Streak: ${streak} dager.`;

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
  if (els.friendFields.hidden) {
    els.friendFields.hidden = false;
    els.requestFriendButton.setAttribute("aria-expanded", "true");
    els.requestFriendButton.textContent = "Send forespørsel i Meldinger";
    els.friendRequestStatus.textContent = "Fyll inn tre felt. Ingenting sendes før Meldinger åpnes og du trykker send.";
    els.friendNameInput.focus();
    return;
  }

  const name = els.friendNameInput.value.trim();
  const username = els.friendUsernameInput.value.trim();
  const email = els.friendEmailInput.value.trim();

  if (!name || !username || !email) {
    els.friendRequestStatus.textContent = "Fyll ut navn, brukernavn og e-postadresse først.";
    els.requestFriendButton.textContent = "Fyll ut alt først";
    window.setTimeout(() => {
      els.requestFriendButton.textContent = "Send forespørsel i Meldinger";
    }, 2200);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    els.friendRequestStatus.textContent = "Sjekk at e-postadressen ser riktig ut.";
    els.friendEmailInput.focus();
    return;
  }

  const body = [
    "Hei! Kan du lage en WB Trene-brukerkonto til en kompis?",
    "",
    `Navn: ${name}`,
    `Ønsket brukernavn: ${username}`,
    `E-post til passord: ${email}`,
    "",
    "Kompisen skal ha egen trening, egen logg og egne mål."
  ].join("\n");

  els.friendRequestStatus.textContent = "Åpner Meldinger. Trykk send der for å sende forespørselen.";
  window.location.href = `sms:${FRIEND_REQUEST_PHONE}&body=${encodeURIComponent(body)}`;
}

function handlePhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  compressImage(file, (dataUrl) => {
    state.pendingPhoto = dataUrl;
    saveState();
    renderPhotoCheckin();
  });
}

function handleProgressPhotoChange(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  compressImage(file, (dataUrl) => {
    const nextWorkout = state.history.length + 1;
    const hasAnyPhoto = allProgressPhotos().length > 0;
    const workoutNumber = hasAnyPhoto ? nextWorkout : 0;
    state.photos.push({
      date: isoDate(),
      workoutNumber,
      label: workoutNumber === 0 ? "Startbilde" : `Økt ${workoutNumber}`,
      dataUrl
    });
    saveState();
    renderStats();
    event.target.value = "";
  });
}

function compressImage(file, onDone) {
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
      onDone(canvas.toDataURL("image/jpeg", 0.72));
    });
    image.src = reader.result;
  });
  reader.readAsDataURL(file);
}

els.completeButton.addEventListener("click", completeWorkout);
els.loginForm.addEventListener("submit", handleLogin);
els.logoutButton.addEventListener("click", logout);
els.settingsButton.addEventListener("click", openSettings);
els.settingsForm.addEventListener("submit", (event) => event.preventDefault());
els.closeSettingsButton.addEventListener("click", closeSettings);
els.settingsDialog.addEventListener("close", handleSettingsClosed);
els.settingsDialog.addEventListener("cancel", handleSettingsCancel);
els.exerciseManagerButton.addEventListener("click", showExerciseManager);
els.openExerciseManagerFromSettings.addEventListener("click", showExerciseManager);
els.toggleCapacityButton.addEventListener("click", toggleCapacityFields);
els.nameInput.addEventListener("input", scheduleSettingsAutoSave);
els.exerciseSettingsFields.addEventListener("change", persistSettingsFromInputs);
[
  els.remindersInput,
  els.reminderTimeInput
].forEach((input) => input.addEventListener("change", persistSettingsFromInputs));
els.exportButton.addEventListener("click", exportData);
els.testNtfyButton.addEventListener("click", testNtfy);
els.photoInput.addEventListener("change", handlePhotoChange);
els.progressPhotoInput.addEventListener("change", handleProgressPhotoChange);
els.requestFriendButton.addEventListener("click", requestFriendAccount);
els.helpPopoverClose.addEventListener("click", hideHelp);
els.helpPopover.addEventListener("click", handleHelpOverlayClick);
els.exerciseGuideClose.addEventListener("click", hideExerciseGuide);
els.exerciseGuidePopover.addEventListener("click", handleExerciseGuideOverlayClick);
els.exerciseManagerClose.addEventListener("click", hideExerciseManager);
els.exerciseManagerPopover.addEventListener("click", handleExerciseManagerOverlayClick);
els.exerciseManagerList.addEventListener("click", handleExerciseManagerClick);
els.exerciseManagerList.addEventListener("keydown", handleExerciseManagerKeydown);
els.exerciseManagerList.addEventListener("change", handleExerciseManagerChange);
document.addEventListener("click", handleHelpClick);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideHelp();
    hideExerciseGuide();
    hideExerciseManager();
  }
});

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
