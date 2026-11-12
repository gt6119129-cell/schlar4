export type VisitorCategory =
  | 'Parent/Guardian'
  | 'Prospective Parent'
  | 'Vendor/Supplier'
  | 'Delivery Personnel'
  | 'Guest/Invited Speaker'
  | 'Service Provider'
  | 'Former Student'
  | 'Government Official'
  | 'Other';

export type VisitStatus = 'Expected' | 'Checked In' | 'Checked Out' | 'Cancelled' | 'Overstay';

export type IdProofType = 'Driver License' | 'Passport' | 'National ID' | 'Company ID' | 'None';

export interface VisitorIdentity {
  id: string; // e.g. 'vis-001'
  fullName: string;
  category: VisitorCategory;
  organization?: string;
  phone: string;
  email?: string;
  idProofType?: IdProofType;
  idProofNumber?: string;
  vehicleNumber?: string;
  linkedParentId?: string; // e.g. 'grd-chen'
  linkedStaffId?: string;
  totalVisitsCount: number;
  notes?: string;
  createdAt: string;
}

export interface VisitRecord {
  id: string; // e.g. 'vst-101'
  visitorId: string;
  visitorName: string;
  visitorCategory: VisitorCategory;
  phone: string;
  organization?: string;
  purpose: string;
  hostStaffId: string;
  hostStaffName: string;
  department: string;
  appointmentId?: string;
  groupSize: number;
  vehicleNumber?: string;
  badgeNumber: string; // e.g. 'PASS-448'
  checkInTime: string; // ISO datetime
  checkOutTime?: string; // ISO datetime
  status: VisitStatus;
  checkoutNotes?: string;
  date: string; // YYYY-MM-DD
}

export type EnquirySource =
  | 'Walk-in'
  | 'Phone'
  | 'Website'
  | 'Referral'
  | 'School Event'
  | 'Email'
  | 'Other';

export type EnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Follow-up Required'
  | 'Visit Scheduled'
  | 'Information Shared'
  | 'Converted'
  | 'Closed';

export interface EnquiryFollowUp {
  id: string;
  date: string;
  note: string;
  author: string;
  action: string;
}

export interface FrontOfficeEnquiry {
  id: string; // e.g. 'enq-fo-001'
  enquiryNo: string;
  enquiryDate: string;
  parentName: string;
  studentName?: string;
  phone: string;
  email?: string;
  academicYear: string;
  interestedClassId: string;
  interestedClassName: string;
  source: EnquirySource;
  details: string;
  assignedStaffId: string;
  assignedStaffName: string;
  followUpDate?: string;
  status: EnquiryStatus;
  internalNotes?: string;
  isConverted: boolean;
  convertedStudentId?: string;
  activityLog: EnquiryFollowUp[];
}

export type AppointmentStatus =
  | 'Scheduled'
  | 'Confirmed'
  | 'Arrived'
  | 'In Meeting'
  | 'Completed'
  | 'Cancelled'
  | 'No Show';

export interface FrontOfficeAppointment {
  id: string; // e.g. 'apt-301'
  title: string;
  visitorName: string;
  visitorPhone: string;
  visitorEmail?: string;
  visitorCategory: VisitorCategory;
  hostStaffId: string;
  hostStaffName: string;
  department: string;
  purpose: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string;
  status: AppointmentStatus;
  linkedVisitId?: string;
  notes?: string;
  createdBy: string;
}

export type CallDirection = 'Incoming' | 'Outgoing';

export type CallCategory =
  | 'Admissions Inquiry'
  | 'Parent Query'
  | 'Fee Inquiry'
  | 'Vendor/Supplier'
  | 'Transport Query'
  | 'Emergency/Urgent'
  | 'General Information';

export interface CallLogRecord {
  id: string; // e.g. 'call-401'
  dateTime: string;
  direction: CallDirection;
  callerName: string;
  phone: string;
  category: CallCategory;
  relatedStudentName?: string;
  relatedStudentId?: string;
  purpose: string;
  summary: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  followUpRequired: boolean;
  followUpDate?: string;
  status: 'Resolved' | 'Pending Follow-up' | 'Transferred' | 'Escalated';
}

export type RequestCategory =
  | 'Teacher Meeting Request'
  | 'Department Inquiry'
  | 'Lost & Found'
  | 'Campus Maintenance'
  | 'Bus Pass / ID Reissue'
  | 'General Query'
  | 'Parent Concern';

export type RequestPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type RequestStatus =
  | 'New'
  | 'Assigned'
  | 'In Progress'
  | 'Waiting for Response'
  | 'Resolved'
  | 'Closed';

export interface ReceptionRequest {
  id: string; // e.g. 'req-501'
  requestNo: string;
  date: string;
  category: RequestCategory;
  requesterName: string;
  requesterPhone: string;
  requesterType: 'Parent' | 'Student' | 'Staff' | 'Visitor';
  summary: string;
  description: string;
  assignedDepartment: string;
  assignedStaffName?: string;
  priority: RequestPriority;
  status: RequestStatus;
  followUpDate?: string;
  resolutionNotes?: string;
  history: Array<{ timestamp: string; action: string; note: string; actor: string }>;
}

export type DocumentType =
  | 'Bonafide Certificate'
  | 'Transfer Certificate (TC) Enquiry'
  | 'Study & Conduct Certificate'
  | 'Fee Receipt Duplicate'
  | 'Grade Card Attestation'
  | 'Bus Pass Replacement';

export type DocumentRequestStatus =
  | 'Submitted'
  | 'Under Review'
  | 'Referred to Department'
  | 'Ready for Collection'
  | 'Completed'
  | 'Rejected';

export interface DocumentRequestRecord {
  id: string; // e.g. 'doc-601'
  requestNo: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  requesterName: string;
  requesterRelationship: string;
  requesterPhone: string;
  documentType: DocumentType;
  purpose: string;
  requestDate: string;
  assignedDepartment: string;
  status: DocumentRequestStatus;
  followUpDate?: string;
  officialFeePaid?: number;
  rejectionReason?: string;
  remarks?: string;
}

export interface CourierPackage {
  id: string;
  consignmentNo: string;
  courierCompany: string;
  senderName: string;
  senderOrganization: string;
  recipientStaffId: string;
  recipientStaffName: string;
  department: string;
  receivedDate: string;
  receivedTime: string;
  packageType: 'Document Envelope' | 'Parcel Box' | 'Registered Letter' | 'Textbook Package';
  status: 'Received at Front Desk' | 'Notified Recipient' | 'Collected by Recipient';
  collectedAt?: string;
}
