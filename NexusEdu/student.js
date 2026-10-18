/**
 * STUDENT PORTAL 2026 - STUDENT DASHBOARD CONTROLLER
 * Renders and coordinates all student-facing views, academic analytics,
 * timetable, assignments, exams, and announcements.
 */

(function (window) {
  'use strict';

  const StudentController = {
    currentStudent: null,
    activeTab: 'overview',
    selectedDay: 'Monday',

    init() {
      this.bindTabEvents();
    },

    loadStudentData() {
      const session = window.PortalAuth.getSession();
      if (!session || session.role !== 'student') return;

      const student = window.PortalData.getStudentById(session.user.id) || 
                      window.PortalData.getStudentByEmailOrId(session.user.email);
      
      this.currentStudent = student;
      this.renderStudentHeader();
      this.switchTab('overview');
    },

    bindTabEvents() {
      document.querySelectorAll('.student-nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tab = btn.getAttribute('data-tab');
          if (tab) {
            this.switchTab(tab);
            window.PortalUI.closeSidebar();
          }
        });
      });
    },

    switchTab(tabName) {
      this.activeTab = tabName;

      // Update sidebar nav state
      document.querySelectorAll('.student-nav-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
      });

      // Update topbar breadcrumb
      const pageTitle = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const breadcrumbEl = document.getElementById('student-page-title');
      if (breadcrumbEl) breadcrumbEl.textContent = pageTitle;

      // Render tab content
      const container = document.getElementById('student-tab-content');
      if (!container) return;

      switch (tabName) {
        case 'overview':
          this.renderOverview(container);
          break;
        case 'attendance':
          this.renderAttendance(container);
          break;
        case 'results':
          this.renderResults(container);
          break;
        case 'timetable':
          this.renderTimetable(container);
          break;
        case 'assignments':
          this.renderAssignments(container);
          break;
        case 'exams':
          this.renderExams(container);
          break;
        case 'materials':
          this.renderMaterials(container);
          break;
        case 'announcements':
          this.renderAnnouncements(container);
          break;
        case 'profile':
          this.renderProfile(container);
          break;
        default:
          this.renderOverview(container);
      }
    },

    renderStudentHeader() {
      const s = this.currentStudent;
      if (!s) return;

      const nameEl = document.getElementById('student-display-name');
      const deptEl = document.getElementById('student-display-dept');
      const avatarEl = document.getElementById('student-display-avatar');

      if (nameEl) nameEl.textContent = s.fullName;
      if (deptEl) deptEl.textContent = `${s.id} • ${s.department} (${s.semester})`;
      if (avatarEl) avatarEl.textContent = s.fullName.charAt(0);
    },

    // 1. Overview Tab
    renderOverview(container) {
      const s = this.currentStudent;
      const subjects = s.subjects || [];
      const assignments = s.assignments || [];
      const pendingAsgCount = assignments.filter(a => a.status === 'Pending').length;
      const announcements = window.PortalData.getAnnouncements();

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <span class="badge badge-primary mb-2">Spring Academic Session 2026</span>
            <h2 class="dash-title">Welcome back, ${window.PortalUI.escapeHtml(s.fullName)}!</h2>
            <p class="dash-subtitle">Enrolled in <strong>${window.PortalUI.escapeHtml(s.department)}</strong> • ${window.PortalUI.escapeHtml(s.semester)}</p>
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="window.StudentController.switchTab('timetable')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              View Schedule
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.StudentController.switchTab('assignments')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Assignments
            </button>
          </div>
        </div>

        <!-- Metric Stat Cards -->
        <div class="stat-cards-grid animate-fade-in">
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Overall Attendance</span>
              <span class="stat-value" style="color: ${s.attendance >= 85 ? 'var(--success)' : s.attendance >= 75 ? 'var(--warning)' : 'var(--danger)'}">
                ${s.attendance}%
              </span>
              <span class="stat-meta text-muted">
                ${s.attendance >= 75 ? '✓ Exam Eligible (>=75%)' : '⚠ Below 75% Requirement'}
              </span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${Math.min(100, s.attendance)}%; background: ${s.attendance >= 85 ? 'var(--success)' : s.attendance >= 75 ? 'var(--warning)' : 'var(--danger)'}"></div>
              </div>
            </div>
            <div class="stat-icon-wrapper" style="background: var(--primary-light); color: var(--primary);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Cumulative GPA (CGPA)</span>
              <span class="stat-value" style="color: var(--primary);">${s.cgpa.toFixed(2)}</span>
              <span class="stat-meta text-muted">Scale of 10.0 • Top 5% Rank</span>
              <div class="progress-bar-container">
                <div class="progress-bar-fill" style="width: ${(s.cgpa / 10) * 100}%; background: var(--primary);"></div>
              </div>
            </div>
            <div class="stat-icon-wrapper" style="background: var(--success-bg); color: var(--success);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Pending Tasks</span>
              <span class="stat-value" style="color: ${pendingAsgCount > 0 ? 'var(--warning)' : 'var(--success)'};">${pendingAsgCount}</span>
              <span class="stat-meta text-muted">Due this academic week</span>
            </div>
            <div class="stat-icon-wrapper" style="background: var(--warning-bg); color: var(--warning);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Degree Credits</span>
              <span class="stat-value">${s.creditsEarned} <small style="font-size: 1rem; color: var(--text-muted);">/ ${s.totalCredits}</small></span>
              <span class="stat-meta text-muted">78.1% Degree Complete</span>
            </div>
            <div class="stat-icon-wrapper" style="background: var(--info-bg); color: var(--info);">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
          </div>
        </div>

        <!-- 2-Column Widgets -->
        <div class="dash-widgets-grid animate-fade-in">
          <!-- Registered Subjects & Attendance Quick Bar -->
          <div class="dash-widget-card">
            <div class="widget-header">
              <span class="widget-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                Current Semester Courses (${subjects.length})
              </span>
              <button class="btn btn-outline btn-sm" onclick="window.StudentController.switchTab('attendance')">View Details</button>
            </div>
            <div class="widget-body" style="padding: 0;">
              <div class="table-responsive-container" style="border: none;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Subject Name</th>
                      <th>Faculty</th>
                      <th>Attended</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${subjects.map(sub => {
                      const pct = Math.round((sub.attended / sub.total) * 100);
                      const isSafe = pct >= 85;
                      const isWarn = pct >= 75 && pct < 85;
                      return `
                        <tr>
                          <td><strong>${sub.code}</strong></td>
                          <td>${window.PortalUI.escapeHtml(sub.name)}</td>
                          <td class="text-muted">${window.PortalUI.escapeHtml(sub.faculty)}</td>
                          <td>${sub.attended} / ${sub.total} classes</td>
                          <td>
                            <div class="d-flex align-items-center gap-2">
                              <span class="badge ${isSafe ? 'badge-success' : isWarn ? 'badge-warning' : 'badge-danger'}">
                                ${pct}%
                              </span>
                            </div>
                          </td>
                        </tr>
                      `;
                    }).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Recent Notices -->
          <div class="dash-widget-card">
            <div class="widget-header">
              <span class="widget-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                Campus Bulletins
              </span>
              <button class="btn btn-ghost btn-sm" onclick="window.StudentController.switchTab('announcements')">All</button>
            </div>
            <div class="widget-body">
              ${announcements.slice(0, 3).map(ann => `
                <div class="announcement-item" style="padding: 0.85rem; margin-bottom: 0.65rem;">
                  <div class="announcement-header">
                    <span class="badge ${ann.badgeClass}">${ann.category}</span>
                    <span class="announcement-date">${ann.date}</span>
                  </div>
                  <h4 style="font-size: 0.95rem; margin-top: 0.25rem;">${window.PortalUI.escapeHtml(ann.title)}</h4>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    },

    // 2. Attendance Tab
    renderAttendance(container) {
      const s = this.currentStudent;
      const subjects = s.subjects || [];

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Attendance Overview</h2>
            <p class="dash-subtitle">University policy requires a minimum threshold of <strong>75% attendance</strong> per registered subject to remain eligible for end-semester examinations.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.PortalUI.toast('Leave application portal will open for verification during official admin hours.', 'info')">
            Apply for Medical / On-Duty Leave
          </button>
        </div>

        <div class="stat-cards-grid animate-fade-in">
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Aggregate Attendance</span>
              <span class="stat-value" style="color: var(--success);">${s.attendance}%</span>
              <span class="stat-meta text-muted">Eligible across all 6 courses</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Total Lectures Held</span>
              <span class="stat-value">251</span>
              <span class="stat-meta text-muted">224 Attended • 27 Missed</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Courses at Risk (<75%)</span>
              <span class="stat-value" style="color: var(--success);">0</span>
              <span class="stat-meta text-muted">All courses satisfy requirements</span>
            </div>
          </div>
        </div>

        <div class="dash-widget-card animate-fade-in">
          <div class="widget-header">
            <span class="widget-title">Subject-Wise Attendance Breakdown</span>
          </div>
          <div class="widget-body" style="padding: 0;">
            <div class="table-responsive-container" style="border: none;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Course Title</th>
                    <th>Faculty Instructor</th>
                    <th>Attended / Total</th>
                    <th>Missed</th>
                    <th>Attendance %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${subjects.map(sub => {
                    const pct = Math.round((sub.attended / sub.total) * 100);
                    const missed = sub.total - sub.attended;
                    const isHigh = pct >= 85;
                    const isMed = pct >= 75 && pct < 85;
                    return `
                      <tr>
                        <td><strong>${sub.code}</strong></td>
                        <td>${window.PortalUI.escapeHtml(sub.name)}</td>
                        <td class="text-muted">${window.PortalUI.escapeHtml(sub.faculty)}</td>
                        <td><strong>${sub.attended}</strong> / ${sub.total}</td>
                        <td class="text-muted">${missed}</td>
                        <td>
                          <div style="min-width: 140px;">
                            <div class="d-flex justify-content-between font-weight-bold" style="font-size: 0.8rem; margin-bottom: 2px;">
                              <span>${pct}%</span>
                            </div>
                            <div class="progress-bar-container" style="margin: 0;">
                              <div class="progress-bar-fill" style="width: ${pct}%; background: ${isHigh ? 'var(--success)' : isMed ? 'var(--warning)' : 'var(--danger)'}"></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span class="badge ${isHigh ? 'badge-success' : isMed ? 'badge-warning' : 'badge-danger'}">
                            ${isHigh ? 'Exemplary' : isMed ? 'Compliant' : 'Shortage'}
                          </span>
                        </td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // 3. Results & Grades Tab
    renderResults(container) {
      const s = this.currentStudent;
      const subjects = s.subjects || [];
      const semesterGrades = s.semesterGrades || [];

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Semester Results & Academic Performance</h2>
            <p class="dash-subtitle">Cumulative Grade Point Average: <strong>${s.cgpa.toFixed(2)}</strong> out of 10.00 scale</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.PortalUI.toast('Official Grade Sheet PDF downloaded successfully.', 'success')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Transcripts
          </button>
        </div>

        <div class="stat-cards-grid animate-fade-in">
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Current CGPA</span>
              <span class="stat-value" style="color: var(--primary);">${s.cgpa.toFixed(2)}</span>
              <span class="stat-meta text-muted">Top 5% of Department</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Earned Credits</span>
              <span class="stat-value">${s.creditsEarned}</span>
              <span class="stat-meta text-muted">Out of 160 required</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Academic Standing</span>
              <span class="stat-value" style="color: var(--success); font-size: 1.5rem;">Dean's List</span>
              <span class="stat-meta text-muted">First Class with Distinction</span>
            </div>
          </div>
        </div>

        <div class="dash-widget-card animate-fade-in mb-4">
          <div class="widget-header">
            <span class="widget-title">Semester-Wise Progression</span>
          </div>
          <div class="widget-body" style="padding: 0;">
            <div class="table-responsive-container" style="border: none;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Semester</th>
                    <th>Credits Registered</th>
                    <th>Grade Point Average (GPA)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${semesterGrades.map(sg => `
                    <tr>
                      <td><strong>${sg.sem}</strong></td>
                      <td>${sg.credits} Credits</td>
                      <td><strong style="color: var(--primary);">${sg.gpa.toFixed(2)}</strong></td>
                      <td>
                        <span class="badge ${sg.status === 'Completed' ? 'badge-success' : 'badge-primary'}">
                          ${sg.status}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="dash-widget-card animate-fade-in">
          <div class="widget-header">
            <span class="widget-title">Current Semester Course Grades (${s.semester})</span>
          </div>
          <div class="widget-body" style="padding: 0;">
            <div class="table-responsive-container" style="border: none;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Title</th>
                    <th>Credits</th>
                    <th>Internal Marks</th>
                    <th>Projected Letter Grade</th>
                  </tr>
                </thead>
                <tbody>
                  ${subjects.map(sub => `
                    <tr>
                      <td><strong>${sub.code}</strong></td>
                      <td>${window.PortalUI.escapeHtml(sub.name)}</td>
                      <td>${sub.credits}</td>
                      <td>92 / 100</td>
                      <td>
                        <span class="badge ${sub.grade === 'O' ? 'badge-success' : 'badge-primary'}" style="font-size: 0.85rem; padding: 0.3rem 0.75rem;">
                          ${sub.grade} (Grade Point: ${sub.grade === 'O' ? '10' : '9'})
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // 4. Timetable Tab
    renderTimetable(container) {
      const schedule = window.PortalData.getTimetable();
      const days = Object.keys(schedule);
      const activePeriods = schedule[this.selectedDay] || [];

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Weekly Lecture Timetable</h2>
            <p class="dash-subtitle">Room assignments, class timings, and faculty office hours for Spring 2026.</p>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.PortalUI.toast('Calendar synced to your iCal/Google Calendar.', 'success')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Sync with Calendar
          </button>
        </div>

        <!-- Day Selector Tabs -->
        <div class="timetable-days-nav animate-fade-in">
          ${days.map(day => `
            <button class="day-tab-btn ${day === this.selectedDay ? 'active' : ''}" onclick="window.StudentController.changeTimetableDay('${day}')">
              ${day}
            </button>
          `).join('')}
        </div>

        <div class="animate-fade-in">
          ${activePeriods.length === 0 ? `
            <div class="card empty-state">
              <div class="empty-state-title">No scheduled lectures for this day</div>
              <p class="empty-state-desc">Use this free time for self-study, capstone project research, and library resources.</p>
            </div>
          ` : activePeriods.map(period => `
            <div class="period-card">
              <div class="d-flex align-items-center gap-3">
                <span class="period-time">${period.time}</span>
                <div>
                  <h4 style="font-size: 1.05rem; margin-bottom: 0.2rem;">${window.PortalUI.escapeHtml(period.subject)}</h4>
                  <span class="text-muted" style="font-size: 0.85rem;">
                    Faculty: <strong>${window.PortalUI.escapeHtml(period.faculty)}</strong> • Room: <strong>${period.room}</strong>
                  </span>
                </div>
              </div>
              <div>
                <span class="badge ${period.type === 'Lecture' ? 'badge-primary' : period.type === 'Laboratory' ? 'badge-info' : 'badge-warning'}">
                  ${period.type}
                </span>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    },

    changeTimetableDay(day) {
      this.selectedDay = day;
      const container = document.getElementById('student-tab-content');
      if (container) this.renderTimetable(container);
    },

    // 5. Assignments Tab
    renderAssignments(container) {
      const s = this.currentStudent;
      const assignments = s.assignments || [];

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Assignments & Submissions</h2>
            <p class="dash-subtitle">Track project deliverables, homework submissions, and faculty evaluations.</p>
          </div>
        </div>

        <div class="animate-fade-in">
          <div class="dash-widget-card">
            <div class="widget-header">
              <span class="widget-title">Active Course Assignments</span>
              <span class="badge badge-primary">${assignments.length} Total</span>
            </div>
            <div class="widget-body" style="padding: 0;">
              <div class="table-responsive-container" style="border: none;">
                <table class="data-table">
                  <thead>
                    <tr>
                      <th>Ref ID</th>
                      <th>Assignment Title</th>
                      <th>Course</th>
                      <th>Due Date</th>
                      <th>Status</th>
                      <th>Points</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${assignments.map(asg => `
                      <tr>
                        <td><code>${asg.id}</code></td>
                        <td><strong>${window.PortalUI.escapeHtml(asg.title)}</strong></td>
                        <td class="text-muted">${window.PortalUI.escapeHtml(asg.subject)}</td>
                        <td>${asg.dueDate}</td>
                        <td>
                          <span class="badge ${asg.status === 'Submitted' ? 'badge-success' : 'badge-warning'}">
                            ${asg.status}
                          </span>
                        </td>
                        <td>${asg.points}</td>
                        <td>
                          ${asg.status === 'Pending' ? `
                            <button class="btn btn-outline btn-sm" onclick="window.StudentController.openSubmissionModal('${asg.id}', '${window.PortalUI.escapeHtml(asg.title)}')">
                              Submit Work
                            </button>
                          ` : `
                            <button class="btn btn-ghost btn-sm" onclick="window.PortalUI.toast('Viewing submitted copy for evaluation.', 'info')">
                              View Submission
                            </button>
                          `}
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      `;
    },

    openSubmissionModal(asgId, title) {
      const titleEl = document.getElementById('submit-modal-asg-title');
      const inputEl = document.getElementById('submit-modal-asg-id');
      if (titleEl) titleEl.textContent = title;
      if (inputEl) inputEl.value = asgId;
      window.PortalUI.openModal('modal-submit-assignment');
    },

    submitAssignmentForm() {
      const asgId = document.getElementById('submit-modal-asg-id').value;
      const fileInput = document.getElementById('submit-file-input');

      if (!fileInput.files || fileInput.files.length === 0) {
        window.PortalUI.toast('Please select a file to submit (PDF, ZIP, or DOCX).', 'warning');
        return;
      }

      // Update assignment status
      if (this.currentStudent && this.currentStudent.assignments) {
        const asg = this.currentStudent.assignments.find(a => a.id === asgId);
        if (asg) {
          asg.status = 'Submitted';
          asg.points = 'Under Review';
        }
      }

      window.PortalUI.closeModal('modal-submit-assignment');
      window.PortalUI.toast('Assignment uploaded and recorded successfully!', 'success');
      this.switchTab('assignments');
    },

    // 6. Exams Tab
    renderExams(container) {
      const s = this.currentStudent;
      const exams = s.exams || [];

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Examinations & Hall Ticket</h2>
            <p class="dash-subtitle">Spring 2026 Mid-Semester Evaluations. Please arrive 15 minutes before scheduled timing.</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.PortalUI.toast('Hall Ticket with QR authentication downloaded.', 'success')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download Hall Ticket
          </button>
        </div>

        <div class="stat-cards-grid animate-fade-in">
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Examination Hall</span>
              <span class="stat-value" style="font-size: 1.45rem;">Main Complex</span>
              <span class="stat-meta text-muted">Blocks A, B & C</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Assigned Desk / Seat</span>
              <span class="stat-value" style="color: var(--primary);">Seat B-24</span>
              <span class="stat-meta text-muted">Roll: ${s.id}</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-info">
              <span class="stat-label">Exam Clearance</span>
              <span class="stat-value" style="color: var(--success); font-size: 1.45rem;">Verified</span>
              <span class="stat-meta text-muted">Attendance requirement met (>75%)</span>
            </div>
          </div>
        </div>

        <div class="dash-widget-card animate-fade-in">
          <div class="widget-header">
            <span class="widget-title">Scheduled Examination Dates</span>
          </div>
          <div class="widget-body" style="padding: 0;">
            <div class="table-responsive-container" style="border: none;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Course Title</th>
                    <th>Date</th>
                    <th>Timing</th>
                    <th>Hall / Room</th>
                    <th>Seat No.</th>
                  </tr>
                </thead>
                <tbody>
                  ${exams.map(ex => `
                    <tr>
                      <td><strong>${ex.code}</strong></td>
                      <td>${window.PortalUI.escapeHtml(ex.title)}</td>
                      <td><strong>${ex.date}</strong></td>
                      <td class="text-muted">${ex.time}</td>
                      <td>${ex.hall}</td>
                      <td><span class="badge badge-primary">${ex.seat}</span></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // 7. Materials Tab
    renderMaterials(container) {
      const materials = window.PortalData.getStudyMaterials();

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Digital Library & Course Repository</h2>
            <p class="dash-subtitle">Verified lecture notes, laboratory manuals, question banks, and reading material.</p>
          </div>
        </div>

        <div class="dash-widget-card animate-fade-in">
          <div class="widget-header">
            <span class="widget-title">Course Documents</span>
          </div>
          <div class="widget-body" style="padding: 0;">
            <div class="table-responsive-container" style="border: none;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Resource Title</th>
                    <th>Subject</th>
                    <th>Format</th>
                    <th>Size</th>
                    <th>Updated</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${materials.map(mat => `
                    <tr>
                      <td><strong>${window.PortalUI.escapeHtml(mat.title)}</strong></td>
                      <td class="text-muted">${window.PortalUI.escapeHtml(mat.subject)}</td>
                      <td><span class="badge badge-info">${mat.type}</span></td>
                      <td class="text-muted">${mat.size}</td>
                      <td>${mat.date}</td>
                      <td>
                        <button class="btn btn-outline btn-sm" onclick="window.PortalUI.toast('Downloading ${window.PortalUI.escapeHtml(mat.title)}', 'success')">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                          Download
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    },

    // 8. Announcements Tab
    renderAnnouncements(container) {
      const announcements = window.PortalData.getAnnouncements();

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Official Announcements</h2>
            <p class="dash-subtitle">Official university directives, department notices, and campus events.</p>
          </div>
        </div>

        <div class="animate-fade-in">
          ${announcements.map(ann => `
            <div class="announcement-item mb-3">
              <div class="announcement-header">
                <div class="d-flex align-items-center gap-2">
                  <span class="badge ${ann.badgeClass}">${ann.category}</span>
                  ${ann.urgent ? '<span class="badge badge-danger">Urgent Notice</span>' : ''}
                </div>
                <span class="announcement-date">${ann.date} • Issued by ${window.PortalUI.escapeHtml(ann.author)}</span>
              </div>
              <h3 style="font-size: 1.15rem; margin: 0.4rem 0;">${window.PortalUI.escapeHtml(ann.title)}</h3>
              <p style="font-size: 0.95rem; line-height: 1.6;">${window.PortalUI.escapeHtml(ann.content)}</p>
            </div>
          `).join('')}
        </div>
      `;
    },

    // 9. Profile Settings Tab
    renderProfile(container) {
      const s = this.currentStudent;

      container.innerHTML = `
        <div class="dashboard-header-card animate-fade-in">
          <div>
            <h2 class="dash-title">Student Profile & Settings</h2>
            <p class="dash-subtitle">View your verified university identity record and security preferences.</p>
          </div>
        </div>

        <div class="dash-widgets-grid animate-fade-in">
          <!-- Identity Record -->
          <div class="dash-widget-card">
            <div class="widget-header">
              <span class="widget-title">Official Student Dossier</span>
            </div>
            <div class="widget-body">
              <div class="d-flex align-items-center gap-3 mb-4">
                <div class="avatar-preview" style="width: 60px; height: 60px; font-size: 1.5rem;">
                  ${s.fullName.charAt(0)}
                </div>
                <div>
                  <h3 style="font-size: 1.25rem;">${window.PortalUI.escapeHtml(s.fullName)}</h3>
                  <p class="text-muted" style="margin: 0;">Student ID: <strong>${s.id}</strong></p>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.25rem;">
                <div>
                  <label class="form-label text-muted">Email Address</label>
                  <p class="font-weight-bold">${window.PortalUI.escapeHtml(s.email)}</p>
                </div>
                <div>
                  <label class="form-label text-muted">Department</label>
                  <p class="font-weight-bold">${window.PortalUI.escapeHtml(s.department)}</p>
                </div>
                <div>
                  <label class="form-label text-muted">Current Semester</label>
                  <p class="font-weight-bold">${window.PortalUI.escapeHtml(s.semester)}</p>
                </div>
                <div>
                  <label class="form-label text-muted">Account Status</label>
                  <p><span class="badge badge-success">${s.status}</span></p>
                </div>
                <div>
                  <label class="form-label text-muted">Registered Contact Phone</label>
                  <p class="font-weight-bold">${s.phone || 'N/A'}</p>
                </div>
                <div>
                  <label class="form-label text-muted">Parent / Guardian</label>
                  <p class="font-weight-bold">${s.guardian || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Password Update Simulation -->
          <div class="dash-widget-card">
            <div class="widget-header">
              <span class="widget-title">Security Settings</span>
            </div>
            <div class="widget-body">
              <form onsubmit="event.preventDefault(); window.PortalUI.toast('Password update request recorded securely. In production this triggers a confirmation link to your email.', 'success');">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <input type="password" class="form-control" placeholder="••••••••" required>
                </div>
                <div class="form-group">
                  <label class="form-label">New Password</label>
                  <input type="password" class="form-control" placeholder="Minimum 8 characters" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Confirm New Password</label>
                  <input type="password" class="form-control" placeholder="Re-enter password" required>
                </div>
                <button type="submit" class="btn btn-primary w-100 mt-2">Update Password</button>
              </form>
            </div>
          </div>
        </div>
      `;
    }
  };

  window.StudentController = StudentController;
})(window);
