import React, { useState } from 'react';
import { LinkedChild } from '../../data/mockData';
import {
  FileCheck,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  X,
  Award,
  BookOpen,
  ChevronRight,
  Info,
} from 'lucide-react';

interface ParentAssignmentsModuleProps {
  selectedChild: LinkedChild;
}

interface DetailedHomework {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  assignedDate: string;
  dueDate: string;
  status: 'pending' | 'due_soon' | 'submitted' | 'graded';
  description: string;
  maxMarks: number;
  obtainedMarks?: number;
  grade?: string;
  teacherFeedback?: string;
  submittedAt?: string;
}

export const ParentAssignmentsModule: React.FC<ParentAssignmentsModuleProps> = ({
  selectedChild,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'due_soon' | 'submitted' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeHomework, setActiveHomework] = useState<DetailedHomework | null>(null);

  // Homework list adapted to the active child
  const childHomeworkList: DetailedHomework[] = selectedChild.grade.includes('8')
    ? [
        {
          id: 'hw-full-1',
          title: 'Quadratic Equations & Roots Exercise 4.2',
          subject: 'Mathematics',
          teacher: 'Ms. Sarah Henderson',
          assignedDate: 'Oct 16, 2026',
          dueDate: 'Tomorrow, Oct 24, 08:30 AM',
          status: 'due_soon',
          description:
            'Complete problems 1 through 15 on page 142 of the textbook. Show all step-by-step factorization working and quadratic formula derivations.',
          maxMarks: 50,
        },
        {
          id: 'hw-full-2',
          title: 'Lab Reflection: Simple Harmonic Pendulum Motion',
          subject: 'Physics',
          teacher: 'Dr. Marcus Vance',
          assignedDate: 'Oct 15, 2026',
          dueDate: 'Oct 26, 2026, 04:00 PM',
          status: 'pending',
          description:
            'Submit a 2-page laboratory reflection report documenting empirical period vs length relationships observed in Thursday laboratory session.',
          maxMarks: 40,
        },
        {
          id: 'hw-full-3',
          title: 'To Kill a Mockingbird: Atticus Finch Moral Courage Essay',
          subject: 'English Literature',
          teacher: 'Mr. David Miller',
          assignedDate: 'Oct 08, 2026',
          dueDate: 'Oct 18, 2026',
          status: 'graded',
          description:
            '800-word analytical essay discussing the literary themes of moral integrity in chapters 9–11.',
          maxMarks: 100,
          obtainedMarks: 94,
          grade: '94/100 (A)',
          teacherFeedback:
            'Exemplary textual evidence citation. Maya demonstrates nuanced analysis of southern societal conventions. Excellent clarity throughout.',
          submittedAt: 'Oct 17, 2026, 07:15 PM',
        },
        {
          id: 'hw-full-4',
          title: 'Silk Road Trade Routes Document-Based Inquiry',
          subject: 'World History',
          teacher: 'Mr. Roberto Alvarez',
          assignedDate: 'Oct 09, 2026',
          dueDate: 'Oct 15, 2026',
          status: 'submitted',
          description:
            'Map the cultural diffusion of paper manufacturing and spices across the trans-Eurasian trade routes during the Tang Dynasty.',
          maxMarks: 30,
          submittedAt: 'Oct 14, 2026, 06:30 PM',
        },
      ]
    : [
        {
          id: 'hw-p1',
          title: 'Multiplication Tables & Word Problems Sheet 3',
          subject: 'Mathematics',
          teacher: 'Mr. David Miller',
          assignedDate: 'Oct 18, 2026',
          dueDate: 'Oct 24, 2026',
          status: 'due_soon',
          description: 'Practice multiplying 2-digit numbers by 1-digit numbers. Complete problems 1–20 on page 56.',
          maxMarks: 20,
        },
        {
          id: 'hw-p2',
          title: 'Solar System Planetary Fact Cards',
          subject: 'General Science',
          teacher: 'Mr. David Miller',
          assignedDate: 'Oct 14, 2026',
          dueDate: 'Oct 21, 2026',
          status: 'graded',
          description: 'Create an index card for each of the 4 rocky planets describing diameter, atmosphere, and distance from Sun.',
          maxMarks: 30,
          obtainedMarks: 28,
          grade: '28/30 (A)',
          teacherFeedback: 'Very colorful and clear illustration of Martian canyons! Excellent work Leo.',
          submittedAt: 'Oct 20, 2026, 05:00 PM',
        },
      ];

  const filteredList = childHomeworkList.filter((hw) => {
    if (filterStatus !== 'all' && hw.status !== filterStatus) {
      return false;
    }
    if (
      searchQuery &&
      !hw.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !hw.subject.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-3 animate-in fade-in duration-150">
      {/* Overview Stat Card */}
      <div
        className="p-4 rounded-xl border shadow-xs"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Homework & Tasks
            </span>
            <span className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
              {selectedChild.name} · {selectedChild.grade}
            </span>
          </div>

          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))',
              color: 'var(--color-primary)',
            }}
          >
            {childHomeworkList.filter((h) => h.status !== 'graded').length} Active
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 text-xs no-scrollbar">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'due_soon', label: 'Due Soon' },
              { id: 'pending', label: 'Pending' },
              { id: 'submitted', label: 'Submitted' },
              { id: 'graded', label: 'Graded' },
            ] as const
          ).map((st) => (
            <button
              key={st.id}
              onClick={() => setFilterStatus(st.id)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold capitalize transition-all border whitespace-nowrap ${
                filterStatus === st.id ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'
              }`}
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter homework by subject or title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-3 py-1.5 rounded-lg border text-xs outline-none"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
        />
      </div>

      {/* Homework Cards List */}
      <div className="space-y-2">
        {filteredList.length === 0 ? (
          <div
            className="p-6 rounded-xl border text-center space-y-2 text-xs"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <BookOpen className="w-7 h-7 text-slate-400 mx-auto" />
            <span className="font-bold block" style={{ color: 'var(--color-text)' }}>
              No assignments found
            </span>
            <p className="text-slate-500 text-[11px]">
              No tasks matched the selected filter.
            </p>
          </div>
        ) : (
          filteredList.map((hw) => {
            const isGraded = hw.status === 'graded';
            const isDueSoon = hw.status === 'due_soon';
            const isSubmitted = hw.status === 'submitted';

            return (
              <div
                key={hw.id}
                onClick={() => setActiveHomework(hw)}
                className="p-3.5 rounded-xl border text-xs cursor-pointer hover:shadow-xs transition-all space-y-2"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="font-bold block truncate" style={{ color: 'var(--color-text)' }}>
                      {hw.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {hw.subject} · {hw.teacher}
                    </span>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                      isGraded
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : isDueSoon
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : isSubmitted
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    {isGraded ? hw.grade : isDueSoon ? 'Due Soon' : isSubmitted ? 'Submitted' : 'Pending'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{hw.dueDate}</span>
                  </span>
                  <span className="font-bold text-teal-600 flex items-center gap-0.5 text-[10px]">
                    <span>View Task</span>
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Homework Detail Modal Sheet */}
      {activeHomework && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border shadow-2xl p-4 sm:p-6 animate-in slide-in-from-bottom-5 duration-200 space-y-3.5"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  {activeHomework.subject} Assignment
                </span>
                <h3 className="text-sm font-extrabold" style={{ color: 'var(--color-text)' }}>
                  {activeHomework.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveHomework(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="p-3 rounded-lg border text-xs space-y-1.5"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex justify-between text-slate-500">
                <span>Instructor:</span>
                <strong style={{ color: 'var(--color-text)' }}>{activeHomework.teacher}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Due Date:</span>
                <strong style={{ color: 'var(--color-text)' }}>{activeHomework.dueDate}</strong>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Maximum Marks:</span>
                <strong className="font-mono">{activeHomework.maxMarks} points</strong>
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Instructions & Rubric
              </span>
              <p
                className="p-2.5 rounded-lg border text-xs leading-relaxed text-slate-600 dark:text-slate-300"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {activeHomework.description}
              </p>
            </div>

            {activeHomework.teacherFeedback && (
              <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs">
                <span className="text-[10px] font-bold uppercase text-emerald-800 dark:text-emerald-300 block mb-1">
                  Teacher Evaluation Feedback
                </span>
                <p className="text-emerald-900 dark:text-emerald-200 italic leading-relaxed">
                  &ldquo;{activeHomework.teacherFeedback}&rdquo;
                </p>
                <div className="mt-2 pt-1 border-t border-emerald-200 dark:border-emerald-800 flex justify-between font-bold text-emerald-900 dark:text-emerald-100">
                  <span>Awarded Score:</span>
                  <span className="font-mono">{activeHomework.grade}</span>
                </div>
              </div>
            )}

            <div className="pt-1 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveHomework(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
