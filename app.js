"use strict";

/*
  ============================================================
  SRM BBA STUDENT PORTAL
  VERSION 4.0
  ============================================================

  Frontend demonstration portal.

  Important:
  Authentication credentials are stored in frontend
  JavaScript for demonstration only.

  This is NOT production-grade authentication.
*/


const CONFIG = {

  version: "4.0",

  storageKey: "srm_bba_portal_v4",

  loginKey: "srm_bba_login_v4",

  themeKey: "srm_bba_theme_v4",

  sidebarKey: "srm_bba_sidebar_v4",

  maxMaterialSize: 15 * 1024 * 1024,

  officialSRM:
    "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp"

};


/* ============================================================
   DEMO LOGIN
   ============================================================ */

const CREDENTIALS = {

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


/* ============================================================
   SUBJECTS
   ============================================================ */

const SUBJECTS = [

  {
    id: "management-science",
    name: "Management Science",
    short: "Management Science"
  },

  {
    id: "production-operations",
    name: "Production & Operations Management",
    short: "Production & Operations"
  },

  {
    id: "marketing-management",
    name: "Marketing Management",
    short: "Marketing Management"
  },

  {
    id: "professional-communication",
    name: "Professional Communication",
    short: "Professional Communication"
  },

  {
    id: "health-wellness",
    name: "Health & Wellness",
    short: "Health & Wellness"
  },

  {
    id: "foundation-ai",
    name: "Foundation of AI-ML",
    short: "Foundation of AI-ML"
  },

  {
    id: "environmental-studies",
    name: "Environmental Studies",
    short: "Environmental Studies"
  }

];


/* ============================================================
   DEFAULT CLASSES
   ============================================================ */

function createDefaultClasses() {

  const now = new Date();

  const tomorrow = new Date(now);

  tomorrow.setDate(tomorrow.getDate() + 1);

  tomorrow.setHours(18, 0, 0, 0);


  const dayAfter = new Date(now);

  dayAfter.setDate(dayAfter.getDate() + 2);

  dayAfter.setHours(20, 0, 0, 0);


  const third = new Date(now);

  third.setDate(third.getDate() + 4);

  third.setHours(19, 0, 0, 0);


  return [

    {
      id: "class-1",
      subject: "Professional Communication",
      start: tomorrow.toISOString(),
      end: new Date(
        tomorrow.getTime() + 60 * 60 * 1000
      ).toISOString(),
      zoom: "https://zoom.us/"
    },

    {
      id: "class-2",
      subject: "Marketing Management",
      start: dayAfter.toISOString(),
      end: new Date(
        dayAfter.getTime() + 60 * 60 * 1000
      ).toISOString(),
      zoom: "https://zoom.us/"
    },

    {
      id: "class-3",
      subject: "Management Science",
      start: third.toISOString(),
      end: new Date(
        third.getTime() + 60 * 60 * 1000
      ).toISOString(),
      zoom: "https://zoom.us/"
    }

  ];

}


/* ============================================================
   DEFAULT ANNOUNCEMENTS
   ============================================================ */

const DEFAULT_ANNOUNCEMENTS = [

  {
    id: "announcement-1",
    title: "Welcome to SRM BBA Portal",
    message:
      "Your Version 4 academic dashboard is ready.",
    priority: "Normal",
    date: new Date().toISOString()
  },

  {
    id: "announcement-2",
    title: "Weekly Progress",
    message:
      "Use Weekly Progress to track Week 1 through Week 15 for every subject.",
    priority: "Important",
    date: new Date().toISOString()
  }

];


/* ============================================================
   DEFAULT ASSIGNMENTS
   ============================================================ */

const DEFAULT_ASSIGNMENTS = [

  {
    subject: "Management Science",
    type: "Assignment",
    title: "Weekly Academic Activity",
    status: "Pending"
  },

  {
    subject: "Marketing Management",
    type: "LAQ",
    title: "Weekly Long Answer",
    status: "Pending"
  },

  {
    subject: "Professional Communication",
    type: "Discussion",
    title: "Discussion Activity",
    status: "Pending"
  },

  {
    subject: "Foundation of AI-ML",
    type: "ELQ",
    title: "Extended Learning Question",
    status: "Pending"
  },

  {
    subject: "Environmental Studies",
    type: "MCQ",
    title: "Weekly MCQ",
    status: "Pending"
  }

];


/* ============================================================
   DEFAULT CALENDAR
   ============================================================ */

const DEFAULT_CALENDAR = [

  {
    date: "Academic",
    title: "Weekly Course Progress",
    description: "Complete weekly learning activities."
  },

  {
    date: "Ongoing",
    title: "Live Classes",
    description: "Check the Live Classes timeline regularly."
  },

  {
    date: "Important",
    title: "Assignments",
    description: "Complete assigned academic activities before their deadlines."
  }

];


/* ============================================================
   STATE
   ============================================================ */

let state = {

  progress: {},

  classes: createDefaultClasses(),

  announcements: DEFAULT_ANNOUNCEMENTS,

  assignments: DEFAULT_ASSIGNMENTS,

  materials: [],

  audit: [],

  sessionStart: null,

  breakStart: null

};


let loginState = null;

let nextClass = null;

let sessionInterval = null;

let countdownInterval = null;

let breakInterval = null;


/* ============================================================
   HELPERS
   ============================================================ */

function $(id) {

  return document.getElementById(id);

}


function all(selector) {

  return Array.from(
    document.querySelectorAll(selector)
  );

}


function safeJSONParse(value, fallback) {

  try {

    return JSON.parse(value);

  } catch {

    return fallback;

  }

}


function saveState() {

  localStorage.setItem(
    CONFIG.storageKey,
    JSON.stringify(state)
  );

}


function loadState() {

  const saved = localStorage.getItem(
    CONFIG.storageKey
  );

  if (!saved) {

    return;

  }

  const parsed = safeJSONParse(
    saved,
    null
  );

  if (!parsed) {

    return;

  }

  state = {

    ...state,

    ...parsed

  };

}


function saveLogin() {

  localStorage.setItem(
    CONFIG.loginKey,
    JSON.stringify(loginState)
  );

}


function loadLogin() {

  const saved = localStorage.getItem(
    CONFIG.loginKey
  );

  if (!saved) {

    return;

  }

  loginState = safeJSONParse(
    saved,
    null
  );

}


function formatDate(date) {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }
  ).format(date);

}


function formatTime(date) {

  return new Intl.DateTimeFormat(
    "en-IN",
    {
      hour: "2-digit",
      minute: "2-digit"
    }
  ).format(date);

}


function formatDateTime(date) {

  return `${formatDate(date)} • ${formatTime(date)}`;

}


function showToast(message) {

  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  setTimeout(() => {

    toast.classList.remove("show");

  }, 2500);

}


function addAudit(message) {

  state.audit.unshift({

    message,

    date: new Date().toISOString()

  });

  state.audit =
    state.audit.slice(0, 30);

  saveState();

  renderAudit();

}

function escapeHTML(str) {
  
  if (!str) return "";
  
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

/* ============================================================
   NAVIGATION
   ============================================================ */

function navigate(sectionId) {

  const pages = all(".page");

  pages.forEach(page => {

    page.classList.remove("active");

  });


  const target = $(sectionId);

  if (!target) {

    return;

  }

  target.classList.add("active");


  all(".nav-item[data-section]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.section === sectionId
      );

    });


  if (window.innerWidth <= 800) {

    document.body.classList.remove(
      "mobile-sidebar-open"
    );

    const backdrop = $("sidebarBackdrop");
    if(backdrop) backdrop.classList.add("hidden");

  }


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


/* ============================================================
   LOGIN MODAL
   ============================================================ */

function openLogin() {
  
  const modal = $("loginModal");
  if (!modal) return;

  modal.classList.remove("hidden");

  clearLoginMessages();

  setLoginRole("student");

  setTimeout(() => {

    const userInp = $("studentUsername");
    if(userInp) userInp.focus();

  }, 50);

}


function closeLogin() {

  const modal = $("loginModal");
  if (!modal) return;

  modal.classList.add("hidden");

}


function clearLoginMessages() {
  
  const sMsg = $("studentLoginMessage");
  const aMsg = $("adminLoginMessage");

  if (sMsg) {
    sMsg.textContent = "";
    sMsg.className = "login-message";
  }

  if (aMsg) {
    aMsg.textContent = "";
    aMsg.className = "login-message";
  }
}


function setLoginRole(role) {

  all(".login-tab")
    .forEach(tab => {

      const active =
        tab.dataset.role === role;

      tab.classList.toggle(
        "active",
        active
      );

    });


  all(".login-form")
    .forEach(form => {

      const active =
        form.dataset.formRole === role;

      form.classList.toggle(
        "active",
        active
      );

      form.hidden = !active;

    });


  clearLoginMessages();

}


function showLoginMessage(
  role,
  message,
  type
) {

  const element =
    role === "student"
      ? $("studentLoginMessage")
      : $("adminLoginMessage");
      
  if (!element) return;


  element.textContent = message;

  element.className =
    `login-message ${type}`;

}


function handleLogin(role, form) {

  const username =
    form.elements.username.value.trim();

  const password =
    form.elements.password.value;


  const account =
    CREDENTIALS[role];


  if (
    username !== account.username ||
    password !== account.password
  ) {

    showLoginMessage(
      role,
      "Incorrect username or password.",
      "error"
    );

    return;

  }


  loginState = {

    role,

    username,

    name: account.name,

    roleName: account.role,

    loggedInAt: new Date().toISOString()

  };


  saveLogin();


  state.sessionStart =
    new Date().toISOString();

  saveState();


  addAudit(
    `${account.role} logged in`
  );


  closeLogin();

  updateUserInterface();

  startSessionTimer();

  navigate("dashboard");

  showToast(
    `Welcome, ${account.name}`
  );

}


/* ============================================================
   USER UI
   ============================================================ */

function updateUserInterface() {

  const loggedIn =
    Boolean(loginState);


  const gStatus = $("guestStatus");
  if(gStatus) gStatus.classList.toggle("hidden", loggedIn);


  const sStatus = $("studentStatus");
  if(sStatus) sStatus.classList.toggle(
      "hidden",
      !loggedIn ||
      loginState.role !== "student"
    );


  const aStatus = $("adminStatus");
  if(aStatus) aStatus.classList.toggle(
      "hidden",
      !loggedIn ||
      loginState.role !== "admin"
    );


  const lBtn = $("loginButton");
  if(lBtn) lBtn.classList.toggle("hidden", loggedIn);


  const oBtn = $("logoutButton");
  if (oBtn) oBtn.classList.toggle("hidden", !loggedIn);


  const admin =
    loggedIn &&
    loginState.role === "admin";


  all(".admin-only")
    .forEach(element => {

      element.classList.toggle(
        "hidden",
        !admin
      );

    });

  const adminSec = $("admin");
  if (
    !admin &&
    adminSec && adminSec.classList.contains("active")
  ) {

    navigate("dashboard");

  }


  if (loggedIn) {

    if($("welcomeTitle")) $("welcomeTitle").textContent =
      `Welcome back, ${loginState.name}`;

    if($("welcomeText")) $("welcomeText").textContent =
      loginState.role === "admin"
        ? "Administrator control and academic management dashboard."
        : "Your academic home dashboard.";

    if($("profileName")) $("profileName").textContent =
      loginState.name;

    if($("profileStatus")) $("profileStatus").textContent =
      loginState.roleName;

  } else {

    if($("welcomeTitle")) $("welcomeTitle").textContent =
      "Welcome to your dashboard";

    if($("welcomeText")) $("welcomeText").textContent =
      "Your academic home dashboard.";

    if($("profileStatus")) $("profileStatus").textContent =
      "Guest";

  }


  updateActivityStatus();

}


function logout() {

  if (!loginState) {

    return;

  }


  addAudit(
    `${loginState.roleName} logged out`
  );


  loginState = null;

  localStorage.removeItem(
    CONFIG.loginKey
  );


  state.sessionStart = null;

  saveState();


  stopSessionTimer();

  updateUserInterface();

  navigate("dashboard");

  showToast("Logged out successfully.");

}


/* ============================================================
   SESSION
   ============================================================ */

function startSessionTimer() {

  stopSessionTimer();


  if (!state.sessionStart) {

    return;

  }


  sessionInterval =
    setInterval(
      updateSessionTimer,
      1000
    );


  updateSessionTimer();

}


function stopSessionTimer() {

  if (sessionInterval) {

    clearInterval(sessionInterval);

    sessionInterval = null;

  }

}


function updateSessionTimer() {

  if (!state.sessionStart) {

    if($("sessionTimer")) $("sessionTimer").textContent =
      "00:00:00";

    return;

  }


  const elapsed =
    Math.max(
      0,
      Date.now() -
      new Date(state.sessionStart).getTime()
    );

  if($("sessionTimer")) $("sessionTimer").textContent =
    durationClock(elapsed);

}


function durationClock(milliseconds) {

  const total =
    Math.floor(milliseconds / 1000);

  const hours =
    Math.floor(total / 3600);

  const minutes =
    Math.floor(
      (total % 3600) / 60
    );

  const seconds =
    total % 60;


  return [
    hours,
    minutes,
    seconds
  ]
    .map(number =>
      String(number).padStart(2, "0")
    )
    .join(":");

}


function updateActivityStatus() {

  const online =
    Boolean(loginState);

  const aBadge = $("activityBadge");
  if (!aBadge) return;


  aBadge.textContent =
    online
      ? "ONLINE"
      : "OFFLINE";


  aBadge.className =
      `badge ${online ? "green" : "red"}`;

}


/* ============================================================
   BREAK TIMER
   ============================================================ */

function startBreak() {

  if (state.breakStart) {

    return;

  }


  state.breakStart =
    new Date().toISOString();

  saveState();


  breakInterval =
    setInterval(
      updateBreakTimer,
      1000
    );


  updateBreakTimer();

  if($("breakButton")) $("breakButton").textContent =
    "End Break";


  showToast(
    "15-minute break started."
  );

}


function endBreak() {

  state.breakStart = null;

  saveState();


  if (breakInterval) {

    clearInterval(breakInterval);

    breakInterval = null;

  }

  if($("breakTimer")) $("breakTimer").textContent =
    "15:00";

  if($("breakButton")) $("breakButton").textContent =
    "Start Break";

  showToast(
    "Break ended."
  );

}


function updateBreakTimer() {

  if (!state.breakStart) {

    return;

  }


  const elapsed =
    Math.floor(
      (
        Date.now() -
        new Date(state.breakStart).getTime()
      ) / 1000
    );


  const remaining =
    Math.max(
      0,
      900 - elapsed
    );


  const minutes =
    Math.floor(
      remaining / 60
    );

  const seconds =
    remaining % 60;

  if($("breakTimer")) $("breakTimer").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


  if (remaining <= 0) {

    endBreak();

    showToast(
      "Your 15-minute break has ended."
    );

  }

}


/* ============================================================
   PROGRESS
   ============================================================ */

function ensureProgress() {

  SUBJECTS.forEach(subject => {

    if (!state.progress[subject.id]) {

      state.progress[subject.id] =
        Array(15).fill("not-started");

    }

  });

  saveState();

}


function progressCounts(subjectId) {

  const weeks =
    state.progress[subjectId] ||
    Array(15).fill("not-started");


  return {

    complete:
      weeks.filter(
        value => value === "complete"
      ).length,

    process:
      weeks.filter(
        value => value === "process"
      ).length,

    total: 15

  };

}


function subjectPercent(subjectId) {

  const counts =
    progressCounts(subjectId);


  return Math.round(
    (counts.complete / 15) * 100
  );

}


function overallStats() {

  let complete = 0;

  let process = 0;


  SUBJECTS.forEach(subject => {

    const counts =
      progressCounts(subject.id);

    complete += counts.complete;

    process += counts.process;

  });


  const total =
    SUBJECTS.length * 15;


  return {

    complete,

    process,

    total,

    percent:
      Math.round(
        (complete / total) * 100
      )

  };

}


/* ============================================================
   RENDER COURSES
   ============================================================ */

function renderCourses() {

  const grid =
    $("coursesGrid");

  if (!grid) return;


  grid.innerHTML =
    SUBJECTS.map(subject => {

      const percent =
        subjectPercent(subject.id);


      return `
        <article class="course-card">

          <div class="stat-icon">
            📚
          </div>

          <h2>
            ${escapeHTML(subject.name)}
          </h2>

          <p>
            15-week academic progress tracker.
          </p>

          <div class="progress-track">
            <div
              class="progress-fill"
              style="width:${percent}%"
            ></div>
          </div>

          <div class="course-card-footer">
            <span>Progress</span>
            <strong>${percent}%</strong>
          </div>

        </article>
      `;

    }).join("");


  renderDashboardCourses();

}


/* ============================================================
   DASHBOARD COURSES
   ============================================================ */

function renderDashboardCourses() {

  const dc = $("dashboardCourses");
  if (!dc) return;

  dc.innerHTML =
    SUBJECTS.map(subject => {

      const percent =
        subjectPercent(subject.id);


      return `
        <div class="course-row">

          <div class="course-row-top">

            <span class="course-row-name">
              ${escapeHTML(subject.short)}
            </span>

            <span class="course-percent">
              ${percent}%
            </span>

          </div>

          <div class="progress-track">

            <div
              class="progress-fill"
              style="width:${percent}%"
            ></div>

          </div>

        </div>
      `;

    }).join("");

}


/* ============================================================
   WEEKLY PROGRESS (COMPLETED)
   ============================================================ */

/**
 * Renders the interactive weekly progress trackers.
 * This is where your code previously cut off.
 */
function renderProgress() {

  const con
