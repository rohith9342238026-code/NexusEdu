/**
 * STUDENT PORTAL 2026 - ADMIN DASHBOARD CONTROLLER
 * Full management of student accounts, search, filtering, CRUD modals, CSV export.
 */

(function (window) {
  'use strict';

  const AdminController = {
    searchQuery: '',
    selectedDepartment: 'ALL',
    selectedStatus: 'ALL',
    sortBy: 'id_asc',
    studentToDeleteId: null,

    init() {
      this.bindControls();
    },

    loadAdminData() {
      const session = window.PortalAuth.getSession();
      if (!session || session.role !== 'admin') return;

      this.renderAdminHeader();
      this.renderMetrics();
      this.renderStudentTable();
    },

    renderAdminHeader() {
      const admin = window.PortalData.getAdminProfile();
      const nameEl = document.getElementById('admin-display-name');
      const deptEl = document.getElementById('admin-display-dept');
      const avatarEl = document.getElementById('admin-display-avatar');

      if (nameEl) nameEl.textContent = admin.name;
      if (deptEl) deptEl.textContent = `${admin.title} • ${admin.department}`;
      if (avatarEl) avatarEl.textContent = 'ADM';
    },

    renderMetrics() {
      const students = window.PortalData.getStudents();
      const totalCount = students.length;
      const activeCount = students.filter(s => s.status === 'Active').length;
      const suspendedCount = students.filter(s => s.status === 'Suspended').length;
      const pendingCount = students.filter(s => s.status === 'Pending').length;

      const totalAtt = students.reduce((sum, s) => sum + (parseFloat(s.attendance) || 0), 0);
      const avgAttendance = totalCount > 0 ? (totalAtt / totalCount).toFixed(1) : '0';

      const totalEl = document.getElementById('admin-metric-total');
      const activeEl = document.getElementById('admin-metric-active');
      const suspendedEl = document.getElementById('admin-metric-suspended');
      const attEl = document.getElementById('admin-metric-avg-att');

      if (totalEl) totalEl.textContent = totalCount;
      if (activeEl) activeEl.textContent = activeCount;
      if (suspendedEl) suspendedEl.textContent = suspendedCount;
      if (attEl) attEl.textContent = `${avgAttendance}%`;
    },

    bindControls() {
      const searchInput = document.getElementById('admin-student-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.renderStudentTable();
        });
      }

      const deptFilter = document.getElementById('admin-dept-filter');
      if (deptFilter) {
        deptFilter.addEventListener('change', (e) => {
          this.selectedDepartment = e.target.value;
          this.renderStudentTable();
        });
      }

      const statusFilter = document.getElementById('admin-status-filter');
      if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
          this.selectedStatus = e.target.value;
          this.renderStudentTable();
        });
      }

      const sortSelect = document.getElementById('admin-sort-select');
      if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
          this.sortBy = e.target.value;
          this.renderStudentTable();
        });
      }

      // Add Student Form submit
      const addForm = document.getElementById('form-add-student');
      if (addForm) {
        addForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleCreateStudent();
        });
      }

      // Edit Student Form submit
      const editForm = document.getElementById('form-edit-student');
      if (editForm) {
        editForm.addEventListener('submit', (e) => {
          e.preventDefault();
          this.handleUpdateStudent();
        });
      }
    },

    getFilteredStudents() {
      let list = window.PortalData.getStudents();

      // Search filter (ID, Name, or Email)
      if (this.searchQuery) {
        const q = this.searchQuery;
        list = list.filter(s =>
          s.id.toLowerCase().includes(q) ||
          s.fullName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q)
        );
      }

      // Department filter
      if (this.selectedDepartment && this.selectedDepartment !== 'ALL') {
        list = list.filter(s => s.department === this.selectedDepartment);
      }

      // Status filter
      if (this.selectedStatus && this.selectedStatus !== 'ALL') {
        list = list.filter(s => s.status === this.selectedStatus);
      }

      // Sorting
      list.sort((a, b) => {
        if (this.sortBy === 'name_asc') return a.fullName.localeCompare(b.fullName);
        if (this.sortBy === 'name_desc') return b.fullName.localeCompare(a.fullName);
        if (this.sortBy === 'id_asc') return a.id.localeCompare(b.id);
        if (this.sortBy === 'id_desc') return b.id.localeCompare(a.id);
        if (this.sortBy === 'cgpa_desc') return (b.cgpa || 0) - (a.cgpa || 0);
        if (this.sortBy === 'att_desc') return (b.attendance || 0) - (a.attendance || 0);
        return 0;
      });

      return list;
    },

    renderStudentTable() {
      const container = document.getElementById('admin-student-tbody');
      const countEl = document.getElementById('admin-filtered-count');
      if (!container) return;

      const students = this.getFilteredStudents();
      if (countEl) {
        countEl.textContent = `Showing ${students.length} student${students.length === 1 ? '' : 's'}`;
      }

      if (students.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="7">
              <div class="empty-state">
                <div class="empty-state-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                </div>
                <div class="empty-state-title">No student accounts found</div>
                <p class="empty-state-desc">Try clearing your search query or reset the department and status filters.</p>
                <button class="btn btn-secondary btn-sm mt-2" onclick="window.AdminController.resetFilters()">
                  Reset Search & Filters
                </button>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      container.innerHTML = students.map(s => {
        let statusBadge = 'badge-success';
        if (s.status === 'Suspended') statusBadge = 'badge-danger';
        if (s.status === 'Pending') statusBadge = 'badge-warning';

        return `
          <tr>
            <td>
              <strong>${window.PortalUI.escapeHtml(s.id)}</strong>
            </td>
            <td>
              <div class="d-flex align-items-center gap-2">
                <div class="avatar-preview" style="width: 30px; height: 30px; font-size: 0.8rem;">
                  ${window.PortalUI.escapeHtml(s.fullName.charAt(0))}
                </div>
                <span class="font-weight-bold">${window.PortalUI.escapeHtml(s.fullName)}</span>
              </div>
            </td>
            <td>
              <span class="text-muted">${window.PortalUI.escapeHtml(s.email)}</span>
            </td>
            <td>
              <span class="badge badge-primary">${window.PortalUI.escapeHtml(s.department)}</span>
            </td>
            <td>${window.PortalUI.escapeHtml(s.semester)}</td>
            <td>
              <span class="badge ${statusBadge}">
                <span class="badge-dot"></span>
                ${window.PortalUI.escapeHtml(s.status)}
              </span>
            </td>
            <td>
              <div class="table-actions">
                <button class="btn btn-secondary btn-sm" title="View Dossier" onclick="window.AdminController.openViewModal('${s.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  View
                </button>
                <button class="btn btn-outline btn-sm" title="Edit Student" onclick="window.AdminController.openEditModal('${s.id}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Edit
                </button>
                <button class="btn btn-ghost btn-sm text-danger" title="Delete Student" onclick="window.AdminController.openDeleteModal('${s.id}', '${window.PortalUI.escapeHtml(s.fullName)}')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    },

    resetFilters() {
      this.searchQuery = '';
      this.selectedDepartment = 'ALL';
      this.selectedStatus = 'ALL';
      this.sortBy = 'id_asc';

      const searchInput = document.getElementById('admin-student-search');
      const deptFilter = document.getElementById('admin-dept-filter');
      const statusFilter = document.getElementById('admin-status-filter');
      const sortSelect = document.getElementById('admin-sort-select');

      if (searchInput) searchInput.value = '';
      if (deptFilter) deptFilter.value = 'ALL';
      if (statusFilter) statusFilter.value = 'ALL';
      if (sortSelect) sortSelect.value = 'id_asc';

      this.renderStudentTable();
    },

    // Modal: Add Student
    openAddModal() {
      const form = document.getElementById('form-add-student');
      if (form) form.reset();
      window.PortalUI.openModal('modal-add-student');
    },

    handleCreateStudent() {
      try {
        const fullName = document.getElementById('add-student-name').value;
        const email = document.getElementById('add-student-email').value;
        const department = document.getElementById('add-student-dept').value;
        const semester = document.getElementById('add-student-sem').value;
        const status = document.getElementById('add-student-status').value;
        const phone = document.getElementById('add-student-phone').value;
        const cgpa = document.getElementById('add-student-cgpa').value;

        const created = window.PortalData.addStudent({
          fullName,
          email,
          department,
          semester,
          status,
          phone,
          cgpa
        });

        window.PortalUI.closeModal('modal-add-student');
        window.PortalUI.toast(`Account for ${created.fullName} (${created.id}) created successfully!`, 'success');
        this.renderMetrics();
        this.renderStudentTable();
      } catch (err) {
        window.PortalUI.toast(err.message, 'error');
      }
    },

    // Modal: Edit Student
    openEditModal(id) {
      const student = window.PortalData.getStudentById(id);
      if (!student) {
        window.PortalUI.toast('Student record not found.', 'error');
        return;
      }

      document.getElementById('edit-student-id').value = student.id;
      document.getElementById('edit-student-display-id').textContent = student.id;
      document.getElementById('edit-student-name').value = student.fullName;
      document.getElementById('edit-student-email').value = student.email;
      document.getElementById('edit-student-dept').value = student.department;
      document.getElementById('edit-student-sem').value = student.semester;
      document.getElementById('edit-student-status').value = student.status;
      document.getElementById('edit-student-phone').value = student.phone || '';
      document.getElementById('edit-student-cgpa').value = student.cgpa || '';

      window.PortalUI.openModal('modal-edit-student');
    },

    handleUpdateStudent() {
      try {
        const id = document.getElementById('edit-student-id').value;
        const fullName = document.getElementById('edit-student-name').value;
        const email = document.getElementById('edit-student-email').value;
        const department = document.getElementById('edit-student-dept').value;
        const semester = document.getElementById('edit-student-sem').value;
        const status = document.getElementById('edit-student-status').value;
        const phone = document.getElementById('edit-student-phone').value;
        const cgpa = parseFloat(document.getElementById('edit-student-cgpa').value) || 8.0;

        window.PortalData.updateStudent(id, {
          fullName,
          email,
          department,
          semester,
          status,
          phone,
          cgpa
        });

        window.PortalUI.closeModal('modal-edit-student');
        window.PortalUI.toast(`Record for ${fullName} updated successfully.`, 'success');
        this.renderMetrics();
        this.renderStudentTable();
      } catch (err) {
        window.PortalUI.toast(err.message, 'error');
      }
    },

    // Modal: View Student Dossier
    openViewModal(id) {
      const s = window.PortalData.getStudentById(id);
      if (!s) return;

      const body = document.getElementById('view-student-modal-body');
      if (body) {
        body.innerHTML = `
          <div class="d-flex align-items-center gap-3 mb-4">
            <div class="avatar-preview" style="width: 54px; height: 54px; font-size: 1.3rem;">
              ${window.PortalUI.escapeHtml(s.fullName.charAt(0))}
            </div>
            <div>
              <h3 style="font-size: 1.25rem; margin-bottom: 0.15rem;">${window.PortalUI.escapeHtml(s.fullName)}</h3>
              <p class="text-muted" style="margin: 0;">ID: <strong>${s.id}</strong> • Status: <span class="badge ${s.status === 'Active' ? 'badge-success' : s.status === 'Suspended' ? 'badge-danger' : 'badge-warning'}">${s.status}</span></p>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; font-size: 0.9rem;">
            <div>
              <label class="form-label text-muted">Email Address</label>
              <p class="font-weight-bold">${window.PortalUI.escapeHtml(s.email)}</p>
            </div>
            <div>
              <label class="form-label text-muted">Academic Department</label>
              <p class="font-weight-bold">${window.PortalUI.escapeHtml(s.department)}</p>
            </div>
            <div>
              <label class="form-label text-muted">Current Semester</label>
              <p class="font-weight-bold">${window.PortalUI.escapeHtml(s.semester)}</p>
            </div>
            <div>
              <label class="form-label text-muted">Academic Standing</label>
              <p class="font-weight-bold">CGPA: ${s.cgpa ? s.cgpa.toFixed(2) : 'N/A'} • Attendance: ${s.attendance || 'N/A'}%</p>
            </div>
            <div>
              <label class="form-label text-muted">Phone Number</label>
              <p class="font-weight-bold">${s.phone || 'Not recorded'}</p>
            </div>
            <div>
              <label class="form-label text-muted">Parent / Guardian</label>
              <p class="font-weight-bold">${s.guardian || 'Not recorded'}</p>
            </div>
            <div style="grid-column: span 2;">
              <label class="form-label text-muted">Enrollment / Join Date</label>
              <p class="font-weight-bold">${s.joinDate || '2024-08-10'}</p>
            </div>
          </div>
        `;
      }

      window.PortalUI.openModal('modal-view-student');
    },

    // Modal: Delete Confirmation
    openDeleteModal(id, name) {
      this.studentToDeleteId = id;
      const nameEl = document.getElementById('delete-modal-student-name');
      if (nameEl) nameEl.textContent = `${name} (${id})`;
      window.PortalUI.openModal('modal-confirm-delete');
    },

    confirmDeleteStudent() {
      if (!this.studentToDeleteId) return;

      try {
        window.PortalData.deleteStudent(this.studentToDeleteId);
        window.PortalUI.closeModal('modal-confirm-delete');
        window.PortalUI.toast(`Student account ${this.studentToDeleteId} deleted successfully.`, 'info');
        this.studentToDeleteId = null;
        this.renderMetrics();
        this.renderStudentTable();
      } catch (err) {
        window.PortalUI.toast(err.message, 'error');
      }
    },

    // Export CSV
    exportCSV() {
      try {
        window.PortalData.exportStudentsToCSV();
        window.PortalUI.toast('Student records exported to CSV successfully.', 'success');
      } catch (err) {
        window.PortalUI.toast('Failed to generate CSV export.', 'error');
      }
    }
  };

  window.AdminController = AdminController;
})(window);
