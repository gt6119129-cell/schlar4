export type BookCondition = 'new' | 'good' | 'fair' | 'damaged' | 'lost' | 'missing';
export type CirculationStatus = 'available' | 'issued' | 'reserved' | 'under-repair' | 'withdrawn';
export type MemberType = 'student' | 'staff';
export type MembershipStatus = 'active' | 'suspended' | 'expired';
export type LoanStatus = 'active' | 'returned' | 'overdue' | 'renewed';
export type ReservationStatus = 'pending' | 'ready-for-pickup' | 'collected' | 'cancelled' | 'expired';
export type FinePaymentStatus = 'unpaid' | 'paid' | 'waived' | 'partially-paid';

export interface BookCategory {
  id: string;
  name: string;
  code: string;
  deweyRange?: string;
  description: string;
  bookCount: number;
  status: 'active' | 'archived';
}

export interface BookTitle {
  id: string;
  isbn: string;
  title: string;
  subtitle?: string;
  authors: string[];
  categoryId: string;
  categoryName: string;
  publisher: string;
  publicationYear: number;
  edition?: string;
  language: string;
  description: string;
  shelfLocation: string; // e.g. "Stack B-04"
  rackNumber: string;    // e.g. "Rack 3"
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  reservedCopies: number;
  acquisitionDate: string;
  purchasePrice?: number;
  supplier?: string;
  status: 'active' | 'archived';
  coverEmoji?: string;
}

export interface BookCopy {
  id: string;
  titleId: string;
  bookTitle: string;
  accessionNumber: string; // e.g. "ACC-2024-0104"
  barcode: string;          // e.g. "890124501"
  condition: BookCondition;
  circulationStatus: CirculationStatus;
  shelfLocation: string;
  purchaseDate: string;
  price: number;
  conditionNotes?: string;
  lastVerifiedDate?: string;
}

export interface LibraryMember {
  id: string;
  memberType: MemberType;
  studentId?: string;
  staffId?: string;
  name: string;
  admissionNoOrStaffId: string;
  classSectionOrDept: string;
  contactEmail: string;
  contactPhone: string;
  status: MembershipStatus;
  issueLimit: number; // e.g. 3 for students, 6 for faculty
  currentIssuedCount: number;
  fineBalance: number;
  joinedDate: string;
  notes?: string;
}

export interface BookLoan {
  id: string;
  copyId: string;
  titleId: string;
  bookTitle: string;
  accessionNumber: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: LoanStatus;
  renewalCount: number;
  maxRenewals: number;
  dailyFineRate: number; // e.g. $0.50
  assessedFine: number;
  finePaid: boolean;
  returnCondition?: BookCondition;
  notes?: string;
  issuedBy?: string;
}

export interface BookReservation {
  id: string;
  titleId: string;
  bookTitle: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  reservationDate: string;
  queuePosition: number;
  status: ReservationStatus;
  expiryDate: string;
  pickupDeadline?: string;
  notes?: string;
}

export interface LibraryFine {
  id: string;
  loanId: string;
  memberId: string;
  memberName: string;
  memberType: MemberType;
  bookTitle: string;
  accessionNumber: string;
  dueDate: string;
  returnDate?: string;
  overdueDays: number;
  dailyRate: number;
  gracePeriodDays: number;
  grossFine: number;
  discountOrWaiver: number;
  netFine: number;
  paymentStatus: FinePaymentStatus;
  amountPaid: number;
  paidDate?: string;
  receiptNumber?: string;
  waiverReason?: string;
  recordedBy: string;
}

export interface StockAuditDiscrepancy {
  copyId: string;
  accessionNumber: string;
  title: string;
  shelfLocation: string;
  expectedStatus: CirculationStatus;
  observedStatus: 'verified' | 'missing' | 'damaged' | 'misplaced';
  notes: string;
}

export interface StockAuditSession {
  id: string;
  sessionName: string;
  auditDate: string;
  categoryOrSection: string;
  totalAudited: number;
  matchedCount: number;
  discrepanciesCount: number;
  discrepancies: StockAuditDiscrepancy[];
  status: 'in-progress' | 'completed';
  verifiedBy: string;
}
