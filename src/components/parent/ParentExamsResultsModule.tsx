import React, { useState } from 'react';
import { LinkedChild } from '../../data/mockData';
import {
  Award,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  BookOpen,
} from 'lucide-react';

interface ParentExamsResultsModuleProps {
  selectedChild: LinkedChild;
}

interface ExamScheduleItem {
  id: string;
  title: string;
  type: string;
  subject: string;
  date: string;
  startTime: string;
  duration: string;
  room: string;
  seatNo: string;
  hallTicketStatus: 'Verified' | 'Pending Verification';
}

interface PublishedResultItem {
  id: string;
  subject: string;
  examName: string;
  term: string;
  marksObtained: number;
  maxMarks: number;
  percentage: number;
  grade: string;
  status: 'Published' | 'Under Moderation';
  teacherRemarks: string;
}

export const ParentExamsResultsModule: React.FC<ParentExamsResultsModuleProps> = ({
  selectedChild,
}) => {
  const [subTab, setSubTab] = useState<'results' | 'upcoming'>('results');
  const [selectedTerm, setSelectedTerm] = useState<'Mid-Term 1' | 'Term 1'>('Mid-Term 1');

  // Upcoming Examination Timetable
  const upcomingExams: ExamScheduleItem[] = [
    {
      id: 'sch-ex-1',
      title: 'Term 1 Kinematics & Applied Energy Final',
      type: 'Formal Written Examination',
      subject: 'Science (Physics)',
      date: 'Nov 14, 2026',
      startTime: '09:00 AM',
      duration: '90 Mins',
      room: 'Exam Hall 3',
      seatNo: `Desk #${selectedChild.rollNumber}`,
      hallTicketStatus: 'Verified',
    },
    {
      id: 'sch-ex-2',
      title: 'Polynomials & Linear Coordinate Geometry Test',
      type: 'Summative Assessment',
      subject: 'Core Mathematics',
      date: 'Oct 28, 2026',
      startTime: '10:30 AM',
      duration: '60 Mins',
      room: 'Room 204',
      seatNo: `Desk #${selectedChild.rollNumber}`,
      hallTicketStatus: 'Verified',
    },
    {
      id: 'sch-ex-3',
      title: 'World Civilizations & Trade Map Practical',
      type: 'Summative Assessment',
      subject: 'World History',
      date: 'Nov 02, 2026',
      startTime: '01:00 PM',
      duration: '45 Mins',
      room: 'Room 206',
      seatNo: `Desk #${selectedChild.rollNumber}`,
      hallTicketStatus: 'Verified',
    },
  ];

  // Published Results (Only official, approved results visible to parents)
  const publishedResults: PublishedResultItem[] = [
    {
      id: 'res-1',
      subject: 'Mathematics',
      examName: 'Mid-Term 1 Summative Assessment',
      term: 'Mid-Term 1',
      marksObtained: 94,
      maxMarks: 100,
      percentage: 94.0,
      grade: 'A',
      status: 'Published',
      teacherRemarks: 'Excellent analytical understanding of algebraic systems. Clean problem-solving methodology.',
    },
    {
      id: 'res-2',
      subject: 'Physics & STEM Sciences',
      examName: 'Mid-Term 1 Summative Assessment',
      term: 'Mid-Term 1',
      marksObtained: 91,
      maxMarks: 100,
      percentage: 91.0,
      grade: 'A',
      status: 'Published',
      teacherRemarks: 'Strong grasp of vector mechanics and laboratory empirical measurements.',
    },
    {
      id: 'res-3',
      subject: 'English Literature',
      examName: 'Mid-Term 1 Summative Assessment',
      term: 'Mid-Term 1',
      marksObtained: 88,
      maxMarks: 100,
      percentage: 88.0,
      grade: 'B+',
      status: 'Published',
      teacherRemarks: 'Expressive thesis writing and critical textual interpretation.',
    },
    {
      id: 'res-4',
      subject: 'World History',
      examName: 'Mid-Term 1 Summative Assessment',
      term: 'Mid-Term 1',
      marksObtained: 92,
      maxMarks: 100,
      percentage: 92.0,
      grade: 'A',
      status: 'Published',
      teacherRemarks: 'Comprehensive mastery of Eurasian trade route cultural impacts.',
    },
    {
      id: 'res-5',
      subject: 'Computer Science',
      examName: 'Mid-Term 1 Summative Assessment',
      term: 'Mid-Term 1',
      marksObtained: 96,
      maxMarks: 100,
      percentage: 96.0,
      grade: 'A+',
      status: 'Published',
      teacherRemarks: 'Outstanding algorithm design and algorithmic efficiency analysis.',
    },
  ];

  const totalMarksObtained = publishedResults.reduce((acc, r) => acc + r.marksObtained, 0);
  const totalMaxMarks = publishedResults.reduce((acc, r) => acc + r.maxMarks, 0);
  const aggregatePercentage = totalMaxMarks > 0 ? ((totalMarksObtained / totalMaxMarks) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* Term Performance Header Card */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Official Term Gradebook
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold font-mono" style={{ color: 'var(--color-primary)' }}>
                {aggregatePercentage}%
              </span>
              <span className="text-xs font-semibold text-emerald-600">
                Grade A Distinction · GPA {selectedChild.gpa}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Published</span>
          </div>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t text-center text-xs" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Points</span>
            <span className="text-xs font-extrabold font-mono">{totalMarksObtained} / {totalMaxMarks}</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Top Mark</span>
            <span className="text-xs font-extrabold font-mono text-emerald-600">96% (CS)</span>
          </div>
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block">Class Rank</span>
            <span className="text-xs font-extrabold font-mono text-teal-600">Top 5%</span>
          </div>
        </div>
      </div>

      {/* Segmented Sub-tab Switcher */}
      <div
        className="grid grid-cols-2 p-1 rounded-xl border text-xs font-semibold text-center"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <button
          onClick={() => setSubTab('results')}
          className={`py-1.5 rounded-lg transition-all ${
            subTab === 'results'
              ? 'bg-black/10 dark:bg-white/10 font-bold shadow-xs'
              : 'opacity-65 hover:opacity-100'
          }`}
          style={{ color: subTab === 'results' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          Report Cards ({publishedResults.length})
        </button>

        <button
          onClick={() => setSubTab('upcoming')}
          className={`py-1.5 rounded-lg transition-all ${
            subTab === 'upcoming'
              ? 'bg-black/10 dark:bg-white/10 font-bold shadow-xs'
              : 'opacity-65 hover:opacity-100'
          }`}
          style={{ color: subTab === 'upcoming' ? 'var(--color-primary)' : 'var(--color-text)' }}
        >
          Exam Schedule ({upcomingExams.length})
        </button>
      </div>

      {/* SUB-TAB 1: PUBLISHED REPORT CARDS */}
      {subTab === 'results' && (
        <div className="space-y-2.5">
          {publishedResults.map((res) => (
            <div
              key={res.id}
              className="p-3.5 rounded-xl border text-xs space-y-2 shadow-xs"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-sm block" style={{ color: 'var(--color-text)' }}>
                    {res.subject}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {res.examName} · {res.term}
                  </span>
                </div>

                <div className="text-right">
                  <span
                    className={`text-xs font-mono font-extrabold px-2 py-0.5 rounded-md ${
                      res.grade.startsWith('A')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                    }`}
                  >
                    Grade {res.grade}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                    {res.marksObtained} / {res.maxMarks} ({res.percentage}%)
                  </span>
                </div>
              </div>

              {/* Score Progress Bar */}
              <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${res.percentage}%`,
                    backgroundColor: res.percentage >= 90 ? 'var(--color-primary)' : '#0284c7',
                  }}
                />
              </div>

              {/* Teacher Remarks Box */}
              <p
                className="p-2 rounded-lg border text-[11px] leading-relaxed text-slate-600 dark:text-slate-300 italic"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              >
                &ldquo;{res.teacherRemarks}&rdquo;
              </p>
            </div>
          ))}
        </div>
      )}

      {/* SUB-TAB 2: UPCOMING EXAM SCHEDULE */}
      {subTab === 'upcoming' && (
        <div className="space-y-2">
          {upcomingExams.map((ex) => (
            <div
              key={ex.id}
              className="p-3.5 rounded-xl border text-xs space-y-2 shadow-xs"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-xs block" style={{ color: 'var(--color-text)' }}>
                    {ex.subject}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {ex.title}
                  </span>
                </div>

                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
                  {ex.hallTicketStatus}
                </span>
              </div>

              <div
                className="grid grid-cols-2 gap-2 p-2 rounded-lg border text-[11px]"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Date & Time</span>
                  <span className="font-semibold">{ex.date} · {ex.startTime}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-medium">Hall & Seat</span>
                  <span className="font-semibold">{ex.room} ({ex.seatNo})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
