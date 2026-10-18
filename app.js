/**
 * STUDENT PORTAL 2026 - MAIN APP ROUTER & ORCHESTRATOR
 * Coordinates SPA navigation, route protection, login handlers, and initialization.
 */

(function (window) {
  'use strict';

  const VIEWS = {
    HOME: 'view-home',
    STUDENT_LOGIN: 'view-student-login',
    ADMIN_LOGIN: 'view-admin-login',
    STUDENT_DASHBOARD: 'view-student-dashboard',
    ADMIN_DASHBOARD: 'view-admin-dashboard'
  };

  const PortalApp = {
    currentView: 'home',

    init() {
      // 1. Initialize Subsystems
      window.PortalTheme.init();
      window.PortalUI.init();
      window.StudentController.init();
      window.AdminController.init();

      // 2. Bind Navigation Links & Routing
      this.bindNavigationEvents();
      this.bindAuthForms();
      this.bindContactForm();

      // 3. Handle Initial Route
      this.handleHashChange();
      window.addEventListener('hashchange', () => this.handleHashChange());

      // 4. Listen for auth changes
      window.addEventListener('portal:loggedOut', () => {
        window.PortalUI.toast('You have been signed out safely.', 'info');
        this.navigateTo('home');
      });
    },

    bindNavigationEvents() {
      // Navigation buttons with data-nav-target
      document.querySelectorAll('[data-nav-target]').forEach(el => {
        el.addEventListener('click', (e) => {
          e.preventDefault();
          const target = el.getAttribute('data-nav-target');
          if (target) {
            window.location.hash = `#/${target}`;
            window.PortalUI.closeMobileDrawer();
          }
        });
      });

      // Global Logout buttons
      document.querySelectorAll('.btn-logout').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          window.PortalAuth.logout();
        });
      });

      // Quick Demo Fill buttons
      const fillStudentBtn = document.getElementById('btn-quick-fill-student');
      if (fillStudentBtn) {
        fillStudentBtn.addEventListener('click', () => {
          const idInput = document.getElementById('student-login-id');
          const passInput = document.getElementById('student-login-pass');
          if (idInput) idInput.value = 'alex.turner@campus.edu';
          if (passInput) passInput.value = 'student123';
          window.PortalUI.toast('Demo student credentials filled!', 'info', 2000);
        });
      }

      const fillAdminBtn = document.getElementById('btn-quick-fill-admin');
      if (fillAdminBtn) {
        fillAdminBtn.addEventListener('click', () => {
          const emailInput = document.getElementById('admin-login-email');
          const passInput = document.getElementById('admin-login-pass');
          if (emailInput) emailInput.value = 'admin@campus.edu';
          if (passInput) passInput.value = 'admin123';
          window.PortalUI.toast('Demo admin credentials filled!', 'info', 2000);
        });
      }

      // Forgot Password Modal submit
      const forgotForm = document.getElementById('form-forgot-password');
      if (forgotForm) {
        forgotForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('forgot-email-input').value;
          window.PortalUI.closeModal('modal-forgot-password');
          window.PortalUI.toast(`Password reset instructions have been dispatched to ${email}.`, 'success');
        });
      }
    },

    bindAuthForms() {
      // Student Login Form
      const studentForm = document.getElementById('form-student-login');
      if (studentForm) {
        studentForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const id = document.getElementById('student-login-id').value;
          const pass = document.getElementById('student-login-pass').value;
          const remember = document.getElementById('student-remember-me').checked;
          const errorEl = document.getElementById('student-login-error');

          if (errorEl) errorEl.style.display = 'none';

          const res = window.PortalAuth.loginStudent(id, pass, remember);
          if (res.success) {
            window.PortalUI.toast(`Welcome back, ${res.user.fullName}!`, 'success');
            window.location.hash = '#/student-dashboard';
          } else {
            if (errorEl) {
              errorEl.textContent = res.error;
              errorEl.style.display = 'block';
            }
            window.PortalUI.toast(res.error, 'error');
          }
        });
      }

      // Admin Login Form
      const adminForm = document.getElementById('form-admin-login');
      if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const email = document.getElementById('admin-login-email').value;
          const pass = document.getElementById('admin-login-pass').value;
          const remember = document.getElementById('admin-remember-me').checked;
          const errorEl = document.getElementById('admin-login-error');

          if (errorEl) errorEl.style.display = 'none';

          const res = window.PortalAuth.loginAdmin(email, pass, remember);
          if (res.success) {
            window.PortalUI.toast(`Administrator session initialized: ${res.user.fullName}`, 'success');
            window.location.hash = '#/admin-dashboard';
          } else {
            if (errorEl) {
              errorEl.textContent = res.error;
              errorEl.style.display = 'block';
            }
            window.PortalUI.toast(res.error, 'error');
          }
        });
      }
    },

    bindContactForm() {
      const contactForm = document.getElementById('home-contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
          e.preventDefault();
          contactForm.reset();
          window.PortalUI.toast('Inquiry submitted. The Campus Registrar will respond within 24 hours.', 'success');
        });
      }
    },

    handleHashChange() {
      const hash = window.location.hash || '#/';
      let route = hash.replace(/^#\/?/, '').trim();
      if (!route) route = 'home';

      this.navigateTo(route, false);
    },

    navigateTo(route, updateHash = true) {
      // Security & Route Protection
      if (route === 'student-dashboard') {
        if (!window.PortalAuth.isAuthenticated() || !window.PortalAuth.isStudent()) {
          window.PortalUI.toast('Student authentication required to access Student Dashboard.', 'warning');
          this.navigateTo('student-login');
          return;
        }
      }

      if (route === 'admin-dashboard') {
        if (!window.PortalAuth.isAuthenticated() || !window.PortalAuth.isAdmin()) {
          window.PortalUI.toast('Administrative credentials required to access the Admin Control Center.', 'error');
          this.navigateTo('admin-login');
          return;
        }
      }

      // Determine active container
      let activeViewId = VIEWS.HOME;
      if (route === 'student-login') activeViewId = VIEWS.STUDENT_LOGIN;
      else if (route === 'admin-login') activeViewId = VIEWS.ADMIN_LOGIN;
      else if (route === 'student-dashboard') activeViewId = VIEWS.STUDENT_DASHBOARD;
      else if (route === 'admin-dashboard') activeViewId = VIEWS.ADMIN_DASHBOARD;

      // Hide all views and show target view
      Object.values(VIEWS).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === activeViewId) ? 'block' : 'none';
      });

      this.currentView = route;
      if (updateHash) {
        window.location.hash = `#/${route}`;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Load view controllers if entering dashboards
      if (route === 'student-dashboard') {
        window.StudentController.loadStudentData();
      } else if (route === 'admin-dashboard') {
        window.AdminController.loadAdminData();
      }
    }
  };

  window.PortalApp = PortalApp;

  // Boot app on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PortalApp.init());
  } else {
    PortalApp.init();
  }
})(window);
