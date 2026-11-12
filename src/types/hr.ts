export interface HRDepartment {
  id: string;
  name: string;
  code: string;
  headOfDepartmentId?: string;
  headOfDepartmentName?: string;
  staffCount: number;
  status: 'active' | 'inactive';
}

export interface HRDesignation {
  id: string;
  title: string;
  departmentId: string;
  departmentName: string;
  level: 'Executive Leadership' | 'Senior Faculty' | 'Faculty' | 'Support Staff' | 'Administrative';
  staffCount: number;
}

export type EmploymentType =
  | 'Full-Time Permanent'
  | 'Full-Time Contract'
  | 'Part-Time'
  | 'Probationary'
  | 'Visiting Faculty';

export interface StaffAttendanceLog {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  designation: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: 'present' | 'late' | 'absent' | 'on_leave' | 'half_day';
  session: 'Full Day' | 'Morning' | 'Afternoon';
  remarks?: string;
}

export interface StaffAttendanceCorrection {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  originalStatus: string;
  requestedStatus: 'present' | 'late' | 'on_leave';
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
}

export interface StaffLeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  departmentName: string;
  designation: string;
  leaveType:
    | 'Casual Leave'
    | 'Sick / Medical'
    | 'Maternity / Paternity'
    | 'Privilege / Earned'
    | 'Duty Leave'
    | 'Unpaid Leave';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  appliedDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  reviewRemarks?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface StaffLeaveBalance {
  staffId: string;
  staffName: string;
  department: string;
  casualRemaining: number;
  casualTotal: number;
  sickRemaining: number;
  sickTotal: number;
  privilegeRemaining: number;
  privilegeTotal: number;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  designation: string;
  employmentType: EmploymentType;
  openingsCount: number;
  experienceRequired: string;
  postingDate: string;
  closingDate: string;
  status: 'Open' | 'Interviewing' | 'Filled' | 'Archived';
  applicantsCount: number;
}

export interface JobCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  appliedRole: string;
  jobOpeningId: string;
  applicationDate: string;
  stage: 'Applied' | 'Screening' | 'Interview' | 'Offer Sent' | 'Hired' | 'Rejected';
  notes?: string;
  rating: number; // 1 to 5
  interviewDate?: string;
  convertedStaffId?: string;
}

export interface StaffDocumentRecord {
  id: string;
  staffId: string;
  staffName: string;
  category:
    | 'Identification'
    | 'Academic Degree'
    | 'Teaching License'
    | 'Background Verification'
    | 'Contract & Appointment';
  documentTitle: string;
  documentNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired' | 'Pending Verification';
  verifiedBy?: string;
}
