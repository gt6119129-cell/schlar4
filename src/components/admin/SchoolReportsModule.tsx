import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Users,
  Building2,
  CalendarCheck2,
  Inbox,
  Receipt,
  CheckCircle2,
  AlertTriangle,
  Lock,
} from 'lucide-react';

export const SchoolReportsModule: React.FC = () => {
  const {
    students,
    classes,
    sections,
    staff,
    attendance,
    admissions,
    feesSummary,
    schoolProfile,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  const canExport = hasPermission('reports.export');
  const canViewFees = hasPermission('fees.view');

  // Selected report category
  const [reportType, setReportType] = useState<
    'enrollment' | 'attendance' | 'staff' | 'admissions' | 'fees'
  >('enrollment');

  // Filter state
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // Feedback toast
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  // Formula injection sanitizer (protects spreadsheet apps against formula injection)
  const sanitizeCsvValue = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    let str = String(val).replace(/"/g, '""');
    // If string starts with =, +, -, @, prepend with single quote
    if (/^[=+\-@]/.test(str)) {
      str = `'${str}`;
    }
    return `"${str}"`;
  };

  // Trigger CSV Download
  const handleExportCsv = () => {
    if (!canExport) {
      setExportFeedback('Export Permission Denied: Your administrative profile lacks reports.export privileges.');
      setTimeout(() => setExportFeedback(null), 4000);
      return;
    }

    let csvContent = '';
    let fileName = '';
    const dateStamp = new Date().toISOString().split('T')[0];

    if (reportType === 'enrollment') {
      fileName = `SCHLAR_Enrollment_Report_${dateStamp}.csv`;
      const headers = ['Admission No', 'Student Name', 'Class', 'Section', 'Gender', 'Guardian Name', 'Guardian Phone', 'Status', 'Admission Date'];
      const rows = students
        .filter((s) => selectedClassId === 'all' || s.classId === selectedClassId)
        .map((s) => [
          s.admissionNo,
          s.name,
          s.className,
          s.sectionName,
          s.gender,
          s.guardianName,
          s.guardianPhone,
          s.enrollmentStatus,
          s.admissionDate,
        ]);
      csvContent = [headers.map(sanitizeCsvValue).join(','), ...rows.map((r) => r.map(sanitizeCsvValue).join(','))].join('\r\n');
    } else if (reportType === 'attendance') {
      fileName = `SCHLAR_Attendance_Register_${dateStamp}.csv`;
      const headers = ['Date', 'Student Name', 'Class ID', 'Section ID', 'Status', 'Recorded By', 'Notes'];
      const rows = attendance.map((a) => [
        a.date,
        a.studentName,
        a.classId,
        a.sectionId,
        a.status,
        a.recordedBy,
        a.notes || '',
      ]);
      csvContent = [headers.map(sanitizeCsvValue).join(','), ...rows.map((r) => r.map(sanitizeCsvValue).join(','))].join('\r\n');
    } else if (reportType === 'staff') {
      fileName = `SCHLAR_Staff_Roster_${dateStamp}.csv`;
      const headers = ['Staff ID', 'Name', 'Designation', 'Department', 'Email', 'Phone', 'Status', 'Join Date'];
      const rows = staff.map((st) => [
        st.staffId,
        st.name,
        st.designation,
        st.department,
        st.email,
        st.phone,
        st.status,
        st.joinDate,
      ]);
      csvContent = [headers.map(sanitizeCsvValue).join(','), ...rows.map((r) => r.map(sanitizeCsvValue).join(','))].join('\r\n');
    } else if (reportType === 'admissions') {
      fileName = `SCHLAR_Admissions_Pipeline_${dateStamp}.csv`;
      const headers = ['Enquiry No', 'Applicant Name', 'Intended Grade', 'Guardian Name', 'Phone', 'Email', 'Source', 'Status', 'Date'];
      const rows = admissions.map((ad) => [
        ad.enquiryNo,
        ad.applicantName,
        ad.intendedClassName,
        ad.guardianName,
        ad.guardianPhone,
        ad.guardianEmail,
        ad.source,
        ad.status,
        ad.enquiryDate,
      ]);
      csvContent = [headers.map(sanitizeCsvValue).join(','), ...rows.map((r) => r.map(sanitizeCsvValue).join(','))].join('\r\n');
    } else if (reportType === 'fees') {
      if (!canViewFees) return;
      fileName = `SCHLAR_Fee_Transactions_${dateStamp}.csv`;
      const headers = ['Receipt No', 'Student Name', 'Cohort', 'Amount', 'Date', 'Payment Method', 'Status'];
      const rows = feesSummary.recentTransactions.map((tx) => [
        tx.invoiceNumber,
        tx.studentName,
        tx.gradeSection,
        tx.amount,
        tx.date,
        tx.paymentMethod,
        tx.status,
      ]);
      csvContent = [headers.map(sanitizeCsvValue).join(','), ...rows.map((r) => r.map(sanitizeCsvValue).join(','))].join('\r\n');
    }

    // Trigger standard browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportFeedback(`Successfully generated and downloaded "${fileName}".`);
    setTimeout(() => setExportFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Feedback */}
      {exportFeedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
            exportFeedback.includes('Denied')
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {exportFeedback.includes('Denied') ? (
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            )}
            <span className="font-semibold">{exportFeedback}</span>
          </div>
          <button onClick={() => setExportFeedback(null)} className="p-1">
            ✕
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--color-text)' }}>
            Institutional Reporting & Audits
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Query school datasets, verify cohort distributions, and download RFC-4180 compliant CSV ledgers.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={!canExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white rounded-lg shadow-xs hover:opacity-95 disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Dataset to CSV</span>
        </button>
      </div>

      {/* Report Categories Tabs */}
      <div
        className="p-1.5 rounded-xl border flex flex-wrap items-center gap-1 text-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {[
          { id: 'enrollment', label: 'Student Enrollment Breakdown', icon: Users },
          { id: 'attendance', label: 'Attendance Audit Register', icon: CalendarCheck2 },
          { id: 'staff', label: 'Staff & Faculty Roster', icon: Building2 },
          { id: 'admissions', label: 'Admissions Pipeline Audit', icon: Inbox },
          ...(canViewFees ? [{ id: 'fees', label: 'Fee Transactions Ledger', icon: Receipt }] : []),
        ].map((rep) => {
          const Icon = rep.icon;
          const isActive = reportType === rep.id;

          return (
            <button
              key={rep.id}
              onClick={() => setReportType(rep.id as any)}
              className={`px-3 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                isActive ? 'shadow-xs' : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: isActive ? 'var(--color-background)' : 'transparent',
                color: 'var(--color-text)',
              }}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{rep.label}</span>
            </button>
          );
        })}
      </div>

      {/* Report Preview Table */}
      <div
        className="rounded-xl border shadow-xs overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
              Report Preview & Data Grid
            </h3>
            <p className="text-xs text-slate-500">Live school database records ready for export</p>
          </div>

          {reportType === 'enrollment' && (
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-2.5 py-1 text-xs rounded border outline-none font-medium"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <option value="all">All Grades</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="overflow-x-auto max-h-[500px]">
          {reportType === 'enrollment' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Adm No</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Name</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Class & Section</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Gender</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Guardian Contact</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Enrollment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {students
                  .filter((s) => selectedClassId === 'all' || s.classId === selectedClassId)
                  .map((st) => (
                    <tr key={st.id} className="hover:bg-black/[0.015]">
                      <td className="py-2.5 px-4 font-mono font-medium text-slate-500">{st.admissionNo}</td>
                      <td className="py-2.5 px-4 font-bold" style={{ color: 'var(--color-text)' }}>{st.name}</td>
                      <td className="py-2.5 px-4">{st.className} · {st.sectionName}</td>
                      <td className="py-2.5 px-4 text-slate-500">{st.gender}</td>
                      <td className="py-2.5 px-4 text-slate-500">{st.guardianName} ({st.guardianPhone})</td>
                      <td className="py-2.5 px-4 text-slate-500 font-mono text-right">{st.admissionDate}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}

          {reportType === 'attendance' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Date</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Name</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Recorded Status</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Recorded By</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {attendance.map((att) => (
                  <tr key={att.id} className="hover:bg-black/[0.015]">
                    <td className="py-2.5 px-4 font-mono text-slate-500">{att.date}</td>
                    <td className="py-2.5 px-4 font-bold" style={{ color: 'var(--color-text)' }}>{att.studentName}</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-black/5 dark:bg-white/10">
                        {att.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{att.recordedBy}</td>
                    <td className="py-2.5 px-4 text-slate-500 italic text-right">{att.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'staff' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Staff ID</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Name</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Designation</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Department</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Email</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {staff.map((st) => (
                  <tr key={st.id} className="hover:bg-black/[0.015]">
                    <td className="py-2.5 px-4 font-mono text-slate-500">{st.staffId}</td>
                    <td className="py-2.5 px-4 font-bold" style={{ color: 'var(--color-text)' }}>{st.name}</td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300">{st.designation}</td>
                    <td className="py-2.5 px-4 font-medium">{st.department}</td>
                    <td className="py-2.5 px-4 text-slate-500">{st.email}</td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-right">{st.joinDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'admissions' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Enquiry ID</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Applicant</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Target Grade</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Guardian</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Status</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {admissions.map((ad) => (
                  <tr key={ad.id} className="hover:bg-black/[0.015]">
                    <td className="py-2.5 px-4 font-mono text-slate-500">{ad.enquiryNo}</td>
                    <td className="py-2.5 px-4 font-bold" style={{ color: 'var(--color-text)' }}>{ad.applicantName}</td>
                    <td className="py-2.5 px-4 font-medium">{ad.intendedClassName}</td>
                    <td className="py-2.5 px-4 text-slate-500">{ad.guardianName} ({ad.guardianPhone})</td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-black/5 dark:bg-white/10">
                        {ad.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500 font-mono text-right">{ad.enquiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'fees' && canViewFees && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr
                  className="border-b"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Receipt No</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Student Name</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Cohort</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Payment Method</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Amount</th>
                  <th className="py-2.5 px-4 font-semibold text-[10px] uppercase text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {feesSummary.recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-black/[0.015]">
                    <td className="py-2.5 px-4 font-mono text-slate-500">{tx.invoiceNumber}</td>
                    <td className="py-2.5 px-4 font-bold" style={{ color: 'var(--color-text)' }}>{tx.studentName}</td>
                    <td className="py-2.5 px-4 text-slate-500">{tx.gradeSection}</td>
                    <td className="py-2.5 px-4">{tx.paymentMethod}</td>
                    <td className="py-2.5 px-4 font-mono font-bold">₹{tx.amount.toLocaleString('en-IN')}</td>
                    <td className="py-2.5 px-4 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold capitalize bg-emerald-100 text-emerald-800">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
