/* =========================================================
   SRM BBA STUDENT PORTAL
   VERSION 2.0
   Main Application Controller
   ========================================================= */


/* =========================================================
   01. CONFIGURATION
   ========================================================= */

const APP_CONFIG = {
  version: "2.0",
  programme: "SRM BBA",
  academicPeriod: "2026–2029",

  officialSRMLogin:
    "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp",

  maxMaterialSize:
    15 * 1024 * 1024,

  totalWeeksPerCourse: 15,

  storageKey:
    "srm_bba_portal_v2",

  loginKey:
    "srm_bba_login_v2",

  sidebarKey:
    "srm_bba_sidebar_v2",

  themeKey:
    "srm_bba_theme_v2",

  sessionKey:
    "srm_bba_session_v2"
};


/* =========================================================
   02. DEMO LOGIN CREDENTIALS
   =========================================================

   IMPORTANT:
   This is a FRONTEND-ONLY demo login.

   GitHub Pages cannot securely hide passwords because
   JavaScript is delivered to the browser.

   For a real production portal, replace this section with
   Firebase Authentication / Supabase / another backend.
   ========================================================= */

const LOGIN_CREDENTIALS = {
  student: {
    username: "js3513",
    password: "Raman@7917",
    name: "S Jayaraman",
    role: "BBA Student"
  },

  admin: {
    username: "Admin",
    password: "Admin@SRM",
    name: "SRM BBA Admin",
    role: "Administrator"
  }
};


/* =========================================================
   03. SUBJECT DATA
   =========================================================

   These are editable portal subject labels.

   Replace these names/codes with the exact official
   semester subject list whenever required.
   ========================================================= */

const SUBJECTS = [
  {
    id: "subject-01",
    code: "BBA-01",
    name: "Principles of Management"
  },
  {
    id: "subject-02",
    code: "BBA-02",
    name: "Business Economics"
  },
  {
    id: "subject-03",
    code: "BBA-03",
    name: "Financial Accounting"
  },
  {
    id: "subject-04",
    code: "BBA-04",
    name: "Professional Communication"
  },
  {
    id: "subject-05",
    code: "BBA-05",
    name: "Marketing Management"
  },
  {
    id: "subject-06",
    code: "BBA-06",
    name: "Production & Operations Management"
  },
  {
    id: "subject-07",
    code: "BBA-07",
    name: "Foundation of AI-ML"
  }
];


/* =========================================================
   04. DEFAULT APPLICATION STATE
   ========================================================= */

function createEmptyProgress() {
  const progress = {};

  SUBJECTS.forEach(subject => {
    progress[subject.id] =
      Array(APP_CONFIG.totalWeeksPerCourse)
        .fill("pending");
  });

  return progress;
}


function createDefaultClasses() {
  const now = new Date();

  const classes = [];

  /*
   * Demo schedule is generated relative to the current date
   * so the countdown does not become permanently expired.
   */

  const schedule = [
    {
      subjectIndex: 0,
      days: 1,
      hour: 18,
      minute: 0
    },
    {
      subjectIndex: 1,
      days: 2,
      hour: 19,
      minute: 0
    },
    {
      subjectIndex: 2,
      days: 3,
      hour: 18,
      minute: 0
    },
    {
      subjectIndex: 3,
      days: 4,
      hour: 18,
      minute: 0
    },
    {
      subjectIndex: 4,
      days: 5,
      hour: 19,
      minute: 0
    },
    {
      subjectIndex: 5,
      days: 6,
      hour: 18,
      minute: 0
    },
    {
      subjectIndex: 6,
      days: 7,
      hour: 19,
      minute: 0
    },
    {
      subjectIndex: 0,
      days: 9,
      hour: 18,
      minute: 0
    },
    {
      subjectIndex: 4,
      days: 11,
      hour: 19,
      minute: 0
    },
    {
      subjectIndex: 6,
      days: 13,
      hour: 18,
      minute: 0
    }
  ];

  schedule.forEach((item, index) => {
    const date = new Date(now);

    date.setDate(
      date.getDate() + item.days
    );

    date.setHours(
      item.hour,
      item.minute,
      0,
      0
    );

    const end = new Date(date);

    end.setMinutes(
      end.getMinutes() + 60
    );

    const subject =
      SUBJECTS[item.subjectIndex];

    classes.push({
      id:
        "class-" +
        Date.now() +
        "-" +
        index,

      subjectId:
        subject.id,

      subjectName:
        subject.name,

      start:
        date.toISOString(),

      end:
        end.toISOString(),

      zoom:
        "https://zoom.us/j/00000000000",

      topic:
        subject.name + " — Live Class",

      status:
        "scheduled"
    });
  });

  return classes;
}


function createDefaultAnnouncements() {
  return [
    {
      id: createId("notice"),
      title: "Welcome to the SRM BBA Portal",
      message:
        "Use this portal to track courses, weekly progress, live classes, study materials and academic tasks.",
      type: "Portal",
      pinned: true,
      createdAt: new Date().toISOString()
    },
    {
      id: createId("notice"),
      title: "Weekly Progress Tracking",
      message:
        "Click a week once to mark it In Process. Double-click the same week to mark it Complete, then press Save.",
      type: "Academic",
      pinned: false,
      createdAt: new Date().toISOString()
    }
  ];
}


function createDefaultState() {
  return {
    progress:
      createEmptyProgress(),

    classes:
      createDefaultClasses(),

    announcements:
      createDefaultAnnouncements(),

    materials:
      [],

    assignments:
      createDefaultAssignments(),

    audit:
      [],

    session: {
      startedAt: null,
      endedAt: null
    },

    adminMinimized:
      false
  };
}


function createDefaultAssignments() {
  return [
    {
      id: "assignment-01",
      title: "Week 1–3 Tasks",
      description: "Assignments, MCQ & ELQ",
      status: "tracked"
    },
    {
      id: "assignment-02",
      title: "Week 4–9 Tasks",
      description: "Weekly academic workflow",
      status: "tracked"
    },
    {
      id: "assignment-03",
      title: "Week 10–15 Tasks",
      description: "Final weekly requirements",
      status: "tracked"
    },
    {
      id: "assignment-04",
      title: "Discussion Activities",
      description: "Course discussion participation",
      status: "tracked"
    },
    {
      id: "assignment-05",
      title: "Learning Assignments",
      description: "Subject learning activities",
      status: "tracked"
    },
    {
      id: "assignment-06",
      title: "LAQ / ELQ",
      description: "Long-answer academic questions",
      status: "tracked"
    },
    {
      id: "assignment-07",
      title: "MCQ Activities",
      description: "Multiple-choice activities",
      status: "tracked"
    },
    {
      id: "assignment-08",
      title: "Revision Work",
      description: "Weekly revision activities",
      status: "tracked"
    },
    {
      id: "assignment-09",
      title: "Study Notes",
      description: "Notebook and study-material preparation",
      status: "tracked"
    },
    {
      id: "assignment-10",
      title: "Course Review",
      description: "Subject review activities",
      status: "tracked"
    },
    {
      id: "assignment-11",
      title: "Academic Preparation",
      description: "Examination preparation",
      status: "tracked"
    },
    {
      id: "assignment-12",
      title: "Final Review",
      description: "Final course checklist",
      status: "tracked"
    }
  ];
}


/* =========================================================
   05. GLOBAL VARIABLES
   ========================================================= */

let state = null;

let currentUser = null;

let countdownInterval = null;

let breakInterval = null;

let materialDatabase = null;

let draftProgress = {};

let currentSection = "dashboard";


/* =========================================================
   06. BASIC HELPERS
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}


function $all(selector) {
  return Array.from(
    document.querySelectorAll(selector)
  );
}


function createId(prefix = "id") {
  if (
    window.crypto &&
    typeof window.crypto.randomUUID === "function"
  ) {
    return prefix + "-" + window.crypto.randomUUID();
  }

  return (
    prefix +
    "-" +
    Date.now() +
    "-" +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
}


function escapeHTML(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function formatBytes(bytes) {
  if (!bytes) {
    return "0 KB";
  }

  const units = [
    "Bytes",
    "KB",
    "MB",
    "GB"
  ];

  const index =
    Math.floor(
      Math.log(bytes) /
      Math.log(1024)
    );

  return (
    Math.round(
      (bytes /
        Math.pow(1024, index)) *
        100
    ) / 100 +
    " " +
    units[index]
  );
}


function formatDate(dateValue) {
  const date =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  );
}


function formatTime(dateValue) {
  const date =
    dateValue instanceof Date
      ? dateValue
      : new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleTimeString(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}


function formatDateTime(dateValue) {
  return (
    formatDate(dateValue) +
    " • " +
    formatTime(dateValue)
  );
}


function getSubject(subjectId) {
  return (
    SUBJECTS.find(
      subject =>
        subject.id === subjectId
    ) || null
  );
}


function getSubjectName(subjectId) {
  const subject =
    getSubject(subjectId);

  return subject
    ? subject.name
    : "Unknown Subject";
}


function saveState() {
  localStorage.setItem(
    APP_CONFIG.storageKey,
    JSON.stringify(state)
  );
}


function loadState() {
  const raw =
    localStorage.getItem(
      APP_CONFIG.storageKey
    );

  if (!raw) {
    state =
      createDefaultState();

    saveState();

    return;
  }

  try {
    const parsed =
      JSON.parse(raw);

    const defaults =
      createDefaultState();

    state = {
      ...defaults,
      ...parsed,

      progress:
        parsed.progress ||
        defaults.progress,

      classes:
        Array.isArray(parsed.classes)
          ? parsed.classes
          : defaults.classes,

      announcements:
        Array.isArray(parsed.announcements)
          ? parsed.announcements
          : defaults.announcements,

      materials:
        Array.isArray(parsed.materials)
          ? parsed.materials
          : [],

      assignments:
        Array.isArray(parsed.assignments)
          ? parsed.assignments
          : defaults.assignments,

      audit:
        Array.isArray(parsed.audit)
          ? parsed.audit
          : []
    };

    SUBJECTS.forEach(subject => {
      if (
        !Array.isArray(
          state.progress[subject.id]
        )
      ) {
        state.progress[subject.id] =
          Array(
            APP_CONFIG.totalWeeksPerCourse
          ).fill("pending");
      }

      while (
        state.progress[subject.id].length <
        APP_CONFIG.totalWeeksPerCourse
      ) {
        state.progress[subject.id]
          .push("pending");
      }

      state.progress[subject.id] =
        state.progress[subject.id].slice(
          0,
          APP_CONFIG.totalWeeksPerCourse
        );
    });

  } catch (error) {
    console.error(
      "State loading error:",
      error
    );

    state =
      createDefaultState();

    saveState();
  }
}


/* =========================================================
   07. AUDIT LOG
   ========================================================= */

function addAudit(action, details = "") {
  if (!state) {
    return;
  }

  state.audit.unshift({
    id: createId("audit"),
    action,
    details,
    user:
      currentUser
        ? currentUser.username
        : "system",
    role:
      currentUser
        ? currentUser.role
        : "system",
    timestamp:
      new Date().toISOString()
  });

  state.audit =
    state.audit.slice(0, 100);

  saveState();
}


/* =========================================================
   08. LOGIN STORAGE
   ========================================================= */

function saveLoginSession(user) {
  localStorage.setItem(
    APP_CONFIG.loginKey,
    JSON.stringify({
      username: user.username,
      name: user.name,
      role: user.role,
      loginAt: new Date().toISOString()
    })
  );
}


function loadLoginSession() {
  const raw =
    localStorage.getItem(
      APP_CONFIG.loginKey
    );

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}


function clearLoginSession() {
  localStorage.removeItem(
    APP_CONFIG.loginKey
  );
}


/* =========================================================
   09. LOGIN UI
   ========================================================= */

function initializeLogin() {

  const loginScreen =
    $("#loginScreen");

  const portalApp =
    $("#portalApp");

  const savedUser =
    loadLoginSession();

  if (savedUser) {

    currentUser =
      savedUser;

    if (loginScreen) {
      loginScreen.hidden = true;
    }

    if (portalApp) {
      portalApp.hidden = false;
    }

    startApplication();
    return;
  }

  if (loginScreen) {
    loginScreen.hidden = false;
  }

  if (portalApp) {
    portalApp.hidden = true;
  }

  bindLoginEvents();
}


function bindLoginEvents() {

  const roleButtons =
    $all("[data-login-role]");

  roleButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const role =
          button.dataset.loginRole;

        roleButtons.forEach(item =>
          item.classList.remove(
            "active"
          )
        );

        button.classList.add(
          "active"
        );

        $all(".login-form")
          .forEach(form =>
            form.classList.remove(
              "active"
            )
          );

        const form =
          document.querySelector(
            `[data-login-form="${role}"]`
          );

        if (form) {
          form.classList.add(
            "active"
          );
        }
      }
    );
  });


  $all(".password-toggle")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const input =
            button.parentElement
              .querySelector("input");

          if (!input) {
            return;
          }

          if (
            input.type === "password"
          ) {

            input.type = "text";

            button.textContent =
              "🙈";

          } else {

            input.type = "password";

            button.textContent =
              "👁";
          }
        }
      );
    });


  const studentForm =
    $("#studentLoginForm");

  if (studentForm) {

    studentForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        handleLogin(
          "student",
          studentForm
        );
      }
    );
  }


  const adminForm =
    $("#adminLoginForm");

  if (adminForm) {

    adminForm.addEventListener(
      "submit",
      event => {

        event.preventDefault();

        handleLogin(
          "admin",
          adminForm
        );
      }
    );
  }


  const officialButtons =
    $all(
      "[data-official-login], #officialLoginButton"
    );

  officialButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        window.open(
          APP_CONFIG.officialSRMLogin,
          "_blank",
          "noopener,noreferrer"
        );
      }
    );
  });
}


function handleLogin(role, form) {

  const usernameInput =
    form.querySelector(
      'input[name="username"]'
    ) ||
    form.querySelector(
      "#studentUsername, #adminUsername"
    );

  const passwordInput =
    form.querySelector(
      'input[name="password"]'
    ) ||
    form.querySelector(
      "#studentPassword, #adminPassword"
    );

  const message =
    form.querySelector(
      ".login-message"
    ) ||
    document.querySelector(
      `[data-login-message="${role}"]`
    );


  const username =
    usernameInput
      ? usernameInput.value.trim()
      : "";

  const password =
    passwordInput
      ? passwordInput.value
      : "";


  const credentials =
    LOGIN_CREDENTIALS[role];


  if (
    username === credentials.username &&
    password === credentials.password
  ) {

    currentUser = {
      username:
        credentials.username,

      name:
        credentials.name,

      role:
        credentials.role,

      loginAt:
        new Date().toISOString()
    };

    saveLoginSession(
      currentUser
    );

    startSession();

    addAudit(
      "Login",
      role +
        " login successful"
    );

    if (message) {
      message.textContent =
        "Login successful.";
      message.classList.add(
        "success"
      );
    }

    const loginScreen =
      $("#loginScreen");

    const portalApp =
      $("#portalApp");

    if (loginScreen) {
      loginScreen.hidden = true;
    }

    if (portalApp) {
      portalApp.hidden = false;
    }

    startApplication();

    showToast(
      "Welcome, " +
        currentUser.name,
      "success"
    );

    return;
  }


  if (message) {
    message.textContent =
      "Incorrect username or password.";
    message.classList.remove(
      "success"
    );
  }

  showToast(
    "Incorrect login details.",
    "error"
  );
}


/* =========================================================
   10. START APPLICATION
   ========================================================= */

function startApplication() {

  loadState();

  if (
    !state.session ||
    !state.session.startedAt
  ) {
    startSession();
  }

  applyTheme();

  applySidebarState();

  initializeIndexedDB();

  initializeNavigation();

  initializeTopbar();

  initializeDashboard();

  initializeCourses();

  initializeLiveClasses();

  initializeMaterials();

  initializeAssignments();

  initializeCalendar();

  initializeAnnouncements();

  initializeAnalytics();

  initializeProfile();

  initializeAdmin();

  initializeModals();

  initializeSearch();

  initializeQuickAccess();

  renderAll();

  startCountdown();

  startBreakTimerLoop();

  updateSessionUI();

  enforceAdminVisibility();

  setInterval(
    updateSessionUI,
    1000
  );
}


/* =========================================================
   11. NAVIGATION
   ========================================================= */

const SECTION_TITLES = {
  dashboard: "Dashboard",
  courses: "My Courses",
  live: "Live Classes",
  materials: "Study Materials",
  assignments: "Assignments",
  calendar: "Calendar",
  exams: "Examinations",
  announcements: "Announcements",
  analytics: "Analytics",
  profile: "Profile",
  admin: "Admin Control Centre"
};


function initializeNavigation() {

  $all(
    "[data-section]"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const section =
          button.dataset.section;

        if (!section) {
          return;
        }

        navigateTo(section);
      }
    );
  });
}


function navigateTo(section) {

  if (
    section === "admin" &&
    currentUser &&
    !isAdmin()
  ) {
    showToast(
      "Admin login is required.",
      "error"
    );

  
