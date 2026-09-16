/* =========================================================
   SRM BBA STUDENT PORTAL
   VERSION 3
   Main Application JavaScript
========================================================= */

"use strict";

/* =========================================================
   APPLICATION CONFIGURATION
========================================================= */

const APP_CONFIG = {
    version: "3.0",

    programme: "SRM BBA",

    academicPeriod: "2026–2029",

    officialSRMLogin:
        "https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp",

    totalWeeksPerCourse: 15,

    maxMaterialSize: 15 * 1024 * 1024,

    storageKey: "srm_bba_portal_v3",

    loginKey: "srm_bba_login_v3",

    themeKey: "srm_bba_theme_v3",

    sidebarKey: "srm_bba_sidebar_v3",

    sessionKey: "srm_bba_session_v3"
};


/* =========================================================
   DEMO LOGIN CONFIGURATION
   ---------------------------------------------------------
   Frontend demo credentials are not secure authentication.
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
   SUBJECTS
========================================================= */

const SUBJECTS = [
    {
        id: "management-science",
        name: "Management Science",
        code: "V26UBA101",
        icon: "📊"
    },

    {
        id: "production-operations",
        name: "Production & Operations Management",
        code: "V26UBA102",
        icon: "⚙️"
    },

    {
        id: "marketing-management",
        name: "Marketing Management",
        code: "V26UBA103",
        icon: "📣"
    },

    {
        id: "professional-communication",
        name: "Professional Communication",
        code: "V26UBA104",
        icon: "💬"
    },

    {
        id: "health-wellness",
        name: "Health & Wellness",
        code: "V26UBA105",
        icon: "❤️"
    },

    {
        id: "foundation-ai-ml",
        name: "Foundation of AI-ML",
        code: "V26UBA106",
        icon: "🤖"
    },

    {
        id: "environmental-studies",
        name: "Environmental Studies",
        code: "V26UBA107",
        icon: "🌱"
    }
];


/* =========================================================
   DEMO LIVE CLASSES
========================================================= */

const DEFAULT_CLASSES = [
    {
        id: "class-1",
        subject: "Professional Communication",
        dateTime: "2026-09-17T18:00",
        zoomLink: "https://zoom.us/",
        createdAt: Date.now()
    },

    {
        id: "class-2",
        subject: "Marketing Management",
        dateTime: "2026-09-18T18:00",
        zoomLink: "https://zoom.us/",
        createdAt: Date.now()
    },

    {
        id: "class-3",
        subject: "Management Science",
        dateTime: "2026-09-19T18:00",
        zoomLink: "https://zoom.us/",
        createdAt: Date.now()
    }
];


/* =========================================================
   DEFAULT ANNOUNCEMENTS
========================================================= */

const DEFAULT_ANNOUNCEMENTS = [
    {
        id: "announcement-1",

        title: "Welcome to SRM BBA Portal",

        message:
            "Use this dashboard to manage courses, weekly progress, classes and study materials.",

        createdAt: Date.now()
    },

    {
        id: "announcement-2",

        title: "Weekly Progress",

        message:
            "Click a week once to mark it In Process and double-click the same week to mark it Complete.",

        createdAt: Date.now()
    }
];


/* =========================================================
   DEFAULT ASSIGNMENTS
========================================================= */

const DEFAULT_ASSIGNMENTS = [
    {
        id: "assignment-1",
        subject: "Environmental Studies",
        title: "Weekly Assignment",
        type: "Assignment",
        status: "Pending"
    },

    {
        id: "assignment-2",
        subject: "Marketing Management",
        title: "Learning Activity Question",
        type: "LAQ",
        status: "Pending"
    },

    {
        id: "assignment-3",
        subject: "Production & Operations Management",
        title: "Discussion Activity",
        type: "Discussion",
        status: "Pending"
    },

    {
        id: "assignment-4",
        subject: "Foundation of AI-ML",
        title: "Extended Learning Question",
        type: "ELQ",
        status: "Pending"
    }
];


/* =========================================================
   DEFAULT CALENDAR
========================================================= */

const DEFAULT_CALENDAR = [
    {
        date: "2026-09-19",
        title: "Academic Task Deadline",
        description:
            "Complete available assignments and academic activities."
    },

    {
        date: "2026-09-24",
        title: "Revision Planning",
        description:
            "Revision schedule can be followed after travel period."
    },

    {
        date: "2026-10-01",
        title: "Monthly Academic Review",
        description:
            "Review weekly course progress and pending activities."
    }
];


/* =========================================================
   STATE
========================================================= */

let portalState = createDefaultState();

let currentUser = null;

let countdownInterval = null;

let sessionInterval = null;

let breakInterval = null;

let toastTimeout = null;


/* =========================================================
   DEFAULT STATE
========================================================= */

function createDefaultState() {

    const progress = {};

    SUBJECTS.forEach(subject => {

        progress[subject.id] =
            Array(APP_CONFIG.totalWeeksPerCourse).fill("not-started");

    });


    return {

        progress,

        classes: DEFAULT_CLASSES.map(item => ({
            ...item
        })),

        announcements: DEFAULT_ANNOUNCEMENTS.map(item => ({
            ...item
        })),

        assignments: DEFAULT_ASSIGNMENTS.map(item => ({
            ...item
        })),

        calendar: DEFAULT_CALENDAR.map(item => ({
            ...item
        })),

        materials: [],

        audit: [],

        adminMinimized: false
    };
}


/* =========================================================
   DOM HELPERS
========================================================= */

function $(selector) {
    return document.querySelector(selector);
}


function $all(selector) {
    return Array.from(document.querySelectorAll(selector));
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeApplication();

});


function initializeApplication() {

    loadPortalState();

    loadTheme();

    loadSidebarState();

    bindGlobalEvents();

    renderDashboard();

    renderCourses();

    renderProgress();

    renderLiveClasses();

    renderAssignments();

    renderMaterials();

    renderCalendar();

    renderAnnouncements();

    renderAnalytics();

    renderProfile();

    renderAdmin();

    updateCurrentDate();

    updateHeaderUser();

    updateStudentStatus();

    startCountdown();

    startSessionClock();

    startBreakClock();

}


/* =========================================================
   GLOBAL EVENT BINDINGS
========================================================= */

function bindGlobalEvents() {

    /* -----------------------------------------
       LOGIN OPEN
    ----------------------------------------- */

    const openLoginButton = $("#openLoginButton");

    if (openLoginButton) {

        openLoginButton.addEventListener(
            "click",
            openLoginModal
        );

    }


    /* -----------------------------------------
       LOGIN CLOSE
    ----------------------------------------- */

    const closeLoginButton = $("#closeLoginButton");

    if (closeLoginButton) {

        closeLoginButton.addEventListener(
            "click",
            closeLoginModal
        );

    }


    const loginOverlay = $("#loginOverlay");

    if (loginOverlay) {

        loginOverlay.addEventListener(
            "click",
            closeLoginModal
        );

    }


    /* -----------------------------------------
       ESCAPE CLOSES LOGIN
    ----------------------------------------- */

    document.addEventListener("keydown", event => {

        if (
            event.key === "Escape" &&
            isLoginModalOpen()
        ) {

            closeLoginModal();

        }

    });


    /* -----------------------------------------
       LOGIN ROLE BUTTONS
    ----------------------------------------- */

    $all("[data-login-role]").forEach(button => {

        button.addEventListener(
            "click",
            () => {

                switchLoginRole(
                    button.dataset.loginRole
                );

            }
        );

    });


    /* -----------------------------------------
       STUDENT LOGIN
    ----------------------------------------- */

    const studentLoginForm =
        $("#studentLoginForm");

    if (studentLoginForm) {

        studentLoginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                handleLogin(
                    "student",
                    studentLoginForm
                );

            }
        );

    }


    /* -----------------------------------------
       ADMIN LOGIN
    ----------------------------------------- */

    const adminLoginForm =
        $("#adminLoginForm");

    if (adminLoginForm) {

        adminLoginForm.addEventListener(
            "submit",
            event => {

                event.preventDefault();

                handleLogin(
                    "admin",
                    adminLoginForm
                );

            }
        );

    }


    /* -----------------------------------------
       LOGOUT
    ----------------------------------------- */

    const logoutButton =
        $("#logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }


    /* -----------------------------------------
       SIDEBAR
    ----------------------------------------- */

    const sidebarToggle =
        $("#sidebarToggle");

    if (sidebarToggle) {

        sidebarToggle.addEventListener(
            "click",
            toggleSidebar
        );

    }


    const sidebarBackdrop =
        $("#sidebarBackdrop");

    if (sidebarBackdrop) {

        sidebarBackdrop.addEventListener(
            "click",
            closeMobileSidebar
        );

    }


    /* -----------------------------------------
       NAVIGATION
    ----------------------------------------- */

    $all("[data-section]").forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const section =
                    event.currentTarget.dataset.section;

                if (section) {

                    navigateTo(section);

                }

            }
        );

    });


    /* -----------------------------------------
       THEME
    ----------------------------------------- */

    const themeToggle =
        $("#themeToggle");

    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            toggleTheme
        );

    }


    /* -----------------------------------------
       BREAK
    ----------------------------------------- */

    const breakButton =
        $("#breakButton");

    if (breakButton) {

        breakButton.addEventListener(
            "click",
            toggleBreak
        );

    }


    /* -----------------------------------------
       JOIN CLASS
    ----------------------------------------- */

    const joinNextClassButton =
        $("#joinNextClassButton");

    if (joinNextClassButton) {

        joinNextClassButton.addEventListener(
            "click",
            joinNextClass
        );

    }


    /* -----------------------------------------
       OFFICIAL SRM
    ----------------------------------------- */

    const officialSRMButton =
        $("#officialSRMButton");

    if (officialSRMButton) {

        officialSRMButton.addEventListener(
            "click",
            () => {

                window.open(
                    APP_CONFIG.officialSRMLogin,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

    }


    /* -----------------------------------------
       ADMIN BANNER
    ----------------------------------------- */

    const adminMinimizeButton =
        $("#adminMinimizeButton");

    if (adminMinimizeButton) {

        adminMinimizeButton.addEventListener(
            "click",
            toggleAdminBanner
        );

    }


    /* -----------------------------------------
       ADMIN CLASS FORM
    ----------------------------------------- */

    const classForm =
        $("#classForm");

    if (classForm) {

        classForm.addEventListener(
            "submit",
            handleClassSubmit
        );

    }


    /* -----------------------------------------
       ANNOUNCEMENT FORM
    ----------------------------------------- */

    const announcementForm =
        $("#announcementForm");

    if (announcementForm) {

        announcementForm.addEventListener(
            "submit",
            handleAnnouncementSubmit
        );

    }


    /* -----------------------------------------
       MATERIAL FORM
    ----------------------------------------- */

    const materialForm =
        $("#materialForm");

    if (materialForm) {

        materialForm.addEventListener(
            "submit",
            handleMaterialSubmit
        );

    }


    /* -----------------------------------------
       EXPORT
    ----------------------------------------- */

    const exportDataButton =
        $("#exportDataButton");

    if (exportDataButton) {

        exportDataButton.addEventListener(
            "click",
            exportPortalData
        );

    }


    /* -----------------------------------------
       IMPORT
    ----------------------------------------- */

    const importDataButton =
        $("#importDataButton");

    const importDataFile =
        $("#importDataFile");

    if (
        importDataButton &&
        importDataFile
    ) {

        importDataButton.addEventListener(
            "click",
            () => importDataFile.click()
        );


        importDataFile.addEventListener(
            "change",
            handleImportData
        );

    }


    /* -----------------------------------------
       RESET
    ----------------------------------------- */

    const resetDataButton =
        $("#resetDataButton");

    if (resetDataButton) {

        resetDataButton.addEventListener(
            "click",
            resetPortalData
        );

    }


    /* -----------------------------------------
       RESIZE
    ----------------------------------------- */

    window.addEventListener(
        "resize",
        handleWindowResize
    );

}


/* =========================================================
   LOGIN MODAL
========================================================= */

function openLoginModal() {

    const modal = $("#loginModal");

    if (!modal) {
        return;
    }

    modal.hidden = false;

    modal.setAttribute(
        "aria-hidden",
        "false"
    );

    document.body.classList.add(
        "login-open"
    );


    switchLoginRole("student");


    const username =
        $("#studentUsername");

    if (username) {

        setTimeout(() => {

            username.focus();

        }, 100);

    }

}


function closeLoginModal() {

    const modal = $("#loginModal");

    if (!modal) {
        return;
    }

    modal.hidden = true;

    modal.setAttribute(
        "aria-hidden",
        "true"
    );

    document.body.classList.remove(
        "login-open"
    );

}


function isLoginModalOpen() {

    const modal = $("#loginModal");

    return modal &&
        !modal.hidden;

}


/* =========================================================
   LOGIN ROLE SWITCH
========================================================= */

function switchLoginRole(role) {

    if (
        role !== "student" &&
        role !== "admin"
    ) {

        role = "student";

    }


    $all("[data-login-role]").forEach(button => {

        button.classList.toggle(
            "active",
            button.dataset.loginRole === role
        );

    });


    $all("[data-login-form]").forEach(form => {

        const isCurrent =
            form.dataset.loginForm === role;

        form.hidden = !isCurrent;

        form.classList.toggle(
            "active",
            isCurrent
        );

    });


    clearLoginMessages();

}


/* =========================================================
   LOGIN
========================================================= */

function handleLogin(role, form) {

    const usernameInput =
        form.querySelector(
            'input[name="username"]'
        );

    const passwordInput =
        form.querySelector(
            'input[name="password"]'
        );


    if (
        !usernameInput ||
        !passwordInput
    ) {

        return;

    }


    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;


    const credentials =
        LOGIN_CREDENTIALS[role];


    if (!credentials) {

        showLoginMessage(
            role,
            "Login configuration unavailable."
        );

        return;

    }


    if (
        username !== credentials.username ||
        password !== credentials.password
    ) {

        showLoginMessage(
            role,
            "Incorrect username or password."
        );

        return;

    }


    currentUser = {

        role,

        username: credentials.username,

        name: credentials.name,

        displayRole: credentials.role

    };


    saveLoginSession();

    startStudentSession();

    addAudit(
        `${credentials.role} logged in`
    );


    updateHeaderUser();

    updateStudentStatus();

    updateAdminVisibility();


    closeLoginModal();


    showToast(
        `Welcome, ${credentials.name}`
    );


    renderAdmin();


    /* -----------------------------------------
       ADMIN LOGIN
    ----------------------------------------- */

    if (role === "admin") {

        navigateTo("admin");

    } else {

        navigateTo("dashboard");

    }

}


/* =========================================================
   LOGIN MESSAGES
========================================================= */

function showLoginMessage(
    role,
    message,
    success = false
) {

    const element =
        document.querySelector(
            `[data-login-message="${role}"]`
        );


    if (!element) {
        return;
    }


    element.textContent = message;

    element.classList.toggle(
        "success",
        success
    );

}


function clearLoginMessages() {

    $all(".login-message").forEach(
        element => {

            element.textContent = "";

            element.classList.remove(
                "success"
            );

        }
    );

}


/* =========================================================
   LOGIN SESSION
========================================================= */

function save
