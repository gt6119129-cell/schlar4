import { AdminNavItem } from './adminNavigation';

export const HR_NAVIGATION: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: 'HR snapshot: headcount distribution, staff on leave, open requisitions, and attendance',
  },
  {
    id: 'hr-staff-overview',
    label: 'Staff Overview',
    icon: 'Users',
    isFolder: false,
    requiredPermission: 'staff.view',
    description: 'Faculty vs support breakdown, department strengths, and full-time ratios',
  },
  {
    id: 'staff-directory',
    label: 'Staff Directory',
    icon: 'UserCheck',
    isFolder: false,
    requiredPermission: 'staff.view',
    description: 'Complete employee roster: faculty, administrative officers, and campus personnel',
  },
  {
    id: 'staff-attendance',
    label: 'Staff Attendance Overview',
    icon: 'CheckSquare',
    isFolder: false,
    requiredPermission: 'attendance.view',
    description: 'Today staff check-in logs, punctuality metrics, and daily faculty presence',
  },
  {
    id: 'leave-management',
    label: 'Leave Overview',
    icon: 'CalendarClock',
    isFolder: false,
    requiredPermission: 'staff.manage',
    description: 'Staff leave requests, approval board, quota balances, and substitute coordination',
  },
  {
    id: 'hr-reports',
    label: 'HR Reports',
    icon: 'FileSpreadsheet',
    isFolder: false,
    requiredPermission: 'reports.view',
    description: 'Statutory headcount audits, faculty workload analysis, and turnover indicators',
  },

  // ----------------------------------------------------
  // EXPANDABLE FOLDERS
  // ----------------------------------------------------

  // 1. Staff Records Folder
  {
    id: 'folder-staff-records',
    label: 'Staff Records',
    icon: 'FolderKanban',
    isFolder: true,
    children: [
      {
        id: 'hr-all-staff',
        label: 'All Staff',
        icon: 'Users',
        requiredPermission: 'staff.view',
        description: 'Complete personnel database with advanced filter, search, and export',
      },
      {
        id: 'hr-add-staff',
        label: 'Add Staff Member',
        icon: 'UserPlus',
        requiredPermission: 'staff.create',
        description: 'Multi-section registration workflow: basic info, contact, employment, and assignments',
      },
      {
        id: 'staff-profiles',
        label: 'Staff Profiles',
        icon: 'User',
        requiredPermission: 'staff.view',
        description: 'Individual employee dossier: qualifications, teaching duties, and employment letters',
      },
      {
        id: 'hr-departments',
        label: 'Departments',
        icon: 'Building2',
        requiredPermission: 'staff.manage',
        description: 'Academic and administrative departments, HoD assignments, and faculty headcount',
      },
      {
        id: 'hr-designations',
        label: 'Designations',
        icon: 'Award',
        requiredPermission: 'staff.manage',
        description: 'Job titles, faculty ranks, responsibility levels, and pay-grade mappings',
      },
      {
        id: 'hr-employment-types',
        label: 'Employment Types',
        icon: 'Briefcase',
        requiredPermission: 'staff.manage',
        description: 'Permanent, contract, probationary, part-time, and visiting faculty classifications',
      },
      {
        id: 'hr-teacher-assignments',
        label: 'Teacher Assignments',
        icon: 'GraduationCap',
        requiredPermission: 'staff.manage',
        description: 'Assign faculty members to classes, sections, and subjects with workload checks',
      },
      {
        id: 'hr-staff-archive',
        label: 'Staff Records & Archive',
        icon: 'Archive',
        requiredPermission: 'staff.archive',
        description: 'Historical records of alumni faculty, retirements, and service certificates',
      },
    ],
  },

  // 2. Recruitment Folder
  {
    id: 'folder-recruitment',
    label: 'Recruitment',
    icon: 'UserPlus',
    isFolder: true,
    children: [
      {
        id: 'recruitment',
        label: 'Recruitment Overview',
        icon: 'GitPullRequest',
        requiredPermission: 'staff.manage',
        description: 'Pipeline summary: active job postings, screening queues, and interview rounds',
      },
      {
        id: 'hr-job-openings',
        label: 'Job Openings',
        icon: 'Briefcase',
        requiredPermission: 'staff.manage',
        description: 'Manage active faculty and staff vacancies, requirements, and application deadlines',
      },
      {
        id: 'hr-candidates',
        label: 'Candidates',
        icon: 'Users',
        requiredPermission: 'staff.manage',
        description: 'Candidate applications, resumes, candidate ratings, and stage transitions',
      },
      {
        id: 'hr-interviews',
        label: 'Interview Schedule',
        icon: 'Calendar',
        requiredPermission: 'staff.manage',
        description: 'Panel interview calendars, demonstration lessons, and evaluation scorecards',
      },
      {
        id: 'hr-hiring-decisions',
        label: 'Hiring Decisions',
        icon: 'CheckCircle2',
        requiredPermission: 'staff.manage',
        description: 'Offer letters, compensation sign-offs, and seamless candidate-to-staff conversion',
      },
    ],
  },

  // 3. Attendance & Leave Folder
  {
    id: 'folder-attendance-leave',
    label: 'Attendance & Leave',
    icon: 'CalendarClock',
    isFolder: true,
    children: [
      {
        id: 'hr-staff-attendance-log',
        label: 'Staff Attendance Log',
        icon: 'Clock',
        requiredPermission: 'attendance.view',
        description: 'Daily check-in/out timestamps, tardiness logs, and duty session tracking',
      },
      {
        id: 'hr-attendance-corrections',
        label: 'Attendance Corrections',
        icon: 'Edit3',
        requiredPermission: 'attendance.edit',
        description: 'Staff biometric correction requests, missed punch approvals, and audit trail',
      },
      {
        id: 'hr-leave-requests',
        label: 'Leave Requests',
        icon: 'FileText',
        requiredPermission: 'staff.manage',
        description: 'Active staff leave applications with medical notes and coverage arrangements',
      },
      {
        id: 'hr-leave-approvals',
        label: 'Leave Approvals',
        icon: 'CheckSquare',
        requiredPermission: 'staff.manage',
        description: 'Actionable approval desk for casual, sick, maternity, and privilege leaves',
      },
      {
        id: 'hr-leave-calendar',
        label: 'Leave Calendar',
        icon: 'CalendarDays',
        requiredPermission: 'staff.manage',
        description: 'Campus-wide staff absence calendar to prevent concurrent faculty shortages',
      },
      {
        id: 'hr-leave-balances',
        label: 'Leave Balances',
        icon: 'Scale',
        requiredPermission: 'staff.manage',
        description: 'Annual leave quotas, entitlement accruals, consumed days, and remaining balances',
      },
    ],
  },

  // 4. Documents Folder
  {
    id: 'folder-documents',
    label: 'Documents',
    icon: 'FolderLock',
    isFolder: true,
    children: [
      {
        id: 'staff-documents',
        label: 'Staff Documents',
        icon: 'FileText',
        requiredPermission: 'staff.manage',
        description: 'Secure personnel files: government IDs, appointment letters, and licenses',
      },
      {
        id: 'hr-doc-categories',
        label: 'Document Categories',
        icon: 'Tag',
        requiredPermission: 'staff.manage',
        description: 'Statutory filing categories, compliance requirements, and mandatory dossiers',
      },
      {
        id: 'hr-doc-expiry',
        label: 'Expiry Tracking',
        icon: 'AlertTriangle',
        requiredPermission: 'staff.manage',
        description: 'Monitors expiring teaching licenses, work visas, and medical certifications',
      },
    ],
  },

  // 5. Reports Folder
  {
    id: 'folder-reports',
    label: 'Reports',
    icon: 'FileSpreadsheet',
    isFolder: true,
    children: [
      {
        id: 'hr-report-directory',
        label: 'Staff Directory Report',
        icon: 'ListFilter',
        requiredPermission: 'reports.view',
        description: 'Exportable faculty roster with credentials, contact, and department assignments',
      },
      {
        id: 'hr-report-headcount',
        label: 'Headcount Report',
        icon: 'BarChart2',
        requiredPermission: 'reports.view',
        description: 'Departmental staff distribution, gender diversity, and full-time faculty ratios',
      },
      {
        id: 'hr-report-attendance',
        label: 'Staff Attendance Report',
        icon: 'CheckSquare',
        requiredPermission: 'reports.view',
        description: 'Monthly punctuality index, lost working hours, and absenteeism metrics',
      },
      {
        id: 'hr-report-leave',
        label: 'Leave Utilization Report',
        icon: 'Calendar',
        requiredPermission: 'reports.view',
        description: 'Casual vs medical leave utilization trends and departmental absence rates',
      },
      {
        id: 'hr-report-recruitment',
        label: 'Recruitment Report',
        icon: 'TrendingUp',
        requiredPermission: 'reports.view',
        description: 'Time-to-hire metrics, applicant source channels, and vacancy fulfillment rates',
      },
      {
        id: 'hr-report-expiry',
        label: 'Document Expiry Report',
        icon: 'AlertCircle',
        requiredPermission: 'reports.view',
        description: 'Audit report of credentials and licenses requiring upcoming renewals',
      },
    ],
  },
];
