import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ClassGrade,
  Section,
  Guardian,
  Student,
  StaffMember,
  Subject,
  TimetablePeriod,
  AttendanceRecord,
  AdmissionEnquiry,
  SchoolProfile,
  FeeSummaryData,
  DayOfWeek,
  SchoolRoom,
  BellSchedulePeriod,
  AcademicTerm,
  GradingScale,
  AdminAuditLog,
  SchoolAssignment,
  SchoolExam,
  AssessmentTask,
  StudentMarkEntry,
  SyllabusTopic,
  LessonPlan,
  StudentIntervention,
  AcademicApproval,
  SchoolAnnouncement,
} from '../types/school';
import {
  INITIAL_CLASSES,
  INITIAL_SECTIONS,
  INITIAL_GUARDIANS,
  INITIAL_STUDENTS,
  INITIAL_STAFF,
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_ATTENDANCE,
  INITIAL_ADMISSIONS,
  INITIAL_SCHOOL_PROFILE,
  INITIAL_FEES_SUMMARY,
  INITIAL_ROOMS,
  INITIAL_BELL_SCHEDULE,
  INITIAL_ACADEMIC_TERMS,
  INITIAL_GRADING_SCALE,
  INITIAL_ADMIN_AUDIT_LOGS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EXAMS,
  INITIAL_ASSESSMENT_TASKS,
  INITIAL_MARKS,
  INITIAL_SYLLABUS,
  INITIAL_LESSON_PLANS,
  INITIAL_INTERVENTIONS,
  INITIAL_APPROVALS,
  INITIAL_ANNOUNCEMENTS,
} from '../data/initialSchoolData';
// Cross-Role Types
import {
  FeeStructure,
  StudentFeeObligation,
  FeeConcession,
  FeePaymentTransaction,
  PaymentMethod,
} from '../types/finance';
import {
  BookTitle,
  BookCopy,
  LibraryMember,
  BookLoan,
  BookReservation,
  LibraryFine,
} from '../types/library';
import {
  Vehicle,
  TransportDriver,
  TransportRoute,
  StudentTransportAssignment,
  TransportBoardingRecord,
  TransportServiceType,
  TransportAssignmentStatus,
} from '../types/transport';
import {
  VisitorIdentity,
  VisitRecord,
  FrontOfficeEnquiry,
  FrontOfficeAppointment,
  CallLogRecord,
  ReceptionRequest,
  DocumentRequestRecord,
  RequestStatus,
  DocumentRequestStatus,
} from '../types/reception';
// Cross-Role Initial Data
import {
  INITIAL_FEE_STRUCTURES,
  INITIAL_STUDENT_OBLIGATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_CONCESSIONS,
} from '../data/initialFinanceData';
import {
  INITIAL_BOOK_TITLES,
  INITIAL_BOOK_COPIES,
  INITIAL_LIBRARY_MEMBERS,
  INITIAL_BOOK_LOANS,
  INITIAL_BOOK_RESERVATIONS,
  INITIAL_LIBRARY_FINES,
} from '../data/initialLibraryData';
import {
  INITIAL_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_ROUTES,
  INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS,
  INITIAL_BOARDING_RECORDS,
} from '../data/initialTransportData';
import {
  INITIAL_VISITORS,
  INITIAL_VISITS,
  INITIAL_FRONT_OFFICE_ENQUIRIES,
  INITIAL_APPOINTMENTS,
  INITIAL_CALL_LOGS,
  INITIAL_RECEPTION_REQUESTS,
  INITIAL_DOCUMENT_REQUESTS,
} from '../data/initialReceptionData';

const STORAGE_KEY_SCHOOL_DATA = 'schlar_school_data_v1';

export interface ValidationFeedback {
  isValid: boolean;
  message?: string;
  field?: string;
  conflictingEntity?: any;
}

interface SchoolDataContextValue {
  classes: ClassGrade[];
  sections: Section[];
  students: Student[];
  guardians: Guardian[];
  staff: StaffMember[];
  subjects: Subject[];
  timetable: TimetablePeriod[];
  attendance: AttendanceRecord[];
  admissions: AdmissionEnquiry[];
  schoolProfile: SchoolProfile;
  feesSummary: FeeSummaryData;
  rooms: SchoolRoom[];
  bellSchedule: BellSchedulePeriod[];
  academicTerms: AcademicTerm[];
  gradingScale: GradingScale[];
  auditLogs: AdminAuditLog[];

  // Room actions
  addRoom: (data: Omit<SchoolRoom, 'id'>) => ValidationFeedback;
  updateRoom: (id: string, data: Partial<SchoolRoom>) => ValidationFeedback;

  // Bell & Schedule actions
  updateBellSchedule: (schedule: BellSchedulePeriod[]) => void;

  // Academic Term actions
  updateAcademicTerms: (terms: AcademicTerm[]) => void;

  // Grading scale
  updateGradingScale: (scale: GradingScale[]) => void;

  // Audit Log
  addAuditLog: (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => void;

  // Class actions
  addClass: (data: Omit<ClassGrade, 'id' | 'status'>) => ValidationFeedback;
  updateClass: (id: string, data: Partial<ClassGrade>) => ValidationFeedback;
  archiveClass: (id: string) => ValidationFeedback;
  restoreClass: (id: string) => ValidationFeedback;

  // Section actions
  addSection: (data: Omit<Section, 'id' | 'status' | 'className'>) => ValidationFeedback;
  updateSection: (id: string, data: Partial<Section>) => ValidationFeedback;
  archiveSection: (id: string) => ValidationFeedback;
  restoreSection: (id: string) => ValidationFeedback;

  // Student actions
  addStudent: (data: Omit<Student, 'id'>) => ValidationFeedback;
  updateStudent: (id: string, data: Partial<Student>) => ValidationFeedback;
  archiveStudent: (id: string) => ValidationFeedback;
  restoreStudent: (id: string) => ValidationFeedback;
  transferStudentSection: (studentId: string, targetSectionId: string, reason?: string) => ValidationFeedback;
  bulkUpdateStudentStatus: (studentIds: string[], status: 'active' | 'inactive' | 'transferred' | 'graduated') => void;

  // Guardian actions
  addGuardian: (data: Omit<Guardian, 'id' | 'linkedStudentIds'>) => Guardian;
  updateGuardian: (id: string, data: Partial<Guardian>) => void;
  linkAdditionalGuardian: (studentId: string, guardianId: string) => ValidationFeedback;
  unlinkGuardian: (studentId: string, guardianId: string) => ValidationFeedback;

  // Staff actions
  addStaff: (data: Omit<StaffMember, 'id'>) => ValidationFeedback;
  updateStaff: (id: string, data: Partial<StaffMember>) => ValidationFeedback;
  archiveStaff: (id: string) => ValidationFeedback;
  restoreStaff: (id: string) => ValidationFeedback;
  assignSubjectTeacher: (staffId: string, subjectName: string, sectionId: string) => ValidationFeedback;
  removeSubjectTeacher: (staffId: string, sectionId: string, subjectName: string) => void;

  // Subject actions
  addSubject: (data: Omit<Subject, 'id'>) => ValidationFeedback;
  updateSubject: (id: string, data: Partial<Subject>) => ValidationFeedback;
  archiveSubject: (id: string) => ValidationFeedback;
  restoreSubject: (id: string) => ValidationFeedback;

  // Timetable actions
  validateTimetableSlot: (
    slot: Omit<TimetablePeriod, 'id'>,
    excludePeriodId?: string
  ) => { hasConflict: boolean; reason?: string; conflictingPeriod?: TimetablePeriod };
  addTimetablePeriod: (period: Omit<TimetablePeriod, 'id'>) => ValidationFeedback;
  updateTimetablePeriod: (id: string, data: Partial<TimetablePeriod>) => ValidationFeedback;
  deleteTimetablePeriod: (id: string) => void;

  // Attendance actions
  recordAttendanceBatch: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Admissions actions
  addAdmissionEnquiry: (data: Omit<AdmissionEnquiry, 'id' | 'enquiryNo'>) => ValidationFeedback;
  updateAdmissionEnquiry: (id: string, data: Partial<AdmissionEnquiry>) => ValidationFeedback;
  convertEnquiryToStudent: (
    enquiryId: string,
    studentDetails: {
      admissionNo: string;
      sectionId: string;
      admissionDate: string;
      gender?: 'Female' | 'Male' | 'Other';
    }
  ) => ValidationFeedback;

  // Prompt 4 Shared Entities
  assignments: SchoolAssignment[];
  exams: SchoolExam[];
  assessmentTasks: AssessmentTask[];
  marks: StudentMarkEntry[];
  syllabus: SyllabusTopic[];
  lessonPlans: LessonPlan[];
  interventions: StudentIntervention[];
  approvals: AcademicApproval[];
  announcements: SchoolAnnouncement[];

  // Cross-Role Module 1: Finance
  feeStructures: FeeStructure[];
  studentFeeObligations: StudentFeeObligation[];
  feeTransactions: FeePaymentTransaction[];
  feeConcessions: FeeConcession[];
  addFeeStructure: (data: Omit<FeeStructure, 'id'>) => ValidationFeedback;
  updateFeeStructure: (id: string, data: Partial<FeeStructure>) => ValidationFeedback;
  archiveFeeStructure: (id: string) => ValidationFeedback;
  recordFeePayment: (params: {
    studentId: string;
    obligationIds: string[];
    amountPaid: number;
    paymentMethod: PaymentMethod;
    transactionRef: string;
    notes?: string;
    collectedByStaffId?: string;
  }) => { success: boolean; receipt?: FeePaymentTransaction; message: string };
  getStudentFeeLedger: (studentId: string) => {
    obligations: StudentFeeObligation[];
    transactions: FeePaymentTransaction[];
    totalAssessed: number;
    totalConcession: number;
    totalNet: number;
    totalPaid: number;
    totalBalance: number;
    status: 'Paid in Full' | 'Partially Paid' | 'Due Soon';
  };

  // Cross-Role Module 2: Library
  bookTitles: BookTitle[];
  bookCopies: BookCopy[];
  libraryMembers: LibraryMember[];
  bookLoans: BookLoan[];
  bookReservations: BookReservation[];
  libraryFines: LibraryFine[];
  issueBookLoan: (params: {
    memberId: string;
    copyId: string;
    dueDate: string;
    notes?: string;
    issuedByStaffId?: string;
  }) => ValidationFeedback & { loan?: BookLoan };
  returnBookLoan: (
    loanId: string,
    condition?: BookCopy['condition'],
    remarks?: string
  ) => ValidationFeedback;
  addBookTitle: (
    data: Omit<BookTitle, 'id' | 'availableCopies'>,
    copiesCount?: number
  ) => ValidationFeedback;
  updateBookTitle: (id: string, data: Partial<BookTitle>) => ValidationFeedback;
  getStudentLibrarySummary: (studentId: string) => {
    member: LibraryMember | undefined;
    activeLoans: BookLoan[];
    overdueLoans: BookLoan[];
    totalFines: number;
  };

  // Cross-Role Module 3: Transport
  transportVehicles: Vehicle[];
  transportDrivers: TransportDriver[];
  transportRoutes: TransportRoute[];
  studentTransportAssignments: StudentTransportAssignment[];
  transportBoardingRecords: TransportBoardingRecord[];
  addTransportRoute: (
    data: Omit<TransportRoute, 'id' | 'assignedStudentCount'>
  ) => ValidationFeedback;
  updateTransportRoute: (id: string, data: Partial<TransportRoute>) => ValidationFeedback;
  deleteTransportRoute: (id: string) => ValidationFeedback;
  assignStudentTransport: (params: {
    studentId: string;
    routeId: string;
    pickupStopId: string;
    dropoffStopId: string;
    serviceType: TransportServiceType;
    notes?: string;
  }) => ValidationFeedback & { assignment?: StudentTransportAssignment };
  unassignStudentTransport: (assignmentId: string) => ValidationFeedback;
  updateStudentTransportStatus: (
    assignmentId: string,
    status: TransportAssignmentStatus
  ) => ValidationFeedback;
  getStudentTransportSummary: (studentId: string) => {
    assignment: StudentTransportAssignment | undefined;
    route: TransportRoute | undefined;
    vehicle: Vehicle | undefined;
    driver: TransportDriver | undefined;
  };

  // Cross-Role Module 4: Reception & Front Office
  visitors: VisitorIdentity[];
  visits: VisitRecord[];
  frontOfficeEnquiries: FrontOfficeEnquiry[];
  frontOfficeAppointments: FrontOfficeAppointment[];
  receptionCalls: CallLogRecord[];
  receptionRequests: ReceptionRequest[];
  documentRequests: DocumentRequestRecord[];
  checkInVisitor: (data: {
    visitorName: string;
    category: VisitorIdentity['category'];
    phone: string;
    organization?: string;
    purpose: string;
    hostStaffName: string;
    hostStaffId: string;
    department: string;
    groupSize?: number;
    vehicleNumber?: string;
  }) => ValidationFeedback & { visit?: VisitRecord };
  checkOutVisitor: (visitId: string) => ValidationFeedback;
  addReceptionEnquiry: (data: Omit<FrontOfficeEnquiry, 'id' | 'enquiryNo' | 'enquiryDate' | 'isConverted'>) => ValidationFeedback;
  updateReceptionEnquiryStatus: (id: string, status: FrontOfficeEnquiry['status'], notes?: string) => void;
  updateDocumentRequestStatus: (id: string, status: DocumentRequestStatus, deliveryNotes?: string) => void;

  // Cross-Role Query Helpers
  getParentWards: (guardianIdOrPhone: string) => Student[];
  getStaffAssignmentsSummary: (staffId: string) => {
    timetablePeriods: TimetablePeriod[];
    sections: Section[];
    subjects: string[];
    pendingApprovals: AcademicApproval[];
  };

  // Assignment actions
  addAssignment: (data: Omit<SchoolAssignment, 'id' | 'submissionsCount' | 'gradedCount'>) => ValidationFeedback;
  updateAssignment: (id: string, data: Partial<SchoolAssignment>) => ValidationFeedback;
  deleteAssignment: (id: string) => void;

  // Exam actions
  addExam: (data: Omit<SchoolExam, 'id'>) => ValidationFeedback;
  updateExam: (id: string, data: Partial<SchoolExam>) => ValidationFeedback;
  deleteExam: (id: string) => ValidationFeedback;
  addAssessmentTask: (data: Omit<AssessmentTask, 'id'>) => ValidationFeedback;
  updateAssessmentTask: (id: string, data: Partial<AssessmentTask>) => ValidationFeedback;
  deleteAssessmentTask: (id: string) => ValidationFeedback;

  // Marks actions
  saveMarksBatch: (
    assessmentId: string,
    entries: {
      studentId: string;
      studentName: string;
      marksObtained: number | null;
      isAbsent?: boolean;
      teacherFeedback?: string;
      grade?: string;
    }[],
    submitForReview?: boolean,
    enteredByStaffId?: string
  ) => ValidationFeedback;
  publishAssessmentResults: (taskId: string, examId?: string) => ValidationFeedback;

  // Syllabus actions
  updateSyllabusTopic: (id: string, data: Partial<SyllabusTopic>) => void;
  reviewSyllabusTopic: (id: string, vpNotes: string, approve: boolean) => void;

  // Lesson Plan actions
  addLessonPlan: (data: Omit<LessonPlan, 'id'>) => ValidationFeedback;
  updateLessonPlan: (id: string, data: Partial<LessonPlan>) => ValidationFeedback;
  approveLessonPlan: (id: string, feedback?: string) => void;

  // Intervention actions
  addIntervention: (data: Omit<StudentIntervention, 'id' | 'createdAt'>) => ValidationFeedback;
  updateIntervention: (id: string, data: Partial<StudentIntervention>) => ValidationFeedback;

  // Approvals actions
  processApproval: (
    id: string,
    decision: 'approved' | 'rejected' | 'returned',
    reason?: string,
    reviewerName?: string
  ) => ValidationFeedback;

  // Announcements & Notices
  addAnnouncement: (data: Omit<SchoolAnnouncement, 'id' | 'publishDate'>) => ValidationFeedback;
  updateAnnouncement: (id: string, data: Partial<SchoolAnnouncement>) => void;

  // Settings
  updateSchoolProfile: (profile: Partial<SchoolProfile>) => void;
  resetAllSchoolDataToDefaults: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextValue | null>(null);

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persistent school data or initialize from seed
  const [dataLoaded, setDataLoaded] = useState(false);

  const [classes, setClasses] = useState<ClassGrade[]>(INITIAL_CLASSES);
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);
  const [guardians, setGuardians] = useState<Guardian[]>(INITIAL_GUARDIANS);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [timetable, setTimetable] = useState<TimetablePeriod[]>(INITIAL_TIMETABLE);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(INITIAL_ATTENDANCE);
  const [admissions, setAdmissions] = useState<AdmissionEnquiry[]>(INITIAL_ADMISSIONS);
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(INITIAL_SCHOOL_PROFILE);
  const [feesSummary, setFeesSummary] = useState<FeeSummaryData>(INITIAL_FEES_SUMMARY);
  const [rooms, setRooms] = useState<SchoolRoom[]>(INITIAL_ROOMS);
  const [bellSchedule, setBellSchedule] = useState<BellSchedulePeriod[]>(INITIAL_BELL_SCHEDULE);
  const [academicTerms, setAcademicTerms] = useState<AcademicTerm[]>(INITIAL_ACADEMIC_TERMS);
  const [gradingScale, setGradingScale] = useState<GradingScale[]>(INITIAL_GRADING_SCALE);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(INITIAL_ADMIN_AUDIT_LOGS);

  // Prompt 4 entities state
  const [assignments, setAssignments] = useState<SchoolAssignment[]>(INITIAL_ASSIGNMENTS);
  const [exams, setExams] = useState<SchoolExam[]>(INITIAL_EXAMS);
  const [assessmentTasks, setAssessmentTasks] = useState<AssessmentTask[]>(INITIAL_ASSESSMENT_TASKS);
  const [marks, setMarks] = useState<StudentMarkEntry[]>(INITIAL_MARKS);
  const [syllabus, setSyllabus] = useState<SyllabusTopic[]>(INITIAL_SYLLABUS);
  const [lessonPlans, setLessonPlans] = useState<LessonPlan[]>(INITIAL_LESSON_PLANS);
  const [interventions, setInterventions] = useState<StudentIntervention[]>(INITIAL_INTERVENTIONS);
  const [approvals, setApprovals] = useState<AcademicApproval[]>(INITIAL_APPROVALS);
  const [announcements, setAnnouncements] = useState<SchoolAnnouncement[]>(INITIAL_ANNOUNCEMENTS);

  // Cross-Role Module 1: Finance State
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>(INITIAL_FEE_STRUCTURES);
  const [studentFeeObligations, setStudentFeeObligations] = useState<StudentFeeObligation[]>(INITIAL_STUDENT_OBLIGATIONS);
  const [feeTransactions, setFeeTransactions] = useState<FeePaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [feeConcessions, setFeeConcessions] = useState<FeeConcession[]>(INITIAL_CONCESSIONS);

  // Cross-Role Module 2: Library State
  const [bookTitles, setBookTitles] = useState<BookTitle[]>(INITIAL_BOOK_TITLES);
  const [bookCopies, setBookCopies] = useState<BookCopy[]>(INITIAL_BOOK_COPIES);
  const [libraryMembers, setLibraryMembers] = useState<LibraryMember[]>(INITIAL_LIBRARY_MEMBERS);
  const [bookLoans, setBookLoans] = useState<BookLoan[]>(INITIAL_BOOK_LOANS);
  const [bookReservations, setBookReservations] = useState<BookReservation[]>(INITIAL_BOOK_RESERVATIONS);
  const [libraryFines, setLibraryFines] = useState<LibraryFine[]>(INITIAL_LIBRARY_FINES);

  // Cross-Role Module 3: Transport State
  const [transportVehicles, setTransportVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [transportDrivers, setTransportDrivers] = useState<TransportDriver[]>(INITIAL_DRIVERS);
  const [transportRoutes, setTransportRoutes] = useState<TransportRoute[]>(INITIAL_ROUTES);
  const [studentTransportAssignments, setStudentTransportAssignments] = useState<StudentTransportAssignment[]>(INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS);
  const [transportBoardingRecords, setTransportBoardingRecords] = useState<TransportBoardingRecord[]>(INITIAL_BOARDING_RECORDS);

  // Cross-Role Module 4: Reception State
  const [visitors, setVisitors] = useState<VisitorIdentity[]>(INITIAL_VISITORS);
  const [visits, setVisits] = useState<VisitRecord[]>(INITIAL_VISITS);
  const [frontOfficeEnquiries, setFrontOfficeEnquiries] = useState<FrontOfficeEnquiry[]>(INITIAL_FRONT_OFFICE_ENQUIRIES);
  const [frontOfficeAppointments, setFrontOfficeAppointments] = useState<FrontOfficeAppointment[]>(INITIAL_APPOINTMENTS);
  const [receptionCalls, setReceptionCalls] = useState<CallLogRecord[]>(INITIAL_CALL_LOGS);
  const [receptionRequests, setReceptionRequests] = useState<ReceptionRequest[]>(INITIAL_RECEPTION_REQUESTS);
  const [documentRequests, setDocumentRequests] = useState<DocumentRequestRecord[]>(INITIAL_DOCUMENT_REQUESTS);

  // Initialize from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCHOOL_DATA);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.classes) setClasses(parsed.classes);
        if (parsed.sections) setSections(parsed.sections);
        if (parsed.guardians) setGuardians(parsed.guardians);
        if (parsed.students) setStudents(parsed.students);
        if (parsed.staff) setStaff(parsed.staff);
        if (parsed.subjects) setSubjects(parsed.subjects);
        if (parsed.timetable) setTimetable(parsed.timetable);
        if (parsed.attendance) setAttendance(parsed.attendance);
        if (parsed.admissions) setAdmissions(parsed.admissions);
        if (parsed.schoolProfile) setSchoolProfile(parsed.schoolProfile);
        if (parsed.feesSummary) setFeesSummary(parsed.feesSummary);
        if (parsed.rooms) setRooms(parsed.rooms);
        if (parsed.bellSchedule) setBellSchedule(parsed.bellSchedule);
        if (parsed.academicTerms) setAcademicTerms(parsed.academicTerms);
        if (parsed.gradingScale) setGradingScale(parsed.gradingScale);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
        if (parsed.assignments) setAssignments(parsed.assignments);
        if (parsed.exams) setExams(parsed.exams);
        if (parsed.assessmentTasks) setAssessmentTasks(parsed.assessmentTasks);
        if (parsed.marks) setMarks(parsed.marks);
        if (parsed.syllabus) setSyllabus(parsed.syllabus);
        if (parsed.lessonPlans) setLessonPlans(parsed.lessonPlans);
        if (parsed.interventions) setInterventions(parsed.interventions);
        if (parsed.approvals) setApprovals(parsed.approvals);
        if (parsed.announcements) setAnnouncements(parsed.announcements);

        // Cross-Role Module 1: Finance
        if (parsed.feeStructures) setFeeStructures(parsed.feeStructures);
        if (parsed.studentFeeObligations) setStudentFeeObligations(parsed.studentFeeObligations);
        if (parsed.feeTransactions) setFeeTransactions(parsed.feeTransactions);
        if (parsed.feeConcessions) setFeeConcessions(parsed.feeConcessions);

        // Cross-Role Module 2: Library
        if (parsed.bookTitles) setBookTitles(parsed.bookTitles);
        if (parsed.bookCopies) setBookCopies(parsed.bookCopies);
        if (parsed.libraryMembers) setLibraryMembers(parsed.libraryMembers);
        if (parsed.bookLoans) setBookLoans(parsed.bookLoans);
        if (parsed.bookReservations) setBookReservations(parsed.bookReservations);
        if (parsed.libraryFines) setLibraryFines(parsed.libraryFines);

        // Cross-Role Module 3: Transport
        if (parsed.transportVehicles) setTransportVehicles(parsed.transportVehicles);
        if (parsed.transportDrivers) setTransportDrivers(parsed.transportDrivers);
        if (parsed.transportRoutes) setTransportRoutes(parsed.transportRoutes);
        if (parsed.studentTransportAssignments) setStudentTransportAssignments(parsed.studentTransportAssignments);
        if (parsed.transportBoardingRecords) setTransportBoardingRecords(parsed.transportBoardingRecords);

        // Cross-Role Module 4: Reception
        if (parsed.visitors) setVisitors(parsed.visitors);
        if (parsed.visits) setVisits(parsed.visits);
        if (parsed.frontOfficeEnquiries) setFrontOfficeEnquiries(parsed.frontOfficeEnquiries);
        if (parsed.frontOfficeAppointments) setFrontOfficeAppointments(parsed.frontOfficeAppointments);
        if (parsed.receptionCalls) setReceptionCalls(parsed.receptionCalls);
        if (parsed.receptionRequests) setReceptionRequests(parsed.receptionRequests);
        if (parsed.documentRequests) setDocumentRequests(parsed.documentRequests);
      }
    } catch (e) {
      console.warn('Failed to load school data from localStorage:', e);
    } finally {
      setDataLoaded(true);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!dataLoaded) return;
    try {
      const payload = {
        classes,
        sections,
        guardians,
        students,
        staff,
        subjects,
        timetable,
        attendance,
        admissions,
        schoolProfile,
        feesSummary,
        rooms,
        bellSchedule,
        academicTerms,
        gradingScale,
        auditLogs,
        assignments,
        exams,
        assessmentTasks,
        marks,
        syllabus,
        lessonPlans,
        interventions,
        approvals,
        announcements,
        feeStructures,
        studentFeeObligations,
        feeTransactions,
        feeConcessions,
        bookTitles,
        bookCopies,
        libraryMembers,
        bookLoans,
        bookReservations,
        libraryFines,
        transportVehicles,
        transportDrivers,
        transportRoutes,
        studentTransportAssignments,
        transportBoardingRecords,
        visitors,
        visits,
        frontOfficeEnquiries,
        frontOfficeAppointments,
        receptionCalls,
        receptionRequests,
        documentRequests,
      };
      localStorage.setItem(STORAGE_KEY_SCHOOL_DATA, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save school data to localStorage:', e);
    }
  }, [
    dataLoaded,
    classes,
    sections,
    guardians,
    students,
    staff,
    subjects,
    timetable,
    attendance,
    admissions,
    schoolProfile,
    feesSummary,
    rooms,
    bellSchedule,
    academicTerms,
    gradingScale,
    auditLogs,
    assignments,
    exams,
    assessmentTasks,
    marks,
    syllabus,
    lessonPlans,
    interventions,
    approvals,
    announcements,
    feeStructures,
    studentFeeObligations,
    feeTransactions,
    feeConcessions,
    bookTitles,
    bookCopies,
    libraryMembers,
    bookLoans,
    bookReservations,
    libraryFines,
    transportVehicles,
    transportDrivers,
    transportRoutes,
    studentTransportAssignments,
    transportBoardingRecords,
    visitors,
    visits,
    frontOfficeEnquiries,
    frontOfficeAppointments,
    receptionCalls,
    receptionRequests,
    documentRequests,
  ]);

  // --- 1. CLASS OPERATIONS ---
  const addClass = (data: Omit<ClassGrade, 'id' | 'status'>): ValidationFeedback => {
    const trimmed = data.name.trim();
    if (!trimmed) {
      return { isValid: false, message: 'Class name cannot be empty.' };
    }
    // Duplicate check
    const duplicate = classes.find(
      (c) => c.status === 'active' && c.name.toLowerCase() === trimmed.toLowerCase() && c.academicYearId === data.academicYearId
    );
    if (duplicate) {
      return { isValid: false, message: `A class named "${trimmed}" already exists for this academic context.` };
    }

    const newClass: ClassGrade = {
      id: `cls-${Date.now()}`,
      name: trimmed,
      academicYearId: data.academicYearId,
      description: data.description || '',
      status: 'active',
    };
    setClasses((prev) => [...prev, newClass]);
    return { isValid: true };
  };

  const updateClass = (id: string, data: Partial<ClassGrade>): ValidationFeedback => {
    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (!trimmed) return { isValid: false, message: 'Class name cannot be empty.' };
      const duplicate = classes.find(
        (c) => c.id !== id && c.status === 'active' && c.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) {
        return { isValid: false, message: `Another active class named "${trimmed}" already exists.` };
      }
    }

    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    // If name changed, update section className and student className
    if (data.name) {
      const newName = data.name.trim();
      setSections((prev) => prev.map((s) => (s.classId === id ? { ...s, className: newName } : s)));
      setStudents((prev) => prev.map((st) => (st.classId === id ? { ...st, className: newName } : st)));
    }
    return { isValid: true };
  };

  const archiveClass = (id: string): ValidationFeedback => {
    // Check if sections or active students exist
    const activeSections = sections.filter((s) => s.classId === id && s.status === 'active');
    const activeStudents = students.filter((s) => s.classId === id && s.enrollmentStatus === 'active');

    if (activeStudents.length > 0) {
      return {
        isValid: false,
        message: `Cannot archive this class: ${activeStudents.length} actively enrolled students exist. Please reassign or transfer students first.`,
      };
    }

    // Archive class and its sections
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'archived' } : c)));
    setSections((prev) => prev.map((s) => (s.classId === id ? { ...s, status: 'archived' } : s)));
    return { isValid: true };
  };

  const restoreClass = (id: string): ValidationFeedback => {
    setClasses((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'active' } : c)));
    return { isValid: true };
  };

  // --- 2. SECTION OPERATIONS ---
  const addSection = (data: Omit<Section, 'id' | 'status' | 'className'>): ValidationFeedback => {
    const parentClass = classes.find((c) => c.id === data.classId);
    if (!parentClass) {
      return { isValid: false, message: 'Selected parent class does not exist.' };
    }
    const trimmed = data.name.trim();
    if (!trimmed) {
      return { isValid: false, message: 'Section name cannot be empty.' };
    }
    // Duplicate check in same class
    const duplicate = sections.find(
      (s) => s.classId === data.classId && s.status === 'active' && s.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      return { isValid: false, message: `A section named "${trimmed}" already exists in ${parentClass.name}.` };
    }

    // Teacher check
    let teacherName: string | undefined = undefined;
    if (data.classTeacherId) {
      const t = staff.find((st) => st.id === data.classTeacherId && st.status === 'active');
      if (!t) return { isValid: false, message: 'Assigned class teacher is not found or is inactive.' };
      teacherName = t.name;
    }

    const newSection: Section = {
      id: `sec-${Date.now()}`,
      name: trimmed,
      classId: data.classId,
      className: parentClass.name,
      academicYearId: data.academicYearId || parentClass.academicYearId,
      classTeacherId: data.classTeacherId,
      classTeacherName: teacherName,
      capacity: data.capacity || 30,
      room: data.room || 'General Room',
      status: 'active',
    };

    setSections((prev) => [...prev, newSection]);
    return { isValid: true };
  };

  const updateSection = (id: string, data: Partial<Section>): ValidationFeedback => {
    const current = sections.find((s) => s.id === id);
    if (!current) return { isValid: false, message: 'Section not found.' };

    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      if (!trimmed) return { isValid: false, message: 'Section name cannot be empty.' };
      const duplicate = sections.find(
        (s) => s.id !== id && s.classId === current.classId && s.status === 'active' && s.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (duplicate) return { isValid: false, message: `Another active section named "${trimmed}" exists in this class.` };
    }

    if (data.classTeacherId !== undefined) {
      if (data.classTeacherId) {
        const t = staff.find((st) => st.id === data.classTeacherId && st.status === 'active');
        if (!t) return { isValid: false, message: 'Assigned teacher is invalid or inactive.' };
        data.classTeacherName = t.name;
      } else {
        data.classTeacherName = undefined;
      }
    }

    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    // If section name changed, update student sectionName
    if (data.name) {
      const newSecName = data.name.trim();
      setStudents((prev) => prev.map((st) => (st.sectionId === id ? { ...st, sectionName: newSecName } : st)));
    }
    return { isValid: true };
  };

  const archiveSection = (id: string): ValidationFeedback => {
    const activeStudents = students.filter((st) => st.sectionId === id && st.enrollmentStatus === 'active');
    if (activeStudents.length > 0) {
      return {
        isValid: false,
        message: `Cannot archive section: ${activeStudents.length} active students currently enrolled. Please transfer them first.`,
      };
    }
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'archived' } : s)));
    return { isValid: true };
  };

  const restoreSection = (id: string): ValidationFeedback => {
    const sec = sections.find((s) => s.id === id);
    if (!sec) return { isValid: false, message: 'Section not found.' };
    const parentClass = classes.find((c) => c.id === sec.classId);
    if (parentClass && parentClass.status !== 'active') {
      return {
        isValid: false,
        message: `Cannot restore section: Parent class "${parentClass.name}" is archived. Please restore the parent class first.`,
      };
    }
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'active' } : s)));
    return { isValid: true };
  };

  // --- 3. STUDENT & GUARDIAN OPERATIONS ---
  const addStudent = (data: Omit<Student, 'id'>): ValidationFeedback => {
    const admNo = data.admissionNo.trim();
    if (!admNo) return { isValid: false, message: 'Admission number is required.' };
    if (!data.name.trim()) return { isValid: false, message: 'Student name is required.' };
    if (!data.classId || !data.sectionId) return { isValid: false, message: 'Class and section must be selected.' };

    // Duplicate admission number check
    const existingAdm = students.find((s) => s.admissionNo.toLowerCase() === admNo.toLowerCase());
    if (existingAdm) {
      return { isValid: false, message: `Admission number "${admNo}" is already assigned to ${existingAdm.name}.` };
    }

    // Verify section belongs to class
    const validSection = sections.find((s) => s.id === data.sectionId && s.classId === data.classId);
    if (!validSection) {
      return { isValid: false, message: 'The selected section does not belong to the selected class.' };
    }

    const studentId = `stu-${Date.now()}`;
    const newStudent: Student = {
      ...data,
      id: studentId,
      admissionNo: admNo,
      name: data.name.trim(),
      className: validSection.className,
      sectionName: validSection.name,
      enrollmentStatus: data.enrollmentStatus || 'active',
      admissionDate: data.admissionDate || new Date().toISOString().split('T')[0],
    };

    setStudents((prev) => [newStudent, ...prev]);

    // Update or link guardian
    if (data.guardianId) {
      setGuardians((prev) =>
        prev.map((g) => (g.id === data.guardianId ? { ...g, linkedStudentIds: [...g.linkedStudentIds, studentId] } : g))
      );
    } else if (data.guardianName) {
      const newGuardian: Guardian = {
        id: `grd-${Date.now()}`,
        name: data.guardianName.trim(),
        relationship: data.guardianRelationship || 'Guardian',
        phone: data.guardianPhone || '',
        email: data.guardianEmail || '',
        address: '',
        linkedStudentIds: [studentId],
      };
      setGuardians((prev) => [...prev, newGuardian]);
    }

    return { isValid: true };
  };

  const updateStudent = (id: string, data: Partial<Student>): ValidationFeedback => {
    const current = students.find((s) => s.id === id);
    if (!current) return { isValid: false, message: 'Student record not found.' };

    if (data.admissionNo !== undefined) {
      const adm = data.admissionNo.trim();
      if (!adm) return { isValid: false, message: 'Admission number cannot be empty.' };
      const duplicate = students.find((s) => s.id !== id && s.admissionNo.toLowerCase() === adm.toLowerCase());
      if (duplicate) return { isValid: false, message: `Admission number "${adm}" is already taken.` };
    }

    // Validate section-class compatibility if either changed
    const targetClassId = data.classId || current.classId;
    const targetSectionId = data.sectionId || current.sectionId;
    const validSec = sections.find((s) => s.id === targetSectionId && s.classId === targetClassId);
    if (!validSec) {
      return { isValid: false, message: 'The selected section is not valid for the assigned class.' };
    }

    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data, className: validSec.className, sectionName: validSec.name } : s))
    );
    return { isValid: true };
  };

  const archiveStudent = (id: string): ValidationFeedback => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, enrollmentStatus: 'transferred' } : s)));
    return { isValid: true };
  };

  const restoreStudent = (id: string): ValidationFeedback => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, enrollmentStatus: 'active' } : s)));
    return { isValid: true };
  };

  const transferStudentSection = (
    studentId: string,
    targetSectionId: string,
    reason?: string
  ): ValidationFeedback => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return { isValid: false, message: 'Student record not found.' };

    const targetSection = sections.find((s) => s.id === targetSectionId && s.status === 'active');
    if (!targetSection) {
      return { isValid: false, message: 'Target section does not exist or is archived.' };
    }

    if (student.sectionId === targetSectionId) {
      return { isValid: false, message: 'Student is already enrolled in this section.' };
    }

    const currentEnrolled = students.filter(
      (s) => s.sectionId === targetSectionId && s.enrollmentStatus === 'active'
    ).length;

    if (currentEnrolled >= targetSection.capacity) {
      return {
        isValid: false,
        message: `Section ${targetSection.className} ${targetSection.name} is at maximum capacity (${targetSection.capacity} students).`,
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const transferEntry = {
      fromSection: `${student.className} · ${student.sectionName}`,
      toSection: `${targetSection.className} · ${targetSection.name}`,
      date: todayStr,
      reason: reason || 'Administrative Cohort Reassignment',
    };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          classId: targetSection.classId,
          className: targetSection.className,
          sectionId: targetSection.id,
          sectionName: targetSection.name,
          transferHistory: [...(s.transferHistory || []), transferEntry],
        };
      })
    );

    return { isValid: true };
  };

  const bulkUpdateStudentStatus = (
    studentIds: string[],
    status: 'active' | 'inactive' | 'transferred' | 'graduated'
  ) => {
    setStudents((prev) =>
      prev.map((s) => (studentIds.includes(s.id) ? { ...s, enrollmentStatus: status } : s))
    );
  };

  const linkAdditionalGuardian = (studentId: string, guardianId: string): ValidationFeedback => {
    const guardian = guardians.find((g) => g.id === guardianId);
    if (!guardian) return { isValid: false, message: 'Guardian record not found.' };

    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        const current = s.additionalGuardianIds || [];
        if (current.includes(guardianId)) return s;
        return { ...s, additionalGuardianIds: [...current, guardianId] };
      })
    );

    setGuardians((prev) =>
      prev.map((g) => {
        if (g.id !== guardianId) return g;
        if (g.linkedStudentIds.includes(studentId)) return g;
        return { ...g, linkedStudentIds: [...g.linkedStudentIds, studentId] };
      })
    );

    return { isValid: true };
  };

  const unlinkGuardian = (studentId: string, guardianId: string): ValidationFeedback => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== studentId) return s;
        return {
          ...s,
          additionalGuardianIds: (s.additionalGuardianIds || []).filter((id) => id !== guardianId),
        };
      })
    );

    setGuardians((prev) =>
      prev.map((g) => {
        if (g.id !== guardianId) return g;
        return {
          ...g,
          linkedStudentIds: g.linkedStudentIds.filter((id) => id !== studentId),
        };
      })
    );

    return { isValid: true };
  };

  const addGuardian = (data: Omit<Guardian, 'id' | 'linkedStudentIds'>): Guardian => {
    const newG: Guardian = {
      ...data,
      id: `grd-${Date.now()}`,
      linkedStudentIds: [],
    };
    setGuardians((prev) => [...prev, newG]);
    return newG;
  };

  const updateGuardian = (id: string, data: Partial<Guardian>) => {
    setGuardians((prev) => prev.map((g) => (g.id === id ? { ...g, ...data } : g)));
    // Sync student record guardian details
    if (data.name || data.phone || data.email) {
      setStudents((prev) =>
        prev.map((st) =>
          st.guardianId === id
            ? {
                ...st,
                guardianName: data.name || st.guardianName,
                guardianPhone: data.phone || st.guardianPhone,
                guardianEmail: data.email || st.guardianEmail,
              }
            : st
        )
      );
    }
  };

  // --- 4. STAFF OPERATIONS ---
  const addStaff = (data: Omit<StaffMember, 'id'>): ValidationFeedback => {
    const sId = data.staffId.trim();
    if (!sId) return { isValid: false, message: 'Staff ID is required.' };
    if (!data.name.trim()) return { isValid: false, message: 'Staff name is required.' };

    const duplicate = staff.find((st) => st.staffId.toLowerCase() === sId.toLowerCase());
    if (duplicate) return { isValid: false, message: `Staff ID "${sId}" already belongs to ${duplicate.name}.` };

    const newStaff: StaffMember = {
      ...data,
      id: `staff-${Date.now()}`,
      staffId: sId,
      status: data.status || 'active',
      assignedSubjects: data.assignedSubjects || [],
      assignedSections: data.assignedSections || [],
    };
    setStaff((prev) => [...prev, newStaff]);
    return { isValid: true };
  };

  const updateStaff = (id: string, data: Partial<StaffMember>): ValidationFeedback => {
    if (data.staffId !== undefined) {
      const sId = data.staffId.trim();
      if (!sId) return { isValid: false, message: 'Staff ID cannot be empty.' };
      const duplicate = staff.find((st) => st.id !== id && st.staffId.toLowerCase() === sId.toLowerCase());
      if (duplicate) return { isValid: false, message: `Staff ID "${sId}" already in use.` };
    }

    setStaff((prev) => prev.map((st) => (st.id === id ? { ...st, ...data } : st)));
    if (data.name) {
      const newName = data.name.trim();
      setSections((prev) => prev.map((s) => (s.classTeacherId === id ? { ...s, classTeacherName: newName } : s)));
      setTimetable((prev) => prev.map((tt) => (tt.teacherId === id ? { ...tt, teacherName: newName } : tt)));
    }
    return { isValid: true };
  };

  const archiveStaff = (id: string): ValidationFeedback => {
    setStaff((prev) => prev.map((st) => (st.id === id ? { ...st, status: 'resigned' } : st)));
    // Clear classTeacher from sections
    setSections((prev) => prev.map((s) => (s.classTeacherId === id ? { ...s, classTeacherId: undefined, classTeacherName: undefined } : s)));
    return { isValid: true };
  };

  const restoreStaff = (id: string): ValidationFeedback => {
    setStaff((prev) => prev.map((st) => (st.id === id ? { ...st, status: 'active' } : st)));
    return { isValid: true };
  };

  const assignSubjectTeacher = (staffId: string, subjectName: string, sectionId: string): ValidationFeedback => {
    const targetStaff = staff.find((st) => st.id === staffId && st.status === 'active');
    if (!targetStaff) return { isValid: false, message: 'Staff member is invalid or not active.' };

    const targetSection = sections.find((s) => s.id === sectionId && s.status === 'active');
    if (!targetSection) return { isValid: false, message: 'Target section is invalid or archived.' };

    const existingAssigned = targetStaff.assignedSections || [];
    const alreadyExists = existingAssigned.some(
      (a) => a.sectionId === sectionId && a.subject.toLowerCase() === subjectName.toLowerCase()
    );
    if (alreadyExists) {
      return { isValid: false, message: `${targetStaff.name} is already assigned to teach ${subjectName} in ${targetSection.className} ${targetSection.name}.` };
    }

    const updatedSections = [
      ...existingAssigned,
      { sectionId, sectionName: `${targetSection.className} · ${targetSection.name}`, subject: subjectName },
    ];

    const currentSubjects = targetStaff.assignedSubjects || [];
    const updatedSubjects = currentSubjects.includes(subjectName)
      ? currentSubjects
      : [...currentSubjects, subjectName];

    setStaff((prev) =>
      prev.map((st) =>
        st.id === staffId
          ? { ...st, assignedSections: updatedSections, assignedSubjects: updatedSubjects }
          : st
      )
    );

    return { isValid: true };
  };

  const removeSubjectTeacher = (staffId: string, sectionId: string, subjectName: string) => {
    setStaff((prev) =>
      prev.map((st) => {
        if (st.id !== staffId) return st;
        const filtered = (st.assignedSections || []).filter(
          (a) => !(a.sectionId === sectionId && a.subject === subjectName)
        );
        return { ...st, assignedSections: filtered };
      })
    );
  };

  // --- SUBJECT OPERATIONS ---
  const addSubject = (data: Omit<Subject, 'id'>): ValidationFeedback => {
    const name = data.name.trim();
    const code = data.code.trim();
    if (!name || !code) return { isValid: false, message: 'Subject name and code are required.' };

    const duplicateCode = subjects.find((s) => s.code.toLowerCase() === code.toLowerCase());
    if (duplicateCode) return { isValid: false, message: `Subject code "${code}" already exists.` };

    const newSub: Subject = {
      ...data,
      id: `subj-${Date.now()}`,
      name,
      code,
      status: 'active',
      category: data.category || 'Core',
    };
    setSubjects((prev) => [...prev, newSub]);
    return { isValid: true };
  };

  const updateSubject = (id: string, data: Partial<Subject>): ValidationFeedback => {
    if (data.code) {
      const code = data.code.trim();
      const duplicateCode = subjects.find(
        (s) => s.id !== id && s.code.toLowerCase() === code.toLowerCase()
      );
      if (duplicateCode) return { isValid: false, message: `Subject code "${code}" is already in use.` };
    }
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...data } : s)));
    return { isValid: true };
  };

  const archiveSubject = (id: string): ValidationFeedback => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'archived' } : s)));
    return { isValid: true };
  };

  const restoreSubject = (id: string): ValidationFeedback => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, status: 'active' } : s)));
    return { isValid: true };
  };

  // --- 5. TIMETABLE & CONFLICT DETECTION (BLOCKING RULES) ---
  const validateTimetableSlot = (
    slot: Omit<TimetablePeriod, 'id'>,
    excludePeriodId?: string
  ): { hasConflict: boolean; reason?: string; conflictingPeriod?: TimetablePeriod } => {
    // 1. Conflict: Section already has another subject at the same Day + Period
    const sectionClash = timetable.find(
      (tt) =>
        tt.id !== excludePeriodId &&
        tt.sectionId === slot.sectionId &&
        tt.dayOfWeek === slot.dayOfWeek &&
        tt.periodNumber === slot.periodNumber
    );
    if (sectionClash) {
      return {
        hasConflict: true,
        reason: `${slot.sectionName} already has "${sectionClash.subjectName}" scheduled for ${slot.dayOfWeek} Period ${slot.periodNumber}.`,
        conflictingPeriod: sectionClash,
      };
    }

    // 2. Conflict: Teacher assigned to another section at the same Day + Period
    const teacherClash = timetable.find(
      (tt) =>
        tt.id !== excludePeriodId &&
        tt.teacherId === slot.teacherId &&
        tt.dayOfWeek === slot.dayOfWeek &&
        tt.periodNumber === slot.periodNumber
    );
    if (teacherClash) {
      return {
        hasConflict: true,
        reason: `${slot.teacherName} is already teaching in ${teacherClash.sectionName} on ${slot.dayOfWeek} Period ${slot.periodNumber}.`,
        conflictingPeriod: teacherClash,
      };
    }

    // 3. Conflict: Room double-booked at the same Day + Period
    if (slot.room && slot.room !== 'General Room') {
      const roomClash = timetable.find(
        (tt) =>
          tt.id !== excludePeriodId &&
          tt.room.toLowerCase() === slot.room.toLowerCase() &&
          tt.dayOfWeek === slot.dayOfWeek &&
          tt.periodNumber === slot.periodNumber
      );
      if (roomClash) {
        return {
          hasConflict: true,
          reason: `Room "${slot.room}" is already reserved for ${roomClash.sectionName} (${roomClash.subjectName}) on ${slot.dayOfWeek} Period ${slot.periodNumber}.`,
          conflictingPeriod: roomClash,
        };
      }
    }

    return { hasConflict: false };
  };

  const addTimetablePeriod = (period: Omit<TimetablePeriod, 'id'>): ValidationFeedback => {
    const conflictCheck = validateTimetableSlot(period);
    if (conflictCheck.hasConflict) {
      return { isValid: false, message: conflictCheck.reason, conflictingEntity: conflictCheck.conflictingPeriod };
    }

    const newPeriod: TimetablePeriod = {
      ...period,
      id: `tt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setTimetable((prev) => [...prev, newPeriod]);
    return { isValid: true };
  };

  const updateTimetablePeriod = (id: string, data: Partial<TimetablePeriod>): ValidationFeedback => {
    const current = timetable.find((tt) => tt.id === id);
    if (!current) return { isValid: false, message: 'Timetable entry not found.' };

    const merged = { ...current, ...data };
    const conflictCheck = validateTimetableSlot(merged, id);
    if (conflictCheck.hasConflict) {
      return { isValid: false, message: conflictCheck.reason, conflictingEntity: conflictCheck.conflictingPeriod };
    }

    setTimetable((prev) => prev.map((tt) => (tt.id === id ? merged : tt)));
    return { isValid: true };
  };

  const deleteTimetablePeriod = (id: string) => {
    setTimetable((prev) => prev.filter((tt) => tt.id !== id));
  };

  // --- 6. ATTENDANCE OPERATIONS ---
  const recordAttendanceBatch = (records: Omit<AttendanceRecord, 'id'>[]) => {
    if (records.length === 0) return;
    const targetDate = records[0].date;
    const targetSectionId = records[0].sectionId;

    // Filter out existing records for this date and section, then append fresh ones
    setAttendance((prev) => {
      const filtered = prev.filter((r) => !(r.date === targetDate && r.sectionId === targetSectionId));
      const additions = records.map((r, i) => ({
        ...r,
        id: `att-${Date.now()}-${i}`,
      }));
      return [...filtered, ...additions];
    });
  };

  // --- 7. ADMISSIONS & CONVERSION WORKFLOW ---
  const addAdmissionEnquiry = (data: Omit<AdmissionEnquiry, 'id' | 'enquiryNo'>): ValidationFeedback => {
    if (!data.applicantName.trim()) return { isValid: false, message: 'Applicant name is required.' };
    if (!data.intendedClassId) return { isValid: false, message: 'Target grade/class is required.' };
    if (!data.guardianPhone && !data.guardianEmail) {
      return { isValid: false, message: 'Guardian contact phone or email must be provided.' };
    }

    const count = admissions.length + 101;
    const enquiryNo = `ENQ-2026-${count}`;
    const newEnquiry: AdmissionEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      enquiryNo,
      enquiryDate: data.enquiryDate || new Date().toISOString().split('T')[0],
      status: data.status || 'New',
      notes: data.notes || '',
    };
    setAdmissions((prev) => [newEnquiry, ...prev]);
    return { isValid: true };
  };

  const updateAdmissionEnquiry = (id: string, data: Partial<AdmissionEnquiry>): ValidationFeedback => {
    setAdmissions((prev) => prev.map((enq) => (enq.id === id ? { ...enq, ...data } : enq)));
    return { isValid: true };
  };

  // Atomic Admission to Student conversion workflow
  const convertEnquiryToStudent = (
    enquiryId: string,
    studentDetails: {
      admissionNo: string;
      sectionId: string;
      admissionDate: string;
      gender?: 'Female' | 'Male' | 'Other';
    }
  ): ValidationFeedback => {
    const enquiry = admissions.find((e) => e.id === enquiryId);
    if (!enquiry) return { isValid: false, message: 'Enquiry not found.' };

    if (enquiry.status === 'Enrolled') {
      return { isValid: false, message: 'This applicant has already been converted and enrolled.' };
    }

    const admNo = studentDetails.admissionNo.trim();
    if (!admNo) return { isValid: false, message: 'Unique admission number is required.' };

    const admExists = students.find((s) => s.admissionNo.toLowerCase() === admNo.toLowerCase());
    if (admExists) {
      return { isValid: false, message: `Admission number "${admNo}" is already in use by ${admExists.name}.` };
    }

    const targetSection = sections.find((s) => s.id === studentDetails.sectionId);
    if (!targetSection) {
      return { isValid: false, message: 'Target section does not exist.' };
    }

    // Create Guardian first or link existing
    let guardianId = `grd-${Date.now()}`;
    const studentId = `stu-enr-${Date.now()}`;

    const newGuardian: Guardian = {
      id: guardianId,
      name: enquiry.guardianName,
      relationship: enquiry.guardianRelationship || 'Guardian',
      phone: enquiry.guardianPhone,
      email: enquiry.guardianEmail,
      address: enquiry.guardianAddress || '',
      linkedStudentIds: [studentId],
    };

    const newStudent: Student = {
      id: studentId,
      admissionNo: admNo,
      name: enquiry.applicantName,
      dateOfBirth: enquiry.dateOfBirth || '2012-01-01',
      gender: studentDetails.gender || enquiry.gender || 'Other',
      classId: targetSection.classId,
      className: targetSection.className,
      sectionId: targetSection.id,
      sectionName: targetSection.name,
      academicYearId: targetSection.academicYearId,
      guardianId: guardianId,
      guardianName: enquiry.guardianName,
      guardianRelationship: enquiry.guardianRelationship,
      guardianPhone: enquiry.guardianPhone,
      guardianEmail: enquiry.guardianEmail,
      enrollmentStatus: 'active',
      admissionDate: studentDetails.admissionDate || new Date().toISOString().split('T')[0],
      notes: `Enrolled via Admission Enquiry #${enquiry.enquiryNo}.`,
    };

    // Commit changes atomically
    setGuardians((prev) => [...prev, newGuardian]);
    setStudents((prev) => [newStudent, ...prev]);
    setAdmissions((prev) =>
      prev.map((e) => (e.id === enquiryId ? { ...e, status: 'Enrolled', convertedStudentId: studentId } : e))
    );

    return { isValid: true };
  };

  const updateSchoolProfile = (profile: Partial<SchoolProfile>) => {
    setSchoolProfile((prev) => ({ ...prev, ...profile }));
  };

  const addRoom = (data: Omit<SchoolRoom, 'id'>): ValidationFeedback => {
    const name = data.name.trim();
    if (!name) return { isValid: false, message: 'Room name is required.' };
    const duplicate = rooms.find((r) => r.name.toLowerCase() === name.toLowerCase());
    if (duplicate) return { isValid: false, message: `Room "${name}" already exists.` };
    const newRoom: SchoolRoom = {
      ...data,
      id: `rm-${Date.now()}`,
      name,
      status: 'active',
    };
    setRooms((prev) => [...prev, newRoom]);
    return { isValid: true };
  };

  const updateRoom = (id: string, data: Partial<SchoolRoom>): ValidationFeedback => {
    if (data.name) {
      const name = data.name.trim();
      const duplicate = rooms.find((r) => r.id !== id && r.name.toLowerCase() === name.toLowerCase());
      if (duplicate) return { isValid: false, message: `Room name "${name}" is already used.` };
    }
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    return { isValid: true };
  };

  const updateBellSchedule = (schedule: BellSchedulePeriod[]) => {
    setBellSchedule(schedule);
  };

  const updateAcademicTerms = (terms: AcademicTerm[]) => {
    setAcademicTerms(terms);
  };

  const updateGradingScale = (scale: GradingScale[]) => {
    setGradingScale(scale);
  };

  const addAuditLog = (log: Omit<AdminAuditLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const ts = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;
    const newEntry: AdminAuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: ts,
    };
    setAuditLogs((prev) => [newEntry, ...prev.slice(0, 99)]);
  };

  // --- 8. ASSIGNMENT OPERATIONS ---
  const addAssignment = (data: Omit<SchoolAssignment, 'id' | 'submissionsCount' | 'gradedCount'>): ValidationFeedback => {
    if (!data.title.trim()) return { isValid: false, message: 'Assignment title is required.' };
    if (!data.dueDate) return { isValid: false, message: 'Due date is required.' };
    if (!data.sectionId) return { isValid: false, message: 'Class & section must be selected.' };
    if (data.maxMarks <= 0) return { isValid: false, message: 'Max marks must be greater than 0.' };

    const newAsgn: SchoolAssignment = {
      ...data,
      id: `asgn-${Date.now()}`,
      submissionsCount: 0,
      gradedCount: 0,
    };
    setAssignments((prev) => [newAsgn, ...prev]);
    addAuditLog({
      user: data.teacherName,
      actorName: data.teacherName,
      actorRole: 'Teacher',
      action: 'Assignment Created',
      module: 'Assignments',
      details: `Created ${data.type} "${data.title}" for ${data.sectionName}`,
      severity: 'info',
    });
    return { isValid: true };
  };

  const updateAssignment = (id: string, data: Partial<SchoolAssignment>): ValidationFeedback => {
    if (data.title !== undefined && !data.title.trim()) {
      return { isValid: false, message: 'Title cannot be blank.' };
    }
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    return { isValid: true };
  };

  const deleteAssignment = (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  };

  // --- 9. EXAMINATION & ASSESSMENT OPERATIONS ---
  const addExam = (data: Omit<SchoolExam, 'id'>): ValidationFeedback => {
    if (!data.name.trim()) return { isValid: false, message: 'Exam name is required.' };
    const newExam: SchoolExam = {
      ...data,
      id: `exam-${Date.now()}`,
    };
    setExams((prev) => [...prev, newExam]);
    return { isValid: true };
  };

  const updateExam = (id: string, data: Partial<SchoolExam>): ValidationFeedback => {
    setExams((prev) => prev.map((e) => (e.id === id ? { ...e, ...data } : e)));
    return { isValid: true };
  };

  const deleteExam = (id: string): ValidationFeedback => {
    const hasTasks = assessmentTasks.some((t) => t.examId === id);
    if (hasTasks) {
      return {
        isValid: false,
        message: 'Cannot delete examination cycle with associated assessment papers. Remove scheduled papers first.',
      };
    }
    setExams((prev) => prev.filter((e) => e.id !== id));
    return { isValid: true };
  };

  const addAssessmentTask = (data: Omit<AssessmentTask, 'id'>): ValidationFeedback => {
    if (!data.subjectName) return { isValid: false, message: 'Subject is required.' };
    const newTask: AssessmentTask = {
      ...data,
      id: `task-${Date.now()}`,
    };
    setAssessmentTasks((prev) => [...prev, newTask]);
    return { isValid: true };
  };

  const updateAssessmentTask = (id: string, data: Partial<AssessmentTask>): ValidationFeedback => {
    setAssessmentTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...data } : t)));
    return { isValid: true };
  };

  const deleteAssessmentTask = (id: string): ValidationFeedback => {
    const hasMarks = marks.some((m) => m.assessmentId === id);
    if (hasMarks) {
      return {
        isValid: false,
        message: 'Cannot delete assessment paper with existing student marks. Clear marks before deleting.',
      };
    }
    setAssessmentTasks((prev) => prev.filter((t) => t.id !== id));
    return { isValid: true };
  };

  // --- 10. MARKS ENTRY OPERATIONS ---
  const saveMarksBatch = (
    assessmentId: string,
    entries: {
      studentId: string;
      studentName: string;
      marksObtained: number | null;
      isAbsent?: boolean;
      teacherFeedback?: string;
      grade?: string;
    }[],
    submitForReview: boolean = false,
    enteredByStaffId: string = 'staff-henderson'
  ): ValidationFeedback => {
    const task = assessmentTasks.find((t) => t.id === assessmentId);
    if (!task) return { isValid: false, message: 'Assessment task not found.' };

    // Validate marks range
    for (const entry of entries) {
      if (!entry.isAbsent && entry.marksObtained !== null) {
        if (entry.marksObtained < 0 || entry.marksObtained > task.maxMarks) {
          return {
            isValid: false,
            message: `Mark for ${entry.studentName} (${entry.marksObtained}) must be between 0 and max marks (${task.maxMarks}).`,
          };
        }
      }
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const newStatus = submitForReview ? 'submitted' : 'draft';

    setMarks((prev) => {
      const filtered = prev.filter((m) => m.assessmentId !== assessmentId);
      const newEntries: StudentMarkEntry[] = entries.map((e, idx) => ({
        id: `mrk-${assessmentId}-${e.studentId || idx}`,
        assessmentId,
        examId: task.examId,
        studentId: e.studentId,
        studentName: e.studentName,
        classId: task.classId,
        sectionId: task.sectionId,
        subjectName: task.subjectName,
        marksObtained: e.isAbsent ? null : e.marksObtained,
        isAbsent: e.isAbsent,
        maxMarks: task.maxMarks,
        grade: e.grade || (e.marksObtained !== null ? (e.marksObtained / task.maxMarks >= 0.9 ? 'A' : e.marksObtained / task.maxMarks >= 0.8 ? 'B' : e.marksObtained / task.maxMarks >= 0.7 ? 'C' : 'D') : undefined),
        teacherFeedback: e.teacherFeedback,
        status: newStatus,
        enteredByStaffId,
        updatedAt: todayStr,
      }));
      return [...filtered, ...newEntries];
    });

    if (submitForReview) {
      updateAssessmentTask(assessmentId, { status: 'submitted' });
      addAuditLog({
        user: task.teacherName,
        actorName: task.teacherName,
        actorRole: 'Teacher',
        action: 'Marks Submitted for Review',
        module: 'Marks & Results',
        details: `Submitted marks for ${task.sectionName} ${task.subjectName} (${entries.length} students)`,
        severity: 'info',
      });
    }

    return { isValid: true };
  };

  const publishAssessmentResults = (taskId: string, examId?: string): ValidationFeedback => {
    updateAssessmentTask(taskId, { status: 'published' });
    setMarks((prev) =>
      prev.map((m) => (m.assessmentId === taskId ? { ...m, status: 'published' } : m))
    );
    if (examId) {
      updateExam(examId, { status: 'published' });
    }
    addAuditLog({
      user: 'Academic Office',
      actorRole: 'Vice Principal',
      action: 'Results Published',
      module: 'Examinations',
      details: `Published official assessment results for task ${taskId}`,
      severity: 'info',
    });
    return { isValid: true };
  };

  // --- 11. SYLLABUS & LESSON PLANS ---
  const updateSyllabusTopic = (id: string, data: Partial<SyllabusTopic>) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSyllabus((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data, lastUpdated: todayStr } : s))
    );
  };

  const reviewSyllabusTopic = (id: string, vpNotes: string, approve: boolean) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSyllabus((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              vpNotes,
              vpReviewed: approve,
              status: approve && s.completedLessons >= s.totalLessons ? 'completed' : s.status,
              lastUpdated: todayStr,
            }
          : s
      )
    );
  };

  const addLessonPlan = (data: Omit<LessonPlan, 'id'>): ValidationFeedback => {
    if (!data.topic.trim()) return { isValid: false, message: 'Topic is required.' };
    if (!data.plannedDate) return { isValid: false, message: 'Planned date is required.' };
    const newPlan: LessonPlan = {
      ...data,
      id: `lp-${Date.now()}`,
    };
    setLessonPlans((prev) => [newPlan, ...prev]);
    return { isValid: true };
  };

  const updateLessonPlan = (id: string, data: Partial<LessonPlan>): ValidationFeedback => {
    setLessonPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
    return { isValid: true };
  };

  const approveLessonPlan = (id: string, feedback?: string) => {
    setLessonPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: 'approved', vpFeedback: feedback } : p))
    );
  };

  // --- 12. STUDENT INTERVENTIONS ---
  const addIntervention = (data: Omit<StudentIntervention, 'id' | 'createdAt'>): ValidationFeedback => {
    if (!data.description.trim()) return { isValid: false, message: 'Description of concern is required.' };
    if (!data.studentId) return { isValid: false, message: 'Student must be selected.' };
    const todayStr = new Date().toISOString().split('T')[0];
    const newIntv: StudentIntervention = {
      ...data,
      id: `int-${Date.now()}`,
      createdAt: todayStr,
    };
    setInterventions((prev) => [newIntv, ...prev]);
    addAuditLog({
      user: data.responsibleStaffName,
      actorRole: 'Faculty',
      action: 'Intervention Logged',
      module: 'Student Support',
      details: `Logged ${data.category} intervention for ${data.studentName} (Follow-up: ${data.followUpDate})`,
      severity: data.severity === 'high' || data.severity === 'critical' ? 'warning' : 'info',
    });
    return { isValid: true };
  };

  const updateIntervention = (id: string, data: Partial<StudentIntervention>): ValidationFeedback => {
    setInterventions((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    return { isValid: true };
  };

  // --- 13. ACADEMIC APPROVALS ---
  const processApproval = (
    id: string,
    decision: 'approved' | 'rejected' | 'returned',
    reason?: string,
    reviewerName: string = 'Dr. Marcus Vance (VP)'
  ): ValidationFeedback => {
    const appr = approvals.find((a) => a.id === id);
    if (!appr) return { isValid: false, message: 'Approval request not found.' };
    if (appr.status !== 'pending') {
      return { isValid: false, message: `Request is already ${appr.status}. Duplicate action prevented.` };
    }
    if ((decision === 'rejected' || decision === 'returned') && (!reason || !reason.trim())) {
      return { isValid: false, message: `A reason/explanation is mandatory to ${decision} an approval request.` };
    }

    const now = new Date();
    const ts = `${now.toISOString().split('T')[0]} ${now.toTimeString().split(' ')[0].substring(0, 5)}`;

    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: decision,
              reviewReason: reason || 'Approved as submitted.',
              reviewedAt: ts,
              reviewedBy: reviewerName,
            }
          : a
      )
    );

    addAuditLog({
      user: reviewerName,
      actorRole: 'Vice Principal',
      action: `Approval ${decision.toUpperCase()}`,
      module: 'Academic Approvals',
      details: `${decision.toUpperCase()}: "${appr.title}" - ${reason || 'Approved'}`,
      severity: decision === 'approved' ? 'info' : 'warning',
    });

    return { isValid: true };
  };

  // --- 14. ANNOUNCEMENTS & NOTICES ---
  const addAnnouncement = (data: Omit<SchoolAnnouncement, 'id' | 'publishDate'>): ValidationFeedback => {
    if (!data.title.trim()) return { isValid: false, message: 'Title is required.' };
    if (!data.content.trim()) return { isValid: false, message: 'Content is required.' };
    const todayStr = new Date().toISOString().split('T')[0];
    const newAnn: SchoolAnnouncement = {
      ...data,
      id: `ann-${Date.now()}`,
      publishDate: todayStr,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    return { isValid: true };
  };

  const updateAnnouncement = (id: string, data: Partial<SchoolAnnouncement>) => {
    setAnnouncements((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
  };

  // --- CROSS-ROLE MODULE 1: FINANCE ACTIONS ---
  const addFeeStructure = (data: Omit<FeeStructure, 'id'>): ValidationFeedback => {
    if (!data.name.trim()) return { isValid: false, message: 'Fee structure title is required.' };
    if (data.amount <= 0) return { isValid: false, message: 'Fee amount must be greater than zero.' };

    const newFs: FeeStructure = {
      ...data,
      id: `fs-${Date.now()}`,
      name: data.name.trim(),
      status: data.status || 'active',
    };
    setFeeStructures((prev) => [newFs, ...prev]);
    return { isValid: true };
  };

  const updateFeeStructure = (id: string, data: Partial<FeeStructure>): ValidationFeedback => {
    if (data.name !== undefined && !data.name.trim()) {
      return { isValid: false, message: 'Fee structure title cannot be blank.' };
    }
    if (data.amount !== undefined && data.amount <= 0) {
      return { isValid: false, message: 'Fee amount must be greater than zero.' };
    }
    setFeeStructures((prev) => prev.map((fs) => (fs.id === id ? { ...fs, ...data } : fs)));
    return { isValid: true };
  };

  const archiveFeeStructure = (id: string): ValidationFeedback => {
    setFeeStructures((prev) =>
      prev.map((fs) => (fs.id === id ? { ...fs, status: 'inactive' } : fs))
    );
    return { isValid: true };
  };

  const recordFeePayment = (params: {
    studentId: string;
    obligationIds: string[];
    amountPaid: number;
    paymentMethod: PaymentMethod;
    transactionRef: string;
    notes?: string;
    collectedByStaffId?: string;
  }): { success: boolean; receipt?: FeePaymentTransaction; message: string } => {
    const student = students.find((s) => s.id === params.studentId);
    if (!student) {
      return { success: false, message: 'Student not found.' };
    }
    if (params.amountPaid <= 0) {
      return { success: false, message: 'Payment amount must be greater than zero.' };
    }
    if (!params.obligationIds || params.obligationIds.length === 0) {
      return { success: false, message: 'At least one fee obligation must be selected.' };
    }

    let remainingPayment = params.amountPaid;
    const updatedObligations = studentFeeObligations.map((ob) => {
      if (params.obligationIds.includes(ob.id) && remainingPayment > 0) {
        const canPay = Math.min(ob.balance, remainingPayment);
        const newPaid = ob.paidAmount + canPay;
        const newBalance = Math.max(0, ob.netAmount - newPaid);
        remainingPayment -= canPay;
        return {
          ...ob,
          paidAmount: newPaid,
          balance: newBalance,
          status: newBalance <= 0 ? ('Paid in Full' as const) : ('Partially Paid' as const),
        };
      }
      return ob;
    });

    setStudentFeeObligations(updatedObligations);

    const now = new Date();
    const receiptNo = `RCP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTransaction: FeePaymentTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo,
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
      className: student.className,
      obligationIds: params.obligationIds,
      amount: params.amountPaid,
      paymentMethod: params.paymentMethod,
      paymentDate: now.toISOString().split('T')[0],
      transactionRef: params.transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      recordedBy: params.collectedByStaffId || 'Mr. Gabriel Rodriguez (Senior Accountant)',
      status: 'Completed',
      notes: params.notes,
      allocatedBreakdown: params.obligationIds.map((id) => {
        const ob = studentFeeObligations.find((o) => o.id === id);
        return {
          obligationId: id,
          feeName: ob?.feeStructureName || 'Tuition Fee',
          amount: ob ? Math.min(ob.balance, params.amountPaid) : params.amountPaid,
        };
      }),
    };

    setFeeTransactions((prev) => [newTransaction, ...prev]);

    // Update feesSummary
    setFeesSummary((prev) => {
      const nextCollected = prev.collectedTotal + params.amountPaid;
      const nextOutstanding = Math.max(0, prev.expectedTotal - nextCollected);
      const nextRate = (nextCollected / prev.expectedTotal) * 100;
      const mappedMethod: 'Bank Wire / ACH' | 'Debit Card' | 'Cheque' | 'Cash' =
        params.paymentMethod === 'Cash'
          ? 'Cash'
          : params.paymentMethod === 'Cheque'
          ? 'Cheque'
          : params.paymentMethod === 'Card'
          ? 'Debit Card'
          : 'Bank Wire / ACH';

      return {
        ...prev,
        collectedTotal: nextCollected,
        outstandingTotal: nextOutstanding,
        collectionRate: Math.round(nextRate * 10) / 10,
        recentTransactions: [
          {
            id: newTransaction.id,
            studentId: student.id,
            studentName: student.name,
            gradeSection: `${student.className} - ${student.sectionName}`,
            amount: params.amountPaid,
            date: now.toISOString().split('T')[0],
            paymentMethod: mappedMethod,
            status: 'cleared',
            invoiceNumber: receiptNo,
          },
          ...prev.recentTransactions.slice(0, 4),
        ],
      };
    });

    addAuditLog({
      user: 'Mr. Gabriel Rodriguez',
      actorRole: 'Accountant',
      action: 'Fee Payment Collected',
      module: 'Finance',
      details: `Collected ₹${params.amountPaid.toFixed(2)} via ${params.paymentMethod} for student ${student.name} (${receiptNo})`,
      severity: 'info',
    });

    return { success: true, receipt: newTransaction, message: 'Fee payment recorded successfully.' };
  };

  const getStudentFeeLedger = (studentId: string) => {
    const studentObs = studentFeeObligations.filter((o) => o.studentId === studentId);
    const studentTxs = feeTransactions.filter((t) => t.studentId === studentId);
    const totalAssessed = studentObs.reduce((acc, curr) => acc + curr.assessedAmount, 0);
    const totalConcession = studentObs.reduce((acc, curr) => acc + curr.concessionAmount, 0);
    const totalNet = studentObs.reduce((acc, curr) => acc + curr.netAmount, 0);
    const totalPaid = studentObs.reduce((acc, curr) => acc + curr.paidAmount, 0);
    const totalBalance = studentObs.reduce((acc, curr) => acc + curr.balance, 0);

    let status: 'Paid in Full' | 'Partially Paid' | 'Due Soon' = 'Paid in Full';
    if (totalBalance > 0) {
      status = totalPaid > 0 ? 'Partially Paid' : 'Due Soon';
    }

    return {
      obligations: studentObs,
      transactions: studentTxs,
      totalAssessed,
      totalConcession,
      totalNet,
      totalPaid,
      totalBalance,
      status,
    };
  };

  // --- CROSS-ROLE MODULE 2: LIBRARY ACTIONS ---
  const issueBookLoan = (params: {
    memberId: string;
    copyId: string;
    dueDate: string;
    notes?: string;
    issuedByStaffId?: string;
  }): ValidationFeedback & { loan?: BookLoan } => {
    const member = libraryMembers.find((m) => m.id === params.memberId);
    if (!member) return { isValid: false, message: 'Library member not found.' };
    if (member.status !== 'active') return { isValid: false, message: 'Library membership is inactive.' };
    if (member.currentIssuedCount >= member.issueLimit) {
      return { isValid: false, message: `Member has reached maximum borrowing limit (${member.issueLimit} books).` };
    }
    if (member.fineBalance > 150) {
      return { isValid: false, message: `Member has outstanding unpaid fines of ₹${member.fineBalance.toFixed(2)}. Max allowed is ₹150.00.` };
    }

    const copy = bookCopies.find((c) => c.id === params.copyId);
    if (!copy) return { isValid: false, message: 'Book copy not found.' };
    if (copy.circulationStatus !== 'available') {
      return { isValid: false, message: `This copy is currently ${copy.circulationStatus} and unavailable for loan.` };
    }

    const title = bookTitles.find((t) => t.id === copy.titleId);

    // Update copy status
    setBookCopies((prev) =>
      prev.map((c) => (c.id === copy.id ? { ...c, circulationStatus: 'issued' } : c))
    );

    // Update title counts
    if (title) {
      setBookTitles((prev) =>
        prev.map((t) =>
          t.id === title.id
            ? {
                ...t,
                issuedCopies: t.issuedCopies + 1,
                availableCopies: Math.max(0, t.availableCopies - 1),
              }
            : t
        )
      );
    }

    // Update member count
    setLibraryMembers((prev) =>
      prev.map((m) =>
        m.id === member.id ? { ...m, currentIssuedCount: m.currentIssuedCount + 1 } : m
      )
    );

    const now = new Date();
    const newLoan: BookLoan = {
      id: `loan-${Date.now()}`,
      copyId: copy.id,
      titleId: copy.titleId,
      bookTitle: copy.bookTitle,
      accessionNumber: copy.accessionNumber,
      memberId: member.id,
      memberName: member.name,
      memberType: member.memberType,
      issueDate: now.toISOString().split('T')[0],
      dueDate: params.dueDate,
      status: 'active',
      renewalCount: 0,
      maxRenewals: 2,
      dailyFineRate: 5.0,
      assessedFine: 0,
      finePaid: false,
      issuedBy: params.issuedByStaffId || 'Mrs. Evelyn Clark (Librarian)',
      notes: params.notes,
    };

    setBookLoans((prev) => [newLoan, ...prev]);

    addAuditLog({
      user: 'Mrs. Evelyn Foster',
      actorRole: 'Librarian',
      action: 'Book Issued',
      module: 'Library',
      details: `Issued "${copy.bookTitle}" (Acc: ${copy.accessionNumber}) to ${member.name} (Due: ${params.dueDate})`,
      severity: 'info',
    });

    return { isValid: true, loan: newLoan };
  };

  const returnBookLoan = (
    loanId: string,
    condition?: BookCopy['condition'],
    remarks?: string
  ): ValidationFeedback => {
    const loan = bookLoans.find((l) => l.id === loanId);
    if (!loan) return { isValid: false, message: 'Loan record not found.' };
    if (loan.status === 'returned') return { isValid: false, message: 'This book loan has already been returned.' };

    const todayStr = new Date().toISOString().split('T')[0];

    // Update loan
    setBookLoans((prev) =>
      prev.map((l) =>
        l.id === loanId
          ? {
              ...l,
              status: 'returned',
              returnDate: todayStr,
              returnCondition: condition || 'good',
              returnRemarks: remarks,
            }
          : l
      )
    );

    // Update copy
    setBookCopies((prev) =>
      prev.map((c) =>
        c.id === loan.copyId
          ? {
              ...c,
              circulationStatus: 'available',
              condition: condition || c.condition,
            }
          : c
      )
    );

    // Update title counts
    setBookTitles((prev) =>
      prev.map((t) =>
        t.id === loan.titleId
          ? {
              ...t,
              issuedCopies: Math.max(0, t.issuedCopies - 1),
              availableCopies: t.availableCopies + 1,
            }
          : t
      )
    );

    // Update member count
    setLibraryMembers((prev) =>
      prev.map((m) =>
        m.id === loan.memberId
          ? { ...m, currentIssuedCount: Math.max(0, m.currentIssuedCount - 1) }
          : m
      )
    );

    addAuditLog({
      user: 'Mrs. Evelyn Foster',
      actorRole: 'Librarian',
      action: 'Book Returned',
      module: 'Library',
      details: `Book "${loan.bookTitle}" returned by ${loan.memberName}. Condition: ${condition || 'good'}`,
      severity: 'info',
    });

    return { isValid: true };
  };

  const addBookTitle = (
    data: Omit<BookTitle, 'id' | 'availableCopies'>,
    copiesCount: number = 2
  ): ValidationFeedback => {
    if (!data.title.trim()) return { isValid: false, message: 'Book title is required.' };
    const titleId = `title-${Date.now()}`;
    const count = Math.max(1, copiesCount || data.totalCopies || 2);
    const newTitle: BookTitle = {
      ...data,
      id: titleId,
      totalCopies: count,
      availableCopies: count,
      issuedCopies: 0,
      reservedCopies: 0,
    };
    setBookTitles((prev) => [newTitle, ...prev]);

    // Generate physical copies
    const newCopies: BookCopy[] = Array.from({ length: count }).map((_, i) => ({
      id: `cpy-${titleId}-${i + 1}`,
      titleId,
      bookTitle: data.title,
      accessionNumber: `ACC-${Math.floor(10000 + Math.random() * 90000)}`,
      barcode: `890${Math.floor(100000000 + Math.random() * 900000000)}`,
      condition: 'good',
      circulationStatus: 'available',
      shelfLocation: data.shelfLocation || 'Stack S-01',
      purchaseDate: new Date().toISOString().split('T')[0],
      price: data.purchasePrice || 350,
    }));
    setBookCopies((prev) => [...prev, ...newCopies]);
    return { isValid: true };
  };

  const updateBookTitle = (id: string, data: Partial<BookTitle>): ValidationFeedback => {
    if (data.title !== undefined && !data.title.trim()) {
      return { isValid: false, message: 'Book title cannot be blank.' };
    }
    setBookTitles((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    return { isValid: true };
  };

  const getStudentLibrarySummary = (studentId: string) => {
    const member = libraryMembers.find((m) => m.studentId === studentId);
    if (!member) {
      return { member: undefined, activeLoans: [], overdueLoans: [], totalFines: 0 };
    }
    const studentLoans = bookLoans.filter((l) => l.memberId === member.id);
    const activeLoans = studentLoans.filter((l) => l.status === 'active' || l.status === 'overdue');
    const overdueLoans = studentLoans.filter((l) => l.status === 'overdue');
    return {
      member,
      activeLoans,
      overdueLoans,
      totalFines: member.fineBalance,
    };
  };

  // --- CROSS-ROLE MODULE 3: TRANSPORT ACTIONS ---
  const addTransportRoute = (
    data: Omit<TransportRoute, 'id' | 'assignedStudentCount'>
  ): ValidationFeedback => {
    if (!data.routeNumber.trim()) return { isValid: false, message: 'Route number is required.' };
    if (!data.name.trim()) return { isValid: false, message: 'Route corridor name is required.' };
    const routeId = `route-${Date.now()}`;
    const newRoute: TransportRoute = {
      ...data,
      id: routeId,
      assignedStudentCount: 0,
      status: data.status || 'active',
    };
    setTransportRoutes((prev) => [newRoute, ...prev]);
    return { isValid: true };
  };

  const updateTransportRoute = (id: string, data: Partial<TransportRoute>): ValidationFeedback => {
    if (data.name !== undefined && !data.name.trim()) {
      return { isValid: false, message: 'Route corridor name cannot be blank.' };
    }
    setTransportRoutes((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    return { isValid: true };
  };

  const deleteTransportRoute = (id: string): ValidationFeedback => {
    const hasAssignments = studentTransportAssignments.some(
      (a) => a.routeId === id && a.status === 'active'
    );
    if (hasAssignments) {
      return {
        isValid: false,
        message: 'Cannot delete route with active student transit allocations. Reassign students first.',
      };
    }
    setTransportRoutes((prev) => prev.filter((r) => r.id !== id));
    return { isValid: true };
  };

  const assignStudentTransport = (params: {
    studentId: string;
    routeId: string;
    pickupStopId: string;
    dropoffStopId: string;
    serviceType: TransportServiceType;
    notes?: string;
  }): ValidationFeedback & { assignment?: StudentTransportAssignment } => {
    const student = students.find((s) => s.id === params.studentId);
    if (!student) return { isValid: false, message: 'Student not found.' };

    const route = transportRoutes.find((r) => r.id === params.routeId);
    if (!route) return { isValid: false, message: 'Transport route not found.' };

    if (route.assignedStudentCount >= route.vehicleCapacity) {
      return { isValid: false, message: `Route ${route.routeNumber} is at full capacity (${route.vehicleCapacity} seats).` };
    }

    const pickupStop = route.stops.find((s) => s.id === params.pickupStopId) || route.stops[0];
    const dropoffStop = route.stops.find((s) => s.id === params.dropoffStopId) || route.stops[0];

    // Remove any previous active assignment for this student
    const existing = studentTransportAssignments.find(
      (a) => a.studentId === student.id && a.status === 'active'
    );
    if (existing) {
      setTransportRoutes((prev) =>
        prev.map((r) =>
          r.id === existing.routeId
            ? { ...r, assignedStudentCount: Math.max(0, r.assignedStudentCount - 1) }
            : r
        )
      );
    }

    const newAssignment: StudentTransportAssignment = {
      id: `asg-${student.id}`,
      studentId: student.id,
      studentName: student.name,
      admissionNo: student.admissionNo,
      classId: student.classId,
      className: student.className,
      sectionId: student.sectionId,
      sectionName: student.sectionName,
      guardianName: student.guardianName,
      guardianPhone: student.guardianPhone,
      routeId: route.id,
      routeName: `${route.routeNumber}: ${route.name}`,
      vehicleNumber: route.assignedVehicleNumber,
      pickupStopId: pickupStop.id,
      pickupStopName: pickupStop.stopName,
      morningPickupTime: pickupStop.morningPickupTime,
      dropoffStopId: dropoffStop.id,
      dropoffStopName: dropoffStop.stopName,
      afternoonDropTime: dropoffStop.afternoonDropTime,
      serviceType: params.serviceType,
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      monthlyTransportFee: route.monthlyFee,
      feeStatus: 'paid',
      notes: params.notes,
    };

    setStudentTransportAssignments((prev) => [
      newAssignment,
      ...prev.filter((a) => a.studentId !== student.id),
    ]);

    // Increment route student count
    setTransportRoutes((prev) =>
      prev.map((r) =>
        r.id === route.id
          ? { ...r, assignedStudentCount: r.assignedStudentCount + 1 }
          : r
      )
    );

    addAuditLog({
      user: 'Mr. Tyler Bennett',
      actorRole: 'Transport Manager',
      action: 'Transport Route Assigned',
      module: 'Transport',
      details: `Assigned ${student.name} to ${route.routeNumber} (${pickupStop.stopName})`,
      severity: 'info',
    });

    return { isValid: true, assignment: newAssignment };
  };

  const unassignStudentTransport = (assignmentId: string): ValidationFeedback => {
    const asg = studentTransportAssignments.find((a) => a.id === assignmentId);
    if (!asg) return { isValid: false, message: 'Transport assignment not found.' };

    setStudentTransportAssignments((prev) => prev.filter((a) => a.id !== assignmentId));

    setTransportRoutes((prev) =>
      prev.map((r) =>
        r.id === asg.routeId
          ? { ...r, assignedStudentCount: Math.max(0, r.assignedStudentCount - 1) }
          : r
      )
    );

    addAuditLog({
      user: 'Mr. Tyler Bennett',
      actorRole: 'Transport Manager',
      action: 'Transport Assignment Cancelled',
      module: 'Transport',
      details: `De-allocated student ${asg.studentName} from route ${asg.routeName}`,
      severity: 'info',
    });

    return { isValid: true };
  };

  const updateStudentTransportStatus = (
    assignmentId: string,
    status: TransportAssignmentStatus
  ): ValidationFeedback => {
    const asg = studentTransportAssignments.find((a) => a.id === assignmentId);
    if (!asg) return { isValid: false, message: 'Transport assignment not found.' };

    setStudentTransportAssignments((prev) =>
      prev.map((a) => (a.id === assignmentId ? { ...a, status } : a))
    );

    addAuditLog({
      user: 'Mr. Tyler Bennett',
      actorRole: 'Transport Manager',
      action: 'Transport Status Changed',
      module: 'Transport',
      details: `Updated ${asg.studentName} assignment status to ${status}`,
      severity: 'info',
    });

    return { isValid: true };
  };

  const getStudentTransportSummary = (studentId: string) => {
    const assignment = studentTransportAssignments.find(
      (a) => a.studentId === studentId && a.status === 'active'
    );
    if (!assignment) {
      return { assignment: undefined, route: undefined, vehicle: undefined, driver: undefined };
    }
    const route = transportRoutes.find((r) => r.id === assignment.routeId);
    const vehicle = transportVehicles.find((v) => v.id === route?.assignedVehicleId);
    const driver = transportDrivers.find((d) => d.id === route?.assignedDriverId);
    return { assignment, route, vehicle, driver };
  };

  // --- CROSS-ROLE MODULE 4: RECEPTION ACTIONS ---
  const checkInVisitor = (data: {
    visitorName: string;
    category: VisitorIdentity['category'];
    phone: string;
    organization?: string;
    purpose: string;
    hostStaffName: string;
    hostStaffId: string;
    department: string;
    groupSize?: number;
    vehicleNumber?: string;
  }): ValidationFeedback & { visit?: VisitRecord } => {
    if (!data.visitorName.trim()) return { isValid: false, message: 'Visitor name is required.' };
    if (!data.phone.trim()) return { isValid: false, message: 'Contact phone is required.' };
    if (!data.purpose.trim()) return { isValid: false, message: 'Visit purpose is required.' };

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const passNumber = `PASS-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newVisit: VisitRecord = {
      id: `vis-${Date.now()}`,
      visitorId: `vst-${Date.now()}`,
      visitorName: data.visitorName.trim(),
      visitorCategory: data.category,
      phone: data.phone.trim(),
      organization: data.organization || '',
      purpose: data.purpose.trim(),
      hostStaffId: data.hostStaffId,
      hostStaffName: data.hostStaffName,
      department: data.department,
      checkInTime: timeStr,
      date: todayStr,
      status: 'Checked In',
      groupSize: data.groupSize || 1,
      vehicleNumber: data.vehicleNumber,
      badgeNumber: passNumber,
    };

    setVisits((prev) => [newVisit, ...prev]);

    // Check if visitor identity exists, if not add
    const existingVisitor = visitors.find(
      (v) => v.phone.replace(/\D/g, '') === data.phone.replace(/\D/g, '')
    );
    if (!existingVisitor) {
      const newIdentity: VisitorIdentity = {
        id: newVisit.visitorId,
        fullName: newVisit.visitorName,
        category: newVisit.visitorCategory,
        phone: newVisit.phone,
        organization: newVisit.organization,
        totalVisitsCount: 1,
        createdAt: todayStr,
      };
      setVisitors((prev) => [newIdentity, ...prev]);
    } else {
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === existingVisitor.id
            ? { ...v, totalVisitsCount: v.totalVisitsCount + 1 }
            : v
        )
      );
    }

    addAuditLog({
      user: 'Mrs. Clara Higgins',
      actorRole: 'Receptionist',
      action: 'Visitor Checked In',
      module: 'Front Desk',
      details: `Checked in visitor ${data.visitorName} (${passNumber}) to see ${data.hostStaffName}`,
      severity: 'info',
    });

    return { isValid: true, visit: newVisit };
  };

  const checkOutVisitor = (visitId: string): ValidationFeedback => {
    const visit = visits.find((v) => v.id === visitId);
    if (!visit) return { isValid: false, message: 'Visit record not found.' };
    if (visit.status === 'Checked Out') {
      return { isValid: false, message: 'Visitor is already checked out.' };
    }

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setVisits((prev) =>
      prev.map((v) =>
        v.id === visitId
          ? { ...v, status: 'Checked Out', checkOutTime: timeStr }
          : v
      )
    );

    addAuditLog({
      user: 'Mrs. Clara Higgins',
      actorRole: 'Receptionist',
      action: 'Visitor Checked Out',
      module: 'Front Desk',
      details: `Checked out visitor ${visit.visitorName} (${visit.badgeNumber}) at ${timeStr}`,
      severity: 'info',
    });

    return { isValid: true };
  };

  const addReceptionEnquiry = (
    data: Omit<FrontOfficeEnquiry, 'id' | 'enquiryNo' | 'enquiryDate' | 'isConverted'>
  ): ValidationFeedback => {
    if (!data.parentName?.trim()) return { isValid: false, message: 'Parent name is required.' };
    const now = new Date();
    const newEnq: FrontOfficeEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      enquiryNo: `ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      enquiryDate: now.toISOString().split('T')[0],
      isConverted: false,
    };
    setFrontOfficeEnquiries((prev) => [newEnq, ...prev]);
    return { isValid: true };
  };

  const updateReceptionEnquiryStatus = (
    id: string,
    status: FrontOfficeEnquiry['status'],
    notes?: string
  ) => {
    setFrontOfficeEnquiries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status, internalNotes: notes || e.internalNotes } : e
      )
    );
  };

  const updateDocumentRequestStatus = (
    id: string,
    status: DocumentRequestStatus,
    deliveryNotes?: string
  ) => {
    setDocumentRequests((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status,
              remarks: deliveryNotes || d.remarks,
            }
          : d
      )
    );
  };

  // --- CROSS-ROLE QUERY HELPERS ---
  const getParentWards = (guardianIdOrPhone: string): Student[] => {
    const cleaned = guardianIdOrPhone.replace(/\D/g, '');
    const g = guardians.find(
      (guard) =>
        guard.id === guardianIdOrPhone ||
        (cleaned && guard.phone.replace(/\D/g, '') === cleaned) ||
        (guardianIdOrPhone.includes('@') && guard.email.toLowerCase() === guardianIdOrPhone.toLowerCase())
    );
    if (!g) {
      return students.filter((s) => s.guardianId === guardianIdOrPhone);
    }
    return students.filter(
      (s) => g.linkedStudentIds.includes(s.id) || s.guardianId === g.id
    );
  };

  const getStaffAssignmentsSummary = (staffId: string) => {
    const timetablePeriods = timetable.filter((t) => t.teacherId === staffId);
    const assignedSecIds = Array.from(new Set(timetablePeriods.map((t) => t.sectionId)));
    const matchedSections = sections.filter((sec) => assignedSecIds.includes(sec.id));
    const matchedSubjects = Array.from(new Set(timetablePeriods.map((t) => t.subjectName)));
    const pendingApprovals = approvals.filter(
      (a) => a.requestedByStaffId === staffId && a.status === 'pending'
    );
    return {
      timetablePeriods,
      sections: matchedSections,
      subjects: matchedSubjects,
      pendingApprovals,
    };
  };

  const resetAllSchoolDataToDefaults = () => {
    setClasses(INITIAL_CLASSES);
    setSections(INITIAL_SECTIONS);
    setGuardians(INITIAL_GUARDIANS);
    setStudents(INITIAL_STUDENTS);
    setStaff(INITIAL_STAFF);
    setSubjects(INITIAL_SUBJECTS);
    setTimetable(INITIAL_TIMETABLE);
    setAttendance(INITIAL_ATTENDANCE);
    setAdmissions(INITIAL_ADMISSIONS);
    setSchoolProfile(INITIAL_SCHOOL_PROFILE);
    setFeesSummary(INITIAL_FEES_SUMMARY);
    setRooms(INITIAL_ROOMS);
    setBellSchedule(INITIAL_BELL_SCHEDULE);
    setAcademicTerms(INITIAL_ACADEMIC_TERMS);
    setGradingScale(INITIAL_GRADING_SCALE);
    setAuditLogs(INITIAL_ADMIN_AUDIT_LOGS);
    setAssignments(INITIAL_ASSIGNMENTS);
    setExams(INITIAL_EXAMS);
    setAssessmentTasks(INITIAL_ASSESSMENT_TASKS);
    setMarks(INITIAL_MARKS);
    setSyllabus(INITIAL_SYLLABUS);
    setLessonPlans(INITIAL_LESSON_PLANS);
    setInterventions(INITIAL_INTERVENTIONS);
    setApprovals(INITIAL_APPROVALS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);

    // Cross-Role Module Entities
    setFeeStructures(INITIAL_FEE_STRUCTURES);
    setStudentFeeObligations(INITIAL_STUDENT_OBLIGATIONS);
    setFeeTransactions(INITIAL_TRANSACTIONS);
    setFeeConcessions(INITIAL_CONCESSIONS);

    setBookTitles(INITIAL_BOOK_TITLES);
    setBookCopies(INITIAL_BOOK_COPIES);
    setLibraryMembers(INITIAL_LIBRARY_MEMBERS);
    setBookLoans(INITIAL_BOOK_LOANS);
    setBookReservations(INITIAL_BOOK_RESERVATIONS);
    setLibraryFines(INITIAL_LIBRARY_FINES);

    setTransportVehicles(INITIAL_VEHICLES);
    setTransportDrivers(INITIAL_DRIVERS);
    setTransportRoutes(INITIAL_ROUTES);
    setStudentTransportAssignments(INITIAL_STUDENT_TRANSPORT_ASSIGNMENTS);
    setTransportBoardingRecords(INITIAL_BOARDING_RECORDS);

    setVisitors(INITIAL_VISITORS);
    setVisits(INITIAL_VISITS);
    setFrontOfficeEnquiries(INITIAL_FRONT_OFFICE_ENQUIRIES);
    setFrontOfficeAppointments(INITIAL_APPOINTMENTS);
    setReceptionCalls(INITIAL_CALL_LOGS);
    setReceptionRequests(INITIAL_RECEPTION_REQUESTS);
    setDocumentRequests(INITIAL_DOCUMENT_REQUESTS);

    try {
      localStorage.removeItem(STORAGE_KEY_SCHOOL_DATA);
    } catch (e) {}
  };

  return (
    <SchoolDataContext.Provider
      value={{
        classes,
        sections,
        students,
        guardians,
        staff,
        subjects,
        timetable,
        attendance,
        admissions,
        schoolProfile,
        feesSummary,
        rooms,
        bellSchedule,
        academicTerms,
        gradingScale,
        auditLogs,
        assignments,
        exams,
        assessmentTasks,
        marks,
        syllabus,
        lessonPlans,
        interventions,
        approvals,
        announcements,
        feeStructures,
        studentFeeObligations,
        feeTransactions,
        feeConcessions,
        addFeeStructure,
        updateFeeStructure,
        archiveFeeStructure,
        recordFeePayment,
        getStudentFeeLedger,
        bookTitles,
        bookCopies,
        libraryMembers,
        bookLoans,
        bookReservations,
        libraryFines,
        addBookTitle,
        updateBookTitle,
        issueBookLoan,
        returnBookLoan,
        getStudentLibrarySummary,
        transportVehicles,
        transportDrivers,
        transportRoutes,
        studentTransportAssignments,
        transportBoardingRecords,
        addTransportRoute,
        updateTransportRoute,
        deleteTransportRoute,
        assignStudentTransport,
        unassignStudentTransport,
        updateStudentTransportStatus,
        getStudentTransportSummary,
        visitors,
        visits,
        frontOfficeEnquiries,
        frontOfficeAppointments,
        receptionCalls,
        receptionRequests,
        documentRequests,
        checkInVisitor,
        checkOutVisitor,
        addReceptionEnquiry,
        updateReceptionEnquiryStatus,
        updateDocumentRequestStatus,
        getParentWards,
        getStaffAssignmentsSummary,
        addRoom,
        updateRoom,
        updateBellSchedule,
        updateAcademicTerms,
        updateGradingScale,
        addAuditLog,
        addClass,
        updateClass,
        archiveClass,
        restoreClass,
        addSection,
        updateSection,
        archiveSection,
        restoreSection,
        addStudent,
        updateStudent,
        archiveStudent,
        restoreStudent,
        transferStudentSection,
        bulkUpdateStudentStatus,
        addGuardian,
        updateGuardian,
        linkAdditionalGuardian,
        unlinkGuardian,
        addStaff,
        updateStaff,
        archiveStaff,
        restoreStaff,
        assignSubjectTeacher,
        removeSubjectTeacher,
        addSubject,
        updateSubject,
        archiveSubject,
        restoreSubject,
        validateTimetableSlot,
        addTimetablePeriod,
        updateTimetablePeriod,
        deleteTimetablePeriod,
        recordAttendanceBatch,
        addAdmissionEnquiry,
        updateAdmissionEnquiry,
        convertEnquiryToStudent,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        addExam,
        updateExam,
        deleteExam,
        addAssessmentTask,
        updateAssessmentTask,
        deleteAssessmentTask,
        saveMarksBatch,
        publishAssessmentResults,
        updateSyllabusTopic,
        reviewSyllabusTopic,
        addLessonPlan,
        updateLessonPlan,
        approveLessonPlan,
        addIntervention,
        updateIntervention,
        processApproval,
        addAnnouncement,
        updateAnnouncement,
        updateSchoolProfile,
        resetAllSchoolDataToDefaults,
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = (): SchoolDataContextValue => {
  const ctx = useContext(SchoolDataContext);
  if (!ctx) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return ctx;
};
