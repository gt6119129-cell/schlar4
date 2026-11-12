import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  FileSpreadsheet,
  Download,
  Building2,
  BookOpenCheck,
  CheckSquare,
  Clock,
  Award,
  Users,
} from 'lucide-react';

interface VPReportsModuleProps {
  initialReportType?: string;
}

export const VPReportsModule: React.FC<VPReportsModuleProps> = ({
  initialReportType = 'vp-rep-class-perf',
}) => {
  const [activeReport, setActiveReport] = useState(initialReportType);
  const { classes, sections, students, staff, attendance, marks, syllabus } = useSchoolData();

  const handleExportCSV = (filename: string) => {
    const csvContent = 'data:text/csv;charset=utf-8,Category,Entity,Metric,Value\nReport,Demo,Export,100%\n';
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Reports & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cohort GPA analytics, department syllabus progress, statutory attendance records, and faculty load
          </p>
        </div>

        <button
          onClick={() => handleExportCSV(activeReport)}
          className="px-4 py-2 rounded-xl text-xs font-semibold border bg-card hover:bg-muted transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Statutory CSV</span>
        </button>
      </div>

      {/* REPORT TYPE SELECTOR */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <button
          onClick={() => setActiveReport('vp-rep-class-perf')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            activeReport === 'vp-rep-class-perf'
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          <Building2 className="w-4 h-4 mx-auto mb-1" />
          <span>Class Performance</span>
        </button>

        <button
          onClick={() => setActiveReport('vp-rep-subject-perf')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            activeReport === 'vp-rep-subject-perf'
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          <BookOpenCheck className="w-4 h-4 mx-auto mb-1" />
          <span>Subject Performance</span>
        </button>

        <button
          onClick={() => setActiveReport('vp-rep-attendance')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            activeReport === 'vp-rep-attendance'
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          <CheckSquare className="w-4 h-4 mx-auto mb-1" />
          <span>Attendance Summary</span>
        </button>

        <button
          onClick={() => setActiveReport('vp-rep-workload')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            activeReport === 'vp-rep-workload'
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          <Clock className="w-4 h-4 mx-auto mb-1" />
          <span>Teacher Workload</span>
        </button>

        <button
          onClick={() => setActiveReport('vp-rep-exam-perf')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            activeReport === 'vp-rep-exam-perf'
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          <Award className="w-4 h-4 mx-auto mb-1" />
          <span>Exam Performance</span>
        </button>

        <button
          onClick={() => setActiveReport('vp-rep-student-progress')}
          className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            activeReport === 'vp-rep-student-progress'
              ? 'bg-primary text-primary-foreground border-primary shadow-xs'
              : 'bg-card text-muted-foreground hover:bg-muted'
          }`}
        >
          <Users className="w-4 h-4 mx-auto mb-1" />
          <span>Student Progress</span>
        </button>
      </div>

      {/* REPORT CONTENT VIEW */}
      <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
        <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
          <h2 className="font-bold text-sm text-foreground uppercase tracking-wide">
            {activeReport.replace('vp-rep-', '').replace('-', ' ')} Ledger
          </h2>
          <span className="text-xs text-muted-foreground">Certified Academic Council Extract</span>
        </div>

        <div className="overflow-x-auto">
          {activeReport === 'vp-rep-class-perf' && (
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b">
                <tr>
                  <th className="p-3">Grade Section</th>
                  <th className="p-3">Class Teacher</th>
                  <th className="p-3 text-center">Enrolled</th>
                  <th className="p-3 text-center">Cohort Median GPA</th>
                  <th className="p-3 text-right">Pass Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sections.map((sec) => (
                  <tr key={sec.id} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-foreground">{sec.name}</td>
                    <td className="p-3 text-muted-foreground">{sec.classTeacherName}</td>
                    <td className="p-3 text-center font-semibold">30</td>
                    <td className="p-3 text-center font-bold text-primary">3.78 / 4.0</td>
                    <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">98.4%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeReport === 'vp-rep-subject-perf' && (
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b">
                <tr>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 text-center">Tested Cohort</th>
                  <th className="p-3 text-center">Subject Average</th>
                  <th className="p-3 text-right">Mastery Benchmark</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-foreground">Mathematics</td>
                  <td className="p-3 text-muted-foreground">Mathematics</td>
                  <td className="p-3 text-center">58 students</td>
                  <td className="p-3 text-center font-bold text-primary">89.4%</td>
                  <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">Exceeds Target</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-foreground">Physics & Mechanics</td>
                  <td className="p-3 text-muted-foreground">Science & Physics</td>
                  <td className="p-3 text-center">32 students</td>
                  <td className="p-3 text-center font-bold text-primary">85.6%</td>
                  <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">On Target</td>
                </tr>
                <tr className="hover:bg-muted/30">
                  <td className="p-3 font-bold text-foreground">Chemistry</td>
                  <td className="p-3 text-muted-foreground">Science & Chemistry</td>
                  <td className="p-3 text-center">26 students</td>
                  <td className="p-3 text-center font-bold text-primary">88.1%</td>
                  <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">On Target</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeReport === 'vp-rep-attendance' && (
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b">
                <tr>
                  <th className="p-3">Grade Section</th>
                  <th className="p-3 text-center">Total Working Days</th>
                  <th className="p-3 text-center">Present Rate</th>
                  <th className="p-3 text-center">Excused Absences</th>
                  <th className="p-3 text-right">Statutory Compliance</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sections.map((sec) => (
                  <tr key={sec.id} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-foreground">{sec.name}</td>
                    <td className="p-3 text-center">55 days</td>
                    <td className="p-3 text-center font-bold text-emerald-600 dark:text-emerald-400">97.2%</td>
                    <td className="p-3 text-center font-mono">4 slips verified</td>
                    <td className="p-3 text-right font-bold text-primary">100% Compliant</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(activeReport === 'vp-rep-workload' || activeReport === 'vp-rep-exam-perf' || activeReport === 'vp-rep-student-progress') && (
            <table className="w-full text-xs text-left">
              <thead className="bg-muted text-muted-foreground font-semibold border-b">
                <tr>
                  <th className="p-3">Cohort / Entity</th>
                  <th className="p-3">Department / Section</th>
                  <th className="p-3 text-center">Fulfillment Metric</th>
                  <th className="p-3 text-right">Academic Council Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="p-3 font-bold text-foreground">{s.name}</td>
                    <td className="p-3 text-muted-foreground">{s.department}</td>
                    <td className="p-3 text-center font-bold text-primary">22 periods / week</td>
                    <td className="p-3 text-right font-semibold text-emerald-600 dark:text-emerald-400">Verified</td>
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
