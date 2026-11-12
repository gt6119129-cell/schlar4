export interface RoleNavItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
  description: string;
  requiredPermission?: string;
  plannedFeatures?: string[];
}

export type PlatformType = 'web' | 'mobile';

export interface RoleConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  route: string;
  platforms: PlatformType[];
  permissions: string[];
  primaryModules: string[];
  navItems: RoleNavItem[];
  mockStats: {
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  sampleRecords: {
    id: string;
    title: string;
    subtitle: string;
    tag: string;
    status: 'active' | 'pending' | 'completed' | 'alert';
    date: string;
  }[];
}

export const SCHLAR_ROLES: RoleConfig[] = [
  {
    id: 'admin',
    name: 'Admin',
    category: 'Executive Governance',
    description: 'School-wide administration, academic operations, staff coordination, student records, admissions, timetables, reports, and authorized school configuration.',
    iconName: 'ShieldCheck',
    route: '/workspace/admin',
    platforms: ['web'],
    permissions: [
      'students.view', 'students.create', 'students.edit', 'students.archive',
      'staff.view', 'staff.manage',
      'attendance.view', 'attendance.create', 'attendance.edit', 'attendance.approve', 'attendance.export',
      'timetable.view', 'timetable.create', 'timetable.edit',
      'assignments.view', 'marks.view', 'results.publish',
      'fees.view', 'fees.record_payment', 'fees.issue_receipt', 'fees.manage_structure', 'fees.approve_concession',
      'library.manage', 'transport.manage', 'exams.manage', 'admissions.manage', 'visitors.manage',
      'announcements.view', 'announcements.create', 'messages.view',
      'reports.view', 'reports.export', 'settings.manage', 'permissions.manage',
    ],
    primaryModules: ['Academics', 'Classes & Sections', 'Students & Guardians', 'Staff Directory', 'School Settings'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'School-wide institutional health, key statistics, and urgent operational alerts' },
      { id: 'academics', label: 'Academics', icon: 'GraduationCap', description: 'Curriculum frameworks, academic milestones, and term grade structures', requiredPermission: 'timetable.view', plannedFeatures: ['Syllabus milestones', 'Department progress tracking', 'Academic council review'] },
      { id: 'classes-sections', label: 'Classes & Sections', icon: 'Building2', description: 'Class division architecture, section capacities, and room assignments', requiredPermission: 'students.view', plannedFeatures: ['Section capacity manager', 'Room allocation', 'Stream assignments'] },
      { id: 'students-guardians', label: 'Students & Guardians', icon: 'Users', description: 'Enrolled student registers, legal guardian contacts, and demographic archives', requiredPermission: 'students.view', plannedFeatures: ['Student profile master', 'Guardian linkage validation', 'Transfer certificate issuing'] },
      { id: 'staff-directory', label: 'Staff Directory', icon: 'UserCheck', description: 'Faculty and administrative personnel registry, service files, and credentials', requiredPermission: 'staff.view', plannedFeatures: ['Faculty qualification records', 'Department hierarchy', 'Teacher workload analysis'] },
      { id: 'timetable', label: 'Timetable', icon: 'CalendarDays', description: 'Campus master schedule, period conflict detection, and room allocations', requiredPermission: 'timetable.view', plannedFeatures: ['Conflict engine', 'Substitute teacher auto-suggest', 'Room occupancy heatmaps'] },
      { id: 'attendance', label: 'Attendance', icon: 'CheckSquare', description: 'Campus-wide daily attendance aggregation, trends, and statutory registers', requiredPermission: 'attendance.view', plannedFeatures: ['Absence streak alerts', 'Biometric log sync', 'State compliance export'] },
      { id: 'admissions', label: 'Admissions', icon: 'Building', description: 'Enrollment pipelines, applicant evaluations, and formal registration passes', requiredPermission: 'admissions.manage', plannedFeatures: ['Prospect scoring', 'Interview scheduling', 'Document verification checklist'] },
      { id: 'fees-overview', label: 'Fees Overview', icon: 'Receipt', description: 'Aggregate revenue ledgers, quarterly collection milestones, and outstanding sums', requiredPermission: 'fees.view', plannedFeatures: ['Quarterly collection pacing', 'Category breakdown', 'Auditor reconciliation export'] },
      { id: 'reports', label: 'Reports', icon: 'FileSpreadsheet', description: 'Comprehensive operational, statutory, academic, and financial reports', requiredPermission: 'reports.view', plannedFeatures: ['Accreditation pack generator', 'Custom CSV query builder', 'Annual audit summary'] },
      { id: 'settings', label: 'School Settings', icon: 'Settings', description: 'Academic terms, institutional metadata, role permissions, and system variables', requiredPermission: 'settings.manage', plannedFeatures: ['Academic term calendar', 'Grading scale definitions', 'System backup triggers'] },
    ],
    mockStats: [
      { label: 'Campus Affiliation Status', value: 'Accredited A+', change: 'Renewed 2026', trend: 'up' },
      { label: 'Enrolled Cohort', value: '2,480', change: '+4.2% YoY', trend: 'up' },
      { label: 'Active Faculty & Staff', value: '184', change: 'Fully Staffed', trend: 'neutral' },
      { label: 'Compliance Score', value: '99.4%', change: 'All Audits Passed', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'ADM-101', title: 'Board of Governors Charter Update', subtitle: 'Academic Year 2026-27 policy ratified', tag: 'Governance', status: 'completed', date: 'Oct 18, 2026' },
      { id: 'ADM-102', title: 'Campus Fiber Network Migration', subtitle: 'Block C & STEM Wing bandwidth optimization', tag: 'Infrastructure', status: 'active', date: 'Oct 17, 2026' },
      { id: 'ADM-103', title: 'Annual Fire Safety Audit Verification', subtitle: 'City Fire Marshall endorsement on file', tag: 'Statutory', status: 'completed', date: 'Oct 15, 2026' },
      { id: 'ADM-104', title: 'Quarterly Cybersecurity Audit', subtitle: 'Scheduled quarterly firewall assessment', tag: 'Security', status: 'pending', date: 'Oct 22, 2026' },
    ],
  },
  {
    id: 'vice-principal',
    name: 'Vice Principal',
    category: 'Academic Administration',
    description: 'Academic oversight, teacher coordination, timetable supervision, attendance monitoring, examinations, and student progress.',
    iconName: 'GraduationCap',
    route: '/workspace/vice-principal',
    platforms: ['web'],
    permissions: [
      'students.view', 'staff.view',
      'attendance.view', 'attendance.create', 'attendance.edit', 'attendance.approve', 'attendance.export',
      'timetable.view', 'timetable.create', 'timetable.edit',
      'assignments.view', 'marks.view', 'marks.edit', 'exams.manage',
      'announcements.view', 'announcements.create', 'messages.view',
      'reports.view', 'reports.export',
    ],
    primaryModules: ['Academic Monitoring', 'Teacher Coordination', 'Timetable Supervision', 'Examinations'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Academic instruction metrics, substitute allocations, and daily period health' },
      { id: 'academic-monitoring', label: 'Academic Monitoring', icon: 'BookOpenCheck', description: 'Curriculum pacing audits, syllabus coverage logs, and lesson quality metrics', requiredPermission: 'timetable.view', plannedFeatures: ['Syllabus completion trackers', 'Cross-grade benchmark comparisons', 'Teaching log audits'] },
      { id: 'classes-sections', label: 'Classes & Sections', icon: 'Building2', description: 'Grade-level cohort supervision, student distributions, and class allocations', requiredPermission: 'students.view', plannedFeatures: ['Section balance reviews', 'Classroom observation logs', 'Peer tutoring groups'] },
      { id: 'teacher-coordination', label: 'Teacher Coordination', icon: 'Users', description: 'Substitute teacher assignments, department head reviews, and faculty support', requiredPermission: 'staff.view', plannedFeatures: ['Substitute pool auto-dispatch', 'Department meeting minutes', 'Faculty development logs'] },
      { id: 'timetable', label: 'Timetable', icon: 'CalendarDays', description: 'Master instructional timetable review, room conflict management, and lab slots', requiredPermission: 'timetable.view', plannedFeatures: ['Daily substitution board', 'Special assembly scheduler', 'Lab rotation matrix'] },
      { id: 'attendance-monitoring', label: 'Attendance Monitoring', icon: 'CheckSquare', description: 'Instructional period attendance compliance, chronic absenteeism, and late check-ins', requiredPermission: 'attendance.view', plannedFeatures: ['Period attendance reconciler', 'Disciplinary absence triggers', 'Leave approvals'] },
      { id: 'examinations', label: 'Examinations', icon: 'ClipboardCheck', description: 'Academic council exam calendar, moderation guidelines, and assessment standards', requiredPermission: 'exams.manage', plannedFeatures: ['Paper moderation sign-off', 'Exam readiness index', 'Remedial exam schedules'] },
      { id: 'student-progress', label: 'Student Progress', icon: 'Award', description: 'Academic achievement distributions, at-risk student monitoring, and honors cohorts', requiredPermission: 'marks.view', plannedFeatures: ['Early intervention alerts', 'Grade distribution curves', 'Counselor referrals'] },
      { id: 'reports', label: 'Reports', icon: 'FileSpreadsheet', description: 'Instructional performance summaries, term metrics, and statutory academic audits', requiredPermission: 'reports.view', plannedFeatures: ['Term performance analytics', 'Department ranking reports', 'Parent-teacher conference pack'] },
    ],
    mockStats: [
      { label: 'Weekly Period Fulfillment', value: '98.8%', change: '342/346 periods', trend: 'up' },
      { label: 'Substitute Teacher Coverage', value: '100%', change: '4 today resolved', trend: 'up' },
      { label: 'Disciplinary Cases Open', value: '2', change: '-3 from last week', trend: 'up' },
      { label: 'Syllabus Milestone Met', value: '94.2%', change: 'Mid-term targets', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'VP-201', title: 'Grade 10 Physics Lab Relocation', subtitle: 'Adjusted period 3 & 4 schedule for STEM Wing A', tag: 'Scheduling', status: 'completed', date: 'Oct 19, 2026' },
      { id: 'VP-202', title: 'Sub-Pool Allocation for Science Dept', subtitle: 'Covering Mr. Harrison medical leave (2 days)', tag: 'Faculty', status: 'active', date: 'Oct 19, 2026' },
      { id: 'VP-203', title: 'Senior Secondary Behavior Review', subtitle: 'Counselor follow-up meeting with parents', tag: 'Discipline', status: 'pending', date: 'Oct 20, 2026' },
      { id: 'VP-204', title: 'Quarterly Syllabus Assessment Report', subtitle: 'Compiled department reviews for board', tag: 'Curriculum', status: 'completed', date: 'Oct 16, 2026' },
    ],
  },
  {
    id: 'teacher',
    name: 'Teacher',
    category: 'Classroom & Instruction',
    description: 'Assigned classes, daily attendance, instructional timetables, homework assignments, student assessments, marks, and parent dialogue.',
    iconName: 'BookOpen',
    route: '/workspace/teacher',
    platforms: ['web', 'mobile'],
    permissions: [
      'students.view',
      'attendance.view', 'attendance.create', 'attendance.edit',
      'timetable.view',
      'assignments.view', 'assignments.create', 'assignments.edit',
      'marks.view', 'marks.enter', 'marks.edit',
      'announcements.view', 'announcements.create',
      'messages.view', 'messages.send',
      'reports.view',
    ],
    primaryModules: ['My Classes', 'Attendance', 'Assignments', 'Marks & Results', 'Student Progress'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Daily teaching schedule, next upcoming class, pending attendance, and assignment queue' },
      { id: 'my-classes', label: 'My Classes', icon: 'Users', description: 'Assigned teaching cohorts, student roster profiles, learning accommodations, and seats', requiredPermission: 'students.view', plannedFeatures: ['Seating chart builder', 'Student profile quick-glance', 'Classroom notes log'] },
      { id: 'attendance', label: 'Attendance', icon: 'CheckSquare', description: 'Period-wise roll-call taking, attendance logs, and late arrival notes', requiredPermission: 'attendance.view', plannedFeatures: ['Fast batch marker', 'Excused note verification', 'Daily absence alert trigger'] },
      { id: 'timetable', label: 'Timetable', icon: 'CalendarDays', description: 'Weekly teaching timetable, assigned rooms, prep hours, and lab duty periods', requiredPermission: 'timetable.view', plannedFeatures: ['Class schedule viewer', 'Room change notifications', 'Invigilation schedule overlay'] },
      { id: 'assignments', label: 'Assignments', icon: 'FileCheck', description: 'Homework briefs, submission desks, grading rubrics, and feedback dispatch', requiredPermission: 'assignments.view', plannedFeatures: ['Assignment creator', 'Digital submission drawer', 'Rubric-based feedback'] },
      { id: 'examinations', label: 'Examinations', icon: 'ClipboardCheck', description: 'Term exam schedules, assigned invigilation shifts, and question paper submission dates', requiredPermission: 'marks.view', plannedFeatures: ['Invigilation shift reminder', 'Syllabus coverage checklist', 'Exam hall instructions'] },
      { id: 'marks-results', label: 'Marks & Results', icon: 'Award', description: 'Assessment scoring sheets, continuous evaluation marks, and gradebook moderation', requiredPermission: 'marks.view', plannedFeatures: ['Gradebook spreadsheet', 'Weighted GPA calculator', 'Moderation submission workflow'] },
      { id: 'student-progress', label: 'Student Progress', icon: 'BookOpenCheck', description: 'Individual student performance trends, strengths, areas for improvement, and comments', requiredPermission: 'marks.view', plannedFeatures: ['Student trajectory graphs', 'Formative evaluation notes', 'Parent meeting summary notes'] },
      { id: 'announcements', label: 'Announcements', icon: 'Bell', description: 'Class-wide homework reminders, project deadlines, and school notices', requiredPermission: 'announcements.view', plannedFeatures: ['Class circular broadcast', 'Schedule change alerts', 'School newsletter viewer'] },
      { id: 'profile-settings', label: 'Profile & Settings', icon: 'Settings', description: 'Teacher profile, department affiliations, teaching subjects, and notification preferences', plannedFeatures: ['Office hour settings', 'Email alert preferences', 'Subject certifications'] },
    ],
    mockStats: [
      { label: 'Today Attendance Rate', value: '96.4%', change: '108/112 present', trend: 'up' },
      { label: 'Assignments to Grade', value: '18', change: 'Grade 9 Mathematics', trend: 'neutral' },
      { label: 'Upcoming Assessments', value: '2', change: 'Physics Quiz Oct 28', trend: 'neutral' },
      { label: 'Active Teaching Units', value: '4', change: 'Polynomials & Vectors', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'TCH-301', title: 'Grade 10-A Algebra Chapter Test', subtitle: '32 submissions evaluated, class median 88%', tag: 'Grading', status: 'completed', date: 'Oct 18, 2026' },
      { id: 'TCH-302', title: 'Daily Attendance Grade 9-B', subtitle: '28 present, 2 excused medical, 1 late', tag: 'Attendance', status: 'completed', date: 'Oct 19, 2026' },
      { id: 'TCH-303', title: 'Physics Laboratory Assignment #4', subtitle: 'Pendulum harmonic motion analysis', tag: 'Homework', status: 'active', date: 'Oct 21, 2026' },
      { id: 'TCH-304', title: 'Parent Inquiry Response (James Carter)', subtitle: 'Reviewed homework revision strategy', tag: 'Messages', status: 'completed', date: 'Oct 17, 2026' },
    ],
  },
  {
    id: 'parent',
    name: 'Parent',
    category: 'Family & Student Progress',
    description: 'Linked children information, daily attendance, class timetables, homework assignments, examination results, fee statements, and school messages.',
    iconName: 'HeartHandshake',
    route: '/workspace/parent',
    platforms: ['mobile'],
    permissions: [
      'students.view',
      'attendance.view',
      'timetable.view',
      'assignments.view',
      'marks.view',
      'fees.view',
      'announcements.view',
      'messages.view', 'messages.send',
    ],
    primaryModules: ['My Children', 'Attendance', 'Homework & Assignments', 'Examinations & Results', 'Fee Information'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Child summary dashboard: attendance, homework due soon, upcoming tests, and fee status' },
      { id: 'my-children', label: 'My Children', icon: 'Users', description: 'Enrolled wards, grade levels, teachers, advisor contact information, and health notes', requiredPermission: 'students.view', plannedFeatures: ['Child profile card', 'Advisor contact information', 'Emergency contact updates'] },
      { id: 'attendance', label: 'Attendance', icon: 'CheckSquare', description: 'Monthly attendance calendar, punctuality records, excused absences, and leave slips', requiredPermission: 'attendance.view', plannedFeatures: ['Monthly calendar visualizer', 'Digital leave slip submitter', 'Absence dispute form'] },
      { id: 'timetable', label: 'Timetable', icon: 'CalendarDays', description: 'Child weekly school schedule, periods, room numbers, and subject teacher names', requiredPermission: 'timetable.view', plannedFeatures: ['Daily schedule tracker', 'Exam timetable overlay', 'Special event flags'] },
      { id: 'homework-assignments', label: 'Homework & Assignments', icon: 'FileCheck', description: 'Daily homework tasks, assignment deadlines, submission statuses, and teacher notes', requiredPermission: 'assignments.view', plannedFeatures: ['Daily homework checklist', 'Submission status badges', 'Teacher feedback viewer'] },
      { id: 'examinations-results', label: 'Examinations & Results', icon: 'Award', description: 'Term report cards, midterm assessment scores, grade trends, and academic transcripts', requiredPermission: 'marks.view', plannedFeatures: ['Electronic report card viewer', 'Historical progress charts', 'Subject grade breakdowns'] },
      { id: 'fee-information', label: 'Fee Information', icon: 'CreditCard', description: 'Tuition statements, term invoice balances, receipts, and payment history', requiredPermission: 'fees.view', plannedFeatures: ['Detailed invoice breakdown', 'Payment receipt download', 'Tuition deadline reminders'] },
      { id: 'announcements', label: 'Announcements', icon: 'Bell', description: 'Campus newsletters, emergency notices, holiday schedules, and permission circulars', requiredPermission: 'announcements.view', plannedFeatures: ['School circular archive', 'Event calendar sync', 'Urgent weather alerts'] },
      { id: 'messages', label: 'Messages', icon: 'Mail', description: 'Secure communication with subject teachers, grade counselors, and school administration', requiredPermission: 'messages.view', plannedFeatures: ['Teacher message thread', 'Appointment request form', 'Read receipt indicator'] },
      { id: 'profile-settings', label: 'Profile & Settings', icon: 'Settings', description: 'Parent contact preferences, emergency phone numbers, and notification settings', plannedFeatures: ['Notification channel preferences', 'Language preferences', 'Address verification'] },
    ],
    mockStats: [
      { label: 'Overall Term GPA', value: '3.85 / 4.0', change: 'Honors Roll', trend: 'up' },
      { label: 'Term Attendance', value: '98.2%', change: '54 of 55 days', trend: 'up' },
      { label: 'Outstanding Balance', value: '₹0.00', change: 'Term 2 Cleared', trend: 'up' },
      { label: 'Next Scheduled Event', value: 'Sports Day', change: 'Nov 02, 2026', trend: 'neutral' },
    ],
    sampleRecords: [
      { id: 'PAR-401', title: 'Term 1 Final Report Card Released', subtitle: 'Grade 8 — Top percentile in STEM & Languages', tag: 'Academic', status: 'completed', date: 'Oct 15, 2026' },
      { id: 'PAR-402', title: 'Annual Educational Tour Consent', subtitle: 'Signed electronic permission slip for Science Museum', tag: 'Consent', status: 'completed', date: 'Oct 18, 2026' },
      { id: 'PAR-403', title: 'Term 2 Tuition Invoice #SCH-8841', subtitle: 'Processed via UPI / Net Banking', tag: 'Payment', status: 'completed', date: 'Oct 05, 2026' },
      { id: 'PAR-404', title: 'Bus Route #14 Punctuality Alert', subtitle: 'Morning pick-up scheduled at 07:15 AM', tag: 'Transit', status: 'active', date: 'Oct 19, 2026' },
    ],
  },
  {
    id: 'accountant',
    name: 'Accountant / Fee Manager',
    category: 'Finance & Accounts',
    description: 'Fee structures, student fee ledgers, tuition payments, official receipts, fee concessions within limits, outstanding balances, and financial audits.',
    iconName: 'Receipt',
    route: '/workspace/accountant',
    platforms: ['web'],
    permissions: [
      'students.view',
      'fees.view', 'fees.record_payment', 'fees.issue_receipt', 'fees.manage_structure', 'fees.approve_concession',
      'reports.view', 'reports.export',
      'announcements.view',
    ],
    primaryModules: ['Fee Structure', 'Student Fee Records', 'Collect & Record Fees', 'Receipts', 'Outstanding Balances'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Financial summary: quarterly collections, pending balances, cash flow, and daily receipts' },
      { id: 'fee-structure', label: 'Fee Structure', icon: 'SlidersHorizontal', description: 'Tuition tier schedules, grade-level fee brackets, laboratory charges, and late levies', requiredPermission: 'fees.manage_structure', plannedFeatures: ['Tiered fee matrix', 'Installment plan schedules', 'Late fee policy rules'] },
      { id: 'student-fee-records', label: 'Student Fee Records', icon: 'Users', description: 'Individual student accounts, billed amounts, credits, balance histories, and payment logs', requiredPermission: 'fees.view', plannedFeatures: ['Student ledger search', 'Account balance summary', 'Sibling discount verification'] },
      { id: 'collect-record-fees', label: 'Collect & Record Fees', icon: 'CreditCard', description: 'Terminal for recording tuition UPI, Net Banking, cash payments, and cheques', requiredPermission: 'fees.record_payment', plannedFeatures: ['Transaction entry terminal', 'Split payment handler', 'Payment gateway reconciliation'] },
      { id: 'receipts', label: 'Receipts', icon: 'Receipt', description: 'Issued fee vouchers, automated receipt generation, tax invoice records, and reprints', requiredPermission: 'fees.issue_receipt', plannedFeatures: ['Numbered voucher register', 'Batch PDF receipt printer', 'Duplicate receipt verification'] },
      { id: 'outstanding-balances', label: 'Outstanding Balances', icon: 'AlertTriangle', description: 'Dues aging matrix, overdue collection reminders, and payment plan workflows', requiredPermission: 'fees.view', plannedFeatures: ['Aging analysis table (30/60/90 days)', 'Automated reminder dispatcher', 'Hardship hold list'] },
      { id: 'concessions', label: 'Concessions', icon: 'Award', description: 'Merit scholarships, staff child discounts, financial hardship waivers, and audit trails', requiredPermission: 'fees.approve_concession', plannedFeatures: ['Scholarship review workflow', 'Concession limit enforcement', 'Audit sign-off register'] },
      { id: 'financial-reports', label: 'Financial Reports', icon: 'FileSpreadsheet', description: 'Revenue balance sheets, category-wise collection totals, audit logs, and tax returns', requiredPermission: 'reports.view', plannedFeatures: ['Trial balance generator', 'Daily cash book ledger', 'Annual auditor package'] },
    ],
    mockStats: [
      { label: 'Quarterly Collections', value: '₹84,25,000', change: '96.8% realized', trend: 'up' },
      { label: 'Outstanding Student Dues', value: '₹2,42,000', change: '-12% this month', trend: 'up' },
      { label: 'Staff Payroll Disbursed', value: '₹34,80,000', change: '184 employees paid', trend: 'neutral' },
      { label: 'Operating Expense Ratio', value: '41.2%', change: 'Within budget target', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'ACC-501', title: 'Batch Fee Run: Term 2 Invoicing', subtitle: '2,480 automated invoices generated with payment links', tag: 'Billing', status: 'completed', date: 'Oct 01, 2026' },
      { id: 'ACC-502', title: 'October Faculty Payroll Reconciliation', subtitle: 'Direct deposits transmitted to partner clearing house', tag: 'Payroll', status: 'completed', date: 'Oct 15, 2026' },
      { id: 'ACC-503', title: 'Laboratory Chemical Consumables PO-902', subtitle: 'Vendor invoice payment voucher pending dual-sign', tag: 'Payables', status: 'pending', date: 'Oct 19, 2026' },
      { id: 'ACC-504', title: 'Quarterly Cash Flow Audit Preparation', subtitle: 'External auditor document package sealed', tag: 'Compliance', status: 'active', date: 'Oct 18, 2026' },
    ],
  },
  {
    id: 'hr-manager',
    name: 'HR / Staff Manager',
    category: 'Human Resources & Talent',
    description: 'Staff directory, staff profiles, recruitment pipelines, staff attendance, leave entitlement management, service documents, and HR administration.',
    iconName: 'UserCheck',
    route: '/workspace/hr-manager',
    platforms: ['web'],
    permissions: [
      'staff.view', 'staff.manage',
      'attendance.view',
      'reports.view', 'reports.export',
      'announcements.view', 'announcements.create',
      'settings.manage',
    ],
    primaryModules: ['Staff Directory', 'Staff Profiles', 'Recruitment', 'Staff Attendance', 'Leave Management'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'HR snapshot: headcount breakdown, staff on leave today, open requisitions, and appraisals' },
      { id: 'staff-directory', label: 'Staff Directory', icon: 'Users', description: 'Complete employee roster: teaching faculty, administrative officers, and support staff', requiredPermission: 'staff.view', plannedFeatures: ['Searchable personnel directory', 'Department filter', 'Emergency contact cards'] },
      { id: 'staff-profiles', label: 'Staff Profiles', icon: 'UserCheck', description: 'Individual personnel records: appointment letters, qualifications, certifications, and service logs', requiredPermission: 'staff.view', plannedFeatures: ['Comprehensive dossier', 'Qualification verification', 'Contract renewal alerts'] },
      { id: 'recruitment', label: 'Recruitment', icon: 'UserPlus', description: 'Open faculty positions, candidate applications, interview panels, and offer letters', requiredPermission: 'staff.manage', plannedFeatures: ['Applicant tracking pipeline', 'Interview scoring rubrics', 'Onboarding packet dispatch'] },
      { id: 'staff-attendance', label: 'Staff Attendance', icon: 'CheckSquare', description: 'Biometric timesheet logs, check-in timestamps, punctuality metrics, and duty leaves', requiredPermission: 'attendance.view', plannedFeatures: ['Biometric log reconciler', 'Late-arrival tracker', 'Duty leave logger'] },
      { id: 'leave-management', label: 'Leave Management', icon: 'CalendarClock', description: 'Casual, medical, maternity, and privilege leave requests, balance tracking, and approvals', requiredPermission: 'staff.manage', plannedFeatures: ['Leave request approval board', 'Quota balance calculator', 'Sub-cover notice generator'] },
      { id: 'staff-documents', label: 'Staff Documents', icon: 'FileText', description: 'Background checks, government ID records, teaching licenses, and statutory filings', requiredPermission: 'staff.manage', plannedFeatures: ['Secure document vault', 'Expiring credential alerts', 'Statutory compliance checklists'] },
      { id: 'hr-reports', label: 'HR Reports', icon: 'FileSpreadsheet', description: 'Attrition metrics, faculty-to-student ratios, diversity audits, and payroll inputs', requiredPermission: 'reports.view', plannedFeatures: ['Staff turnover analytics', 'Teacher workload distribution', 'Payroll input summary'] },
    ],
    mockStats: [
      { label: 'Total Active Headcount', value: '184', change: '128 Faculty, 56 Support', trend: 'neutral' },
      { label: 'Staff Attendance Today', value: '97.3%', change: '179 present on campus', trend: 'up' },
      { label: 'Pending Leave Requests', value: '5', change: '3 urgent reviews', trend: 'neutral' },
      { label: 'Open Faculty Positions', value: '2', change: 'Senior Math & Art Lead', trend: 'neutral' },
    ],
    sampleRecords: [
      { id: 'HR-601', title: 'New Faculty Onboarding: Ms. Elena Rostova', subtitle: 'Biochemistry teacher credential verification & badge', tag: 'Onboarding', status: 'completed', date: 'Oct 17, 2026' },
      { id: 'HR-602', title: 'Medical Leave Approval: Mr. David Miller', subtitle: 'Grade 6 English — 3 days medical leave approved', tag: 'Leave', status: 'completed', date: 'Oct 18, 2026' },
      { id: 'HR-603', title: 'Annual Teaching Excellence Evaluations', subtitle: 'Term 1 peer and student feedback consolidation', tag: 'Appraisal', status: 'active', date: 'Oct 19, 2026' },
      { id: 'HR-604', title: 'Background Check Verification Batch', subtitle: 'Campus safety statutory compliance checks', tag: 'Compliance', status: 'completed', date: 'Oct 14, 2026' },
    ],
  },
  {
    id: 'librarian',
    name: 'Librarian',
    category: 'Library & Information Resources',
    description: 'Library catalogue, book inventory, issue and return records, book reservations, overdue tracking, fines, and library reports.',
    iconName: 'Library',
    route: '/workspace/librarian',
    platforms: ['web'],
    permissions: [
      'students.view', 'staff.view',
      'library.manage',
      'reports.view',
      'announcements.view',
    ],
    primaryModules: ['Book Catalogue', 'Book Inventory', 'Issue Books', 'Return Books', 'Reservations'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Library circulation dashboard: active loans, books due today, overdue notices, and visitor counts' },
      { id: 'book-catalogue', label: 'Book Catalogue', icon: 'BookMarked', description: 'Digital catalog: Dewey decimal indices, authors, publishers, subject keywords, and editions', requiredPermission: 'library.manage', plannedFeatures: ['OPAC catalog search', 'ISBN auto-fetcher', 'Subject taxonomy editor'] },
      { id: 'book-inventory', label: 'Book Inventory', icon: 'Library', description: 'Physical volume holdings, barcode asset tags, shelf allocations, and condition audits', requiredPermission: 'library.manage', plannedFeatures: ['Barcode inventory scanner', 'Damaged volume register', 'Missing book reconciliation'] },
      { id: 'issue-books', label: 'Issue Books', icon: 'ScanLine', description: 'Circulation check-out terminal: student and staff barcode scanning, loan limits, and due dates', requiredPermission: 'library.manage', plannedFeatures: ['Fast barcode loan terminal', 'Loan quota enforcement', 'Due date slip generator'] },
      { id: 'return-books', label: 'Return Books', icon: 'CheckSquare', description: 'Check-in desk, return inspection, shelf re-sort staging, and automated loan clearances', requiredPermission: 'library.manage', plannedFeatures: ['One-scan return check-in', 'Condition grade logging', 'Hold reservation alert on return'] },
      { id: 'reservations', label: 'Reservations', icon: 'Clock', description: 'Student and faculty book reservation queues, notification dispatches, and hold shelf holds', requiredPermission: 'library.manage', plannedFeatures: ['Queue priority manager', 'Pickup deadline notifications', 'Auto-expiration of unclaimed holds'] },
      { id: 'overdue-books', label: 'Overdue Books', icon: 'AlertTriangle', description: 'Overdue volume tracking, automated email/SMS return notices, and fine ledgers', requiredPermission: 'library.manage', plannedFeatures: ['Overdue reminder dispatcher', 'Late fine calculation ledger', 'Borrowing suspension rules'] },
      { id: 'library-reports', label: 'Library Reports', icon: 'FileSpreadsheet', description: 'Circulation frequency metrics, popular genre trends, inventory audits, and loss summaries', requiredPermission: 'reports.view', plannedFeatures: ['Top circulating books report', 'Cohort reading volume stats', 'Annual audit package'] },
    ],
    mockStats: [
      { label: 'Total Cataloged Volumes', value: '38,450', change: '+320 new additions', trend: 'up' },
      { label: 'Active Loans Outstanding', value: '1,240', change: '84 checked out today', trend: 'neutral' },
      { label: 'Overdue Items', value: '18', change: 'Reminder notices sent', trend: 'neutral' },
      { label: 'E-Journal Downloads', value: '2,890', change: '+18% this month', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'LIB-701', title: 'Dewey Decimal Re-classification: Physics 530', subtitle: 'Updated shelf tags for Advanced Placement textbooks', tag: 'Catalog', status: 'completed', date: 'Oct 16, 2026' },
      { id: 'LIB-702', title: 'Overdue Circulation Recall Batch #12', subtitle: 'Automated reminders delivered to 18 borrowers', tag: 'Circulation', status: 'completed', date: 'Oct 19, 2026' },
      { id: 'LIB-703', title: 'Procurement: Contemporary Fiction Collection', subtitle: 'Purchase order for 65 youth literature titles approved', tag: 'Acquisitions', status: 'active', date: 'Oct 18, 2026' },
      { id: 'LIB-704', title: 'Quarterly Physical Barcode Inventory Scan', subtitle: 'East Reading Room stacks verified 100% matched', tag: 'Audit', status: 'completed', date: 'Oct 12, 2026' },
    ],
  },
  {
    id: 'transport-manager',
    name: 'Transport Manager',
    category: 'Logistics & Fleet Operations',
    description: 'Transit routes, vehicle fleet, driver records, student transport assignments, vehicle maintenance logs, transport circulars, and transport reports.',
    iconName: 'Bus',
    route: '/workspace/transport-manager',
    platforms: ['web'],
    permissions: [
      'students.view', 'staff.view',
      'transport.manage',
      'reports.view',
      'announcements.view',
    ],
    primaryModules: ['Routes', 'Vehicles', 'Drivers', 'Transport Assignments', 'Vehicle Maintenance'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Fleet status overview: active buses on route, morning on-time rates, and upcoming maintenance' },
      { id: 'routes', label: 'Routes', icon: 'MapPin', description: 'Morning and afternoon transit corridors, designated pickup stops, and transit schedule timings', requiredPermission: 'transport.manage', plannedFeatures: ['Route corridor mapping', 'Stop sequence optimizer', 'Detour planner'] },
      { id: 'vehicles', label: 'Vehicles', icon: 'Bus', description: 'Bus fleet registry: registration numbers, seating capacities, safety permits, and fuel cards', requiredPermission: 'transport.manage', plannedFeatures: ['Vehicle asset master', 'Registration renewal alerts', 'First-aid & safety inspection logs'] },
      { id: 'drivers', label: 'Drivers', icon: 'UserCheck', description: 'Commercial driver licenses, attendant assignments, background verification, and health logs', requiredPermission: 'transport.manage', plannedFeatures: ['Driver license validity tracker', 'Daily breathalyzer checklist', 'Attendant duty rosters'] },
      { id: 'transport-assignments', label: 'Transport Assignments', icon: 'Users', description: 'Student and staff bus allocations, designated stop manifests, and route rosters', requiredPermission: 'transport.manage', plannedFeatures: ['Student seat allocator', 'Stop roster sheets for drivers', 'Transfer request handler'] },
      { id: 'vehicle-maintenance', label: 'Vehicle Maintenance', icon: 'Wrench', description: 'Scheduled preventive services, oil changes, brake inspections, tire replacements, and roadworthiness', requiredPermission: 'transport.manage', plannedFeatures: ['Service schedule alerts', 'Odometer mileage log', 'Depot repair order manager'] },
      { id: 'transport-notices', label: 'Transport Notices', icon: 'Bell', description: 'Route delay notices, weather emergency alerts, and parent transit circulars', requiredPermission: 'transport.manage', plannedFeatures: ['Broadcast SMS delay alert', 'Emergency parent notification', 'Holiday schedule broadcast'] },
      { id: 'transport-reports', label: 'Transport Reports', icon: 'FileSpreadsheet', description: 'Fuel efficiency metrics, on-time punctuality percentages, fleet operating expenses, and route audits', requiredPermission: 'reports.view', plannedFeatures: ['Fleet fuel consumption ledger', 'On-time arrival punctuality', 'Cost-per-kilometer report'] },
    ],
    mockStats: [
      { label: 'Active Fleet in Service', value: '28 / 28', change: '100% roadworthy', trend: 'up' },
      { label: 'Morning On-Time Rate', value: '99.1%', change: 'Avg arrival 07:42 AM', trend: 'up' },
      { label: 'Students Commuting', value: '1,640', change: 'Across 28 assigned routes', trend: 'neutral' },
      { label: 'Fleet Fuel Efficiency', value: '8.4 mpg', change: '+0.3 mpg optimized', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'TRN-801', title: 'Bus #09 Route A-4 Highway Detour Plan', subtitle: 'Municipal roadwork detour deployed without delay', tag: 'Routing', status: 'completed', date: 'Oct 19, 2026' },
      { id: 'TRN-802', title: 'Commercial Vehicle Inspection: Bus #14 & #22', subtitle: 'State road transport safety certification passed', tag: 'Inspection', status: 'completed', date: 'Oct 15, 2026' },
      { id: 'TRN-803', title: 'Driver Morning Breathalyzer & Health Check', subtitle: 'All 28 drivers and 28 conductors verified fit', tag: 'Safety', status: 'completed', date: 'Oct 19, 2026' },
      { id: 'TRN-804', title: 'Winter Tire Fleet Fitting Schedule', subtitle: 'Staggered depot maintenance slot reserved for Nov 10', tag: 'Maintenance', status: 'pending', date: 'Oct 25, 2026' },
    ],
  },
  {
    id: 'receptionist',
    name: 'Receptionist / Front Office',
    category: 'Front Office & Visitor Management',
    description: 'Admissions enquiries, visitor register, appointments, parent enquiries, campus communications, and front office records.',
    iconName: 'Building',
    route: '/workspace/receptionist',
    platforms: ['web'],
    permissions: [
      'students.view',
      'staff.view',
      'visitors.manage',
      'admissions.manage',
      'messages.view', 'messages.send',
      'announcements.view',
      'reports.view',
    ],
    primaryModules: ['Admissions Enquiries', 'Visitor Register', 'Appointments', 'Parent Enquiries', 'Communications'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Front desk overview: current visitors on campus, scheduled appointments, and pending tour inquiries' },
      { id: 'admissions-enquiries', label: 'Admissions Enquiries', icon: 'HelpCircle', description: 'Prospective family walk-ins, phone prospectus requests, tour bookings, and intake leads', requiredPermission: 'admissions.manage', plannedFeatures: ['Prospective family lead logger', 'Campus tour schedule', 'Prospectus kit inventory'] },
      { id: 'visitor-register', label: 'Visitor Register', icon: 'BadgeCheck', description: 'Digital gate pass system: visitor photo IDs, visiting purpose, department hosts, and badge checkouts', requiredPermission: 'visitors.manage', plannedFeatures: ['Instant badge generator', 'Host notification alert', 'Security gate pass log'] },
      { id: 'appointments', label: 'Appointments', icon: 'CalendarDays', description: 'Executive appointment schedules: Principal, Vice Principal, and department head meeting calendars', requiredPermission: 'visitors.manage', plannedFeatures: ['Principal calendar scheduler', 'Visitor waiting room tracker', 'Meeting duration log'] },
      { id: 'parent-enquiries', label: 'Parent Enquiries', icon: 'Users', description: 'Front desk parent walk-in issues: fee query assistance, document requests, and bus card reissues', requiredPermission: 'admissions.manage', plannedFeatures: ['Query ticketing desk', 'Department dispatch routing', 'Resolution feedback note'] },
      { id: 'communications', label: 'Communications', icon: 'Mail', description: 'Inward postal dispatches, registered mail registry, courier logging, and official notice boards', requiredPermission: 'messages.view', plannedFeatures: ['Inward courier package log', 'Registered post registry', 'Outgoing dispatch manifest'] },
      { id: 'front-office-records', label: 'Front Office Records', icon: 'FileText', description: 'Daily telephone logs, emergency contact directories, lost & found logs, and gate clearance audits', requiredPermission: 'visitors.manage', plannedFeatures: ['Lost & found property register', 'Campus emergency directory', 'Security daily incident log'] },
    ],
    mockStats: [
      { label: 'Visitors Checked-In Today', value: '34', change: '8 currently on campus', trend: 'neutral' },
      { label: 'Admissions Inquiries Logged', value: '14', change: 'Kindergarten & Grade 1', trend: 'up' },
      { label: 'Scheduled Appointments', value: '11', change: 'All confirmed today', trend: 'up' },
      { label: 'Couriers Logged & Routed', value: '26', change: '100% delivered to wings', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'REC-901', title: 'Visitor Pass #VP-448: Dr. Angela Cooper', subtitle: 'External STEM Accreditation Auditor (Host: Principal)', tag: 'Visitor', status: 'active', date: 'Oct 19, 2026' },
      { id: 'REC-902', title: 'Campus Tour: Prospective Family (Martinez)', subtitle: 'Grade 6 transfer inquiry, escorted by admissions lead', tag: 'Inquiry', status: 'completed', date: 'Oct 19, 2026' },
      { id: 'REC-903', title: 'Registered Post Courier #RP-9921 Received', subtitle: 'State Education Board formal syllabus circulars', tag: 'Dispatch', status: 'completed', date: 'Oct 18, 2026' },
      { id: 'REC-904', title: 'Emergency Contact Drill Log Update', subtitle: 'Telephone tree numbers verified across all 10 departments', tag: 'Safety', status: 'completed', date: 'Oct 16, 2026' },
    ],
  },
  {
    id: 'exam-coordinator',
    name: 'Exam Coordinator',
    category: 'Assessment & Examinations',
    description: 'Exam calendar, examination setup, exam timetable, student registrations, marks workflows, result preparation, publication workflows, and exam reports.',
    iconName: 'ClipboardCheck',
    route: '/workspace/exam-coordinator',
    platforms: ['web'],
    permissions: [
      'students.view',
      'exams.manage',
      'timetable.view',
      'marks.view', 'marks.edit',
      'results.publish',
      'reports.view', 'reports.export',
      'announcements.view',
    ],
    primaryModules: ['Exam Calendar', 'Examination Setup', 'Exam Timetable', 'Marks Workflow', 'Result Publication'],
    navItems: [
      { id: 'overview', label: 'Overview', icon: 'LayoutDashboard', description: 'Exam control overview: upcoming exam countdown, hall ticket readiness, and invigilation coverage' },
      { id: 'exam-calendar', label: 'Exam Calendar', icon: 'CalendarDays', description: 'Annual term exam windows, board examination schedules, and internal milestone deadlines', requiredPermission: 'exams.manage', plannedFeatures: ['Annual assessment calendar', 'Academic council approval milestones', 'Blackout date manager'] },
      { id: 'examination-setup', label: 'Examination Setup', icon: 'Settings', description: 'Subject paper specifications, maximum marks, passing thresholds, and question paper vault tracking', requiredPermission: 'exams.manage', plannedFeatures: ['Exam paper specifications', 'Confidential vault custody register', 'Weightage setup'] },
      { id: 'exam-timetable', label: 'Exam Timetable', icon: 'CalendarRange', description: 'Date-wise exam schedules, hall assignments, desk numbering plans, and student seating quotas', requiredPermission: 'timetable.view', plannedFeatures: ['Hall desk allocator', 'Exam clash detector', 'Batch print timetable generator'] },
      { id: 'exam-registrations', label: 'Exam Registrations', icon: 'Users', description: 'Student exam eligibility check, hall ticket generation, barcode photo passes, and attendance slips', requiredPermission: 'exams.manage', plannedFeatures: ['Eligibility criteria checker', 'Batch hall ticket generator', 'Special accommodation roster'] },
      { id: 'marks-workflow', label: 'Marks Workflow', icon: 'Award', description: 'Teacher marks entry submission tracking, deadline reminders, and moderation review boards', requiredPermission: 'marks.view', plannedFeatures: ['Marks submission progress tracker', 'Missing marks warning alerts', 'Grade moderation panel'] },
      { id: 'result-preparation', label: 'Result Preparation', icon: 'FileCheck', description: 'GPA computation engines, grace marks allocation, grade curve adjustments, and transcript drafts', requiredPermission: 'marks.edit', plannedFeatures: ['GPA calculation engine', 'Grade curve preview', 'Transcript draft generator'] },
      { id: 'result-publication', label: 'Result Publication', icon: 'BookOpenCheck', description: 'Authorized publication sign-off, electronic release to parent portals, and honors roll announcements', requiredPermission: 'results.publish', plannedFeatures: ['Dual authorization release switch', 'Parent portal result push', 'Merit list generator'] },
      { id: 'exam-reports', label: 'Exam Reports', icon: 'FileSpreadsheet', description: 'Grade distribution analysis, subject pass percentages, cross-cohort comparisons, and board submission packs', requiredPermission: 'reports.view', plannedFeatures: ['Grade curve distribution', 'Subject comparison matrix', 'Statutory board return package'] },
    ],
    mockStats: [
      { label: 'Upcoming Term Exams', value: 'Term 1 Finals', change: 'Starts Nov 14, 2026', trend: 'neutral' },
      { label: 'Hall Tickets Prepared', value: '2,480', change: 'Ready for batch print', trend: 'up' },
      { label: 'Invigilation Shifts Allocated', value: '112 / 112', change: 'Zero shift conflicts', trend: 'up' },
      { label: 'Examination Halls Ready', value: '16 Halls', change: 'Desk numbering verified', trend: 'up' },
    ],
    sampleRecords: [
      { id: 'EXM-001', title: 'Midterm Examination Schedule Finalized', subtitle: 'Grades 6 through 12 timetables ratified by Academic Council', tag: 'Schedule', status: 'completed', date: 'Oct 18, 2026' },
      { id: 'EXM-002', title: 'Hall Ticket Generation Batch: Senior School', subtitle: '2,480 barcodes generated with student photo verification', tag: 'Hall Tickets', status: 'completed', date: 'Oct 19, 2026' },
      { id: 'EXM-003', title: 'Invigilation Duty Roster Assignment', subtitle: 'Distributed across 42 senior teachers with backup reserves', tag: 'Invigilation', status: 'active', date: 'Oct 19, 2026' },
      { id: 'EXM-004', title: 'Confidential Question Paper Vault Protocol', subtitle: 'Dual biometric key custody protocol verified with Admin', tag: 'Security', status: 'completed', date: 'Oct 17, 2026' },
    ],
  },
];
