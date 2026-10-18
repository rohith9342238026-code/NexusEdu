/**
 * STUDENT PORTAL 2026 - THEME CONTROLLER MODULE
 * Manages Dark/Light theme switching, OS preference detection, and persistence.
 */

(function (window) {
  'use strict';

  const THEME_STORAGE_KEY = 'sp_portal_theme_preference';

  const PortalTheme = {
    currentTheme: 'light',

    init() {
      // 1. Check saved user preference
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        this.setTheme(savedTheme, false);
      } else {
        // 2. Default to system preference
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.setTheme(prefersDark ? 'dark' : 'light', false);
      }

      // 3. Listen for OS theme changes if user hasn't explicitly set preference
      if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
          if (!localStorage.getItem(THEME_STORAGE_KEY)) {
            this.setTheme(e.matches ? 'dark' : 'light', false);
          }
        });
      }

      // Bind all theme toggles in DOM
      this.bindToggleButtons();
    },

    setTheme(theme, save = true) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      if (save) {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      }
      this.updateToggleIcons();

      // Dispatch event
      window.dispatchEvent(new CustomEvent('portal:themeChanged', { detail: { theme } }));
    },

    toggle() {
      const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(nextTheme, true);
    },

    bindToggleButtons() {
      document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => this.toggle());
      });
      this.updateToggleIcons();
    },

    updateToggleIcons() {
      const isDark = this.currentTheme === 'dark';
      const sunSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
      const moonSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

      document.querySelectorAll('.btn-theme-toggle').forEach(btn => {
        btn.innerHTML = isDark ? sunSvg : moonSvg;
        btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      });
    }
  };

  window.PortalTheme = PortalTheme;
})(window);
