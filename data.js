/**
 * STUDENT PORTAL 2026 - DATA STORAGE & REPOSITORY MODULE
 * Manages LocalStorage persistence, data integrity, validation, and demo mock data.
 */

(function (window) {
  'use strict';

  const STORAGE_KEYS = {
    STUDENTS: 'sp_portal_students_v1',
    ADMIN: 'sp_portal_admin_v1',
    SETTINGS: 'sp_portal_settings_v1',
    ANNOUNCEMENTS: 'sp_portal_announcements_v1',
    AUTH_SESSION: 'sp_portal_auth_session_v1'
  };

  // Initial Seed Data for Academic Demonstration
  const INITIAL_STUDENTS = [
    {
      id: 'STU2024001',
      fullName: 'Alex Turner',
      email: 'alex.turner@campus.edu',
      department: 'Computer Science & Engineering',
      semester: '6th Semester',
      status: 'Active',
      cgpa: 8.92,
      attendance: 88.5,
      phone: '+1 (555) 234-5678',
      dob: '2003-04-12',
      guardian: 'Sarah Turner (Mother)',
      joinDate: '2023-08-15',
      address: '42 Academic Way, Silicon Valley, CA',
      creditsEarned: 125,
      totalCredits: 160,
      subjects: [
        { code: 'CSE301', name: 'Advanced Algorithms', faculty: 'Dr. Alan Turing', attended: 42, total: 46, credits: 4, grade: 'A+' },
        { code: 'CSE302', name: 'Database Management Systems', faculty: 'Prof. Grace Hopper', attended: 38, total: 44, credits: 4, grade: 'A' },
        { code: 'CSE303', name: 'Cloud Computing & DevOps', faculty: 'Dr. James Gosling', attended: 35, total: 40, credits: 3, grade: 'O' },
        { code: 'CSE304', name: 'Machine Learning Foundations', faculty: 'Prof. Andrew Ng', attended: 44, total: 48, credits: 4, grade: 'A+' },
        { code: 'CSE305', name: 'Software Engineering & Agile', faculty: 'Dr. Martin Fowler', attended: 39, total: 45, credits: 3, grade: 'A' },
        { code: 'CSE306', name: 'Web Technologies Lab', faculty: 'Prof. Tim Berners-Lee', attended: 26, total: 28, credits: 2, grade: 'O' }
      ],
      semesterGrades: [
        { sem: 'Semester 1', gpa: 8.60, credits: 24, status: 'Completed' },
        { sem: 'Semester 2', gpa: 8.75, credits: 24, status: 'Completed' },
        { sem: 'Semester 3', gpa: 9.10, credits: 26, status: 'Completed' },
        { sem: 'Semester 4', gpa: 8.95, credits: 25, status: 'Completed' },
        { sem: 'Semester 5', gpa: 9.20, credits: 26, status: 'Completed' },
        { sem: 'Semester 6', gpa: 8.92, credits: 20, status: 'Ongoing' }
      ],
      assignments: [
        { id: 'ASG-101', title: 'Distributed Systems Lab 4: Consensus Raft', subject: 'Cloud Computing & DevOps', dueDate: '2026-10-18', status: 'Pending', points: '100' },
        { id: 'ASG-102', title: 'B+ Tree Indexing & Query Optimization', subject: 'Database Management Systems', dueDate: '2026-10-12', status: 'Submitted', points: '96/100' },
        { id: 'ASG-103', title: 'Convolutional Neural Networks for Vision', subject: 'Machine Learning Foundations', dueDate: '2026-10-22', status: 'Pending', points: '100' },
        { id: 'ASG-104', title: 'Microservices Deployment on Kubernetes', subject: 'Software Engineering & Agile', dueDate: '2026-10-05', status: 'Submitted', points: '98/100' }
      ],
      exams: [
        { code: 'CSE301', title: 'Advanced Algorithms', date: '2026-11-04', time: '10:00 AM - 01:00 PM', hall: 'Hall B - Room 204', seat: 'B24' },
        { code: 'CSE302', title: 'Database Management Systems', date: '2026-11-07', time: '10:00 AM - 01:00 PM', hall: 'Hall B - Room 204', seat: 'B24' },
        { code: 'CSE304', title: 'Machine Learning Foundations', date: '2026-11-10', time: '02:00 PM - 05:00 PM', hall: 'Hall A - Room 102', seat: 'A18' },
        { code: 'CSE303', title: 'Cloud Computing & DevOps', date: '2026-11-13', time: '10:00 AM - 01:00 PM', hall: 'Hall C - Room 301', seat: 'C12' }
      ]
    },
    {
      id: 'STU2024002',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@campus.edu',
      department: 'Information Technology',
      semester: '6th Semester',
      status: 'Active',
      cgpa: 9.35,
      attendance: 94.2,
      phone: '+1 (555) 345-6789',
      dob: '2003-08-20',
      guardian: 'Rajesh Sharma',
      joinDate: '2023-08-15',
      address: '77 Innovation Blvd, Austin, TX',
      creditsEarned: 125,
      totalCredits: 160
    },
    {
      id: 'STU2024003',
      fullName: 'Marcus Chen',
      email: 'marcus.chen@campus.edu',
      department: 'Electronics & Communication',
      semester: '4th Semester',
      status: 'Active',
      cgpa: 8.40,
      attendance: 81.0,
      phone: '+1 (555) 456-7890',
      dob: '2004-02-15',
      guardian: 'David Chen',
      joinDate: '2024-08-10',
      address: '108 Tech Ridge, Seattle, WA',
      creditsEarned: 75,
      totalCredits: 160
    },
    {
      id: 'STU2024004',
      fullName: 'Sarah Jenkins',
      email: 'sarah.j@campus.edu',
      department: 'Mechanical Engineering',
      semester: '6th Semester',
      status: 'Suspended',
      cgpa: 7.15,
      attendance: 68.4,
      phone: '+1 (555) 567-8901',
      dob: '2003-11-30',
      guardian: 'Thomas Jenkins',
      joinDate: '2023-08-15',
      address: '15 Industrial Parkway, Detroit, MI',
      creditsEarned: 110,
      totalCredits: 160
    },
    {
      id: 'STU2024005',
      fullName: 'David Miller',
      email: 'david.m@campus.edu',
      department: 'Civil Engineering',
      semester: '2nd Semester',
      status: 'Active',
      cgpa: 8.10,
      attendance: 85.0,
      phone: '+1 (555) 678-9012',
      dob: '2005-01-08',
      guardian: 'Karen Miller',
      joinDate: '2025-08-12',
      address: '33 Cornerstone Road, Denver, CO',
      creditsEarned: 24,
      totalCredits: 160
    },
    {
      id: 'STU2024006',
      fullName: 'Aisha Patel',
      email: 'aisha.p@campus.edu',
      department: 'Computer Science & Engineering',
      semester: '4th Semester',
      status: 'Active',
      cgpa: 9.60,
      attendance: 96.5,
      phone: '+1 (555) 789-0123',
      dob: '2004-06-18',
      guardian: 'Farooq Patel',
      joinDate: '2024-08-10',
      address: '89 Maple Ave, Boston, MA',
      creditsEarned: 78,
      totalCredits: 160
    },
    {
      id: 'STU2024007',
      fullName: 'Liam O\'Connor',
      email: 'liam.oc@campus.edu',
      department: 'Electrical Engineering',
      semester: '6th Semester',
      status: 'Pending',
      cgpa: 7.80,
      attendance: 74.2,
      phone: '+1 (555) 890-1234',
      dob: '2003-09-04',
      guardian: 'Sean O\'Connor',
      joinDate: '2023-08-15',
      address: '12 Harbor Point, Chicago, IL',
      creditsEarned: 118,
      totalCredits: 160
    },
    {
      id: 'STU2024008',
      fullName: 'Elena Rostova',
      email: 'elena.r@campus.edu',
      department: 'Biotechnology',
      semester: '4th Semester',
      status: 'Active',
      cgpa: 8.85,
      attendance: 91.0,
      phone: '+1 (555) 901-2345',
      dob: '2004-10-25',
      guardian: 'Yuri Rostov',
      joinDate: '2024-08-10',
      address: '50 BioScience Drive, San Diego, CA',
      creditsEarned: 76,
      totalCredits: 160
    }
  ];

  const INITIAL_ADMIN = {
    id: 'ADM001',
    name: 'Dr. Robert Vance',
    email: 'admin@campus.edu',
    title: 'Dean of Academic Affairs & Systems Administrator',
    department: 'University Administration',
    lastLogin: '2026-10-13 09:30'
  };

  const INITIAL_ANNOUNCEMENTS = [
    {
      id: 'ANN-2026-01',
      title: 'Spring Semester Mid-Term Examination Schedule Released',
      category: 'Academic',
      badgeClass: 'badge-primary',
      date: 'Oct 12, 2026',
      author: 'Office of the Controller of Examinations',
      content: 'The official schedule for the Spring 2026 Mid-term evaluations has been finalized. Students can view room assignments, hall ticket details, and instructions on their exam portal.',
      urgent: true
    },
    {
      id: 'ANN-2026-02',
      title: 'Annual Innovation Expo & Hackathon 2026 Registration Open',
      category: 'Event',
      badgeClass: 'badge-success',
      date: 'Oct 10, 2026',
      author: 'Center for Student Innovation',
      content: 'Registrations are now open for the 48-hour Campus Hackathon with $25,000 in project grants and mentorship from leading tech giants. Form teams of 2 to 4 members before Oct 25.',
      urgent: false
    },
    {
      id: 'ANN-2026-03',
      title: 'Central Digital Library Upgraded to IEEE & ACM Full Access',
      category: 'Resource',
      badgeClass: 'badge-info',
      date: 'Oct 08, 2026',
      author: 'University Library System',
      content: 'All enrolled undergraduate and postgraduate students now have unlimited off-campus proxy access to IEEE Xplore, ACM Digital Library, and Springer Nature through student credentials.',
      urgent: false
    },
    {
      id: 'ANN-2026-04',
      title: 'Campus Placement Drive: Top Tier-1 Tech Partners Visiting Next Month',
      category: 'Placement',
      badgeClass: 'badge-warning',
      date: 'Oct 04, 2026',
      author: 'Department of Training & Placement',
      content: 'Recruitment drives for final and pre-final year students commence early November. Ensure your academic profile, resume, and CGPA clearance are verified with the admin desk.',
      urgent: false
    }
  ];

  const TIMETABLE_SCHEDULE = {
    Monday: [
      { time: '09:00 - 10:15 AM', subject: 'Advanced Algorithms', room: 'Lecture Hall A-102', faculty: 'Dr. Alan Turing', type: 'Lecture' },
      { time: '10:30 - 11:45 AM', subject: 'Database Management Systems', room: 'Seminar Hall 3', faculty: 'Prof. Grace Hopper', type: 'Lecture' },
      { time: '12:00 - 01:00 PM', subject: 'Academic Lunch & Peer Mentoring', room: 'Student Commons', faculty: 'Open', type: 'Break' },
      { time: '01:15 - 03:15 PM', subject: 'Web Technologies Lab', room: 'Systems Lab 304', faculty: 'Prof. Tim Berners-Lee', type: 'Laboratory' },
      { time: '03:30 - 04:30 PM', subject: 'Faculty Office Hours & Consultation', room: 'Faculty Block B-12', faculty: 'Dr. Alan Turing', type: 'Tutorial' }
    ],
    Tuesday: [
      { time: '09:00 - 10:15 AM', subject: 'Machine Learning Foundations', room: 'Lecture Hall B-201', faculty: 'Prof. Andrew Ng', type: 'Lecture' },
      { time: '10:30 - 11:45 AM', subject: 'Cloud Computing & DevOps', room: 'Lecture Hall A-102', faculty: 'Dr. James Gosling', type: 'Lecture' },
      { time: '12:00 - 01:00 PM', subject: 'Academic Lunch Break', room: 'Dining Hall', faculty: 'Open', type: 'Break' },
      { time: '01:15 - 02:45 PM', subject: 'Software Engineering & Agile', room: 'Seminar Hall 1', faculty: 'Dr. Martin Fowler', type: 'Lecture' },
      { time: '03:00 - 04:30 PM', subject: 'Capstone Project Review', room: 'Innovation Lab 101', faculty: 'Project Advisory Board', type: 'Project' }
    ],
    Wednesday: [
      { time: '09:00 - 10:15 AM', subject: 'Database Management Systems', room: 'Lecture Hall A-102', faculty: 'Prof. Grace Hopper', type: 'Lecture' },
      { time: '10:30 - 11:45 AM', subject: 'Advanced Algorithms', room: 'Lecture Hall A-102', faculty: 'Dr. Alan Turing', type: 'Lecture' },
      { time: '12:00 - 01:00 PM', subject: 'Academic Lunch Break', room: 'Dining Hall', faculty: 'Open', type: 'Break' },
      { time: '01:15 - 04:15 PM', subject: 'Machine Learning Practical Lab', room: 'AI Computing Hub 202', faculty: 'Prof. Andrew Ng', type: 'Laboratory' }
    ],
    Thursday: [
      { time: '09:00 - 10:15 AM', subject: 'Cloud Computing & DevOps', room: 'Lecture Hall B-201', faculty: 'Dr. James Gosling', type: 'Lecture' },
      { time: '10:30 - 11:45 AM', subject: 'Software Engineering & Agile', room: 'Seminar Hall 1', faculty: 'Dr. Martin Fowler', type: 'Lecture' },
      { time: '12:00 - 01:00 PM', subject: 'Academic Lunch Break', room: 'Dining Hall', faculty: 'Open', type: 'Break' },
      { time: '01:15 - 03:00 PM', subject: 'Seminar on Ethical AI & Society', room: 'Auditorium West', faculty: 'Guest Speaker', type: 'Seminar' }
    ],
    Friday: [
      { time: '09:00 - 10:30 AM', subject: 'Advanced Algorithms Tutorial', room: 'Lecture Hall A-102', faculty: 'Dr. Alan Turing', type: 'Tutorial' },
      { time: '10:45 - 12:15 PM', subject: 'Cloud & Kubernetes Workshop', room: 'Cloud Lab 405', faculty: 'Dr. James Gosling', type: 'Workshop' },
      { time: '12:15 - 01:15 PM', subject: 'Academic Lunch Break', room: 'Dining Hall', faculty: 'Open', type: 'Break' },
      { time: '01:30 - 03:30 PM', subject: 'Student Clubs & Technical Societies', room: 'Campus Quad', faculty: 'Student Council', type: 'Activity' }
    ],
    Saturday: [
      { time: '10:00 - 12:00 PM', subject: 'Remedial Classes & Doubt Clearing', room: 'Online / Room 105', faculty: 'Department Faculty', type: 'Optional' },
      { time: '01:00 - 03:00 PM', subject: 'Competitive Programming League', room: 'Coding Arena', faculty: 'CS Club', type: 'Club' }
    ]
  };

  const STUDY_MATERIALS = [
    { title: 'Advanced Algorithms - Graph Theory & Dynamic Programming', subject: 'Advanced Algorithms', type: 'PDF', size: '4.2 MB', date: 'Oct 02, 2026' },
    { title: 'DBMS Relational Calculus & Concurrency Control Slides', subject: 'Database Management Systems', type: 'PPTX', size: '7.8 MB', date: 'Sep 28, 2026' },
    { title: 'Deep Learning with PyTorch: Lecture Notes Week 1-6', subject: 'Machine Learning Foundations', type: 'PDF', size: '12.5 MB', date: 'Oct 05, 2026' },
    { title: 'Docker & Kubernetes Hands-on Production Manual', subject: 'Cloud Computing & DevOps', type: 'PDF', size: '6.1 MB', date: 'Sep 25, 2026' },
    { title: 'Agile & Scrum Best Practices in Enterprise Software', subject: 'Software Engineering & Agile', type: 'PDF', size: '3.4 MB', date: 'Sep 20, 2026' }
  ];

  // Repository Service
  const PortalData = {
    // Initialize LocalStorage with seed data if not present, preserving existing
    init() {
      try {
        if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
          localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(INITIAL_STUDENTS));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ADMIN)) {
          localStorage.setItem(STORAGE_KEYS.ADMIN, JSON.stringify(INITIAL_ADMIN));
        }
        if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
          localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(INITIAL_ANNOUNCEMENTS));
        }
      } catch (err) {
        console.error('LocalStorage initialization error:', err);
      }
    },

    // Students CRUD
    getStudents() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.STUDENTS);
        return raw ? JSON.parse(raw) : INITIAL_STUDENTS;
      } catch (err) {
        console.error('Error fetching students:', err);
        return INITIAL_STUDENTS;
      }
    },

    getStudentById(id) {
      const students = this.getStudents();
      return students.find(s => s.id.toLowerCase() === id.trim().toLowerCase()) || null;
    },

    getStudentByEmailOrId(query) {
      const q = query.trim().toLowerCase();
      const students = this.getStudents();
      return students.find(s => s.email.toLowerCase() === q || s.id.toLowerCase() === q) || null;
    },

    addStudent(data) {
      const students = this.getStudents();

      // Validation
      if (!data.fullName || !data.fullName.trim()) {
        throw new Error('Full Name is required.');
      }
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('A valid email address is required.');
      }
      if (!data.department || !data.department.trim()) {
        throw new Error('Department is required.');
      }

      // Check duplicates
      const emailExists = students.some(s => s.email.toLowerCase() === data.email.trim().toLowerCase());
      if (emailExists) {
        throw new Error(`A student with email "${data.email}" already exists.`);
      }

      // Generate ID if not provided
      let id = data.id && data.id.trim() ? data.id.trim().toUpperCase() : null;
      if (id) {
        const idExists = students.some(s => s.id.toUpperCase() === id);
        if (idExists) {
          throw new Error(`Student ID "${id}" is already registered.`);
        }
      } else {
        const nextNum = students.length + 1;
        id = `STU2024${String(nextNum).padStart(3, '0')}`;
      }

      const newStudent = {
        id: id,
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        department: data.department.trim(),
        semester: data.semester || '1st Semester',
        status: data.status || 'Active',
        cgpa: parseFloat(data.cgpa) || 8.0,
        attendance: parseFloat(data.attendance) || 85.0,
        phone: data.phone || '+1 (555) 000-0000',
        dob: data.dob || '2004-01-01',
        guardian: data.guardian || 'Guardian Name',
        joinDate: new Date().toISOString().split('T')[0],
        address: data.address || 'Campus Residence',
        creditsEarned: 24,
        totalCredits: 160,
        subjects: INITIAL_STUDENTS[0].subjects, // default course template
        semesterGrades: [{ sem: data.semester || '1st Semester', gpa: parseFloat(data.cgpa) || 8.0, credits: 24, status: 'Ongoing' }],
        assignments: INITIAL_STUDENTS[0].assignments,
        exams: INITIAL_STUDENTS[0].exams
      };

      students.unshift(newStudent);
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      return newStudent;
    },

    updateStudent(id, fields) {
      const students = this.getStudents();
      const index = students.findIndex(s => s.id.toUpperCase() === id.toUpperCase());
      if (index === -1) {
        throw new Error(`Student with ID "${id}" not found.`);
      }

      // Check email uniqueness if email changed
      if (fields.email) {
        const emailLower = fields.email.trim().toLowerCase();
        const conflict = students.some((s, idx) => idx !== index && s.email.toLowerCase() === emailLower);
        if (conflict) {
          throw new Error(`Email "${fields.email}" is already used by another student.`);
        }
        fields.email = emailLower;
      }

      students[index] = { ...students[index], ...fields };
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
      return students[index];
    },

    deleteStudent(id) {
      const students = this.getStudents();
      const initialLen = students.length;
      const filtered = students.filter(s => s.id.toUpperCase() !== id.toUpperCase());
      if (filtered.length === initialLen) {
        throw new Error(`Student with ID "${id}" not found.`);
      }
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(filtered));
      return true;
    },

    // Announcements
    getAnnouncements() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
        return raw ? JSON.parse(raw) : INITIAL_ANNOUNCEMENTS;
      } catch (err) {
        return INITIAL_ANNOUNCEMENTS;
      }
    },

    // Timetable
    getTimetable() {
      return TIMETABLE_SCHEDULE;
    },

    // Study Materials
    getStudyMaterials() {
      return STUDY_MATERIALS;
    },

    // Admin Profile
    getAdminProfile() {
      try {
        const raw = localStorage.getItem(STORAGE_KEYS.ADMIN);
        return raw ? JSON.parse(raw) : INITIAL_ADMIN;
      } catch (err) {
        return INITIAL_ADMIN;
      }
    },

    // Export non-sensitive student data to CSV (never exposes passwords/secrets)
    exportStudentsToCSV() {
      const students = this.getStudents();
      const headers = ['Student ID', 'Full Name', 'Email Address', 'Department', 'Semester', 'Account Status', 'CGPA', 'Attendance %'];
      const rows = students.map(s => [
        `"${s.id}"`,
        `"${s.fullName.replace(/"/g, '""')}"`,
        `"${s.email}"`,
        `"${s.department.replace(/"/g, '""')}"`,
        `"${s.semester}"`,
        `"${s.status}"`,
        `"${s.cgpa || 'N/A'}"`,
        `"${s.attendance || 'N/A'}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Student_Records_Export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Expose to window
  window.PortalData = PortalData;
  PortalData.init();
})(window);
