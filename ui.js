/**
 * STUDENT PORTAL 2026 - UI COMPONENTS & INTERACTION MODULE
 * Manages toast notifications, modal dialogs, drawer toggles, and UI utilities.
 */

(function (window) {
  'use strict';

  const PortalUI = {
    toastContainer: null,

    init() {
      this.ensureToastContainer();
      this.initModalListeners();
      this.initPasswordToggles();
      this.initMobileDrawer();
    },

    // HTML Escape to prevent XSS
    escapeHtml(str) {
      if (!str) return '';
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    // Toast Notifications
    ensureToastContainer() {
      let container = document.getElementById('toast-container');
      if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
      }
      this.toastContainer = container;
    },

    toast(message, type = 'info', duration = 3500) {
      this.ensureToastContainer();

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;

      let iconSvg = '';
      if (type === 'success') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
      } else if (type === 'error') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      } else if (type === 'warning') {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      } else {
        iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
      }

      toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-message">${this.escapeHtml(message)}</div>
      `;

      this.toastContainer.appendChild(toast);

      setTimeout(() => {
        toast.classList.add('toast-hiding');
        setTimeout(() => toast.remove(), 250);
      }, duration);
    },

    // Modals
    openModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
      }
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    },

    initModalListeners() {
      // Close on backdrop click
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            this.closeModal(overlay.id);
          }
        });
      });

      // Close on ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal-overlay.active').forEach(overlay => {
            this.closeModal(overlay.id);
          });
          this.closeMobileDrawer();
          this.closeSidebar();
        }
      });

      // Close on modal-close button click
      document.querySelectorAll('[data-close-modal]').forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.getAttribute('data-close-modal');
          if (targetId) {
            this.closeModal(targetId);
          } else {
            const overlay = btn.closest('.modal-overlay');
            if (overlay) this.closeModal(overlay.id);
          }
        });
      });
    },

    // Password Visibility Toggles
    initPasswordToggles() {
      document.querySelectorAll('.btn-toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
          const input = btn.previousElementSibling;
          if (input && input.tagName === 'INPUT') {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.innerHTML = isPassword
              ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
              : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
          }
        });
      });
    },

    // Mobile Drawer Navigation (Home)
    initMobileDrawer() {
      const openBtn = document.getElementById('mobile-menu-open-btn');
      const closeBtn = document.getElementById('mobile-menu-close-btn');
      const overlay = document.getElementById('mobile-drawer-overlay');
      const drawer = document.getElementById('mobile-drawer');

      if (openBtn && overlay && drawer) {
        openBtn.addEventListener('click', () => {
          overlay.classList.add('active');
          drawer.classList.add('active');
        });
      }

      if (closeBtn && overlay && drawer) {
        closeBtn.addEventListener('click', () => {
          this.closeMobileDrawer();
        });
      }

      if (overlay) {
        overlay.addEventListener('click', () => {
          this.closeMobileDrawer();
        });
      }

      // Sidebar Backdrop & Toggle (Dashboards)
      const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
      const sidebarBackdrop = document.getElementById('sidebar-backdrop');
      const sidebar = document.getElementById('app-sidebar');

      if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', () => {
          sidebar.classList.toggle('sidebar-open');
          if (sidebarBackdrop) sidebarBackdrop.classList.toggle('active');
        });
      }

      if (sidebarBackdrop && sidebar) {
        sidebarBackdrop.addEventListener('click', () => {
          this.closeSidebar();
        });
      }
    },

    closeMobileDrawer() {
      const overlay = document.getElementById('mobile-drawer-overlay');
      const drawer = document.getElementById('mobile-drawer');
      if (overlay) overlay.classList.remove('active');
      if (drawer) drawer.classList.remove('active');
    },

    closeSidebar() {
      const sidebar = document.getElementById('app-sidebar');
      const backdrop = document.getElementById('sidebar-backdrop');
      if (sidebar) sidebar.classList.remove('sidebar-open');
      if (backdrop) backdrop.classList.remove('active');
    }
  };

  window.PortalUI = PortalUI;
})(window);
