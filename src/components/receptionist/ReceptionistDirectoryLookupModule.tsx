import React, { useState, useMemo } from 'react';
import {
  INITIAL_STUDENTS,
  INITIAL_GUARDIANS,
  INITIAL_STAFF,
} from '../../data/initialSchoolData';
import {
  Search,
  GraduationCap,
  Users,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Shield,
  ShieldAlert,
  Lock,
  Building,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const ReceptionistDirectoryLookupModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'students' | 'parents' | 'staff'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');

  const filteredStudents = useMemo(() => {
    return INITIAL_STUDENTS.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.guardianName && s.guardianName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (s.guardianPhone && s.guardianPhone.includes(searchQuery));

      const matchClass = filterClass === 'all' || s.className === filterClass;

      return matchSearch && matchClass;
    });
  }, [searchQuery, filterClass]);

  const filteredParents = useMemo(() => {
    return INITIAL_GUARDIANS.filter((g) => {
      return (
        g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.phone.includes(searchQuery) ||
        (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (g.address && g.address.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [searchQuery]);

  const filteredStaff = useMemo(() => {
    return INITIAL_STAFF.filter((st) => {
      const matchSearch =
        st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        st.phone.includes(searchQuery);

      const matchDept = filterDept === 'all' || st.department.toLowerCase().includes(filterDept.toLowerCase());

      return matchSearch && matchDept;
    });
  }, [searchQuery, filterDept]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-teal-700 dark:text-teal-400 mb-1">
            <Search className="w-4 h-4" />
            <span>Campus Registry & Front Desk Identity Lookup</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            School Directory Lookup
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified student classrooms, parent emergency telephone contacts, and faculty office room locations.
          </p>
        </div>

        {/* TAB SWITCHER */}
        <div className="p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border flex items-center gap-1 text-xs font-bold self-start sm:self-auto" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'students'
                ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students ({INITIAL_STUDENTS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'parents'
                ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Parents ({INITIAL_GUARDIANS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'staff'
                ? 'bg-white dark:bg-slate-700 text-teal-800 dark:text-teal-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Staff & Depts ({INITIAL_STAFF.length})</span>
          </button>
        </div>
      </div>

      {/* PRIVACY SHIELD BANNER */}
      <div className="p-3.5 rounded-xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 text-xs flex items-start gap-3">
        <Shield className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="font-bold">Front-Office Privacy Shield Active:</strong> Showing authorized demographic, emergency contact, and location records only. In accordance with school security standards, academic report card grades, disciplinary dossiers, medical health records, and private fee ledgers remain restricted to Academic and Financial administrators.
        </div>
      </div>

      {/* SEARCH AND FILTERS */}
      <div
        className="p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder={
                activeTab === 'students'
                  ? 'Search student name, ID (e.g. SCH-2022-0814), guardian phone...'
                  : activeTab === 'parents'
                  ? 'Search parent name, phone, or address...'
                  : 'Search faculty name, staff ID, or department...'
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          {activeTab === 'students' && (
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Cohorts</option>
              <option value="Grade 4">Grade 4</option>
              <option value="Grade 6">Grade 6</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>
          )}

          {activeTab === 'staff' && (
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 outline-none text-xs"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="all">All Departments</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science & Physics</option>
              <option value="Primary">Primary Education</option>
            </select>
          )}
        </div>

        <div className="text-slate-500 font-medium">
          Matches: <strong>
            {activeTab === 'students'
              ? filteredStudents.length
              : activeTab === 'parents'
              ? filteredParents.length
              : filteredStaff.length}
          </strong>
        </div>
      </div>

      {/* TAB 1: STUDENT DIRECTORY */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-teal-800 dark:text-teal-300">
                      {s.admissionNo}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {s.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-100 text-teal-800">
                    {s.className} · {s.sectionName}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-slate-400 text-[10px] block">PRIMARY GUARDIAN:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {s.guardianName} ({s.guardianRelationship})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono font-medium">{s.guardianPhone}</span>
                  </div>

                  {s.guardianEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{s.guardianEmail}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 pt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Admitted: {s.admissionDate}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Student
                </span>
                <span className="text-[10px] text-slate-400">
                  FERPA Cleared
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: PARENT DIRECTORY */}
      {activeTab === 'parents' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParents.map((p) => {
            const linkedStudents = INITIAL_STUDENTS.filter((st) =>
              p.linkedStudentIds.includes(st.id)
            );

            return (
              <div
                key={p.id}
                className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {p.name}
                      </h3>
                      <span className="text-xs text-teal-700 dark:text-teal-400 font-semibold">
                        {p.relationship}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {p.linkedStudentIds.length} wards
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono font-medium">{p.phone}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </div>

                    <div className="flex items-start gap-2 text-[11px]">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{p.address}</span>
                    </div>

                    {/* LINKED WARDS */}
                    <div className="pt-2">
                      <span className="text-slate-400 text-[10px] block font-bold uppercase mb-1">
                        ENROLLED WARDS:
                      </span>
                      <div className="space-y-1">
                        {linkedStudents.map((st) => (
                          <div
                            key={st.id}
                            className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px]"
                          >
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {st.name}
                            </span>
                            <span className="text-[10px] text-teal-700 dark:text-teal-400">
                              {st.className} ({st.sectionName})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 text-right">
                  Authorized Emergency Contact
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: STAFF & DEPARTMENT DIRECTORY */}
      {activeTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStaff.map((st) => (
            <div
              key={st.id}
              className="p-5 rounded-2xl border bg-white dark:bg-slate-900 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-teal-800 dark:text-teal-300">
                      {st.staffId}
                    </span>
                    <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {st.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800">
                    {st.department}
                  </span>
                </div>

                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {st.designation}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="font-mono font-medium">Ext. {st.staffId.slice(-3)} ({st.phone})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{st.email}</span>
                  </div>

                  <div className="pt-1 text-[11px] text-slate-500">
                    <strong>Primary Room / Class:</strong> {st.assignedSections?.[0]?.sectionName || 'Faculty Room'}
                  </div>

                  {st.notes && (
                    <p className="text-[11px] text-slate-400 italic line-clamp-2 mt-1">
                      "{st.notes}"
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
                <span className="inline-flex items-center gap-1 text-emerald-600 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Active Faculty
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Room Key Ready
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
