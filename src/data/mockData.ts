export interface LinkedChild {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  avatarInitials: string;
  gpa: string;
  attendancePercent: number;
  attendanceDays: { present: number; total: number };
  tuitionStatus: 'Paid' | 'Due Soon' | 'Overdue';
  outstandingBalance: number;
  classTeacher: string;
  homeroom: string;
  pendingHomeworkCount: number;
  upcomingAssessments: {
    id: string;
    subject: string;
    title: string;
    date: string;
    room: string;
  }[];
  recentHomework: {
    id: string;
    subject: string;
    title: string;
    dueDate: string;
    status: 'submitted' | 'pending' | 'graded';
    grade?: string;
  }[];
  attendanceHistory: {
    date: string;
    status: 'present' | 'absent' | 'late' | 'excused';
    note?: string;
  }[];
}

export interface TeacherClass {
  id: string;
  name: string;
  grade: string;
  section: string;
  subject: string;
  studentCount: number;
  room: string;
  nextPeriodTime: string;
  attendanceTakenToday: boolean;
  students: {
    id: string;
    rollNo: number;
    name: string;
    attendanceToday: 'present' | 'absent' | 'late' | 'excused';
    lastExamGrade: string;
  }[];
}

export interface DemoNotification {
  id: string;
  roleId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'notice' | 'academic' | 'finance' | 'urgent';
  targetModuleId?: string;
}

// 1. SHARED PARENT DEMO DATA
export const DEMO_LINKED_CHILDREN: LinkedChild[] = [
  {
    id: 'child-1-maya',
    name: 'Maya Chen',
    grade: 'Grade 8',
    section: 'Section A',
    rollNumber: '14',
    avatarInitials: 'MC',
    gpa: '3.88 / 4.0',
    attendancePercent: 98.2,
    attendanceDays: { present: 54, total: 55 },
    tuitionStatus: 'Paid',
    outstandingBalance: 0,
    classTeacher: 'Ms. Sarah Henderson',
    homeroom: 'Room 204 (West Wing)',
    pendingHomeworkCount: 2,
    upcomingAssessments: [
      { id: 'asm-101', subject: 'Science (Physics)', title: 'Term 1 Kinematics & Energy Exam', date: 'Nov 14, 2026', room: 'Hall 3' },
      { id: 'asm-102', subject: 'Mathematics', title: 'Polynomials & Linear Systems Test', date: 'Oct 28, 2026', room: 'Room 204' },
    ],
    recentHomework: [
      { id: 'hw-1', subject: 'Mathematics', title: 'Quadratic Equations Exercise 4.2', dueDate: 'Tomorrow, 08:30 AM', status: 'pending' },
      { id: 'hw-2', subject: 'Physics', title: 'Lab Reflection: Pendulum Harmonic Motion', dueDate: 'Oct 22, 2026', status: 'pending' },
      { id: 'hw-3', subject: 'English Literature', title: 'To Kill a Mockingbird Chapter 6 Essay', dueDate: 'Oct 18, 2026', status: 'graded', grade: '94/100 (A)' },
      { id: 'hw-4', subject: 'World History', title: 'Silk Road Trade Routes Document Analysis', dueDate: 'Oct 15, 2026', status: 'submitted' },
    ],
    attendanceHistory: [
      { date: 'Oct 19, 2026', status: 'present' },
      { date: 'Oct 18, 2026', status: 'present' },
      { date: 'Oct 17, 2026', status: 'present' },
      { date: 'Oct 16, 2026', status: 'late', note: '10 min late (Transit delay on Bus #09)' },
      { date: 'Oct 15, 2026', status: 'present' },
      { date: 'Oct 12, 2026', status: 'excused', note: 'Medical appointment (Excused slip verified)' },
      { date: 'Oct 11, 2026', status: 'present' },
    ],
  },
  {
    id: 'child-2-leo',
    name: 'Leo Chen',
    grade: 'Grade 4',
    section: 'Section B',
    rollNumber: '09',
    avatarInitials: 'LC',
    gpa: '3.75 / 4.0',
    attendancePercent: 96.4,
    attendanceDays: { present: 53, total: 55 },
    tuitionStatus: 'Due Soon',
    outstandingBalance: 120.0,
    classTeacher: 'Mr. David Miller',
    homeroom: 'Room 112 (Primary Wing)',
    pendingHomeworkCount: 1,
    upcomingAssessments: [
      { id: 'asm-201', subject: 'Arithmetic', title: 'Fractions & Decimal Operations Quiz', date: 'Oct 28, 2026', room: 'Room 112' },
      { id: 'asm-202', subject: 'General Science', title: 'Plant Ecosystems Project Display', date: 'Nov 05, 2026', room: 'Primary Lab' },
    ],
    recentHomework: [
      { id: 'hw-21', subject: 'Reading & Literacy', title: 'Chapter 4 Reading Journal & Character Map', dueDate: 'Oct 21, 2026', status: 'pending' },
      { id: 'hw-22', subject: 'Math', title: 'Long Division Practice Worksheet #8', dueDate: 'Oct 17, 2026', status: 'graded', grade: '90/100 (A-)' },
      { id: 'hw-23', subject: 'Art & Design', title: 'Autumn Color Palette Botanical Collage', dueDate: 'Oct 14, 2026', status: 'submitted' },
    ],
    attendanceHistory: [
      { date: 'Oct 19, 2026', status: 'present' },
      { date: 'Oct 18, 2026', status: 'present' },
      { date: 'Oct 17, 2026', status: 'present' },
      { date: 'Oct 16, 2026', status: 'present' },
      { date: 'Oct 15, 2026', status: 'absent', note: 'Fever (Doctor note on file)' },
    ],
  },
];

// 2. SHARED TEACHER DEMO DATA
export const DEMO_TEACHER_CLASSES: TeacherClass[] = [
  {
    id: 'class-10a',
    name: 'Grade 10-A',
    grade: 'Grade 10',
    section: 'Section A',
    subject: 'Physics & Mechanics',
    studentCount: 32,
    room: 'Lab 3 (STEM Wing)',
    nextPeriodTime: '10:15 AM – 11:00 AM (Period 3)',
    attendanceTakenToday: true,
    students: [
      { id: 'stu-101', rollNo: 1, name: 'Adrian Vance', attendanceToday: 'present', lastExamGrade: '92% (A)' },
      { id: 'stu-102', rollNo: 2, name: 'Beatrice Lawson', attendanceToday: 'present', lastExamGrade: '88% (B+)' },
      { id: 'stu-103', rollNo: 3, name: 'Clara Oswald', attendanceToday: 'present', lastExamGrade: '95% (A+)' },
      { id: 'stu-104', rollNo: 4, name: 'Daniel Kim', attendanceToday: 'late', lastExamGrade: '84% (B)' },
      { id: 'stu-105', rollNo: 5, name: 'Elena Rostova', attendanceToday: 'present', lastExamGrade: '98% (A+)' },
      { id: 'stu-106', rollNo: 6, name: 'Franklin Wright', attendanceToday: 'absent', lastExamGrade: '76% (C+)' },
      { id: 'stu-107', rollNo: 7, name: 'Gemma Ward', attendanceToday: 'present', lastExamGrade: '89% (B+)' },
      { id: 'stu-108', rollNo: 8, name: 'Henry Ford', attendanceToday: 'present', lastExamGrade: '91% (A)' },
    ],
  },
  {
    id: 'class-9b',
    name: 'Grade 9-B',
    grade: 'Grade 9',
    section: 'Section B',
    subject: 'Core Mathematics',
    studentCount: 28,
    room: 'Room 204 (West Wing)',
    nextPeriodTime: '11:15 AM – 12:00 PM (Period 4)',
    attendanceTakenToday: false,
    students: [
      { id: 'stu-201', rollNo: 1, name: 'Austin Bailey', attendanceToday: 'present', lastExamGrade: '86% (B)' },
      { id: 'stu-202', rollNo: 2, name: 'Brianna Scott', attendanceToday: 'present', lastExamGrade: '93% (A)' },
      { id: 'stu-203', rollNo: 3, name: 'Cameron Diaz', attendanceToday: 'present', lastExamGrade: '80% (B-)' },
      { id: 'stu-204', rollNo: 4, name: 'Dakota Fanning', attendanceToday: 'present', lastExamGrade: '89% (B+)' },
      { id: 'stu-205', rollNo: 5, name: 'Ethan Hunt', attendanceToday: 'present', lastExamGrade: '94% (A)' },
      { id: 'stu-206', rollNo: 6, name: 'Fiona Gallagher', attendanceToday: 'present', lastExamGrade: '88% (B+)' },
    ],
  },
  {
    id: 'class-11a',
    name: 'Grade 11-A',
    grade: 'Grade 11',
    section: 'Section A',
    subject: 'Advanced Mechanics & Calculus',
    studentCount: 24,
    room: 'Room 310 (East Wing)',
    nextPeriodTime: '01:45 PM – 02:30 PM (Period 6)',
    attendanceTakenToday: true,
    students: [
      { id: 'stu-301', rollNo: 1, name: 'Alexander Pope', attendanceToday: 'present', lastExamGrade: '96% (A+)' },
      { id: 'stu-302', rollNo: 2, name: 'Bernadette Peters', attendanceToday: 'present', lastExamGrade: '91% (A)' },
      { id: 'stu-303', rollNo: 3, name: 'Christopher Nolan', attendanceToday: 'present', lastExamGrade: '98% (A+)' },
    ],
  },
];

// 3. DETERMINISTIC ROLE NOTIFICATIONS
export const INITIAL_NOTIFICATIONS: DemoNotification[] = [
  // Admin
  { id: 'notif-1', roleId: 'admin', title: 'Annual Fire Safety Audit Verification', message: 'City Fire Marshall endorsement certified for all campus blocks.', timestamp: '10 min ago', read: false, type: 'notice', targetModuleId: 'academics' },
  { id: 'notif-2', roleId: 'admin', title: 'Admissions Intake Milestone', message: '2026-27 cohort capacity reached 94.2%. 120 waitlist applications pending.', timestamp: '2 hours ago', read: false, type: 'academic', targetModuleId: 'admissions' },
  { id: 'notif-3', roleId: 'admin', title: 'Quarterly Cybersecurity Scan Passed', message: 'External penetration audit verified zero vulnerabilities across gateway.', timestamp: 'Yesterday', read: true, type: 'notice', targetModuleId: 'settings' },

  // Vice Principal
  { id: 'notif-4', roleId: 'vice-principal', title: 'Substitute Coverage Resolved', message: 'All 4 teacher leaves for today have assigned department cover periods.', timestamp: '25 min ago', read: false, type: 'academic', targetModuleId: 'teacher-coordination' },
  { id: 'notif-5', roleId: 'vice-principal', title: 'Grade 10 Lab Rotation Approved', message: 'STEM Wing Physics laboratory shift schedule ratified for Term 1.', timestamp: '3 hours ago', read: true, type: 'notice', targetModuleId: 'timetable' },

  // Teacher
  { id: 'notif-6', roleId: 'teacher', title: 'Pending Attendance: Grade 9-B', message: 'Please submit period 4 attendance for Core Mathematics before 12:30 PM.', timestamp: '15 min ago', read: false, type: 'urgent', targetModuleId: 'attendance' },
  { id: 'notif-7', roleId: 'teacher', title: '18 Homework Submissions Received', message: 'Grade 10-A Algebra Chapter Test ready for review and marks entry.', timestamp: '1 hour ago', read: false, type: 'academic', targetModuleId: 'assignments' },
  { id: 'notif-8', roleId: 'teacher', title: 'Parent Message from Mrs. Chen', message: 'Inquiry regarding Maya Chen upcoming Science Fair project materials.', timestamp: 'Yesterday', read: true, type: 'notice', targetModuleId: 'messages' },

  // Parent
  { id: 'notif-9', roleId: 'parent', title: 'Term 1 Final Report Card Published', message: 'Maya Chen report card released. Overall GPA: 3.88 / 4.0 (Honors Roll).', timestamp: '30 min ago', read: false, type: 'academic', targetModuleId: 'examinations-results' },
  { id: 'notif-10', roleId: 'parent', title: 'Science Museum Educational Tour Consent', message: 'Electronic permission slip required for Grade 8 annual field excursion.', timestamp: '2 hours ago', read: false, type: 'notice', targetModuleId: 'announcements' },
  { id: 'notif-11', roleId: 'parent', title: 'Term 2 Tuition Invoice #SCH-8841', message: 'Tuition clearance processed successfully. Zero outstanding dues.', timestamp: '2 days ago', read: true, type: 'finance', targetModuleId: 'fee-information' },

  // Accountant
  { id: 'notif-12', roleId: 'accountant', title: 'Batch Fee Run Completed', message: '2,480 automated invoices generated with online clearing links.', timestamp: '1 hour ago', read: false, type: 'finance', targetModuleId: 'student-fee-records' },
  { id: 'notif-13', roleId: 'accountant', title: 'Laboratory PO-902 Voucher Signed', message: 'Dual-sign approval completed for STEM chemical consumables.', timestamp: '4 hours ago', read: true, type: 'finance', targetModuleId: 'receipts' },

  // HR Manager
  { id: 'notif-14', roleId: 'hr-manager', title: 'New Faculty Onboarding Verified', message: 'Ms. Elena Rostova background verification and security pass issued.', timestamp: '1 hour ago', read: false, type: 'notice', targetModuleId: 'staff-profiles' },
  { id: 'notif-15', roleId: 'hr-manager', title: '3 Pending Leave Requests', message: 'Medical and duty leave approvals required for senior faculty.', timestamp: '3 hours ago', read: false, type: 'urgent', targetModuleId: 'leave-management' },

  // Librarian
  { id: 'notif-16', roleId: 'librarian', title: 'Overdue Recall Delivery', message: '18 automated return reminders successfully delivered to student inboxes.', timestamp: '45 min ago', read: false, type: 'notice', targetModuleId: 'overdue-books' },
  { id: 'notif-17', roleId: 'librarian', title: '65 New Volumes Delivered', message: 'Contemporary Fiction collection ready for Dewey decimal cataloging.', timestamp: 'Yesterday', read: true, type: 'academic', targetModuleId: 'book-catalogue' },

  // Transport Manager
  { id: 'notif-18', roleId: 'transport-manager', title: 'Route A-4 Roadwork Detour Clear', message: 'Bus #09 completed morning corridor on time without delay.', timestamp: '20 min ago', read: false, type: 'notice', targetModuleId: 'routes' },
  { id: 'notif-19', roleId: 'transport-manager', title: 'Fleet Inspection Certificate Passed', message: 'Buses #14 and #22 passed state commercial roadworthiness test.', timestamp: 'Yesterday', read: true, type: 'notice', targetModuleId: 'vehicles' },

  // Receptionist
  { id: 'notif-20', roleId: 'receptionist', title: 'Accreditation Auditor Arrived', message: 'Dr. Angela Cooper checked in at front desk (Host: Principal).', timestamp: '10 min ago', read: false, type: 'notice', targetModuleId: 'visitor-register' },
  { id: 'notif-21', roleId: 'receptionist', title: 'State Syllabus Circulars Logged', message: 'Registered post #RP-9921 received and routed to VP office.', timestamp: '3 hours ago', read: true, type: 'notice', targetModuleId: 'communications' },

  // Exam Coordinator
  { id: 'notif-22', roleId: 'exam-coordinator', title: 'Term 1 Exam Schedule Ratified', message: 'Timetable approved by Academic Council. 16 halls numbered.', timestamp: '35 min ago', read: false, type: 'academic', targetModuleId: 'exam-timetable' },
  { id: 'notif-23', roleId: 'exam-coordinator', title: 'Hall Tickets Ready for Batch Print', message: '2,480 student barcodes verified against eligibility registers.', timestamp: '2 hours ago', read: false, type: 'notice', targetModuleId: 'exam-registrations' },
];
