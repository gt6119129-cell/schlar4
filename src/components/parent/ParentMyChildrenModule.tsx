import React, { useState } from 'react';
import { LinkedChild } from '../../data/mockData';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Users,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MapPin,
  FileText,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ParentMyChildrenModuleProps {
  childrenList: LinkedChild[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  onNavigateTab: (tabId: string) => void;
}

export const ParentMyChildrenModule: React.FC<ParentMyChildrenModuleProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  onNavigateTab,
}) => {
  const [profileTab, setProfileTab] = useState<'overview' | 'academic' | 'enrollment'>('overview');
  const { students, guardians } = useSchoolData();

  const selectedChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];
  const matchedStudent = students.find(
    (s) => s.name.toLowerCase() === selectedChild.name.toLowerCase()
  );
  const guardianInfo = guardians.find((g) => g.linkedStudentIds.includes(matchedStudent?.id || ''));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div
            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider mb-0.5"
            style={{ color: 'var(--color-secondary)' }}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Family Portfolio</span>
          </div>
          <h1 className="text-base font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
            My Children
          </h1>
          <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
            Official student records linked to your guardian account.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('messages')}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border hover:opacity-90 transition-opacity shrink-0"
          style={{
            borderColor: 'var(--color-border)',
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)',
          }}
        >
          <Mail className="w-3 h-3" style={{ color: 'var(--color-primary)' }} />
          <span>Help / Inquiries</span>
        </button>
      </div>

      {/* Children Selection Cards Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {childrenList.map((child) => {
          const isSelected = child.id === selectedChild.id;
          return (
            <div
              key={child.id}
              onClick={() => onSelectChild(child.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'ring-2 shadow-sm'
                  : 'hover:shadow-xs opacity-90 hover:opacity-100'
              }`}
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: isSelected ? 'var(--color-primary)' : 'var(--color-border)',
                // @ts-ignore
                '--tw-ring-color': 'var(--color-primary)',
              }}
            >
              <div className="flex items-start justify-between gap-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shadow-xs shrink-0"
                    style={{
                      backgroundColor: isSelected ? 'var(--color-primary)' : 'var(--color-secondary)',
                    }}
                  >
                    {child.avatarInitials}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                        {child.name}
                      </span>
                      {isSelected && (
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.2 rounded text-white uppercase tracking-wider"
                          style={{ backgroundColor: 'var(--color-accent)' }}
                        >
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                      {child.grade} · {child.section} (Roll #{child.rollNumber})
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className="text-xs font-mono font-bold block"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    GPA {child.gpa.split(' ')[0]}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {child.attendancePercent}% Attn
                  </span>
                </div>
              </div>

              <div
                className="grid grid-cols-3 gap-1.5 mt-3 pt-2.5 border-t text-center text-xs"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Homeroom</span>
                  <span className="font-semibold text-[10px] truncate block" style={{ color: 'var(--color-text)' }}>
                    {child.homeroom.split('(')[0]}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Tuition</span>
                  <span
                    className={`font-semibold text-[10px] block ${
                      child.tuitionStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {child.tuitionStatus}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Due Work</span>
                  <span className="font-semibold text-[10px] block" style={{ color: 'var(--color-text)' }}>
                    {child.pendingHomeworkCount} tasks
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Child Detailed Portfolio Card */}
      <div
        className="rounded-xl border shadow-xs transition-colors overflow-hidden"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Child Profile Banner */}
        <div
          className="p-3.5 border-b space-y-3"
          style={{
            backgroundColor: 'rgba(var(--color-primary), 0.03)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-base font-extrabold text-white shadow-xs shrink-0"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              {selectedChild.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h2 className="text-sm font-extrabold truncate" style={{ color: 'var(--color-text)' }}>
                  {selectedChild.name}
                </h2>
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase border shrink-0"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-secondary)',
                  }}
                >
                  ID: {matchedStudent?.admissionNo || `SCH-2026-${selectedChild.rollNumber}`}
                </span>
              </div>
              <p className="text-[11px] truncate" style={{ color: 'var(--color-text-secondary)' }}>
                {selectedChild.grade} · {selectedChild.section} · Advisor: <strong>{selectedChild.classTeacher}</strong>
              </p>
            </div>
          </div>

          {/* Quick Sub-tab Switcher inside Child Detail */}
          <div
            className="grid grid-cols-3 gap-1 p-1 rounded-xl border text-[11px] font-semibold"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <button
              onClick={() => setProfileTab('overview')}
              className={`py-1.5 rounded-lg text-center transition-all ${
                profileTab === 'overview' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'text-slate-500'
              }`}
              style={{ color: profileTab === 'overview' ? 'var(--color-primary)' : undefined }}
            >
              Overview
            </button>
            <button
              onClick={() => setProfileTab('academic')}
              className={`py-1.5 rounded-lg text-center transition-all ${
                profileTab === 'academic' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'text-slate-500'
              }`}
              style={{ color: profileTab === 'academic' ? 'var(--color-primary)' : undefined }}
            >
              Academic
            </button>
            <button
              onClick={() => setProfileTab('enrollment')}
              className={`py-1.5 rounded-lg text-center transition-all truncate px-1 ${
                profileTab === 'enrollment' ? 'bg-white dark:bg-slate-800 shadow-xs font-bold' : 'text-slate-500'
              }`}
              style={{ color: profileTab === 'enrollment' ? 'var(--color-primary)' : undefined }}
            >
              Enrollment
            </button>
          </div>
        </div>

        {/* Tab 1: Profile Overview */}
        {profileTab === 'overview' && (
          <div className="p-3.5 space-y-3.5">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div
                className="p-3 rounded-xl border text-xs"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Academic Year</span>
                <span className="text-xs font-bold block" style={{ color: 'var(--color-text)' }}>
                  2026–2027
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Term 1 Active</span>
              </div>

              <div
                className="p-3 rounded-xl border text-xs"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Roll / Seat</span>
                <span className="text-xs font-bold font-mono block" style={{ color: 'var(--color-text)' }}>
                  #{selectedChild.rollNumber}
                </span>
                <span className="text-[10px] text-slate-500">{selectedChild.section}</span>
              </div>

              <div
                className="p-3 rounded-xl border text-xs col-span-2 sm:col-span-1"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Homeroom</span>
                <span className="text-xs font-bold block truncate" style={{ color: 'var(--color-text)' }}>
                  {selectedChild.homeroom}
                </span>
                <span className="text-[10px] text-slate-500">Main Campus</span>
              </div>

              <div
                className="p-3 rounded-xl border text-xs col-span-2 sm:col-span-1"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Status</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-600">Active Regular</span>
                </div>
                <span className="text-[10px] text-slate-500">Good Standing</span>
              </div>
            </div>

            {/* Quick Action Buttons for Child */}
            <div className="pt-1 flex flex-col gap-2">
              <button
                onClick={() => onNavigateTab('attendance')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg text-white"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>View Full Attendance History</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigateTab('timetable')}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg border hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: 'var(--color-secondary)' }} />
                  <span>Timetable</span>
                </button>

                <button
                  onClick={() => onNavigateTab('fees')}
                  className="flex items-center justify-center gap-1.5 py-2 px-2 text-xs font-semibold rounded-lg border hover:opacity-90"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                >
                  <FileText className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                  <span>Fees & Dues</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Academic Info */}
        {profileTab === 'academic' && (
          <div className="p-3.5 space-y-3.5 text-xs">
            <div className="space-y-3">
              <div
                className="p-3.5 rounded-xl border space-y-2.5"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                    Academic Standing
                  </span>
                  <Award className="w-3.5 h-3.5" style={{ color: 'var(--color-accent)' }} />
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cumulative GPA:</span>
                    <span className="font-bold font-mono" style={{ color: 'var(--color-text)' }}>
                      {selectedChild.gpa}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Academic Standing:</span>
                    <span className="font-bold text-emerald-600">Honors Standing</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Attendance Rate:</span>
                    <span className="font-bold font-mono" style={{ color: 'var(--color-primary)' }}>
                      {selectedChild.attendancePercent}% ({selectedChild.attendanceDays.present}/{selectedChild.attendanceDays.total} Days)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pending Homework:</span>
                    <span className="font-bold text-amber-600">
                      {selectedChild.pendingHomeworkCount} Tasks
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border space-y-2.5"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <span className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                    Core Academic Subjects
                  </span>
                  <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: 'Mathematics', teacher: 'Ms. Sarah Henderson', status: 'On Track' },
                    { name: 'Physics & STEM Sciences', teacher: 'Dr. Marcus Vance', status: 'On Track' },
                    { name: 'English Literature', teacher: 'Mr. David Miller', status: 'Exceeding' },
                    { name: 'World History', teacher: 'Mr. Roberto Alvarez', status: 'On Track' },
                  ].map((sub, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-xs block truncate" style={{ color: 'var(--color-text)' }}>
                          {sub.name}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">{sub.teacher}</span>
                      </div>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 shrink-0">
                        {sub.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Enrollment & Guardian */}
        {profileTab === 'enrollment' && (
          <div className="p-3.5 space-y-3 text-xs">
            <div className="space-y-3">
              <div
                className="p-3.5 rounded-xl border space-y-2.5"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <span className="font-bold text-xs block pb-1.5 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  Student Enrollment Record
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official Full Name:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{selectedChild.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Admission Number:</span>
                    <span className="font-mono font-semibold" style={{ color: 'var(--color-text)' }}>
                      {matchedStudent?.admissionNo || 'SCH-2022-0814'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date of Birth:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {matchedStudent?.dateOfBirth || 'April 14, 2012'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Admission Date:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {matchedStudent?.admissionDate || 'September 01, 2022'}
                    </span>
                  </div>
                </div>
              </div>

              <div
                className="p-3.5 rounded-xl border space-y-2.5"
                style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}
              >
                <span className="font-bold text-xs block pb-1.5 border-b" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  Primary Guardian Information
                </span>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Guardian Name:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {guardianInfo?.name || 'Mrs. Li Chen'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Relationship:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {guardianInfo?.relationship || 'Mother'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verified Phone:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {guardianInfo?.phone || '+91 98450 23488'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Registered Email:</span>
                    <span className="font-semibold" style={{ color: 'var(--color-text)' }}>
                      {guardianInfo?.email || 'li.chen@innovate.org'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
