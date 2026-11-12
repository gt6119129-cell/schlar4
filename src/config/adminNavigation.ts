export interface AdminNavItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  requiredPermission?: string;
  description?: string;
  badge?: string | number;
  isFolder?: boolean;
  children?: AdminNavItem[];
}

export const ADMIN_NAVIGATION_SECTIONS: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // Frequently accessed major destinations
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: 'Institutional health, critical statistics, alerts, and pending workflows',
  },
  {
    id: 'academics-overview',
    label: 'Academic Overview',
    icon: 'BookOpenCheck',
    isFolder: false,
    requiredPermission: 'timetable.view',
    description: 'Curriculum structure, department heads, and term schedules',
  },
  {
    id: 'attendance-overview',
    label: 'Attendance Overview',
    icon: 'CheckSquare',
    isFolder: false,
    requiredPermission: 'attendance.view',
    description: 'Campus-wide daily presence rate, absence trends, and grade health',
  },
  {
    id: 'admissions-overview',
    label: 'Admissions Overview',
    icon: 'Building',
    isFolder: false,
    requiredPermission: 'admissions.manage',
    description: 'Prospective student intake funnel, conversion pacing, and lead metrics',
  },
  {
    id: 'reports-overview',
    label: 'Reports & Analytics',
    icon: 'PieChart',
    isFolder: false,
    requiredPermission: 'reports.view',
    description: 'Executive institutional summary, capacity utilization, and key benchmarks',
  },
  {
    id: 'config-calendar',
    label: 'School Calendar',
    icon: 'Calendar',
    isFolder: false,
    requiredPermission: 'settings.manage',
    description: 'Academic term dates, statutory public holidays, exams, and parent conferences',
  },
  {
    id: 'config-profile',
    label: 'School Profile',
    icon: 'Building2',
    isFolder: false,
    requiredPermission: 'settings.manage',
    description: 'Institutional name, affiliation code, principal details, contact info, and motto',
  },
  {
    id: 'admin-activity-activity',
    label: 'Activity Log',
    icon: 'FileText',
    isFolder: false,
    requiredPermission: 'settings.manage',
    description: 'System-wide audit trail of administrative modifications and published actions',
  },

  // ----------------------------------------------------
  // EXPANDABLE FOLDERS
  // ----------------------------------------------------

  // 1. Academic Management
  {
    id: 'academics-folder',
    label: 'Academic Management',
    icon: 'GraduationCap',
    isFolder: true,
    requiredPermission: 'timetable.view',
    children: [
      {
        id: 'academics-years-terms',
        label: 'Academic Years & Terms',
        icon: 'CalendarRange',
        description: 'Calendar years, semester boundaries, and active academic period',
      },
      {
        id: 'academics-classes',
        label: 'Classes',
        icon: 'Building2',
        description: 'Grade-level cohort registers, streams, and class division master',
      },
      {
        id: 'academics-sections',
        label: 'Sections',
        icon: 'Layers',
        description: 'Section capacity limits, homeroom locations, and class teacher allocations',
      },
      {
        id: 'academics-subjects',
        label: 'Subjects',
        icon: 'BookMarked',
        description: 'Curriculum catalog, credit units, subject codes, and departmental streams',
      },
      {
        id: 'academics-assignments',
        label: 'Class & Section Assignments',
        icon: 'CheckSquare',
        description: 'Subject-teacher mappings and classroom workload distribution',
      },
      {
        id: 'academics-timetable-folder',
        label: 'Timetable',
        icon: 'CalendarDays',
        isFolder: true,
        children: [
          {
            id: 'academics-timetable-overview',
            label: 'Timetable Overview',
            icon: 'Calendar',
            description: 'Master schedule completion pacing, weekly statistics, and metrics',
          },
          {
            id: 'academics-timetable-builder',
            label: 'Timetable Builder',
            icon: 'SlidersHorizontal',
            description: 'Staged 5-step schedule composer with live conflict detection',
          },
          {
            id: 'academics-timetable-classes',
            label: 'Class Timetables',
            icon: 'FileText',
            description: 'Weekly period schedule viewer and printable grid by section',
          },
          {
            id: 'academics-timetable-teachers',
            label: 'Teacher Timetables',
            icon: 'UserCheck',
            description: 'Faculty schedule allocation, weekly periods, and free slot analysis',
          },
          {
            id: 'academics-timetable-rooms',
            label: 'Room Timetables',
            icon: 'Building',
            description: 'Laboratory and classroom occupancy matrices and availability',
          },
          {
            id: 'academics-timetable-conflicts',
            label: 'Timetable Conflicts',
            icon: 'AlertTriangle',
            description: 'Live audit of overlapping teachers, sections, or double-booked rooms',
          },
        ],
      },
    ],
  },

  // 2. Student Management
  {
    id: 'students-folder',
    label: 'Student Management',
    icon: 'Users',
    isFolder: true,
    requiredPermission: 'students.view',
    children: [
      {
        id: 'students-all',
        label: 'All Students',
        icon: 'FileSpreadsheet',
        description: 'Complete student directory with multi-filter search, drawer, and CSV export',
      },
      {
        id: 'students-add',
        label: 'Add Student',
        icon: 'Plus',
        description: 'Staged onboarding wizard: personal info, admission, guardian, and enrollment',
      },
      {
        id: 'students-admissions',
        label: 'Admissions & Enrollment',
        icon: 'Bookmark',
        description: 'Recently enrolled cohorts and intake registration documents',
      },
      {
        id: 'students-assignments',
        label: 'Student Class Assignments',
        icon: 'Layers',
        description: 'Cohort reassignment, roll numbering, and stream placements',
      },
      {
        id: 'students-transfers',
        label: 'Student Transfers',
        icon: 'ArrowRightLeft',
        description: 'Section transfer workflow preserving historical academic and attendance records',
      },
      {
        id: 'students-guardians',
        label: 'Guardians & Parents',
        icon: 'HeartHandshake',
        description: 'Parent-guardian directory with emergency contacts and student linkage',
      },
      {
        id: 'students-archive',
        label: 'Student Records & Archive',
        icon: 'Archive',
        description: 'Transferred, graduated, and archived student profiles with restoration',
      },
    ],
  },

  // 3. Staff Management
  {
    id: 'staff-folder',
    label: 'Staff Management',
    icon: 'UserCheck',
    isFolder: true,
    requiredPermission: 'staff.view',
    children: [
      {
        id: 'staff-all',
        label: 'All Staff',
        icon: 'Users',
        description: 'Personnel directory with department filter, workload, and credentials',
      },
      {
        id: 'staff-add',
        label: 'Add Staff Member',
        icon: 'Plus',
        description: 'Structured onboarding: personal info, employment, department, and assignments',
      },
      {
        id: 'staff-teachers',
        label: 'Teacher Directory',
        icon: 'GraduationCap',
        description: 'Teaching faculty specializations, period quotas, and homeroom assignments',
      },
      {
        id: 'staff-profiles',
        label: 'Staff Profiles',
        icon: 'FileText',
        description: 'Comprehensive faculty dossiers, service files, and credentials',
      },
      {
        id: 'staff-assignments',
        label: 'Teacher & Subject Assignments',
        icon: 'CheckSquare',
        description: 'Interactive assignment matrix: link teacher to section and curriculum subject',
      },
      {
        id: 'staff-departments',
        label: 'Departments',
        icon: 'Building2',
        description: 'Sciences, Humanities, Languages, Arts, and Administrative divisions',
      },
      {
        id: 'staff-designations',
        label: 'Designations',
        icon: 'Award',
        description: 'Academic rank hierarchy: Principal, PGT, TGT, Department Head, Coordinator',
      },
      {
        id: 'staff-archive',
        label: 'Staff Records & Archive',
        icon: 'Archive',
        description: 'Resigned and archived staff records with reactivation controls',
      },
    ],
  },

  // 4. Attendance Management
  {
    id: 'attendance-folder',
    label: 'Attendance Management',
    icon: 'CheckSquare',
    isFolder: true,
    requiredPermission: 'attendance.view',
    children: [
      {
        id: 'attendance-daily',
        label: 'Daily Attendance',
        icon: 'CalendarCheck2',
        description: 'Interactive roll-call register with Present, Late, Absent, and Excused status',
      },
      {
        id: 'attendance-classes',
        label: 'Class-wise Attendance',
        icon: 'Building2',
        description: 'Side-by-side section comparison of daily attendance rates',
      },
      {
        id: 'attendance-corrections',
        label: 'Attendance Corrections',
        icon: 'SlidersHorizontal',
        description: 'Audit log of corrected roll-call records with documented reasons',
      },
      {
        id: 'attendance-history',
        label: 'Attendance History',
        icon: 'Clock',
        description: 'Historical date-range attendance logs for compliance and reporting',
      },
      {
        id: 'attendance-reports',
        label: 'Attendance Reports',
        icon: 'FileSpreadsheet',
        description: 'Monthly and term attendance summaries with CSV export',
      },
    ],
  },

  // 5. Admissions Management
  {
    id: 'admissions-folder',
    label: 'Admissions Management',
    icon: 'Building',
    isFolder: true,
    requiredPermission: 'admissions.manage',
    children: [
      {
        id: 'admissions-enquiries',
        label: 'Enquiries',
        icon: 'HelpCircle',
        description: 'Prospective family enquiries register with contact information and source tags',
      },
      {
        id: 'admissions-applications',
        label: 'Applications',
        icon: 'FileText',
        description: 'Formal applicant packages under review with document verification status',
      },
      {
        id: 'admissions-followups',
        label: 'Follow-ups',
        icon: 'CalendarClock',
        description: 'Scheduled campus visits, parent interviews, and pending callback tasks',
      },
      {
        id: 'admissions-decisions',
        label: 'Admission Decisions',
        icon: 'BadgeCheck',
        description: 'Acceptance, waitlist, and decision logging with administrative comments',
      },
      {
        id: 'admissions-conversion',
        label: 'Enrollment Conversion',
        icon: 'UserPlus',
        description: 'One-click conversion wizard: accepted candidate to active enrolled student',
      },
      {
        id: 'admissions-reports',
        label: 'Admissions Reports',
        icon: 'FileSpreadsheet',
        description: 'Intake demographic reports, marketing source yields, and conversion metrics',
      },
    ],
  },

  // 6. Fee Overview
  {
    id: 'fees-folder',
    label: 'Fee Overview',
    icon: 'Receipt',
    isFolder: true,
    requiredPermission: 'fees.view',
    children: [
      {
        id: 'fees-dashboard',
        label: 'Fee Dashboard',
        icon: 'Receipt',
        description: 'High-level financial collection health, quarterly targets, and payment rates',
      },
      {
        id: 'fees-structure',
        label: 'Fee Structure Overview',
        icon: 'CreditCard',
        description: 'Tuition schedule, laboratory fees, athletic dues, and term installments',
      },
      {
        id: 'fees-student-summary',
        label: 'Student Fee Summary',
        icon: 'Users',
        description: 'Per-student billing status: Paid, Partial, Pending, and Overdue ledgers',
      },
      {
        id: 'fees-collections',
        label: 'Collection Summary',
        icon: 'CheckCircle2',
        description: 'Cleared transaction ledger with payment method breakdown (ACH, Card, Cheque)',
      },
      {
        id: 'fees-outstanding',
        label: 'Outstanding Balances',
        icon: 'AlertCircle',
        description: 'Overdue accounts aging report with reminder notification tools',
      },
      {
        id: 'fees-concessions',
        label: 'Concession Summary',
        icon: 'Award',
        description: 'Approved scholarship grants, sibling discounts, and aid allowances',
      },
      {
        id: 'fees-reports',
        label: 'Financial Reports',
        icon: 'FileSpreadsheet',
        description: 'Quarterly financial collection summaries with CSV data export',
      },
    ],
  },

  // 7. School Configuration
  {
    id: 'config-folder',
    label: 'School Configuration',
    icon: 'Settings',
    isFolder: true,
    requiredPermission: 'settings.manage',
    children: [
      {
        id: 'config-academics',
        label: 'Academic Configuration',
        icon: 'GraduationCap',
        description: 'Active academic year, term boundaries, and curriculum standards',
      },
      {
        id: 'config-bell-schedule',
        label: 'Period & Bell Schedule',
        icon: 'Clock',
        description: 'Campus bell schedule: assembly, period start/end times, nutrition break, and lunch',
      },
      {
        id: 'config-grading',
        label: 'Grading Configuration',
        icon: 'Award',
        description: 'Letter grade bands (A+ to F), GPA conversion points, and mastery criteria',
      },
      {
        id: 'config-settings',
        label: 'General Settings',
        icon: 'SlidersHorizontal',
        description: 'Timezone preferences, date format standards, and local data reset controls',
      },
    ],
  },
];
