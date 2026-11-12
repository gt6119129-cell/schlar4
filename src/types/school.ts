export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface ClassGrade {
  id: string;
  name: string;
  academicYearId: string;
  description: string;
  status: 'active' | 'archived';
}

export interface Section {
  id: string;
  name: string;
  classId: string;
  className: string;
  academicYearId: string;
  classTeacherId?: string;
  classTeacherName?: string;
  capacity: number;
  room: string;
  status: 'active' | 'archived';
}

export interface Guardian {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  linkedStudentIds: string[];
}

export interface Student {
  id: string;
  admissionNo: string;
  name: string;
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Other';
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  academicYearId: string;
  guardianId: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  enrollmentStatus: 'active' | 'inactive' | 'graduated' | 'transferred';
  admissionDate: string;
  gpa?: string;
  notes?: string;
  additionalGuardianIds?: string[];
  transferHistory?: { fromSection: string; toSection: string; date: string; reason?: string }[];
}

export interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  designation: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'on-leave' | 'resigned';
  joinDate: string;
  assignedSubjects: string[];
  assignedSections: { sectionId: string; sectionName: string; subject: string }[];
  notes?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  department: string;
  status?: 'active' | 'archived';
  category?: 'Core' | 'Elective' | 'Laboratory' | 'Vocational';
  credits?: number;
}

export interface TimetablePeriod {
  id: string;
  sectionId: string;
  sectionName: string;
  dayOfWeek: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  room: string;
  isBreak?: boolean;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  classId: string;
  sectionId: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  recordedBy: string;
  notes?: string;
}

export type AdmissionStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up Required'
  | 'Application Received'
  | 'Under Review'
  | 'Accepted'
  | 'Rejected'
  | 'Enrolled';

export interface AdmissionEnquiry {
  id: string;
  enquiryNo: string;
  applicantName: string;
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Other';
  intendedClassId: string;
  intendedClassName: string;
  guardianName: string;
  guardianRelationship: string;
  guardianPhone: string;
  guardianEmail: string;
  guardianAddress?: string;
  source: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  enquiryDate: string;
  followUpDate?: string;
  status: AdmissionStatus;
  notes: string;
  convertedStudentId?: string;
}

export interface SchoolProfile {
  name: string;
  motto: string;
  email: string;
  phone: string;
  address: string;
  currentAcademicYear: string;
  currentTerm: string;
  timezone: string;
  principalName: string;
  affiliationNo: string;
  establishedYear: string;
}

export interface FeeSummaryData {
  expectedTotal: number;
  collectedTotal: number;
  outstandingTotal: number;
  collectionRate: number;
  recentTransactions: {
    id: string;
    studentId: string;
    studentName: string;
    gradeSection: string;
    amount: number;
    date: string;
    paymentMethod: 'Bank Wire / ACH' | 'Debit Card' | 'Cheque' | 'Cash';
    status: 'cleared' | 'pending';
    invoiceNumber: string;
  }[];
}

export interface SchoolRoom {
  id: string;
  name: string;
  building: string;
  capacity: number;
  type: 'Classroom' | 'Laboratory' | 'Auditorium' | 'Special';
  status: 'active' | 'maintenance';
}

export interface BellSchedulePeriod {
  id: string;
  periodNumber: number;
  name: string;
  startTime: string;
  endTime: string;
  type: 'assembly' | 'lesson' | 'break' | 'lunch';
}

export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}

export interface GradingScale {
  grade: string;
  gpa: number;
  minScore: number;
  maxScore: number;
  description: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  user: string;
  actorName?: string;
  actorRole?: string;
  action: string;
  module: string;
  category?: string;
  targetEntity?: string;
  details: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SchoolAssignment {
  id: string;
  title: string;
  instructions: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectName: string;
  type: 'Homework' | 'Project' | 'Quiz' | 'Lab Report' | 'Essay';
  assignedDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  maxMarks: number;
  status: 'draft' | 'published' | 'closed';
  teacherId: string;
  teacherName: string;
  submissionsCount: number;
  totalStudents: number;
  gradedCount: number;
}

export interface SchoolExam {
  id: string;
  name: string;
  termId: string;
  termName: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'marks_entry' | 'review' | 'published';
  academicYearId: string;
}

export interface AssessmentTask {
  id: string;
  examId: string;
  examName: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectName: string;
  examDate: string;
  startTime: string;
  durationMinutes: number;
  maxMarks: number;
  room: string;
  teacherId: string;
  teacherName: string;
  status: 'scheduled' | 'conducted' | 'marks_pending' | 'submitted' | 'reviewed' | 'published';
}

export interface StudentMarkEntry {
  id: string;
  assessmentId: string;
  examId: string;
  studentId: string;
  studentName: string;
  rollNo?: number;
  classId: string;
  sectionId: string;
  subjectName: string;
  marksObtained: number | null; // null if absent
  isAbsent?: boolean;
  maxMarks: number;
  grade?: string;
  teacherFeedback?: string;
  status: 'draft' | 'submitted' | 'reviewed' | 'published';
  enteredByStaffId: string;
  updatedAt: string;
}

export interface SyllabusTopic {
  id: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectName: string;
  chapterNo: number;
  topicTitle: string;
  totalLessons: number;
  completedLessons: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'reviewed';
  teacherId: string;
  teacherName: string;
  teacherNotes?: string;
  vpNotes?: string;
  vpReviewed: boolean;
  lastUpdated: string;
}

export interface LessonPlan {
  id: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectName: string;
  plannedDate: string;
  topic: string;
  learningObjectives: string;
  resources: string;
  status: 'draft' | 'submitted' | 'approved';
  vpFeedback?: string;
}

export interface StudentIntervention {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  category: 'Academic' | 'Attendance' | 'Behavioral' | 'Wellness';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  actionTaken: string;
  responsibleStaffId: string;
  responsibleStaffName: string;
  followUpDate: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  reviewNotes: string;
  createdAt: string;
}

export interface AcademicApproval {
  id: string;
  type: 'Syllabus Completion Sign-off' | 'Marks Moderation Request' | 'Attendance Correction Review' | 'Lesson Plan Approval' | 'Assessment Waiver';
  title: string;
  requestedByStaffId: string;
  requestedByStaffName: string;
  role: string;
  submissionDate: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  subjectName: string;
  details: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  reviewReason?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SchoolAnnouncement {
  id: string;
  title: string;
  content: string;
  targetAudience: 'all' | 'faculty' | 'class' | 'parents';
  classId?: string;
  className?: string;
  sectionId?: string;
  authorStaffId: string;
  authorStaffName: string;
  authorRole: string;
  publishDate: string;
  priority: 'normal' | 'important' | 'urgent';
  category: 'Academic' | 'Administrative' | 'Event' | 'Examination';
  status: 'draft' | 'published';
}
