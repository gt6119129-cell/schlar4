import { AdminNavItem } from './adminNavigation';

export const TEACHER_NAVIGATION: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: "Today's teaching schedule, next upcoming class, attendance tasks, and assignment queue",
  },
  {
    id: 'my-classes',
    label: 'My Classes',
    icon: 'Users',
    isFolder: false,
    requiredPermission: 'students.view',
    description: 'Assigned teaching cohorts, student roster profiles, learning accommodations, and seats',
  },
  {
    id: 'my-timetable',
    label: 'My Timetable',
    icon: 'CalendarDays',
    isFolder: false,
    requiredPermission: 'timetable.view',
    description: 'Weekly teaching schedule, assigned rooms, prep hours, and lab duty periods',
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: 'CheckSquare',
    isFolder: false,
    requiredPermission: 'attendance.create',
    description: 'Period-wise roll-call taking, attendance logs, and late arrival notes',
  },
  {
    id: 'assignments',
    label: 'Assignments',
    icon: 'FileCheck',
    isFolder: false,
    requiredPermission: 'assignments.view',
    description: 'Homework briefs, submission desks, grading rubrics, and feedback dispatch',
  },
  {
    id: 'marks-results',
    label: 'Marks & Results',
    icon: 'Award',
    isFolder: false,
    requiredPermission: 'marks.view',
    description: 'Assessment scoring sheets, continuous evaluation marks, and gradebook moderation',
  },

  // ----------------------------------------------------
  // EXPANDABLE FOLDERS
  // ----------------------------------------------------

  // 1. Teaching
  {
    id: 'teaching-folder',
    label: 'Teaching',
    icon: 'BookOpen',
    isFolder: true,
    children: [
      {
        id: 'teacher-class-details',
        label: 'Class Details',
        icon: 'Building2',
        description: 'Assigned section demographics, class teacher advisory notes, and roster overview',
      },
      {
        id: 'teacher-subject-materials',
        label: 'Subject Materials',
        icon: 'BookMarked',
        description: 'Syllabus guidelines, textbook references, and digital courseware',
      },
      {
        id: 'teacher-lesson-plans',
        label: 'Lesson Plans',
        icon: 'FileText',
        description: 'Draft, submit, and track instructional lesson plans and learning objectives',
      },
      {
        id: 'teacher-syllabus-progress',
        label: 'Syllabus Progress',
        icon: 'Bookmark',
        description: 'Update chapter completion milestones and request VP sign-off',
      },
      {
        id: 'teacher-resources',
        label: 'Teaching Resources',
        icon: 'Library',
        description: 'Reference formulas, lab experiment sheets, and interactive tools',
      },
    ],
  },

  // 2. Student Progress
  {
    id: 'student-progress-folder',
    label: 'Student Progress',
    icon: 'BookOpenCheck',
    isFolder: true,
    children: [
      {
        id: 'teacher-student-directory',
        label: 'Student Directory (Assigned Classes)',
        icon: 'Users',
        description: 'Searchable roster of students enrolled in your assigned sections',
      },
      {
        id: 'teacher-student-performance',
        label: 'Student Performance',
        icon: 'Award',
        description: 'Academic score distributions, trajectory curves, and strengths in your subjects',
      },
      {
        id: 'teacher-attendance-concerns',
        label: 'Attendance Concerns',
        icon: 'Clock',
        description: 'Notice repeated tardiness or absence streaks for your periods',
      },
      {
        id: 'teacher-feedback',
        label: 'Teacher Feedback',
        icon: 'FileCheck',
        description: 'Record individualized student notes and learning recommendations',
      },
    ],
  },

  // 3. Examinations
  {
    id: 'examinations-folder',
    label: 'Examinations',
    icon: 'ClipboardCheck',
    isFolder: true,
    children: [
      {
        id: 'teacher-exam-schedule',
        label: 'Examination Schedule',
        icon: 'CalendarDays',
        description: 'Upcoming examination slots, hall allocations, and invigilation duties',
      },
      {
        id: 'teacher-assessment-tasks',
        label: 'Assessment Tasks',
        icon: 'FileCheck',
        description: 'My assigned tests, midterm evaluation tasks, and question blueprints',
      },
      {
        id: 'teacher-marks-entry',
        label: 'Marks Entry',
        icon: 'CheckSquare',
        description: 'Input evaluation marks, absent toggles, and formative feedback for assigned classes',
      },
      {
        id: 'teacher-marks-review-status',
        label: 'Marks Review Status',
        icon: 'Clock',
        description: 'Track submitted gradebooks under VP moderation review',
      },
      {
        id: 'teacher-results',
        label: 'Results',
        icon: 'Award',
        description: 'View finalized and published evaluation reports for your subjects',
      },
    ],
  },

  // 4. Communication
  {
    id: 'communication-folder',
    label: 'Communication',
    icon: 'Bell',
    isFolder: true,
    children: [
      {
        id: 'teacher-announcements',
        label: 'Announcements',
        icon: 'Bell',
        description: 'School-wide and faculty notices from leadership and administration',
      },
      {
        id: 'teacher-class-notices',
        label: 'Class Notices',
        icon: 'FileText',
        description: 'Post homework reminders, test alerts, and updates to your assigned classes',
      },
      {
        id: 'teacher-messages',
        label: 'Messages',
        icon: 'Mail',
        description: 'Departmental communications and internal staff dialogue desk',
      },
    ],
  },

  // 5. My Account
  {
    id: 'my-account-folder',
    label: 'My Account',
    icon: 'Settings',
    isFolder: true,
    children: [
      {
        id: 'teacher-my-profile',
        label: 'My Profile',
        icon: 'UserCheck',
        description: 'Faculty credential card, employee ID, and contact details',
      },
      {
        id: 'teacher-my-assignments',
        label: 'My Teaching Assignments',
        icon: 'Building2',
        description: 'Official roster of assigned grades, sections, subjects, and periods',
      },
      {
        id: 'teacher-preferences',
        label: 'Preferences',
        icon: 'Settings',
        description: 'Interface display preferences, notification frequencies, and shortcuts',
      },
    ],
  },
];
