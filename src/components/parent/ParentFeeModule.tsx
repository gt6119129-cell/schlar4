import React, { useState } from 'react';
import { LinkedChild } from '../../data/mockData';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SchlarLogo } from '../brand/SchlarLogo';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Receipt,
  X,
  ShieldCheck,
  Info,
  ChevronRight,
  Lock,
  Check,
  Download,
  Building,
  Smartphone,
  CheckSquare,
} from 'lucide-react';

interface ParentFeeModuleProps {
  selectedChild: LinkedChild;
}

interface FeeCategoryItem {
  id: string;
  name: string;
  category: string;
  assessedAmount: number;
  concessionAmount: number;
  netObligation: number;
  status: 'Paid in Full' | 'Partially Paid' | 'Due Soon' | 'Overdue' | 'Unpaid';
}

interface PaymentRecord {
  id: string;
  receiptNo: string;
  paymentDate: string;
  amountPaid: number;
  paymentMethod: string;
  transactionRef: string;
  allocatedCategory: string;
  status: 'Completed' | 'Verified';
}

export const ParentFeeModule: React.FC<ParentFeeModuleProps> = ({
  selectedChild,
}) => {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentRecord | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'items' | 'receipts'>('items');
  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState<'UPI' | 'Card' | 'Bank Transfer'>('UPI');
  const [upiId, setUpiId] = useState('parent@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('08/28');
  const [cardCvc, setCardCvc] = useState('312');
  const [cardHolder, setCardHolder] = useState('Mrs. Li Chen');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paySuccessNotice, setPaySuccessNotice] = useState<string | null>(null);
  const [downloadSuccessNotice, setDownloadSuccessNotice] = useState<string | null>(null);
  const [localPaidOffset, setLocalPaidOffset] = useState<number>(0);

  const { students, getStudentFeeLedger, recordFeePayment } = useSchoolData();

  const matchedStudent = students.find(
    (s) =>
      s.id === selectedChild.id ||
      s.name.toLowerCase() === selectedChild.name.toLowerCase()
  );

  const ledger = matchedStudent ? getStudentFeeLedger(matchedStudent.id) : null;

  // Financial obligations bound to live context ledger or fallback
  const fallbackCategories: FeeCategoryItem[] = selectedChild.grade.includes('8')
    ? [
        {
          id: 'fee-1',
          name: 'Academic Tuition & Instruction Fee (Term 1 & 2)',
          category: 'Tuition',
          assessedAmount: 3200.0,
          concessionAmount: 320.0,
          netObligation: 2880.0,
          status: 'Paid in Full',
        },
        {
          id: 'fee-2',
          name: 'STEM Physics & Robotics Lab Consumables',
          category: 'Laboratory',
          assessedAmount: 450.0,
          concessionAmount: 0.0,
          netObligation: 450.0,
          status: 'Paid in Full',
        },
        {
          id: 'fee-3',
          name: 'Digital Library & Campus Network License',
          category: 'Technology',
          assessedAmount: 220.0,
          concessionAmount: 0.0,
          netObligation: 220.0,
          status: 'Paid in Full',
        },
        {
          id: 'fee-4',
          name: 'Athletics & Physical Education Facility Access',
          category: 'Co-Curricular',
          assessedAmount: 180.0,
          concessionAmount: 0.0,
          netObligation: 180.0,
          status: 'Paid in Full',
        },
      ]
    : [
        {
          id: 'fee-p1',
          name: 'Primary Elementary Tuition (Term 1)',
          category: 'Tuition',
          assessedAmount: 2100.0,
          concessionAmount: 0.0,
          netObligation: 2100.0,
          status: 'Partially Paid',
        },
        {
          id: 'fee-p2',
          name: 'Primary Art & Music Studio Materials',
          category: 'Co-Curricular',
          assessedAmount: 180.0,
          concessionAmount: 0.0,
          netObligation: 180.0,
          status: 'Paid in Full',
        },
        {
          id: 'fee-p3',
          name: 'Campus Lunch Program & Activity Levies',
          category: 'Meals & Activities',
          assessedAmount: 350.0,
          concessionAmount: 0.0,
          netObligation: 350.0,
          status: 'Due Soon',
        },
      ];

  const feeCategories: FeeCategoryItem[] =
    ledger && ledger.obligations.length > 0
      ? ledger.obligations.map((ob) => ({
          id: ob.id,
          name: ob.feeStructureName,
          category: ob.category,
          assessedAmount: ob.assessedAmount,
          concessionAmount: ob.concessionAmount,
          netObligation: ob.netAmount,
          status: ob.status,
        }))
      : fallbackCategories;

  const totalAssessed =
    ledger && ledger.obligations.length > 0
      ? ledger.totalAssessed
      : feeCategories.reduce((acc, f) => acc + f.assessedAmount, 0);

  const totalConcessions =
    ledger && ledger.obligations.length > 0
      ? ledger.totalConcession
      : feeCategories.reduce((acc, f) => acc + f.concessionAmount, 0);

  const rawOutstanding =
    ledger && ledger.obligations.length > 0
      ? ledger.totalBalance
      : selectedChild.outstandingBalance;

  const outstandingBalance = Math.max(0, rawOutstanding - localPaidOffset);

  const rawPaid =
    ledger && ledger.obligations.length > 0
      ? ledger.totalPaid
      : totalAssessed - totalConcessions - rawOutstanding;

  const totalPaid = rawPaid + localPaidOffset;

  // Payment receipts history
  const fallbackHistory: PaymentRecord[] = selectedChild.grade.includes('8')
    ? [
        {
          id: 'pay-1',
          receiptNo: 'REC-2026-0814-A',
          paymentDate: '2026-08-28',
          amountPaid: 2880.0,
          paymentMethod: 'Bank Wire / ACH Direct',
          transactionRef: 'TXN-9982314-BOS',
          allocatedCategory: 'Academic Tuition (Term 1 & 2)',
          status: 'Completed',
        },
        {
          id: 'pay-2',
          receiptNo: 'REC-2026-0814-B',
          paymentDate: '2026-09-02',
          amountPaid: 850.0,
          paymentMethod: 'Electronic Bank Debit',
          transactionRef: 'TXN-4412998-SCH',
          allocatedCategory: 'STEM Lab, Technology & Athletics Fees',
          status: 'Completed',
        },
      ]
    : [
        {
          id: 'pay-p1',
          receiptNo: 'REC-2026-0409-A',
          paymentDate: '2026-09-01',
          amountPaid: 1200.0,
          paymentMethod: 'Bank Transfer',
          transactionRef: 'TXN-7782190-SCH',
          allocatedCategory: 'Primary Instruction Tuition',
          status: 'Completed',
        },
      ];

  const paymentHistory: PaymentRecord[] = [
    ...(localPaidOffset > 0
      ? [
          {
            id: 'pay-live-recent',
            receiptNo: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}-ONLINE`,
            paymentDate: new Date().toISOString().split('T')[0],
            amountPaid: localPaidOffset,
            paymentMethod: `${payMethod} · Instant Gateway`,
            transactionRef: `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`,
            allocatedCategory: 'Tuition & Campus Assessment Dues',
            status: 'Completed' as const,
          },
        ]
      : []),
    ...(ledger && ledger.transactions.length > 0
      ? ledger.transactions.map((tx) => ({
          id: tx.id,
          receiptNo: tx.receiptNo,
          paymentDate: tx.paymentDate,
          amountPaid: tx.amount,
          paymentMethod: tx.paymentMethod,
          transactionRef: tx.transactionRef,
          allocatedCategory:
            tx.allocatedBreakdown?.map((b) => b.feeName).join(', ') || 'School Fees',
          status: 'Completed' as const,
        }))
      : fallbackHistory),
  ];

  const handleExecutePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (outstandingBalance <= 0) return;

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const paidAmount = outstandingBalance;

      // If matched student exists in SchoolDataContext, trigger recordFeePayment
      if (matchedStudent && ledger && ledger.obligations.length > 0) {
        const unpaidObs = ledger.obligations.filter((o) => o.status !== 'Paid in Full').map((o) => o.id);
        recordFeePayment({
          studentId: matchedStudent.id,
          obligationIds: unpaidObs.length > 0 ? unpaidObs : [ledger.obligations[0].id],
          amountPaid: paidAmount,
          paymentMethod: payMethod === 'Bank Transfer' ? 'Bank Transfer' : payMethod === 'UPI' ? 'UPI' : 'Card',
          transactionRef: `TXN-IN-${Date.now().toString().slice(-6)}`,
          notes: `Paid online via ${payMethod} by guardian Mrs. Li Chen`,
          collectedByStaffId: 'staff-online-portal',
        });
      }

      setLocalPaidOffset((prev) => prev + paidAmount);
      setShowPayModal(false);
      setPaySuccessNotice(`Payment of ₹${paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} processed successfully via ${payMethod}! Official receipt voucher generated.`);
      setTimeout(() => setPaySuccessNotice(null), 4500);
    }, 1000);
  };

  const handleSimulateDownload = (receipt: PaymentRecord) => {
    setDownloadSuccessNotice(`Receipt ${receipt.receiptNo} saved as PDF.`);
    setTimeout(() => setDownloadSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* Toast Feedback */}
      {paySuccessNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{paySuccessNotice}</span>
        </div>
      )}

      {downloadSuccessNotice && (
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <Download className="w-4 h-4 text-blue-600 shrink-0" />
          <span>{downloadSuccessNotice}</span>
        </div>
      )}

      {/* Main Account Balance Card */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between text-[11px] mb-2 text-slate-500 font-medium">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
            <span>Greenfield International Bursar</span>
          </div>
          <span className="font-mono">{selectedChild.grade} ({selectedChild.section})</span>
        </div>

        <div className="mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Current Outstanding Dues
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span
              className={`text-2xl font-extrabold font-mono tracking-tight ${
                outstandingBalance === 0 ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              ₹{outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {outstandingBalance === 0 ? '· All fees cleared in full' : '· Due by Nov 01, 2026'}
            </span>
          </div>
        </div>

        {/* Primary Action Button */}
        {outstandingBalance > 0 ? (
          <button
            onClick={() => setShowPayModal(true)}
            className="w-full py-2.5 px-4 text-xs font-bold text-white rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all hover:opacity-95"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Pay Dues Now (₹{outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
          </button>
        ) : (
          <div className="w-full py-2 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero Outstanding Balance · Tuition Fully Settled</span>
          </div>
        )}

        {/* 3 Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Assessed</span>
            <span className="text-xs font-extrabold font-mono" style={{ color: 'var(--color-text)' }}>
              ₹{totalAssessed.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Concession</span>
            <span className="text-xs font-extrabold font-mono text-emerald-600">
              {totalConcessions > 0 ? `-₹${totalConcessions.toLocaleString('en-IN')}` : '₹0'}
            </span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Cleared</span>
            <span className="text-xs font-extrabold font-mono" style={{ color: 'var(--color-primary)' }}>
              ₹{totalPaid.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Tab Switcher */}
      <div
        className="grid grid-cols-2 p-1 rounded-xl border text-xs font-semibold text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setActiveSubTab('items')}
          className={`py-1.5 rounded-lg transition-all ${
            activeSubTab === 'items'
              ? 'bg-black/10 dark:bg-white/10 font-bold shadow-xs'
              : 'opacity-65 hover:opacity-100'
          }`}
          style={{ color: activeSubTab === 'items' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          Itemized Dues ({feeCategories.length})
        </button>

        <button
          onClick={() => setActiveSubTab('receipts')}
          className={`py-1.5 rounded-lg transition-all ${
            activeSubTab === 'receipts'
              ? 'bg-black/10 dark:bg-white/10 font-bold shadow-xs'
              : 'opacity-65 hover:opacity-100'
          }`}
          style={{ color: activeSubTab === 'receipts' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          Payment Receipts ({paymentHistory.length})
        </button>
      </div>

      {/* SUB-TAB 1: ITEMIZED FEE SCHEDULE */}
      {activeSubTab === 'items' && (
        <div className="space-y-2">
          {feeCategories.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl border text-xs space-y-1.5 shadow-xs"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
                    {item.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Category: {item.category}
                  </span>
                </div>

                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    item.status === 'Paid in Full' || outstandingBalance === 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {outstandingBalance === 0 ? 'Paid in Full' : item.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t text-slate-500" style={{ borderColor: 'var(--color-border)' }}>
                <span>
                  Assessed: <strong className="font-mono">₹{item.assessedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </span>
                {item.concessionAmount > 0 && (
                  <span className="text-emerald-600 font-semibold">
                    Discount: -₹{item.concessionAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                )}
                <span>
                  Net: <strong className="font-mono text-slate-800 dark:text-slate-100">₹{item.netObligation.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong>
                </span>
              </div>
            </div>
          ))}

          <div className="p-3 rounded-lg border text-[11px] text-slate-500 flex items-start gap-2 bg-black/[0.02] dark:bg-white/[0.02]" style={{ borderColor: 'var(--color-border)' }}>
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              All fee invoices are issued by Greenfield International School under School Management Committee approved fee schedules.
            </span>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PAYMENT RECEIPTS HISTORY */}
      {activeSubTab === 'receipts' && (
        <div className="space-y-2">
          {paymentHistory.map((rcp) => (
            <div
              key={rcp.id}
              onClick={() => setSelectedReceipt(rcp)}
              className="p-3 rounded-xl border text-xs cursor-pointer hover:shadow-xs transition-all space-y-1.5"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--color-primary)' }}>
                  <Receipt className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-mono">{rcp.receiptNo}</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-emerald-600">
                  +₹{rcp.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>{rcp.allocatedCategory}</span>
                <span className="font-mono text-[10px]">{rcp.paymentDate}</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <span>Method: {rcp.paymentMethod}</span>
                <span className="font-bold text-teal-600 flex items-center gap-0.5">
                  <span>View Voucher</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ONLINE PAYMENT DRAWER / MODAL */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border shadow-2xl p-4 sm:p-6 animate-in slide-in-from-bottom-5 duration-200 space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
                  Pay School Tuition Due
                </h3>
                <span className="text-[11px] text-slate-500">Greenfield International Bursar Gateway</span>
              </div>
              <button
                onClick={() => setShowPayModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total Due Banner */}
            <div
              className="p-3 rounded-xl border flex items-center justify-between text-xs"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-primary)',
              }}
            >
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Student</span>
                <span className="font-bold text-xs">{selectedChild.name} · {selectedChild.grade}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Amount Due</span>
                <span className="text-base font-extrabold font-mono" style={{ color: 'var(--color-primary)' }}>
                  ₹{outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Payment Method Switcher */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase text-slate-400 block">
                Select Indian Payment Channel
              </label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {([
                  { id: 'UPI', label: 'UPI / QR' },
                  { id: 'Card', label: 'RuPay / Card' },
                  { id: 'Bank Transfer', label: 'Net Banking' },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`py-2 px-1 rounded-lg border text-[11px] font-semibold text-center transition-all ${
                      payMethod === m.id
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/30 text-teal-800 dark:text-teal-200 font-bold shadow-xs'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      borderColor: payMethod === m.id ? 'var(--color-primary)' : 'var(--color-border)',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handleExecutePayment} className="space-y-3">
              {payMethod === 'UPI' && (
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Virtual Payment Address (UPI ID)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. mobile@upi or name@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-mono"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] border text-[10px] text-slate-500" style={{ borderColor: 'var(--color-border)' }}>
                    <span>Supported UPI Apps:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Google Pay · PhonePe · Paytm · BHIM</span>
                  </div>
                </div>
              )}

              {payMethod === 'Card' && (
                <>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-medium"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                      RuPay / Debit / Credit Card Number
                    </label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-mono"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-mono text-center"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                        CVV / Security Code
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border outline-none font-mono text-center"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text)',
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {payMethod === 'Bank Transfer' && (
                <div
                  className="p-3 rounded-lg border text-xs space-y-1.5"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                  }}
                >
                  <div className="flex items-center gap-1.5 font-bold" style={{ color: 'var(--color-primary)' }}>
                    <Building className="w-3.5 h-3.5" />
                    <span>NEFT / RTGS / IMPS School Bank Details</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
                    Beneficiary: <strong>Greenfield International School Trust</strong><br />
                    Bank: <strong>State Bank of India (SBI), Bengaluru Branch</strong><br />
                    Account No: <strong>40819283719</strong> · IFSC: <strong>SBIN0040182</strong>
                  </p>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 text-xs font-bold text-white rounded-lg shadow-sm flex items-center justify-center gap-2 hover:opacity-95 disabled:opacity-50"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  {isProcessing ? (
                    <span>Processing Payment via NPCI Gateway...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Confirm & Pay Dues (₹{outstandingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })})</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>256-bit Encrypted SSL Academic Clearance</span>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OFFICIAL RECEIPT DETAIL MODAL */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-sm rounded-2xl border shadow-2xl p-5 animate-in zoom-in-95 duration-150 space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                <span className="font-extrabold text-sm">Official Payment Receipt</span>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Voucher Body */}
            <div
              className="p-4 rounded-xl border space-y-3 text-xs"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-start justify-between border-b pb-2.5" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <SchlarLogo variant="compact" />
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Greenfield International School
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-xs block text-teal-600">
                    {selectedReceipt.receiptNo}
                  </span>
                  <span className="text-[10px] text-slate-400 block">{selectedReceipt.paymentDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Student</span>
                  <span className="font-semibold">{selectedChild.name}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Payee</span>
                  <span className="font-semibold">Mrs. Li Chen (Guardian)</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex justify-between">
                  <span className="text-slate-500">Allocation:</span>
                  <span className="font-semibold">{selectedReceipt.allocatedCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Channel:</span>
                  <span className="font-mono">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ref:</span>
                  <span className="font-mono text-[10px]">{selectedReceipt.transactionRef}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Bursar Validated</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-extrabold font-mono text-emerald-600 block">
                    ₹{selectedReceipt.amountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleSimulateDownload(selectedReceipt)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:bg-black/5"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save Voucher</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedReceipt(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
