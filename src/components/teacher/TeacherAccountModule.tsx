import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  User,
  Settings,
  BookOpen,
  CalendarDays,
  Mail,
  Phone,
  Building2,
  Award,
  CheckCircle2,
  Save,
} from 'lucide-react';

interface TeacherAccountModuleProps {
  initialSubTab?: string;
}

export const TeacherAccountModule: React.FC<TeacherAccountModuleProps> = ({
  initialSubTab = 'teacher-my-profile',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);

  const { sections, timetable } = useSchoolData();

  // Demo Teacher: Ms. Sarah Henderson ('staff-henderson')
  const teacherId = 'staff-henderson';
  const assignedSectionIds = ['sec-8a', 'sec-9b', 'sec-10a'];
  const mySections = sections.filter((s) => assignedSectionIds.includes(s.id));
  const myPeriods = timetable.filter((t) => t.teacherId === teacherId && !t.isBreak);

  // Preference state
  const [dailyDigest, setDailyDigest] = useState(true);
  const [attendanceAlerts, setAttendanceAlerts] = useState(true);
  const [defaultLanding, setDefaultLanding] = useState('overview');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSavePreferences = () => {
    setSavedNotice('Instructor preferences saved.');
    setTimeout(() => setSavedNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER & SUBTABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-primary)',
              }}
            >
              Faculty Desk
            </span>
            <span className="text-xs text-slate-500">Account & Teaching Profile</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Faculty Account & Teaching Scope</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Instructor credentials, departmental subject assignments, and portal preferences.
          </p>
        </div>

        {/* Tab strip */}
        <div className="flex items-center gap-1 p-1 rounded-xl border bg-slate-50 dark:bg-slate-900 text-xs shrink-0 overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('teacher-my-profile')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-my-profile'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('teacher-my-assignments')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-my-assignments'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Teaching Assignments ({mySections.length})
          </button>
          <button
            onClick={() => setActiveTab('teacher-preferences')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'teacher-preferences'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* SUBTAB 1: MY PROFILE */}
      {activeTab === 'teacher-my-profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="p-6 rounded-2xl border shadow-xs md:col-span-1 flex flex-col items-center text-center"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="w-20 h-20 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-extrabold text-2xl mb-3 shadow-xs">
              SH
            </div>
            <h3 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
              Ms. Sarah Henderson
            </h3>
            <span className="text-xs text-slate-500 mt-0.5">Senior Faculty · Department of Mathematics</span>
            <div className="mt-4 pt-4 border-t w-full text-left space-y-2 text-xs text-slate-500" style={{ borderColor: 'var(--color-border)' }}>
              <div>Staff ID: <strong className="font-mono text-slate-700 dark:text-slate-300">staff-henderson</strong></div>
              <div>Qualifications: <strong className="text-slate-700 dark:text-slate-300">M.Sc. Mathematics, B.Ed.</strong></div>
              <div>Campus Room: <strong className="text-slate-700 dark:text-slate-300">Lab 204 / Faculty Hub 2</strong></div>
            </div>
          </div>

          <div
            className="p-6 rounded-2xl border shadow-xs md:col-span-2 space-y-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Authorized Teaching Scope & Allocations
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Assigned Cohorts</span>
                <span className="text-xl font-bold mt-1 block" style={{ color: 'var(--color-text)' }}>
                  3 Cohorts (8-A, 9-B, 10-A)
                </span>
                <span className="text-[11px] text-slate-500">84 total enrolled students</span>
              </div>

              <div className="p-4 rounded-xl border bg-slate-50 dark:bg-slate-900" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Instructional Workload</span>
                <span className="text-xl font-bold mt-1 block" style={{ color: 'var(--color-text)' }}>
                  {myPeriods.length} Weekly Periods
                </span>
                <span className="text-[11px] text-slate-500">Full-time faculty workload standard</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Institutional Contact & Routing:
              </span>
              <p className="text-xs text-slate-500 leading-relaxed">
                Official inquiries are routed through the SCHLAR teacher communication channel. Direct administrative or timetable inquiries should be directed to the Vice Principal's Office.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: TEACHING ASSIGNMENTS */}
      {activeTab === 'teacher-my-assignments' && (
        <div className="space-y-4">
          <div
            className="rounded-2xl border shadow-xs overflow-hidden"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="p-4 border-b">
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Departmental Teaching Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Official instructional allocations authorized by Academic Administration
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b"
                    style={{
                      backgroundColor: 'var(--color-table-header, #f9fafb)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Class & Section</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Subject</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Designated Room</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Weekly Load</th>
                    <th className="py-2.5 px-4 font-semibold text-[10px] uppercase">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {mySections.map((sec) => (
                    <tr key={sec.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                      <td className="py-3 px-4 font-semibold" style={{ color: 'var(--color-text)' }}>
                        {sec.name} ({sec.className})
                      </td>
                      <td className="py-3 px-4">Mathematics</td>
                      <td className="py-3 px-4 font-mono">Room {sec.room || '204'}</td>
                      <td className="py-3 px-4 font-mono">5 Periods / Week</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Primary Subject Instructor
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: PREFERENCES */}
      {activeTab === 'teacher-preferences' && (
        <div
          className="p-6 rounded-2xl border shadow-xs max-w-xl space-y-5"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div className="border-b pb-3">
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Instructor Portal Preferences
            </h3>
            <p className="text-xs text-slate-500">Configure notifications and default workspace views.</p>
          </div>

          <div className="space-y-4 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                  Daily Attendance Reminders
                </span>
                <span className="text-[11px] text-slate-500">
                  Notify if period roll call is pending 15 minutes before noon.
                </span>
              </div>
              <input
                type="checkbox"
                checked={attendanceAlerts}
                onChange={(e) => setAttendanceAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border cursor-pointer" style={{ borderColor: 'var(--color-border)' }}>
              <div>
                <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                  Curriculum Pacing Digest
                </span>
                <span className="text-[11px] text-slate-500">
                  Weekly summary of syllabus completion and upcoming assessment tasks.
                </span>
              </div>
              <input
                type="checkbox"
                checked={dailyDigest}
                onChange={(e) => setDailyDigest(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600"
              />
            </label>

            <div>
              <label className="font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
                Default Workspace Landing Tab
              </label>
              <select
                value={defaultLanding}
                onChange={(e) => setDefaultLanding(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border outline-none"
                style={{
                  backgroundColor: 'var(--color-background)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <option value="overview">Instructional Dashboard</option>
                <option value="attendance">Roll Call Register</option>
                <option value="my-classes">My Classes</option>
                <option value="my-timetable">My Timetable</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-sm flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Save className="w-4 h-4" />
              <span>Save Preferences</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
