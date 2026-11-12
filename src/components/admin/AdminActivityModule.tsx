import React, { useState, useMemo } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { usePermissions } from '../../context/PermissionContext';
import { PermissionManager } from '../permissions/PermissionManager';
import {
  ShieldAlert,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  FileText,
  User,
  Users,
  Building,
  Calendar,
  Layers,
  ExternalLink,
  ChevronRight,
  Database,
  Info,
} from 'lucide-react';

interface AdminActivityModuleProps {
  initialTab?: string;
  onNavigateTab?: (tabId: string) => void;
}

export const AdminActivityModule: React.FC<AdminActivityModuleProps> = ({
  initialTab = 'activity',
  onNavigateTab,
}) => {
  // Normalize initialTab
  const normalizedInitial = initialTab.includes('recent')
    ? 'recent'
    : initialTab.includes('integrity')
    ? 'integrity'
    : initialTab.includes('permission')
    ? 'permissions'
    : 'activity';

  const [activeTab, setActiveTab] = useState<'activity' | 'recent' | 'integrity' | 'permissions'>(
    normalizedInitial as any
  );

  const {
    auditLogs,
    students,
    sections,
    classes,
    staff,
    timetable,
    rooms,
    schoolProfile,
  } = useSchoolData();

  const { hasPermission } = usePermissions();

  // Filter & search for audit logs
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');

  // Diagnostics state
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanTime, setLastScanTime] = useState<string>('Just now');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const actorName = log.actorName || log.user || 'Administrator';
      const targetEntity = log.targetEntity || log.module || 'System';
      const category = log.category || log.module || 'General';
      const matchSearch =
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        targetEntity.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory =
        categoryFilter === 'all' || category === categoryFilter || log.module === categoryFilter;
      const matchAction =
        actionFilter === 'all' || log.action.toLowerCase().includes(actionFilter.toLowerCase());
      return matchSearch && matchCategory && matchAction;
    });
  }, [auditLogs, searchTerm, categoryFilter, actionFilter]);

  // Data Integrity Analysis Engine
  const integrityReport = useMemo(() => {
    const issues: {
      id: string;
      severity: 'critical' | 'warning' | 'info';
      category: string;
      title: string;
      description: string;
      actionLabel?: string;
      targetTab?: string;
    }[] = [];

    // 1. Sections without Class Teachers
    sections.forEach((sec) => {
      if (!sec.classTeacherId || sec.classTeacherId === 'unassigned') {
        issues.push({
          id: `sec-no-teacher-${sec.id}`,
          severity: 'warning',
          category: 'Sections & Rosters',
          title: `Vacant Class Teacher: ${sec.name}`,
          description: `Section ${sec.name} (${sec.className}) does not have an assigned homeroom Class Teacher.`,
          actionLabel: 'Assign Teacher',
          targetTab: 'academics-sections',
        });
      }
    });

    // 2. Sections at or over capacity
    sections.forEach((sec) => {
      const enrollmentCount = students.filter((s) => s.sectionId === sec.id && s.enrollmentStatus === 'active').length;
      if (enrollmentCount >= sec.capacity) {
        issues.push({
          id: `sec-capacity-${sec.id}`,
          severity: enrollmentCount > sec.capacity ? 'critical' : 'warning',
          category: 'Enrollment Capacity',
          title: `Capacity Limit Reached: ${sec.name}`,
          description: `Enrollment (${enrollmentCount}) has reached or exceeded max limit (${sec.capacity}).`,
          actionLabel: 'Adjust Section',
          targetTab: 'academics-sections',
        });
      }
    });

    // 3. Timetable periods with Room conflicts
    const roomMap = new Map<string, typeof timetable[0]>();
    timetable.forEach((entry) => {
      if (entry.room && entry.room !== 'General Room') {
        const roomKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.room}`;
        if (roomMap.has(roomKey)) {
          const prev = roomMap.get(roomKey)!;
          issues.push({
            id: `room-clash-${entry.id}`,
            severity: 'critical',
            category: 'Timetable Scheduling',
            title: `Room Collision in ${entry.room}`,
            description: `Room occupied simultaneously by ${prev.sectionName} and ${entry.sectionName} on ${entry.dayOfWeek} P${entry.periodNumber}.`,
            actionLabel: 'Resolve Timetable',
            targetTab: 'academics-timetable-conflicts',
          });
        } else {
          roomMap.set(roomKey, entry);
        }
      }
    });

    // 4. Timetable periods with Teacher conflicts
    const teacherMap = new Map<string, typeof timetable[0]>();
    timetable.forEach((entry) => {
      const teacherKey = `${entry.dayOfWeek}-${entry.periodNumber}-${entry.teacherId}`;
      if (teacherMap.has(teacherKey)) {
        const prev = teacherMap.get(teacherKey)!;
        issues.push({
          id: `teacher-clash-${entry.id}`,
          severity: 'critical',
          category: 'Faculty Scheduling',
          title: `Teacher Overlap: ${entry.teacherName}`,
          description: `Double-scheduled across ${prev.sectionName} and ${entry.sectionName} on ${entry.dayOfWeek} P${entry.periodNumber}.`,
          actionLabel: 'Fix Timetable',
          targetTab: 'academics-timetable-conflicts',
        });
      } else {
        teacherMap.set(teacherKey, entry);
      }
    });

    // 5. Inactive staff with active homerooms
    staff.forEach((member) => {
      if (member.status === 'resigned' || member.status === 'on-leave') {
        const linkedSec = sections.find((s) => s.classTeacherId === member.id);
        if (linkedSec) {
          issues.push({
            id: `archived-staff-${member.id}`,
            severity: member.status === 'resigned' ? 'critical' : 'warning',
            category: 'Staff Records',
            title: `${member.status === 'resigned' ? 'Resigned' : 'On-Leave'} Staff Assigned: ${member.name}`,
            description: `${member.status === 'resigned' ? 'Resigned' : 'On-Leave'} faculty member is still designated as homeroom teacher for ${linkedSec.name}.`,
            actionLabel: 'Reassign Staff',
            targetTab: 'staff-assignments',
          });
        }
      }
    });

    // Calculate score
    const criticalCount = issues.filter((i) => i.severity === 'critical').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    let score = 100 - criticalCount * 15 - warningCount * 5;
    score = Math.max(20, Math.min(100, score));

    return {
      issues,
      score,
      criticalCount,
      warningCount,
    };
  }, [sections, timetable, staff]);

  const handleRunScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setLastScanTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 600);
  };

  // Recent entity changes feed
  const recentChanges = useMemo(() => {
    const list: {
      id: string;
      entity: string;
      title: string;
      action: 'Created' | 'Modified' | 'Updated' | 'Configured';
      timestamp: string;
      actor: string;
      icon: any;
      badgeColor: string;
    }[] = [
      {
        id: 'rc-1',
        entity: 'Timetable',
        title: 'Master Period Allocation for Grade 10-A',
        action: 'Modified',
        timestamp: '15 mins ago',
        actor: 'Admin (System)',
        icon: Calendar,
        badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      },
      {
        id: 'rc-2',
        entity: 'Student Placement',
        title: 'Maya Chen homeroom placement verified',
        action: 'Updated',
        timestamp: '1 hour ago',
        actor: 'Registrar',
        icon: Users,
        badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
      },
      {
        id: 'rc-3',
        entity: 'Academic Settings',
        title: 'School profile contacts and affiliation code updated',
        action: 'Configured',
        timestamp: '3 hours ago',
        actor: 'Principal Office',
        icon: Building,
        badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      },
      {
        id: 'rc-4',
        entity: 'Section Capacity',
        title: 'Section 11-B capacity expanded to 35 seats',
        action: 'Modified',
        timestamp: 'Yesterday at 4:30 PM',
        actor: 'Admin',
        icon: Layers,
        badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      },
      {
        id: 'rc-5',
        entity: 'Bell Schedule',
        title: 'Morning Recess and Lunch Period standard intervals ratified',
        action: 'Updated',
        timestamp: '2 days ago',
        actor: 'Director of Academics',
        icon: Clock,
        badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
      },
    ];
    return list;
  }, []);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase mb-1" style={{ color: 'var(--color-primary)' }}>
            <ShieldAlert className="w-4 h-4" />
            <span>Institutional Governance & Control</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
            Administration & Activity
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            System-wide audit trail, data integrity diagnostics, recent modifications, and role permission policies.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl border bg-black/[0.02] dark:bg-white/[0.02] overflow-x-auto" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Audit Log ({auditLogs.length})
          </button>
          <button
            onClick={() => setActiveTab('recent')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'recent'
                ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Recent Changes
          </button>
          <button
            onClick={() => setActiveTab('integrity')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'integrity'
                ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Data Integrity</span>
            {integrityReport.criticalCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'permissions'
                ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Permission Matrix
          </button>
        </div>
      </div>

      {/* TAB 1: AUDIT LOG */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div
            className="p-4 rounded-xl border flex flex-col md:flex-row items-center justify-between gap-3"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search audit trail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-xs border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-xs border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <option value="all">All Categories</option>
                <option value="Timetable">Timetable</option>
                <option value="Academics">Academics</option>
                <option value="Students">Students</option>
                <option value="Staff">Staff</option>
                <option value="Settings">Settings</option>
              </select>

              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="px-3 py-2 rounded-lg text-xs border bg-transparent focus:outline-none"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                <option value="all">All Actions</option>
                <option value="create">Created</option>
                <option value="update">Updated</option>
                <option value="delete">Deleted</option>
                <option value="archive">Archived</option>
              </select>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div
            className="rounded-xl border overflow-hidden shadow-sm"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr
                    className="border-b text-[10px] uppercase font-bold tracking-wider"
                    style={{
                      backgroundColor: 'var(--color-table-header, #f8fafc)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Action</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Target Entity</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Modification Details</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
                  {filteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No audit records match the current search or filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLogs.map((log) => {
                      const actionBadge =
                        log.action === 'create'
                          ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
                          : log.action === 'delete'
                          ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                          : log.action === 'archive'
                          ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                          : 'bg-blue-500/10 text-blue-600 border-blue-500/20';

                      return (
                        <tr key={log.id} className="hover:bg-black/[0.015] dark:hover:bg-white/[0.015] transition-colors">
                          <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                            {log.timestamp}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${actionBadge}`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-text)' }}>
                            {log.category || log.module}
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-600 dark:text-slate-300">
                            {log.targetEntity || log.module}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold block" style={{ color: 'var(--color-text)' }}>
                              {log.actorName || log.user}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {log.actorRole || 'Administrator'}
                            </span>
                          </td>
                          <td className="py-3 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300" title={log.details}>
                            {log.details}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Committed</span>
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RECENT CHANGES */}
      {activeTab === 'recent' && (
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl border flex items-center justify-between"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                System-wide Modification Timeline
              </h2>
              <p className="text-xs text-slate-500">
                Ordered stream of high-impact adjustments across departments and curriculum.
              </p>
            </div>
            <button
              onClick={() => showToast?.('Recent timeline refreshed')}
              className="p-2 rounded-lg border hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-slate-600 dark:text-slate-300"
              style={{ borderColor: 'var(--color-border)' }}
              title="Refresh timeline"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {recentChanges.map((change) => {
              const IconComp = change.icon;
              return (
                <div
                  key={change.id}
                  className="p-4 rounded-xl border transition-all hover:shadow-sm flex items-start justify-between gap-4"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="p-2.5 rounded-lg border shrink-0 mt-0.5"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                          {change.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${change.badgeColor}`}>
                          {change.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span>Entity: <strong className="font-medium text-slate-700 dark:text-slate-300">{change.entity}</strong></span>
                        <span>•</span>
                        <span>By: {change.actor}</span>
                        <span>•</span>
                        <span>{change.timestamp}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20 shrink-0">
                    Verified
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DATA INTEGRITY DIAGNOSTICS */}
      {activeTab === 'integrity' && (
        <div className="space-y-6">
          {/* Diagnostic Health Scoreboard */}
          <div
            className="p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-5">
              <div
                className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-black text-2xl border shadow-inner shrink-0"
                style={{
                  backgroundColor: integrityReport.score > 80 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  borderColor: integrityReport.score > 80 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  color: integrityReport.score > 80 ? 'var(--color-success, #10b981)' : 'var(--color-error, #ef4444)',
                }}
              >
                <span>{integrityReport.score}%</span>
                <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">HEALTH</span>
              </div>
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
                  Institutional Relational Health Audit
                </h2>
                <p className="text-xs text-slate-500 max-w-md mt-0.5">
                  Automated scan of data linkages, class teacher homeroom mandates, timetable room overlaps, and capacity limits.
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-2">
                  <span>Last scanned: <strong className="font-semibold text-slate-700 dark:text-slate-300">{lastScanTime}</strong></span>
                  <span>•</span>
                  <span className="text-rose-500 font-semibold">{integrityReport.criticalCount} Critical</span>
                  <span>•</span>
                  <span className="text-amber-500 font-semibold">{integrityReport.warningCount} Warnings</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleRunScan}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white flex items-center gap-2 shadow-sm transition-all"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Running Scan...' : 'Re-run Integrity Scan'}</span>
            </button>
          </div>

          {/* Issue List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Identified Structural Discrepancies ({integrityReport.issues.length})
            </h3>

            {integrityReport.issues.length === 0 ? (
              <div
                className="p-8 rounded-xl border text-center space-y-2"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Zero Integrity Violations Detected
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  All active cohorts have designated class teachers, room capacities are within limits, and timetable slots are free of teacher and space conflicts.
                </p>
              </div>
            ) : (
              integrityReport.issues.map((issue) => {
                const badge =
                  issue.severity === 'critical'
                    ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    : issue.severity === 'warning'
                    ? 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                    : 'bg-blue-500/10 text-blue-600 border-blue-500/20';

                return (
                  <div
                    key={issue.id}
                    className="p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                    style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 shrink-0 mt-0.5 ${
                          issue.severity === 'critical' ? 'text-rose-500' : 'text-amber-500'
                        }`}
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold" style={{ color: 'var(--color-text)' }}>
                            {issue.title}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${badge}`}>
                            {issue.severity}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {issue.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 max-w-xl">
                          {issue.description}
                        </p>
                      </div>
                    </div>

                    {issue.actionLabel && onNavigateTab && issue.targetTab && (
                      <button
                        onClick={() => onNavigateTab(issue.targetTab!)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold border hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                      >
                        <span>{issue.actionLabel}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PERMISSION MATRIX */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div
            className="p-4 rounded-xl border flex items-center justify-between"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div>
              <h2 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Role-Based Access Control Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Inspect capabilities across the 10 role workspaces (Admin, Teacher, Student, Parent, Principal, etc.)
              </p>
            </div>
          </div>

          <PermissionManager />
        </div>
      )}
    </div>
  );
};
