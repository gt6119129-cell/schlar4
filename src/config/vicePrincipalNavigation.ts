import { AdminNavItem } from './adminNavigation';

export const VICE_PRINCIPAL_NAVIGATION: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: 'Academic operations, timetable health, substitute coverage, and urgent academic alerts',
  },
  {
    id: 'academic-overview',
    label: 'Academic Overview',
    icon: 'BookOpenCheck',
    isFolder: false,
    requiredPermission: 'timetable.view',
    description: 'Curricular framework, syllabus pacing, and department instructional audits',
  },
  {
    id: 'timetable',
    label: 'Timetable',
    icon: 'CalendarDays',
    isFolder: false,
    requiredPermission: 'timetable.view',
    description: 'Canonical master instructional schedule, room allocations, and period coverage',
  },
  {
    id: 'attendance-monitoring',
    label: 'Attendance Monitoring',
    icon: 'CheckSquare',
    isFolder: false,
    requiredPermission: 'attendance.view',
    description: 'Instructional period attendance compliance, absence patterns, and review logs',
  },
  {
    id: 'student-progress',
    label: 'Student Progress',
    icon: 'Award',
    isFolder: false,
    requiredPermission: 'marks.view',
    description: 'Academic achievement distributions, at-risk student monitoring, and intervention cases',
  },
  {
    id: 'academic-reports',
    label: 'Academic Reports',
    icon: 'FileSpreadsheet',
    isFolder: false,
    requiredPermission: 'reports.view',
    description: 'Instructional performance summaries, term metrics, and statutory academic audits',
  },

  // ----------------------------------------------------
  // EXPANDABLE FOLDERS
  // ----------------------------------------------------

  // 1. Academic Management
  {
    id: 'folder-academic',
    label: 'Academic Management',
    icon: 'GraduationCap',
    isFolder: true,
    children: [
      {
        id: 'vp-classes-sections',
        label: 'Classes & Sections',
        icon: 'Building2',
        description: 'Supervise grade cohorts, student rosters, assigned teachers, and class timetables',
      },
      {
        id: 'vp-subject-coverage',
        label: 'Subject Coverage',
        icon: 'BookMarked',
        description: 'Subjects assigned to classes and teachers, coverage percentages, and gap alerts',
      },
      {
        id: 'vp-syllabus-progress',
        label: 'Syllabus Progress',
        icon: 'Bookmark',
        description: 'Track topic completion, teacher-reported updates, and VP formal sign-offs',
      },
      {
        id: 'vp-academic-calendar',
        label: 'Academic Calendar',
        icon: 'Calendar',
        description: 'Semester terms, instructional day counts, exam windows, and holidays',
      },
      {
        id: 'vp-academic-activities',
        label: 'Academic Activities',
        icon: 'CalendarRange',
        description: 'STEM exhibitions, debate tournaments, academic competitions, and deadlines',
      },
    ],
  },

  // 2. Teacher Coordination
  {
    id: 'folder-teacher',
    label: 'Teacher Coordination',
    icon: 'Users',
    isFolder: true,
    children: [
      {
        id: 'vp-teacher-directory',
        label: 'Teacher Directory',
        icon: 'UserCheck',
        description: 'Faculty roster, qualifications, departments, and assigned sections',
      },
      {
        id: 'vp-teacher-workload',
        label: 'Teacher Workload',
        icon: 'Clock',
        description: 'Weekly teaching periods, period distribution across days, and load balancing',
      },
      {
        id: 'vp-teacher-assignments',
        label: 'Class & Subject Assignments',
        icon: 'FileCheck',
        description: 'Departmental faculty assignment matrix and room allocations',
      },
      {
        id: 'vp-assignment-completion',
        label: 'Assignment Completion Monitoring',
        icon: 'ClipboardCheck',
        description: 'Faculty assignment dispatch rates, student submission pacing, and grading status',
      },
      {
        id: 'vp-teacher-attendance',
        label: 'Teacher Attendance Summary',
        icon: 'CalendarClock',
        description: 'Daily faculty presence, leave coverages, and substitute allocation status',
      },
    ],
  },

  // 3. Examinations
  {
    id: 'folder-exams',
    label: 'Examinations',
    icon: 'ClipboardCheck',
    isFolder: true,
    children: [
      {
        id: 'vp-exam-overview',
        label: 'Examination Overview',
        icon: 'LayoutDashboard',
        description: 'Examination calendars, active assessment windows, and cycle health',
      },
      {
        id: 'vp-exam-schedule',
        label: 'Examination Schedule',
        icon: 'CalendarDays',
        description: 'Timetabled examination halls, slot timings, and invigilation rosters',
      },
      {
        id: 'vp-assessment-progress',
        label: 'Assessment Progress',
        icon: 'FileCheck',
        description: 'Monitoring test conduction across grade cohorts and departmental subjects',
      },
      {
        id: 'vp-marks-monitoring',
        label: 'Marks Entry Monitoring',
        icon: 'CheckSquare',
        description: 'Faculty marks input submission pacing and pending evaluation alerts',
      },
      {
        id: 'vp-result-review',
        label: 'Result Review',
        icon: 'Award',
        description: 'Pre-publication gradebook moderation, class distributions, and curve sign-off',
      },
      {
        id: 'vp-result-publication',
        label: 'Result Publication Status',
        icon: 'BadgeCheck',
        description: 'Publication lock controls and official release authorization status',
      },
    ],
  },

  // 4. Student Support
  {
    id: 'folder-support',
    label: 'Student Support',
    icon: 'HeartHandshake',
    isFolder: true,
    children: [
      {
        id: 'vp-students-attention',
        label: 'Students Requiring Attention',
        icon: 'AlertTriangle',
        description: 'Flagged students needing academic assistance, behavioral review, or attendance follow-up',
      },
      {
        id: 'vp-attendance-concerns',
        label: 'Attendance Concerns',
        icon: 'Clock',
        description: 'Chronic absenteeism cases, unexcused absence streaks, and tardiness logs',
      },
      {
        id: 'vp-performance-concerns',
        label: 'Academic Performance Concerns',
        icon: 'Award',
        description: 'Students scoring below competency thresholds and subject-specific dips',
      },
      {
        id: 'vp-interventions',
        label: 'Intervention Follow-ups',
        icon: 'FileText',
        description: 'Logged remedial actions, assigned faculty mentors, and review dates',
      },
    ],
  },

  // 5. Approvals
  {
    id: 'folder-approvals',
    label: 'Approvals',
    icon: 'BadgeCheck',
    isFolder: true,
    children: [
      {
        id: 'vp-pending-approvals',
        label: 'Pending Academic Approvals',
        icon: 'Clock',
        badge: 3,
        description: 'Syllabus sign-offs, marks moderation, attendance corrections, and lesson plans awaiting VP action',
      },
      {
        id: 'vp-completed-approvals',
        label: 'Completed Approvals',
        icon: 'CheckSquare',
        description: 'Chronological archive of approved academic requests with sign-off timestamps',
      },
      {
        id: 'vp-rejected-approvals',
        label: 'Rejected or Returned Requests',
        icon: 'AlertTriangle',
        description: 'Returned or denied submissions with mandatory feedback and revision guidelines',
      },
    ],
  },

  // 6. Reports
  {
    id: 'folder-reports',
    label: 'Reports',
    icon: 'FileSpreadsheet',
    isFolder: true,
    children: [
      {
        id: 'vp-rep-class-perf',
        label: 'Class Performance',
        icon: 'Building2',
        description: 'Comparative GPA, pass percentages, and subject masteries by grade section',
      },
      {
        id: 'vp-rep-subject-perf',
        label: 'Subject Performance',
        icon: 'BookOpenCheck',
        description: 'Departmental score distributions, standard deviations, and curriculum pacing',
      },
      {
        id: 'vp-rep-attendance',
        label: 'Attendance Summary',
        icon: 'CheckSquare',
        description: 'Term attendance percentages, statutory roll registers, and trend metrics',
      },
      {
        id: 'vp-rep-workload',
        label: 'Teacher Workload Summary',
        icon: 'Clock',
        description: 'Teaching hours, period allocations, and departmental faculty balance reports',
      },
      {
        id: 'vp-rep-exam-perf',
        label: 'Examination Performance',
        icon: 'Award',
        description: 'Assessment cycle cohort analyses, honors lists, and subject medians',
      },
      {
        id: 'vp-rep-student-progress',
        label: 'Student Progress Reports',
        icon: 'Users',
        description: 'Individual student growth trajectories, term progress cards, and remedial notes',
      },
    ],
  },
];
