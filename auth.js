/**
 * STUDENT PORTAL 2026 - AUTHENTICATION & ROLE MANAGEMENT MODULE
 * Implements strict role separation between Student and Admin users.
 */

(function (window) {
  'use strict';

  const SESSION_KEY = 'sp_portal_auth_session_v1';

  // Demo Credentials Map for Sandbox Demonstration
  const DEMO_CREDENTIALS = {
    STUDENT_DEFAULT_PASS: 'student123',
    ADMIN_EMAIL: 'admin@campus.edu',
    ADMIN_PASS: 'admin123'
  };

  const PortalAuth = {
    currentSession: null,

    init() {
      try {
        const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
        if (raw) {
          this.currentSession = JSON.parse(raw);
        }
      } catch (err) {
        console.error('Session load error:', err);
        this.currentSession = null;
      }
    },

    getSession() {
      return this.currentSession;
    },

    isAuthenticated() {
      return Boolean(this.currentSession && this.currentSession.user);
    },

    getRole() {
      return this.currentSession ? this.currentSession.role : null;
    },

    isStudent() {
      return this.getRole() === 'student';
    },

    isAdmin() {
      return this.getRole() === 'admin';
    },

    // Authenticate Student
    loginStudent(identifier, password, remember = false) {
      const idTrimmed = (identifier || '').trim();
      const passTrimmed = (password || '').trim();

      if (!idTrimmed) {
        return { success: false, error: 'Please enter your Student Email or Student ID.' };
      }
      if (!passTrimmed) {
        return { success: false, error: 'Please enter your password.' };
      }

      // Check if user is mistakenly attempting admin credentials here
      if (idTrimmed.toLowerCase() === DEMO_CREDENTIALS.ADMIN_EMAIL.toLowerCase()) {
        return { 
          success: false, 
          error: 'Administrator credentials detected. Please use the designated Admin Portal login.' 
        };
      }

      // Find student in repository
      const student = window.PortalData.getStudentByEmailOrId(idTrimmed);
      if (!student) {
        return { 
          success: false, 
          error: 'No student account matches the provided Student ID or Email.' 
        };
      }

      // Check status
      if (student.status === 'Suspended') {
        return { 
          success: false, 
          error: 'Your student account is currently suspended. Please contact the Academic Office.' 
        };
      }

      // Verify Password (In production, this would be an HTTPS POST to /api/auth/login with bcrypt validation)
      if (passTrimmed !== DEMO_CREDENTIALS.STUDENT_DEFAULT_PASS) {
        return { 
          success: false, 
          error: 'Invalid password. (Tip: Demo password is "student123")' 
        };
      }

      // Create session
      const sessionData = {
        role: 'student',
        user: {
          id: student.id,
          fullName: student.fullName,
          email: student.email,
          department: student.department,
          semester: student.semester
        },
        token: 'demo-jwt-student-token-' + Date.now(),
        loginTime: new Date().toISOString()
      };

      this.saveSession(sessionData, remember);
      return { success: true, user: sessionData.user };
    },

    // Authenticate Administrator
    loginAdmin(email, password, remember = false) {
      const emailTrimmed = (email || '').trim().toLowerCase();
      const passTrimmed = (password || '').trim();

      if (!emailTrimmed) {
        return { success: false, error: 'Please enter the administrator email address.' };
      }
      if (!passTrimmed) {
        return { success: false, error: 'Please enter the administrator password.' };
      }

      // Security check: Check if a student tries to sign into Admin
      const isStudentEmail = window.PortalData.getStudentByEmailOrId(emailTrimmed);
      if (isStudentEmail && emailTrimmed !== DEMO_CREDENTIALS.ADMIN_EMAIL.toLowerCase()) {
        return { 
          success: false, 
          error: 'Access Denied: This account is registered as a Student and lacks Administrative privileges.' 
        };
      }

      // Verify Admin credentials
      if (emailTrimmed !== DEMO_CREDENTIALS.ADMIN_EMAIL.toLowerCase() || passTrimmed !== DEMO_CREDENTIALS.ADMIN_PASS) {
        return { 
          success: false, 
          error: 'Invalid administrator credentials. (Tip: Demo is "admin@campus.edu" / "admin123")' 
        };
      }

      const adminProfile = window.PortalData.getAdminProfile();
      const sessionData = {
        role: 'admin',
        user: {
          id: adminProfile.id,
          fullName: adminProfile.name,
          email: adminProfile.email,
          title: adminProfile.title,
          department: adminProfile.department
        },
        token: 'demo-jwt-admin-token-' + Date.now(),
        loginTime: new Date().toISOString()
      };

      this.saveSession(sessionData, remember);
      return { success: true, user: sessionData.user };
    },

    saveSession(sessionData, remember) {
      this.currentSession = sessionData;
      const str = JSON.stringify(sessionData);
      sessionStorage.setItem(SESSION_KEY, str);
      if (remember) {
        localStorage.setItem(SESSION_KEY, str);
      }
    },

    logout() {
      this.currentSession = null;
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
      window.dispatchEvent(new CustomEvent('portal:loggedOut'));
    }
  };

  window.PortalAuth = PortalAuth;
  PortalAuth.init();
})(window);
