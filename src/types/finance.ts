export type FeeCategory =
  | 'Tuition'
  | 'Admission'
  | 'Examination'
  | 'Laboratory'
  | 'Library'
  | 'Transport'
  | 'Extracurricular'
  | 'Facility';

export type FeeFrequency = 'One-Time' | 'Annual' | 'Termly' | 'Monthly';

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'Cheque' | 'UPI' | 'Card';

export type TransactionStatus = 'Completed' | 'Pending' | 'Reversed' | 'Cancelled';

export interface FeeStructure {
  id: string;
  name: string;
  academicYear: string;
  classIds: string[];
  classNameList: string[];
  category: FeeCategory;
  amount: number;
  frequency: FeeFrequency;
  dueDate: string;
  effectiveFrom: string;
  status: 'active' | 'inactive';
  description?: string;
}

export interface StudentFeeObligation {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  sectionId: string;
  sectionName: string;
  feeStructureId: string;
  feeStructureName: string;
  category: FeeCategory;
  assessedAmount: number;
  concessionAmount: number;
  netAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'Unpaid' | 'Partially Paid' | 'Paid in Full' | 'Overdue';
}

export interface FeeConcession {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  obligationId: string;
  obligationName: string;
  type: 'Merit Scholarship' | 'Staff Child Waiver' | 'Financial Hardship' | 'Sibling Concession';
  amount: number;
  percentage?: number;
  reason: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface FeePaymentTransaction {
  id: string;
  receiptNo: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  obligationIds: string[];
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  transactionRef: string;
  recordedBy: string;
  status: TransactionStatus;
  notes?: string;
  allocatedBreakdown: {
    obligationId: string;
    feeName: string;
    amount: number;
  }[];
}

export interface FeeRefundAdjustment {
  id: string;
  type: 'Refund' | 'Adjustment' | 'Reversal';
  originalTransactionId?: string;
  receiptNo?: string;
  studentId: string;
  studentName: string;
  amount: number;
  reason: string;
  processedDate: string;
  approvedBy: string;
  status: 'Completed' | 'Pending' | 'Rejected';
}

export interface BankReconciliationItem {
  id: string;
  transactionRef: string;
  paymentId?: string;
  studentName?: string;
  date: string;
  statementAmount: number;
  systemAmount: number;
  difference: number;
  status: 'Matched' | 'Unmatched' | 'Exception';
  bankStatementRef: string;
  reconciledAt?: string;
}
