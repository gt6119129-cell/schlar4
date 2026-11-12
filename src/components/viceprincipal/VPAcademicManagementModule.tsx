import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Building2,
  BookMarked,
  Bookmark,
  Calendar,
  CalendarRange,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  GraduationCap,
  Users,
  Eye,
  FileCheck,
  Check,
} from 'lucide-react';
import { SyllabusTopic } from '../../types/school';

interface VPAcademicManagementModuleProps {
  initialSubTab?: string;
}

export const VPAcademicManagementModule: React.FC<VPAcademicManagementModuleProps> = ({
  initialSubTab = 'vp-classes-sections',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');

  const {
    classes,
    sections,
    students,
    subjects,
    staff,
    syllabus,
    reviewSyllabusTopic,
    academicTerms,
  } = useSchoolData();

  // Syllabus Review State
  const [reviewingTopic, setReviewingTopic] = useState<SyllabusTopic | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [signOffToast, setSignOffToast] = useState<string | null>(null);

  // Selected Section Detail Modal
  const [viewingSectionId, setViewingSectionId] = useState<string | null>(null);

  const activeClasses = classes.filter((c) => c.status === 'active');
  const activeSections = sections.filter((s) => s.status === 'active');

  const filteredSections = activeSections.filter((sec) => {
    const matchesGrade = selectedGrade === 'all' || sec.classId === selectedGrade;
    const matchesSearch =
      sec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sec.classTeacherName && sec.classTeacherName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGrade && matchesSearch;
  });

  const handleConfirmReview = (approve: boolean) => {
    if (!reviewingTopic) return;
    reviewSyllabusTopic(reviewingTopic.id, reviewNotes, approve);
    setSignOffToast(
      approve
        ? `Syllabus topic "${reviewingTopic.topicTitle}" approved and formally signed off.`
        : `Feedback returned for topic "${reviewingTopic.topicTitle}".`
    );
    setReviewingTopic(null);
    setReviewNotes('');
    setTimeout(() => setSignOffToast(null), 3000);
  };

  const selectedSectionRecord = activeSections.find((s) => s.id === viewingSectionId);
  const sectionStudents = viewingSectionId
    ? students.filter((st) => st.sectionId === viewingSectionId && st.enrollmentStatus === 'active')
    : [];

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {signOffToast && (
        <div className="p-3 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{signOffToast}</span>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cohort supervision, curriculum delivery, syllabus tracking, and term schedules
          </p>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('vp-classes-sections')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-classes-sections' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Classes & Sections
          </button>
          <button
            onClick={() => setActiveTab('vp-subject-coverage')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-subject-coverage' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Subject Coverage
          </button>
          <button
            onClick={() => setActiveTab('vp-syllabus-progress')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-syllabus-progress' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Syllabus Progress
          </button>
          <button
            onClick={() => setActiveTab('vp-academic-calendar')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-academic-calendar' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Academic Calendar
          </button>
          <button
            onClick={() => setActiveTab('vp-academic-activities')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-academic-activities' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Academic Activities
          </button>
        </div>
      </div>

      {/* 1. CLASSES & SECTIONS VIEW */}
      {activeTab === 'vp-classes-sections' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search classes or teachers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-card focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-muted-foreground" />
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="text-xs rounded-xl border bg-card px-3 py-2 focus:outline-hidden"
              >
                <option value="all">All Grades ({activeClasses.length})</option>
                {activeClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSections.map((sec) => {
              const enrolled = students.filter(
                (s) => s.sectionId === sec.id && s.enrollmentStatus === 'active'
              ).length;
              const capacityPercent = Math.round((enrolled / (sec.capacity || 30)) * 100);

              return (
                <div
                  key={sec.id}
                  className="p-5 rounded-2xl border bg-card hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                        {sec.className}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">{sec.room}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground">{sec.name}</h3>
                    <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>Class Teacher: <strong className="text-foreground">{sec.classTeacherName || 'Unassigned'}</strong></span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Enrolled Students:</span>
                      <span className="font-bold text-foreground">
                        {enrolled} / {sec.capacity} ({capacityPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          capacityPercent > 95 ? 'bg-amber-500' : 'bg-primary'
                        }`}
                        style={{ width: `${Math.min(capacityPercent, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        onClick={() => setViewingSectionId(sec.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground transition-colors flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Roster</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. SUBJECT COVERAGE VIEW */}
      {activeTab === 'vp-subject-coverage' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border bg-muted/30 text-xs text-muted-foreground flex items-center gap-3">
            <BookMarked className="w-5 h-5 text-primary shrink-0" />
            <div>
              <strong className="text-foreground">Curricular Subject Allocation</strong>: Verification that all accredited core, laboratory, and elective subjects have certified department faculty assigned.
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="p-3">Subject Name</th>
                    <th className="p-3">Code</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Assigned Faculty</th>
                    <th className="p-3">Target Grades</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {subjects.map((subj) => {
                    const assignedTeachers = staff.filter((st) =>
                      st.assignedSubjects && st.assignedSubjects.some((s) => s.toLowerCase().includes(subj.name.toLowerCase()))
                    );

                    return (
                      <tr key={subj.id} className="hover:bg-muted/30">
                        <td className="p-3 font-bold text-foreground">{subj.name}</td>
                        <td className="p-3 text-muted-foreground font-mono">{subj.code}</td>
                        <td className="p-3">{subj.department}</td>
                        <td className="p-3">
                          {assignedTeachers.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {assignedTeachers.map((t) => (
                                <span
                                  key={t.id}
                                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground"
                                >
                                  {t.name}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              Unassigned
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-muted-foreground">Grades 8, 9, 10, 11</td>
                        <td className="p-3 text-right">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                            Active
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. SYLLABUS PROGRESS VIEW */}
      {activeTab === 'vp-syllabus-progress' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Review teacher-reported lesson pacing and provide official Vice Principal academic sign-offs.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold">Total Topics Tracked: {syllabus.length}</span>
            </div>
          </div>

          <div className="border rounded-2xl overflow-hidden bg-card shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-muted text-muted-foreground font-semibold border-b">
                  <tr>
                    <th className="p-3">Class & Section</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Chapter / Topic Title</th>
                    <th className="p-3">Pacing</th>
                    <th className="p-3">Teacher Notes</th>
                    <th className="p-3">VP Sign-Off</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {syllabus.map((top) => {
                    const percent = Math.round((top.completedLessons / top.totalLessons) * 100);

                    return (
                      <tr key={top.id} className="hover:bg-muted/30">
                        <td className="p-3 font-semibold text-foreground">{top.sectionName}</td>
                        <td className="p-3 font-medium text-foreground">{top.subjectName}</td>
                        <td className="p-3">
                          <div className="font-semibold text-foreground">
                            Ch {top.chapterNo}: {top.topicTitle}
                          </div>
                          <div className="text-[11px] text-muted-foreground">Updated: {top.lastUpdated}</div>
                        </td>
                        <td className="p-3">
                          <div className="w-28 space-y-1">
                            <div className="flex justify-between text-[11px] font-semibold">
                              <span>{top.completedLessons}/{top.totalLessons}</span>
                              <span>{percent}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className={`h-full rounded-full ${
                                  percent === 100 ? 'bg-emerald-500' : 'bg-primary'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground max-w-xs truncate">
                          {top.teacherNotes || 'No notes entered'}
                        </td>
                        <td className="p-3">
                          {top.vpReviewed ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Signed Off
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold text-[11px]">
                              <Clock className="w-3.5 h-3.5" />
                              Awaiting Sign-off
                            </span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setReviewingTopic(top);
                              setReviewNotes(top.vpNotes || '');
                            }}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
                          >
                            {top.vpReviewed ? 'Update Review' : 'Review & Sign'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. ACADEMIC CALENDAR VIEW */}
      {activeTab === 'vp-academic-calendar' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {academicTerms.map((term) => (
              <div
                key={term.id}
                className={`p-5 rounded-2xl border bg-card shadow-xs space-y-3 ${
                  term.isCurrent ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Term Schedule
                  </span>
                  {term.isCurrent && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-primary-foreground">
                      CURRENT TERM
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground">{term.name}</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div>Start Date: <strong className="text-foreground">{term.startDate}</strong></div>
                  <div>End Date: <strong className="text-foreground">{term.endDate}</strong></div>
                  <div>Instructional Working Days: <strong className="text-foreground">58 Days</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. ACADEMIC ACTIVITIES VIEW */}
      {activeTab === 'vp-academic-activities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  STEM & SCIENCE
                </span>
                <span className="text-xs text-muted-foreground">Nov 05, 2026</span>
              </div>
              <h3 className="text-base font-bold text-foreground">Annual STEM & Robotics Exhibition</h3>
              <p className="text-xs text-muted-foreground">
                Senior and middle secondary project presentations in the STEM Wing laboratory halls. Mentors assigned from Physics & Chemistry departments.
              </p>
              <div className="text-xs text-foreground font-semibold pt-2">Applicable: Grades 8, 9, 10, 11</div>
            </div>

            <div className="p-5 rounded-2xl border bg-card shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  HUMANITIES & ARTS
                </span>
                <span className="text-xs text-muted-foreground">Nov 18, 2026</span>
              </div>
              <h3 className="text-base font-bold text-foreground">Inter-House Parliamentary Debate</h3>
              <p className="text-xs text-muted-foreground">
                Formal parliamentary format tournament in the main auditorium. Coordinated by Mr. Roberto Alvarez and Language Arts faculty.
              </p>
              <div className="text-xs text-foreground font-semibold pt-2">Applicable: Grades 9, 10, 11</div>
            </div>
          </div>
        </div>
      )}

      {/* REVIEW SYLLABUS TOPIC MODAL */}
      {reviewingTopic && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-base font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span>Vice Principal Syllabus Review</span>
              </h2>
              <button
                onClick={() => setReviewingTopic(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 space-y-1 text-xs">
              <div className="font-bold text-foreground text-sm">{reviewingTopic.topicTitle}</div>
              <div className="text-muted-foreground">
                {reviewingTopic.sectionName} • {reviewingTopic.subjectName} • Chapter {reviewingTopic.chapterNo}
              </div>
              <div className="text-muted-foreground">
                Pacing: {reviewingTopic.completedLessons} of {reviewingTopic.totalLessons} lessons completed
              </div>
              {reviewingTopic.teacherNotes && (
                <div className="pt-1 text-foreground">
                  <strong>Teacher Note:</strong> {reviewingTopic.teacherNotes}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Vice Principal Review & Curricular Commentary:
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter formal verification notes, suggestions, or curriculum adjustments..."
                rows={3}
                className="w-full text-xs rounded-xl border bg-background p-3 focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setReviewingTopic(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmReview(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950"
              >
                Return with Feedback
              </button>
              <button
                onClick={() => handleConfirmReview(true)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Approve & Sign Off
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT ROSTER MODAL */}
      {viewingSectionId && selectedSectionRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b">
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-primary" />
                  <span>{selectedSectionRecord.name} Roster</span>
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Class Teacher: {selectedSectionRecord.classTeacherName} • Room {selectedSectionRecord.room}
                </p>
              </div>
              <button
                onClick={() => setViewingSectionId(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {sectionStudents.length === 0 ? (
                <div className="text-center py-8 text-xs text-muted-foreground">
                  No active students enrolled in this section.
                </div>
              ) : (
                <div className="border rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-muted font-semibold text-muted-foreground border-b">
                      <tr>
                        <th className="p-2.5">Admission No</th>
                        <th className="p-2.5">Student Name</th>
                        <th className="p-2.5">Gender</th>
                        <th className="p-2.5">Guardian Contact</th>
                        <th className="p-2.5 text-right">GPA</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {sectionStudents.map((st) => (
                        <tr key={st.id} className="hover:bg-muted/30">
                          <td className="p-2.5 font-mono text-muted-foreground">{st.admissionNo}</td>
                          <td className="p-2.5 font-bold text-foreground">{st.name}</td>
                          <td className="p-2.5">{st.gender}</td>
                          <td className="p-2.5 text-muted-foreground">{st.guardianName} ({st.guardianPhone})</td>
                          <td className="p-2.5 text-right font-bold text-primary">{st.gpa || '3.70'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t">
              <button
                onClick={() => setViewingSectionId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-muted hover:bg-muted/80"
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
