import { AdminNavItem } from './adminNavigation';

export const RECEPTIONIST_NAVIGATION: AdminNavItem[] = [
  // ----------------------------------------------------
  // DIRECT LINKS — NO SUBMENU
  // ----------------------------------------------------
  {
    id: 'overview',
    label: 'Dashboard',
    icon: 'LayoutDashboard',
    isFolder: false,
    description: 'Reception overview: visitors checked in, expected arrivals, appointments, and phone inquiries',
  },

  // ----------------------------------------------------
  // VISITOR MANAGEMENT FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-visitors',
    label: 'Visitor Management',
    icon: 'BadgeCheck',
    isFolder: true,
    children: [
      {
        id: 'visitor-register',
        label: 'Active Desk & Check-in',
        icon: 'LogIn',
        requiredPermission: 'visitors.manage',
        description: 'Real-time check-in, active campus visitors, one-click checkout, and gate passes',
      },
      {
        id: 'visitor-directory',
        label: 'Visitor Registry',
        icon: 'Users',
        requiredPermission: 'visitors.manage',
        description: 'Master list of registered visitors, contact details, ID verification, and visit counts',
      },
      {
        id: 'visit-history',
        label: 'Visit Audit Log',
        icon: 'History',
        requiredPermission: 'visitors.manage',
        description: 'Historical archive of all past visits, check-out timestamps, and departure remarks',
      },
    ],
  },

  // ----------------------------------------------------
  // ENQUIRIES FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-enquiries',
    label: 'Enquiries & Leads',
    icon: 'HelpCircle',
    isFolder: true,
    children: [
      {
        id: 'admissions-enquiries',
        label: 'Enquiry Directory',
        icon: 'ListFilter',
        requiredPermission: 'admissions.manage',
        description: 'Prospective family walk-ins, online leads, tour bookings, and intake inquiries',
      },
      {
        id: 'enquiry-followups',
        label: 'Scheduled Follow-ups',
        icon: 'CalendarClock',
        requiredPermission: 'admissions.manage',
        description: 'Due and overdue follow-up callbacks, counselor assignments, and action notes',
      },
    ],
  },

  // ----------------------------------------------------
  // APPOINTMENTS FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-appointments',
    label: 'Appointments',
    icon: 'CalendarDays',
    isFolder: true,
    children: [
      {
        id: 'appointments',
        label: "Today's Schedule",
        icon: 'Calendar',
        requiredPermission: 'visitors.manage',
        description: 'Principal, VP, and faculty meetings, visitor arrival tracker, and schedule calendar',
      },
      {
        id: 'appointment-history',
        label: 'Appointment History',
        icon: 'Clock',
        requiredPermission: 'visitors.manage',
        description: 'Past appointment logs, completed consultations, cancellations, and no-show records',
      },
    ],
  },

  // ----------------------------------------------------
  // COMMUNICATIONS FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-communications',
    label: 'Communications',
    icon: 'PhoneCall',
    isFolder: true,
    children: [
      {
        id: 'communications',
        label: 'Call & Courier Log',
        icon: 'PhoneIncoming',
        requiredPermission: 'messages.view',
        description: 'Incoming/outgoing phone call tracker, courier dispatches, and urgent message transfers',
      },
      {
        id: 'parent-enquiries',
        label: 'Reception Requests',
        icon: 'MessageSquareText',
        requiredPermission: 'admissions.manage',
        description: 'Front desk query tickets: lost and found, bus card reissues, and department inquiries',
      },
    ],
  },

  // ----------------------------------------------------
  // SCHOOL DIRECTORY LOOKUP FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-directory',
    label: 'School Directory',
    icon: 'Search',
    isFolder: true,
    children: [
      {
        id: 'reception-student-lookup',
        label: 'Student Lookup',
        icon: 'GraduationCap',
        requiredPermission: 'students.view',
        description: 'Privacy-safe student search: class, section, guardian phone, and emergency contact card',
      },
      {
        id: 'reception-parent-lookup',
        label: 'Parent & Guardian Registry',
        icon: 'Contact',
        requiredPermission: 'students.view',
        description: 'Search parents, linked student wards, verified phone numbers, and past visit history',
      },
      {
        id: 'reception-staff-lookup',
        label: 'Staff & Department Finder',
        icon: 'Briefcase',
        requiredPermission: 'staff.view',
        description: 'Faculty directory, department rooms, office extension numbers, and desk locations',
      },
    ],
  },

  // ----------------------------------------------------
  // DOCUMENT REQUESTS FOLDER
  // ----------------------------------------------------
  {
    id: 'folder-documents',
    label: 'Document Requests',
    icon: 'FileCheck',
    isFolder: true,
    children: [
      {
        id: 'document-requests',
        label: 'Certificate Requests',
        icon: 'FileText',
        requiredPermission: 'students.view',
        description: 'Bonafide, study, transfer certificate inquiries, fee receipt duplicates, and collection ready shelf',
      },
    ],
  },

  // ----------------------------------------------------
  // REPORTS
  // ----------------------------------------------------
  {
    id: 'front-office-records',
    label: 'Daily Register & Reports',
    icon: 'FileSpreadsheet',
    isFolder: false,
    requiredPermission: 'reports.view',
    description: 'Daily visitor register, category & purpose stats, appointment summaries, and activity export',
  },
];
