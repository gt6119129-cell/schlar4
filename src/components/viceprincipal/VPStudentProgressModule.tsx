import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Award,
  AlertTriangle,
  Clock,
  FileText,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  User,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { StudentIntervention } from '../../types/school';

interface VPStudentProgressModuleProps {
  initialSubTab?: string;
}

export const VPStudentProgressModule: React.FC<VPStudentProgressModuleProps> = ({
  initialSubTab = 'overview',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const { students, interventions, addIntervention, updateIntervention, staff, sections } = useSchoolData();

  // Create intervention modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [category, setCategory] = useState<'Academic' | 'Attendance' | 'Behavioral' | 'Wellness'>('Academic');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [description, setDescription] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [responsibleStaffId, setResponsibleStaffId] = useState(staff[0]?.id || '');
  const [followUpDate, setFollowUpDate] = useState('2026-10-30');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered interventions
  const filteredInterventions = interventions.filter((intv) => {
    const matchesCategory = categoryFilter === 'all' || intv.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || intv.status === statusFilter;
    const matchesSearch =
      intv.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intv.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
      intv.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const handleCreateIntervention = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find((s) => s.id === selectedStudentId);
    const teacher = staff.find((s) => s.id === responsibleStaffId);
    if (!student || !teacher) return;

    const res = addIntervention({
      studentId: student.id,
      studentName: student.name,
      classId: student.classId,
      className: student.className,
      sectionId: student.sectionId,
      sectionName: student.sectionName,
      category,
      severity,
      description,
      actionTaken,
      responsibleStaffId: teacher.id,
      responsibleStaffName: teacher.name,
      followUpDate,
      status: 'open',
      reviewNotes: 'Case opened by Vice Principal academic council.',
    });

    if (res.isValid) {
      setToastMessage(`Intervention for ${student.name} successfully recorded.`);
      setCreateModalOpen(false);
      setDescription('');
      setActionTaken('');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleResolveIntervention = (id: string) => {
    updateIntervention(id, {
      status: 'resolved',
      reviewNotes: 'Resolved during Vice Principal weekly review session.',
    });
    setToastMessage('Intervention marked as resolved.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Student Support & Interventions</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Academic recovery tracking, early warning flags, attendance remediation, and student mentoring
          </p>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Intervention</span>
        </button>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search student or concern..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-card focus:outline-hidden focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs rounded-xl border bg-card px-3 py-2 focus:outline-hidden font-semibold"
          >
            <option value="all">All Categories</option>
            <option value="Academic">Academic</option>
            <option value="Attendance">Attendance</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Wellness">Wellness</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs rounded-xl border bg-card px-3 py-2 focus:outline-hidden font-semibold"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* INTERVENTIONS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredInterventions.length === 0 ? (
          <div className="col-span-2 text-center py-12 border rounded-2xl bg-card text-muted-foreground text-xs">
            No active student intervention cases matching the selected filters.
          </div>
        ) : (
          filteredInterventions.map((intv) => (
            <div
              key={intv.id}
              className="p-5 rounded-2xl border bg-card hover:shadow-md transition-all space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{intv.studentName}</span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      ({intv.className} • {intv.sectionName})
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      intv.severity === 'high' || intv.severity === 'critical'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : intv.severity === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {intv.category.toUpperCase()} • {intv.severity.toUpperCase()}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-muted/40 space-y-1 text-xs">
                  <span className="font-semibold text-foreground">Identified Concern:</span>
                  <p className="text-muted-foreground">{intv.description}</p>
                </div>

                <div className="text-xs space-y-1">
                  <div>
                    <strong className="text-foreground">Action Taken: </strong>
                    <span className="text-muted-foreground">{intv.actionTaken}</span>
                  </div>
                  <div>
                    <strong className="text-foreground">Responsible Mentor: </strong>
                    <span className="text-muted-foreground">{intv.responsibleStaffName}</span>
                  </div>
                  {intv.reviewNotes && (
                    <div>
                      <strong className="text-foreground">Review Notes: </strong>
                      <span className="text-muted-foreground">{intv.reviewNotes}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Follow-Up: <strong className="text-foreground">{intv.followUpDate}</strong>
                </span>

                {intv.status !== 'resolved' ? (
                  <button
                    onClick={() => handleResolveIntervention(intv.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
                  >
                    Mark Resolved
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    RESOLVED
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE INTERVENTION MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-base font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Log Student Support Intervention</span>
              </h2>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateIntervention} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-foreground">Select Student:</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden font-semibold"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.className} - {st.sectionName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-foreground">Concern Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden font-semibold"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Attendance">Attendance</option>
                    <option value="Behavioral">Behavioral</option>
                    <option value="Wellness">Wellness</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Severity Level:</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden font-semibold"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-foreground">Description of Concern:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the specific academic drop, missed concepts, or attendance concerns..."
                  required
                  rows={2}
                  className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="font-semibold text-foreground">Remedial Action Taken:</label>
                <textarea
                  value={actionTaken}
                  onChange={(e) => setActionTaken(e.target.value)}
                  placeholder="e.g., Assigned peer tutoring clinic, modified homework packet, parental consult..."
                  required
                  rows={2}
                  className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-foreground">Responsible Faculty Mentor:</label>
                  <select
                    value={responsibleStaffId}
                    onChange={(e) => setResponsibleStaffId(e.target.value)}
                    className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden font-semibold"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} ({s.department})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-foreground">Follow-Up Review Date:</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    required
                    className="w-full text-xs rounded-xl border bg-background p-2 mt-1 focus:outline-hidden font-semibold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Save Intervention Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
