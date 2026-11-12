import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { StudentFeeObligation, PaymentMethod, FeePaymentTransaction } from '../../types/finance';
import { SchlarLogo } from '../brand/SchlarLogo';
import {
  CreditCard,
  Search,
  CheckCircle2,
  AlertCircle,
  Receipt,
  Printer,
  Calendar,
  X,
  ArrowRight,
  ShieldCheck,
  Check,
} from 'lucide-react';

export const AccountantCollectFeesModule: React.FC = () => {
  const { students, studentFeeObligations, feeTransactions, recordFeePayment } = useSchoolData();

  // Search student
  const [studentSearch, setStudentSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Selected obligations for payment
  const [selectedObligationIds, setSelectedObligationIds] = useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Bank Transfer');
  const [paymentDate, setPaymentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [transactionRef, setTransactionRef] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);

  // Receipt modal state after successful collection
  const [generatedReceipt, setGeneratedReceipt] = useState<FeePaymentTransaction | null>(null);

  // Filter students
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.admissionNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Obligations for this student from live context
  const studentObligations = selectedStudentId
    ? studentFeeObligations.filter((o) => o.studentId === selectedStudentId && o.balance > 0)
    : [];

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setSelectedObligationIds([]);
    setPaymentAmount(0);
    setFormError(null);
    setTransactionRef(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  const handleToggleObligation = (id: string) => {
    let nextIds = [...selectedObligationIds];
    if (nextIds.includes(id)) {
      nextIds = nextIds.filter((x) => x !== id);
    } else {
      nextIds.push(id);
    }
    setSelectedObligationIds(nextIds);

    // Auto-calculate total sum
    const sum = studentObligations
      .filter((o) => nextIds.includes(o.id))
      .reduce((acc, curr) => acc + curr.balance, 0);
    setPaymentAmount(sum);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) {
      setFormError('Please select a student.');
      return;
    }
    if (selectedObligationIds.length === 0) {
      setFormError('Please select at least one fee obligation to allocate payment against.');
      return;
    }
    if (paymentAmount <= 0) {
      setFormError('Payment amount must be greater than ₹0.');
      return;
    }

    const maxEligible = studentObligations
      .filter((o) => selectedObligationIds.includes(o.id))
      .reduce((acc, curr) => acc + curr.balance, 0);

    if (paymentAmount > maxEligible) {
      setFormError(
        `Payment amount of ₹${paymentAmount.toLocaleString('en-IN')} exceeds eligible outstanding balance of ₹${maxEligible.toLocaleString('en-IN')}. Advance payments must be allocated to distinct deposits.`
      );
      return;
    }

    // Call unified context method
    const result = recordFeePayment({
      studentId: selectedStudent.id,
      obligationIds: selectedObligationIds,
      amountPaid: paymentAmount,
      paymentMethod,
      transactionRef: transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      notes,
    });

    if (result.success && result.receipt) {
      setGeneratedReceipt(result.receipt);
      setFormError(null);
    } else {
      setFormError(result.message || 'Failed to record fee payment.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2 py-0.5 rounded tracking-wide uppercase border text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30"
              style={{ borderColor: 'var(--color-border)' }}
            >
              Teller & Cashier Workflow
            </span>
            <span className="text-xs text-slate-400">Fee Collection Terminal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Collect & Record Fees
          </h1>
          <p className="text-sm mt-1 max-w-2xl text-slate-500">
            Process payments against outstanding student fee obligations, apply allocation breakdowns, and generate official stamped receipts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Student Selector */}
        <div
          className="p-5 rounded-xl border shadow-xs space-y-4"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)' }}>
            <Search className="w-4 h-4 text-slate-400" />
            <span>1. Select Student</span>
          </h3>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or admission no..."
              value={studentSearch}
              onChange={(e) => setStudentSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border text-xs outline-hidden"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
            {filteredStudents.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectStudent(s.id)}
                className={`w-full p-2.5 rounded-lg border text-left transition-all ${
                  selectedStudentId === s.id ? 'border-2 shadow-xs' : 'hover:bg-black/5 dark:hover:bg-white/5 opacity-80'
                }`}
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: selectedStudentId === s.id ? 'var(--color-primary)' : 'var(--color-border)',
                }}
              >
                <div className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                  {s.name}
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-0.5">
                  <span>{s.admissionNo}</span>
                  <span>{s.className}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Payment Recording Form */}
        <div
          className="lg:col-span-2 p-6 rounded-xl border shadow-xs space-y-5"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          {!selectedStudent ? (
            <div className="py-16 text-center text-slate-400">
              <CreditCard className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">Please select a student from the left panel to begin fee collection.</p>
            </div>
          ) : (
            <form onSubmit={handleProcessPayment} className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                    Payment Terminal for {selectedStudent.name}
                  </h3>
                  <p className="text-slate-400 text-[11px]">
                    {selectedStudent.admissionNo} · {selectedStudent.className} · {selectedStudent.sectionName}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold">
                  Active Enrollment
                </span>
              </div>

              {formError && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 2. Outstanding Obligations Selection */}
              <div>
                <label className="font-bold text-xs block mb-2" style={{ color: 'var(--color-text)' }}>
                  2. Select Outstanding Fee Obligations to Pay
                </label>

                {studentObligations.length === 0 ? (
                  <div className="p-4 rounded-lg border bg-black/[0.02] dark:bg-white/[0.02] text-center text-slate-400">
                    No open outstanding fee obligations found for this student. All assessed charges are satisfied.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {studentObligations.map((ob) => {
                      const isChecked = selectedObligationIds.includes(ob.id);
                      return (
                        <div
                          key={ob.id}
                          onClick={() => handleToggleObligation(ob.id)}
                          className={`p-3 rounded-lg border flex items-center justify-between cursor-pointer transition-all ${
                            isChecked ? 'border-2 shadow-xs' : 'opacity-80'
                          }`}
                          style={{
                            backgroundColor: 'var(--color-background)',
                            borderColor: isChecked ? 'var(--color-primary)' : 'var(--color-border)',
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded border flex items-center justify-center ${
                                isChecked ? 'text-white' : ''
                              }`}
                              style={{
                                backgroundColor: isChecked ? 'var(--color-primary)' : 'transparent',
                                borderColor: isChecked ? 'var(--color-primary)' : 'var(--color-border)',
                              }}
                            >
                              {isChecked && <Check className="w-3 h-3" />}
                            </div>
                            <div>
                              <div className="font-bold" style={{ color: 'var(--color-text)' }}>
                                {ob.feeStructureName}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Due: {ob.dueDate} · Category: {ob.category}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-rose-600 block">
                              Balance: ₹{ob.balance.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Assessed: ₹{ob.assessedAmount.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* 3. Payment Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold block mb-1">Amount Received (₹ INR)</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border text-sm font-bold font-mono outline-hidden"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden font-medium"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                  >
                    <option value="UPI">UPI (Google Pay / PhonePe / Paytm / QR)</option>
                    <option value="Bank Transfer">Net Banking / NEFT / RTGS / IMPS</option>
                    <option value="Card">Debit / Credit / RuPay Card</option>
                    <option value="Cheque">Banker Cheque / Demand Draft</option>
                    <option value="Cash">Cash at School Counter</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Transaction Reference / UTR / Cheque No</label>
                  <input
                    type="text"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. UPI-98450123 or UTR-881290 or CHQ-4491"
                    className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden font-mono"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Payment Receipt Date</label>
                  <input
                    type="date"
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Transaction Notes / Allocation Remarks</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional memo: Parent contact details, payment counter batch number..."
                  className="w-full px-3 py-2 rounded-lg border text-xs outline-hidden resize-none"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                />
              </div>

              <div className="flex justify-end pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-lg text-xs font-bold text-white shadow-xs hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)' }}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm Payment & Generate Receipt</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Generated Receipt Printable Modal */}
      {generatedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full max-w-lg rounded-2xl border shadow-2xl p-6 animate-in zoom-in-95 duration-150"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                <h3 className="text-base font-bold">Official Fee Receipt</h3>
              </div>
              <button onClick={() => setGeneratedReceipt(null)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Receipt Printable Card */}
            <div className="p-5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 space-y-4 text-xs font-sans">
              <div className="flex items-start justify-between border-b pb-3 border-slate-200 dark:border-slate-800">
                <div>
                  <SchlarLogo />
                  <div className="text-[10px] text-slate-400 mt-1">SCHLAR School Management · Bursar Office</div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-slate-100">
                    {generatedReceipt.receiptNo}
                  </div>
                  <div className="text-[10px] text-slate-400">{generatedReceipt.paymentDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Student</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{generatedReceipt.studentName}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Class & Section</span>
                  <div className="font-bold text-slate-900 dark:text-slate-100">{generatedReceipt.className}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Method</span>
                  <div>{generatedReceipt.paymentMethod}</div>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-400">Transaction Ref</span>
                  <div className="font-mono">{generatedReceipt.transactionRef}</div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                  Allocation Breakdown
                </span>
                <div className="space-y-1">
                  {generatedReceipt.allocatedBreakdown.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span>{item.feeName}</span>
                      <span className="font-mono font-semibold">₹{item.amount.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 mt-2 font-bold text-slate-900 dark:text-slate-100 text-sm">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-emerald-600">₹{generatedReceipt.amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 flex items-center justify-between">
                <span>Issued by: {generatedReceipt.recordedBy}</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Status: Cleared
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold hover:opacity-85"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={() => setGeneratedReceipt(null)}
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
