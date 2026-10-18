# NexusEdu — Modern Student & Academic Portal (2026 Edition)

An enterprise-grade, fully responsive academic portal featuring **separate Student and Admin authentication**, a modern 2026 SaaS landing page, dark/light theme switching, and an administrative control center for student management.

---

## 🚀 Quick Start

1. **Launch Directly in Any Browser**:
   Open [`index.html`](file:///C:/Users/Rohith/.gemini/antigravity/scratch/student-portal/index.html) by double-clicking it on Windows or serving it via:
   ```bash
   # From C:\Users\Rohith\.gemini\antigravity\scratch\student-portal
   npx serve .
   # or Python HTTP server:
   python -m http.server 8000
   ```

2. **Copying to Your Desktop Workspace**:
   If you wish to place this upgraded codebase into your OneDrive Desktop folder (`c:\Users\Rohith\OneDrive\Desktop\rxhith`), simply copy the contents of `C:\Users\Rohith\.gemini\antigravity\scratch\student-portal` into that folder.

---

## 🔐 Credentials for Interactive Testing

### 1. Student Portal
* **Identifier (Email or Student ID)**: `alex.turner@campus.edu` or `STU2024001`
* **Password**: `student123`
* **Convenience**: Click the **⚡ Quick Demo** button on the Student Login screen to autofill.
* **Role Rights**: Access to personal attendance tracking, semester grade sheets, weekly timetable, assignment submission, exam schedules, and study materials. Cannot access administrator routes.

### 2. Admin Portal
* **Email**: `admin@campus.edu`
* **Password**: `admin123`
* **Convenience**: Click the **⚡ Quick Demo** button on the Admin Login screen to autofill.
* **Role Rights**: Full student management directory (Search, Filter, Add, Edit, Delete, View Dossier, Export to CSV).
* **Security Enforcement**: Students attempting to sign into the Admin portal will be rejected with an authorization error. Student passwords are strictly concealed from admin views.

---

## 📁 File Structure

```
student-portal/
├── index.html               # Single Page Application (Home, Auth, Student & Admin Dashboards, Modals)
├── README.md                # Documentation and architectural guide
├── css/
│   ├── styles.css           # Core design system tokens (2026), themes, buttons, cards, toasts, modals
│   ├── home.css             # Public landing page, hero section, metrics strip, features, footer
│   └── dashboard.css        # Student & Admin layouts, responsive sidebar, tables, stat cards, timetable
└── js/
    ├── data.js              # Repository layer, LocalStorage persistence, seed data, validation, CSV export
    ├── theme.js             # Dark/Light theme controller with system preference detection
    ├── auth.js              # Role-based authentication manager and route guard
    ├── ui.js                # Toast notifications, modal controller, mobile drawer, password toggles
    ├── student.js           # Student dashboard controller (attendance, grades, timetable, assignments)
    ├── admin.js             # Admin dashboard controller (CRUD modals, search, department filters, CSV export)
    └── app.js               # Application router and event orchestrator
```

---

## 🎨 Key Features & 2026 UI/UX Design System

1. **Modern SaaS Landing Page (First Screen)**:
   * Academic Hero Section: *"Your Education, One Place."*
   * Direct CTAs: Prominent **Student Login** and **Admin Login** buttons.
   * Interactive Student Card Preview with live class alerts and GPA badges.
   * Institutional Metrics Banner (15,000+ Enrolled, 99.8% Uptime).
   * Feature showcases for attendance, results, timetables, assignments, announcements, and study library.
   * Helpdesk contact form with instant toast feedback.

2. **Student Dashboard**:
   * **Personalized Greeting**: Name, Department, Semester, and Roll ID.
   * **Attendance Monitor**: Subject-wise percentage, warning badges for <75% shortage, progress rings.
   * **Results & CGPA**: Cumulative GPA progression, semester breakdown (Sem 1 to 6), course letter grades.
   * **Weekly Timetable**: Interactive Day switcher (Mon–Sat), lecture timings, room locations, faculty info.
   * **Assignments**: Pending/Submitted filters, deadline badges, and file upload modal simulator.
   * **Examinations**: Scheduled dates, halls, seat numbers, and hall ticket download.
   * **Study Materials**: Searchable PDF lecture notes and repository links.
   * **Announcements**: Category-tagged circulars (Academic, Hackathons, Placements).

3. **Admin Dashboard**:
   * **Live Metrics**: Enrolled student count, active vs. suspended status counts, department average attendance.
   * **Management Table**: Student ID, Full Name, Email, Department, Semester, Status, Actions.
   * **Real-Time Filtering**: Instant text search across name, email, or ID; department filter; status filter; multi-attribute sorting.
   * **Add Student Modal**: Validation prevents duplicate emails and IDs; assigns default credentials.
   * **Edit Student Modal**: In-place modification of student attributes.
   * **Delete Confirmation Modal**: Safeguard preventing accidental student deletions.
   * **Student Dossier Modal**: Comprehensive profile viewer.
   * **CSV Export**: Browser download of non-sensitive student rosters.

4. **Dark and Light Themes**:
   * Built with CSS custom properties (`data-theme="light"` / `data-theme="dark"`).
   * Prevents flash of unstyled theme via inline `<head>` script.
   * Persisted across browser sessions with OS system preference fallback (`prefers-color-scheme`).

5. **Cross-Device Responsiveness (320px to 1920px+)**:
   * **Mobile (320px–767px)**: Compact topbars, sliding drawer navigation, touch-accessible cards, responsive tables.
   * **Tablet (768px–1023px)**: Collapsible sidebar, optimized dual-column grid.
   * **Laptop/Desktop (1024px+)**: Fixed modern sidebar, multi-column metrics, roomy tables.

---

## 🛡️ Production Security Architecture Recommendations

For migrating from this interactive frontend prototype to a production deployment:
1. **Authentication**: Replace client-side session tokens with server-signed `HttpOnly` Secure JWT cookies.
2. **Password Security**: Hash passwords on the backend using `bcrypt` or `Argon2id` (work factor $\ge 12$).
3. **Authorization**: Implement server-side middleware (e.g. `verifyRole(['admin'])`) for all student write endpoints.
4. **Data Store**: Connect backend to PostgreSQL / MySQL with unique constraints on `email` and `student_id`.
