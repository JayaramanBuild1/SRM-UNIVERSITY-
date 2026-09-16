(function(){
  // Patch/fallbacks to restore interactivity when app.js is truncated or missing implementations.
  // This file defines minimal implementations only when they don't already exist.

  function defineIfMissing(name, fn) {
    if (typeof window[name] === 'undefined') {
      window[name] = fn;
    }
  }

  defineIfMissing('loadPortalState', function() {
    try {
      const raw = localStorage.getItem(APP_CONFIG.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          portalState = parsed;
        }
      }
    } catch (e) {
      console.warn('loadPortalState fallback failed', e);
    }
  });

  defineIfMissing('saveLoginSession', function() {
    try {
      if (currentUser) {
        localStorage.setItem(APP_CONFIG.loginKey, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(APP_CONFIG.loginKey);
      }
    } catch (e) {
      console.warn('saveLoginSession fallback failed', e);
    }
  });

  defineIfMissing('loadTheme', function() {
    try {
      const t = localStorage.getItem(APP_CONFIG.themeKey);
      if (t === 'dark') document.documentElement.classList.add('dark');
    } catch (e) { }
  });

  defineIfMissing('loadSidebarState', function() {
    try {
      const v = localStorage.getItem(APP_CONFIG.sidebarKey);
      if (v === 'closed') document.getElementById('sidebar')?.classList.add('minimized');
    } catch (e) { }
  });

  defineIfMissing('navigateTo', function(section) {
    try {
      // hide all
      document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
      const id = 'section-' + section;
      const el = document.getElementById(id);
      if (el) el.classList.add('active');
      // update nav buttons
      document.querySelectorAll('[data-section]').forEach(btn => btn.classList.toggle('active', btn.dataset.section === section));
    } catch (e) { console.warn('navigateTo fallback', e); }
  });

  defineIfMissing('updateCurrentDate', function() {
    try {
      const el = document.getElementById('currentDate');
      if (!el) return;
      const d = new Date();
      el.textContent = d.toLocaleDateString();
    } catch (e) { }
  });

  defineIfMissing('updateHeaderUser', function() {
    try {
      const loggedArea = document.getElementById('loggedUserArea');
      const openBtn = document.getElementById('openLoginButton');
      const headerName = document.getElementById('headerUserName');
      const headerRole = document.getElementById('headerUserRole');
      if (currentUser) {
        if (loggedArea) loggedArea.hidden = false;
        if (openBtn) openBtn.hidden = true;
        if (headerName) headerName.textContent = currentUser.name || currentUser.username || 'User';
        if (headerRole) headerRole.textContent = currentUser.displayRole || currentUser.role || '';
      } else {
        if (loggedArea) loggedArea.hidden = true;
        if (openBtn) openBtn.hidden = false;
        if (headerName) headerName.textContent = 'Guest';
        if (headerRole) headerRole.textContent = 'Guest';
      }
    } catch (e) { }
  });

  defineIfMissing('updateStudentStatus', function() {
    try {
      const el = document.getElementById('studentStatus');
      if (!el) return;
      if (currentUser) {
        el.querySelector('.status-light')?.classList.add('online');
        el.querySelectorAll('span')[1].textContent = currentUser.displayRole || 'Student';
      } else {
        el.querySelector('.status-light')?.classList.remove('online');
        el.querySelectorAll('span')[1].textContent = 'Student';
      }
    } catch (e) { }
  });

  defineIfMissing('renderDashboard', function() {
    try {
      // course count
      const courseCount = document.getElementById('courseCount');
      if (courseCount) courseCount.textContent = String(SUBJECTS.length);

      // overall progress
      const overall = document.getElementById('overallProgress');
      if (overall) overall.textContent = '0%';

      // upcoming classes
      const container = document.getElementById('dashboardUpcomingClasses');
      if (container) {
        container.innerHTML = '';
        (portalState.classes || []).forEach(c => {
          const card = document.createElement('div');
          card.className = 'upcoming-item';
          card.innerHTML = `<strong>${c.subject}</strong><div>${c.dateTime}</div>`;
          container.appendChild(card);
        });
      }

      // announcements
      const annContainer = document.getElementById('dashboardAnnouncements');
      if (annContainer) {
        annContainer.innerHTML = '';
        (portalState.announcements || []).forEach(a => {
          const el = document.createElement('div');
          el.className = 'announcement-item';
          el.innerHTML = `<strong>${a.title}</strong><div>${a.message}</div>`;
          annContainer.appendChild(el);
        });
      }

      // enable join button if next class exists
      const joinButton = document.getElementById('joinNextClassButton');
      if (joinButton) {
        const next = (portalState.classes || [])[0];
        if (next && next.zoomLink) {
          joinButton.disabled = false;
          joinButton.dataset.zoom = next.zoomLink;
        } else {
          joinButton.disabled = true;
        }
      }

    } catch (e) { console.warn('renderDashboard fallback', e); }
  });

  defineIfMissing('renderLiveClasses', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderCourses', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderProgress', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderAssignments', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderMaterials', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderCalendar', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderAnnouncements', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderAnalytics', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderProfile', function() { try { /* no-op fallback */ } catch(e){} });
  defineIfMissing('renderAdmin', function() { try { /* no-op fallback */ } catch(e){} });

  defineIfMissing('startCountdown', function() {
    try {
      const next = (portalState.classes || [])[0];
      if (!next) return;
      const target = new Date(next.dateTime);
      function update() {
        const diff = target - new Date();
        if (diff <= 0) {
          document.getElementById('countdownDays').textContent = '00';
          document.getElementById('countdownHours').textContent = '00';
          document.getElementById('countdownMinutes').textContent = '00';
          document.getElementById('countdownSeconds').textContent = '00';
          return;
        }
        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff / (1000*60*60)) % 24);
        const minutes = Math.floor((diff / (1000*60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        document.getElementById('countdownDays').textContent = String(days).padStart(2,'0');
        document.getElementById('countdownHours').textContent = String(hours).padStart(2,'0');
        document.getElementById('countdownMinutes').textContent = String(minutes).padStart(2,'0');
        document.getElementById('countdownSeconds').textContent = String(seconds).padStart(2,'0');
      }
      update();
      if (typeof window.__patchCountdownInterval === 'number') clearInterval(window.__patchCountdownInterval);
      window.__patchCountdownInterval = setInterval(update,1000);
    } catch (e) { }
  });

  defineIfMissing('startSessionClock', function() {
    try {
      const el = document.getElementById('sessionTimer');
      if (!el) return;
      let seconds = 0;
      function fmt(s){
        const hh = String(Math.floor(s/3600)).padStart(2,'0');
        const mm = String(Math.floor((s%3600)/60)).padStart(2,'0');
        const ss = String(s%60).padStart(2,'0');
        return `${hh}:${mm}:${ss}`;
      }
      el.textContent = fmt(seconds);
      if (typeof window.__patchSessionInterval === 'number') clearInterval(window.__patchSessionInterval);
      window.__patchSessionInterval = setInterval(()=>{ seconds++; el.textContent = fmt(seconds); },1000);
    } catch (e) { }
  });

  defineIfMissing('startBreakClock', function() { /* fallback no-op */ });

  defineIfMissing('joinNextClass', function() {
    try {
      const joinButton = document.getElementById('joinNextClassButton');
      if (!joinButton) return;
      const link = joinButton.dataset.zoom || (portalState.classes && portalState.classes[0] && portalState.classes[0].zoomLink);
      if (link) window.open(link, '_blank', 'noopener');
    } catch (e) { }
  });

  defineIfMissing('toggleBreak', function() { /* no-op */ });
  defineIfMissing('toggleTheme', function() { document.documentElement.classList.toggle('dark'); });
  defineIfMissing('toggleSidebar', function() { document.getElementById('sidebar')?.classList.toggle('minimized'); });
  defineIfMissing('closeMobileSidebar', function() { /* no-op */ });
  defineIfMissing('handleWindowResize', function() { /* no-op */ });
  defineIfMissing('logout', function() { currentUser = null; saveLoginSession(); updateHeaderUser(); updateStudentStatus(); showToast('Logged out'); });
  defineIfMissing('updateAdminVisibility', function() { try { const btn = document.getElementById('adminNavButton'); if (btn) btn.hidden = !(currentUser && currentUser.role === 'admin'); } catch(e){} });

  defineIfMissing('addAudit', function(msg){ try{ portalState.audit = portalState.audit || []; portalState.audit.push({message: msg, time: Date.now()}); localStorage.setItem(APP_CONFIG.storageKey, JSON.stringify(portalState)); }catch(e){} });
  defineIfMissing('showToast', function(msg){ try{ console.log('TOAST:',msg); }catch(e){} });
  defineIfMissing('showLoginMessage', function(role,msg){ console.warn('Login message for',role,msg); });
  defineIfMissing('clearLoginMessages', function(){ /* no-op */ });

  // Attempt to (re)bind events and re-render UI now that fallbacks are available.
  document.addEventListener('DOMContentLoaded', function(){
    try {
      // load saved state
      if (typeof loadPortalState === 'function') loadPortalState();
      if (typeof loadTheme === 'function') loadTheme();
      if (typeof loadSidebarState === 'function') loadSidebarState();

      // if app previously failed before setting currentUser, restore from storage
      try {
        const saved = localStorage.getItem(APP_CONFIG.loginKey);
        if (saved) currentUser = JSON.parse(saved);
      } catch(e){}

      // bind global events if available
      if (typeof bindGlobalEvents === 'function') bindGlobalEvents();

      // render
      if (typeof renderDashboard === 'function') renderDashboard();
      if (typeof renderCourses === 'function') renderCourses();
      if (typeof renderProgress === 'function') renderProgress();
      if (typeof renderLiveClasses === 'function') renderLiveClasses();
      if (typeof renderAssignments === 'function') renderAssignments();
      if (typeof renderMaterials === 'function') renderMaterials();
      if (typeof renderCalendar === 'function') renderCalendar();
      if (typeof renderAnnouncements === 'function') renderAnnouncements();
      if (typeof renderAnalytics === 'function') renderAnalytics();
      if (typeof renderProfile === 'function') renderProfile();
      if (typeof renderAdmin === 'function') renderAdmin();

      if (typeof updateCurrentDate === 'function') updateCurrentDate();
      if (typeof updateHeaderUser === 'function') updateHeaderUser();
      if (typeof updateStudentStatus === 'function') updateStudentStatus();
      if (typeof startCountdown === 'function') startCountdown();
      if (typeof startSessionClock === 'function') startSessionClock();
      if (typeof startBreakClock === 'function') startBreakClock();

      console.info('Patch fallbacks applied');
    } catch (e) {
      console.warn('Patch initialization failed', e);
    }
  });

})();
