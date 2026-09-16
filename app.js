/* =========================================================
   SRM BBA STUDENT PORTAL
   Version 1
   File: app.js

   Frontend-only GitHub Pages version.
   - Progress is saved in localStorage.
   - Uploaded files are stored in IndexedDB on this browser.
   - No real authentication is implemented in V1.
   - Replace demo subjects/classes with official SRM data.
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURATION
   ========================================================= */

const CONFIG = {
  storageKey: "srm_bba_portal_v1",
  maxFileSize: 15 * 1024 * 1024,
  breakMinutes: 15,
  officialSrmLogin:
    "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp",
  databaseName: "SRM_BBA_PORTAL_V1_FILES",
  databaseVersion: 1,
  objectStoreName: "materials"
};

/*
 * Demo subject list.
 * Replace these names with the official SRM BBA subject names
 * when the final syllabus/course list is entered.
 */
const SUBJECTS = [
  {
    id: "subject-1",
    code: "BBA-01",
    name: "Principles of Management"
  },
  {
    id: "subject-2",
    code: "BBA-02",
    name: "Business Economics"
  },
  {
    id: "subject-3",
    code: "BBA-03",
    name: "Financial Accounting"
  },
  {
    id: "subject-4",
    code: "BBA-04",
    name: "Professional Communication"
  },
  {
    id: "subject-5",
    code: "BBA-05",
    name: "Marketing Management"
  },
  {
    id: "subject-6",
    code: "BBA-06",
    name: "Human Resource Management"
  },
  {
    id: "subject-7",
    code: "BBA-07",
    name: "Business Statistics"
  }
];

const TOTAL_WEEKS = 15;

/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  Array.from(parent.querySelectorAll(selector));

function byId(id) {
  return document.getElementById(id);
}

/* =========================================================
   GENERAL HELPERS
   ========================================================= */

function uid(prefix = "id") {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(value, options = {}) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...options
  }).format(date);
}

function formatDateTime(value) {
  return formatDate(value, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 KB";
  }

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );

  return `${(bytes / Math.pow(1024, index)).toFixed(
    index === 0 ? 0 : 2
  )} ${units[index]}`;
}

function extensionOf(filename) {
  const name = String(filename || "");
  const parts = name.split(".");

  if (parts.length < 2) {
    return "";
  }

  return parts.pop().toLowerCase();
}

function materialType(filename) {
  const extension = extensionOf(filename);

  const types = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    ppt: "PowerPoint",
    pptx: "PowerPoint",
    xls: "Excel",
    xlsx: "Excel",
    txt: "Text",
    csv: "CSV",
    jpg: "Image",
    jpeg: "Image",
    png: "Image",
    webp: "Image"
  };

  return types[extension] || extension.toUpperCase() || "Document";
}

function getSubject(subjectId) {
  return SUBJECTS.find((subject) => subject.id === subjectId);
}

function subjectName(subjectId) {
  return getSubject(subjectId)?.name || "General";
}

function normalizeDateInput(date, time) {
  if (!date || !time) {
    return null;
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  const localDate = new Date(
    year,
    month - 1,
    day,
    hour,
    minute,
    0,
    0
  );

  if (Number.isNaN(localDate.getTime())) {
    return null;
  }

  return localDate.toISOString();
}

function futureDate(daysFromNow, hour, minute) {
  const date = new Date();

  date.setDate(date.getDate() + daysFromNow);
  date.setHours(hour, minute, 0, 0);

  return date.toISOString();
}

/* =========================================================
   DEFAULT DATA
   ========================================================= */

function createEmptyProgress() {
  const progress = {};

  SUBJECTS.forEach((subject) => {
    progress[subject.id] = Array.from(
      { length: TOTAL_WEEKS },
      () => "pending"
    );
  });

  return progress;
}

function createDefaultClasses() {
  const schedule = [
    [1, 18, 0, 60, 0],
    [2, 19, 0, 60, 0],
    [3, 18, 0, 60, 0],
    [4, 20, 0, 60, 0],
    [6, 18, 0, 60, 0],
    [7, 19, 0, 60, 0],
    [9, 18, 0, 60, 0]
  ];

  return schedule.map((item, index) => {
    const [days, hour, minute, duration, subjectIndex] = item;
    const subject =
      SUBJECTS[subjectIndex % SUBJECTS.length];

    return {
      id: `default-class-${index + 1}`,
      subjectId: subject.id,
      title: `${subject.name} — Live Class`,
      start: futureDate(days, hour, minute),
      durationMinutes: duration,
      zoomLink: "https://zoom.us/j/00000000000",
      meetingId: "000 0000 0000",
      host: "BBA Faculty",
      isDemo: true,
      createdAt: new Date().toISOString()
    };
  });
}

function createDefaultAnnouncements() {
  return [
    {
      id: "notice-1",
      title: "Welcome to SRM BBA Student Portal",
      message:
        "Use this portal to track weekly progress, live classes, assignments, study materials and academic activities.",
      type: "General",
      createdAt: new Date().toISOString(),
      pinned: true
    },
    {
      id: "notice-2",
      title: "Study Progress",
      message:
        "Complete each weekly activity and use the Save button in every subject to retain your progress.",
      type: "Academic",
      createdAt: new Date().toISOString(),
      pinned: false
    }
  ];
}

function createDefaultState() {
  return {
    version: 1,

    progress: createEmptyProgress(),

    classes: createDefaultClasses(),

    announcements: createDefaultAnnouncements(),

    materials: [],

    assignments: [
      {
        id: "assignment-1",
        title: "Weekly Assignment",
        subjectId: SUBJECTS[0].id,
        type: "Assignment",
        dueDate: futureDate(3, 23, 59),
        status: "Pending"
      },
      {
        id: "assignment-2",
        title: "MCQ Assessment",
        subjectId: SUBJECTS[1].id,
        type: "MCQ",
        dueDate: futureDate(5, 23, 59),
        status: "Pending"
      },
      {
        id: "assignment-3",
        title: "LAQ / ELQ Practice",
        subjectId: SUBJECTS[4].id,
        type: "LAQ / ELQ",
        dueDate: futureDate(7, 23, 59),
        status: "Pending"
      },
      {
        id: "assignment-4",
        title: "Discussion Activity",
        subjectId: SUBJECTS[3].id,
        type: "Discussion",
        dueDate: futureDate(9, 23, 59),
        status: "Pending"
      }
    ],

    session: {
      startedAt: null,
      endedAt: null,
      breakUntil: null
    },

    audit: [],

    preferences: {
      theme: "light",
      sidebarCollapsed: false,
      adminMinimized: false
    }
  };
}

/* =========================================================
   STATE MANAGEMENT
   ========================================================= */

let state = createDefaultState();
let draftProgress = {};
let breakInterval = null;
let countdownInterval = null;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const raw = localStorage.getItem(CONFIG.storageKey);

  if (!raw) {
    state = createDefaultState();
    saveState();
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    const defaults = createDefaultState();

    state = {
      ...defaults,
      ...parsed,

      preferences: {
        ...defaults.preferences,
        ...(parsed.preferences || {})
      },

      session: {
        ...defaults.session,
        ...(parsed.session || {})
      },

      progress: {
        ...defaults.progress,
        ...(parsed.progress || {})
      },

      classes: Array.isArray(parsed.classes)
        ? parsed.classes
        : defaults.classes,

      announcements: Array.isArray(parsed.announcements)
        ? parsed.announcements
        : defaults.announcements,

      materials: Array.isArray(parsed.materials)
        ? parsed.materials
        : [],

      assignments: Array.isArray(parsed.assignments)
        ? parsed.assignments
        : defaults.assignments,

      audit: Array.isArray(parsed.audit)
        ? parsed.audit
        : []
    };

    SUBJECTS.forEach((subject) => {
      if (
        !Array.isArray(state.progress[subject.id]) ||
        state.progress[subject.id].length !== TOTAL_WEEKS
      ) {
        state.progress[subject.id] = Array.from(
          { length: TOTAL_WEEKS },
          () => "pending"
        );
      }
    });
  } catch (error) {
    console.error("Unable to load saved portal data:", error);
    state = createDefaultState();
    saveState();
  }
}

function saveState() {
  localStorage.setItem(
    CONFIG.storageKey,
    JSON.stringify(state)
  );
}

function addAudit(action, details = "") {
  state.audit.unshift({
    id: uid("audit"),
    action,
    details,
    timestamp: new Date().toISOString()
  });

  state.audit = state.audit.slice(0, 100);
  saveState();
}

/* =========================================================
   TOAST
   ========================================================= */

function showToast(message, type = "success") {
  let container = byId("toastContainer");

  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-hide");

    setTimeout(() => {
      toast.remove();
    }, 250);
  }, 3000);
}

/* =========================================================
   NAVIGATION
   ========================================================= */

const sectionTitles = {
  dashboard: "Dashboard",
  courses: "Courses & Weekly Progress",
  live: "Live Classes",
  materials: "Study Materials",
  assignments: "Assignments & Assessments",
  calendar: "Academic Calendar",
  exams: "Examination Overview",
  announcements: "Announcements",
  analytics: "Analytics",
  profile: "Profile & Session",
  admin: "Admin Control Centre"
};

function showSection(sectionName) {
  const sections = $$(".page-section");

  sections.forEach((section) => {
    section.classList.toggle(
      "active",
      section.id === sectionName
    );
  });

  $$(".nav-item").forEach((item) => {
    item.classList.toggle(
      "active",
      item.dataset.section === sectionName
    );
  });

  const title = byId("pageTitle");

  if (title) {
    title.textContent =
      sectionTitles[sectionName] || "Student Portal";
  }

  const sidebar = byId("sidebar");

  if (
    window.innerWidth <= 900 &&
    sidebar &&
    !sidebar.classList.contains("collapsed")
  ) {
    sidebar.classList.remove("mobile-open");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function setupNavigation() {
  $$(".nav-item[data-section]").forEach((item) => {
    item.addEventListener("click", () => {
      showSection(item.dataset.section);
    });
  });

  $$("[data-section]").forEach((element) => {
    if (
      element.classList.contains("nav-item") ||
      element.dataset.section === undefined
    ) {
      return;
    }

    element.addEventListener("click", () => {
      showSection(element.dataset.section);
    });
  });
}

/* =========================================================
   SIDEBAR
   ========================================================= */

function applySidebarPreference() {
  const sidebar = byId("sidebar");

  if (!sidebar) {
    return;
  }

  sidebar.classList.toggle(
    "collapsed",
    Boolean(state.preferences.sidebarCollapsed)
  );
}

function setupSidebar() {
  const collapseButton = byId("sidebarCollapse");
  const sidebar = byId("sidebar");
  const mobileButton = $(".mobile-menu");

  collapseButton?.addEventListener("click", () => {
    state.preferences.sidebarCollapsed =
      !state.preferences.sidebarCollapsed;

    saveState();
    applySidebarPreference();
  });

  mobileButton?.addEventListener("click", () => {
    sidebar?.classList.toggle("mobile-open");
  });

  applySidebarPreference();
}

/* =========================================================
   THEME
   ========================================================= */

function applyTheme() {
  document.documentElement.dataset.theme =
    state.preferences.theme;

  document.body.classList.toggle(
    "dark-mode",
    state.preferences.theme === "dark"
  );
}

function setupTheme() {
  const button = byId("themeToggle");

  button?.addEventListener("click", () => {
    state.preferences.theme =
      state.preferences.theme === "dark"
        ? "light"
        : "dark";

    saveState();
    applyTheme();

    showToast(
      state.preferences.theme === "dark"
        ? "Dark mode enabled."
        : "Light mode enabled."
    );
  });

  applyTheme();
}

/* =========================================================
   SESSION
   ========================================================= */

function ensureSessionStarted() {
  if (!state.session.startedAt) {
    state.session.startedAt = new Date().toISOString();
    state.session.endedAt = null;

    addAudit("Session started", "Student portal session opened.");
  }
}

function endSession() {
  state.session.endedAt = new Date().toISOString();
  state.session.breakUntil = null;

  addAudit("Session ended", "Student portal session ended.");

  saveState();

  updateSessionUI();

  showToast("Session ended.", "info");
}

function sessionIsActive() {
  if (!state.session.startedAt) {
    return false;
  }

  if (!state.session.endedAt) {
    return true;
  }

  return (
    new Date(state.session.startedAt).getTime() >
    new Date(state.session.endedAt).getTime()
  );
}

function updateSessionUI() {
  const active = sessionIsActive();

  const statusElements = [
    byId("studentStatus"),
    byId("sessionStatus")
  ];

  statusElements.forEach((element) => {
    if (!element) {
      return;
    }

    element.classList.toggle("active", active);

    const label = element.querySelector(".status-text");

    if (label) {
      label.textContent = active
        ? "Active"
        : "Offline";
    } else if (
      element.classList.contains("status-pill")
    ) {
      element.textContent = active
        ? "● Active"
        : "● Offline";
    }
  });

  const meta = byId("sessionMeta");

  if (meta) {
    if (!state.session.startedAt) {
      meta.textContent = "No active session";
    } else {
      meta.textContent = active
        ? `Started ${formatDateTime(
            state.session.startedAt
          )}`
        : `Ended ${formatDateTime(
            state.session.endedAt
          )}`;
    }
  }

  const profileSession = byId("profileSession");

  if (profileSession) {
    profileSession.innerHTML = `
      <strong>${active ? "Active" : "Offline"}</strong>
      <span>
        ${
          state.session.startedAt
            ? `Started: ${escapeHTML(
                formatDateTime(state.session.startedAt)
              )}`
            : "No session recorded"
        }
      </span>
      ${
        state.session.endedAt
          ? `<span>Ended: ${escapeHTML(
              formatDateTime(state.session.endedAt)
            )}</span>`
          : ""
      }
    `;
  }
}

/* =========================================================
   BREAK TIMER
   ========================================================= */

function openBreakModal() {
  const modal = byId("breakModal");

  if (modal) {
    modal.classList.add("open");
  }
}

function closeBreakModal() {
  const modal = byId("breakModal");

  if (modal) {
    modal.classList.remove("open");
  }
}

function startBreak() {
  if (!sessionIsActive()) {
    showToast(
      "Start an active session before taking a break.",
      "warning"
    );
    return;
  }

  state.session.breakUntil =
    Date.now() + CONFIG.breakMinutes * 60 * 1000;

  saveState();

  openBreakModal();
  updateBreakTimer();

  if (breakInterval) {
    clearInterval(breakInterval);
  }

  breakInterval = setInterval(
    updateBreakTimer,
    1000
  );

  addAudit(
    "Break started",
    `${CONFIG.breakMinutes}-minute break started.`
  );
}

function updateBreakTimer() {
  const timer = byId("breakTimer");

  if (!state.session.breakUntil) {
    if (breakInterval) {
      clearInterval(breakInterval);
      breakInterval = null;
    }

    return;
  }

  const remaining = Math.max(
    0,
    state.session.breakUntil - Date.now()
  );

  const totalSeconds = Math.ceil(
    remaining / 1000
  );

  const minutes = Math.floor(
    totalSeconds / 60
  );

  const seconds = totalSeconds % 60;

  if (timer) {
    timer.textContent =
      `${String(minutes).padStart(2, "0")}:` +
      `${String(seconds).padStart(2, "0")}`;
  }

  if (remaining <= 0) {
    state.session.breakUntil = null;
    saveState();

    if (breakInterval) {
      clearInterval(breakInterval);
      breakInterval = null;
    }

    closeBreakModal();

    showToast("Your 15-minute break has ended.", "info");
    addAudit("Break ended", "Break timer completed.");
  }
}

function stopBreak() {
  state.session.breakUntil = null;
  saveState();

  if (breakInterval) {
    clearInterval(breakInterval);
    breakInterval = null;
  }

  closeBreakModal();

  showToast("Break stopped.", "info");
}

/* =========================================================
   SUBJECT OPTIONS
   ========================================================= */

function populateSubjectSelects() {
  const selects = $$(
    "#classSubject, #materialSubject, #materialSubjectFilter"
  );

  selects.forEach((select) => {
    const currentValue = select.value;

    const isFilter =
      select.id === "materialSubjectFilter";

    select.innerHTML =
      isFilter
        ? `<option value="">All Subjects</option>`
        : `<option value="">Select subject</option>`;

    SUBJECTS.forEach((subject) => {
      const option = document.createElement("option");

      option.value = subject.id;
      option.textContent =
        `${subject.code} — ${subject.name}`;

      select.appendChild(option);
    });

    if (currentValue) {
      select.value = currentValue;
    }
  });

  const weekSelect = byId("materialWeek");

  if (weekSelect) {
    weekSelect.innerHTML =
      `<option value="">All / General</option>`;

    for (let week = 1; week <= TOTAL_WEEKS; week++) {
      const option =
        document.createElement("option");

      option.value = String(week);
      option.textContent = `Week 
