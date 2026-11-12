import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  BadgeCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  FileText,
  User,
  Calendar,
} from 'lucide-react';
import { AcademicApproval } from '../../types/school';

interface VPApprovalsModuleProps {
  initialSubTab?: string;
}

export const VPApprovalsModule: React.FC<VPApprovalsModuleProps> = ({
  initialSubTab = 'vp-pending-approvals',
}) => {
  const [activeTab, setActiveTab] = useState(initialSubTab);
  const [selectedApproval, setSelectedApproval] = useState<AcademicApproval | null>(null);

  // Modal reason state for Reject & Return
  const [actionType, setActionType] = useState<'reject' | 'return' | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [actionToast, setActionToast] = useState<string | null>(null);

  const { approvals, processApproval } = useSchoolData();

  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const completedApprovals = approvals.filter((a) => a.status === 'approved');
  const rejectedOrReturned = approvals.filter((a) => a.status === 'rejected' || a.status === 'returned');

  const displayedList =
    activeTab === 'vp-pending-approvals'
      ? pendingApprovals
      : activeTab === 'vp-completed-approvals'
      ? completedApprovals
      : rejectedOrReturned;

  const handleQuickApprove = (approval: AcademicApproval) => {
    const res = processApproval(approval.id, 'approved', 'Approved as submitted by Vice Principal.');
    if (res.isValid) {
      setActionToast(`Approval "${approval.title}" approved successfully.`);
      setTimeout(() => setActionToast(null), 3000);
      if (selectedApproval?.id === approval.id) {
        setSelectedApproval(null);
      }
    } else {
      alert(res.message);
    }
  };

  const handleConfirmDecisionWithReason = () => {
    if (!selectedApproval || !actionType) return;
    if (!reasonText.trim()) {
      alert(`A clear reason is mandatory to ${actionType} an academic submission.`);
      return;
    }

    const decision = actionType === 'reject' ? 'rejected' : 'returned';
    const res = processApproval(selectedApproval.id, decision, reasonText);
    if (res.isValid) {
      setActionToast(
        actionType === 'reject'
          ? `Request rejected with reason logged.`
          : `Request returned for teacher correction with feedback logged.`
      );
      setActionType(null);
      setReasonText('');
      setSelectedApproval(null);
      setTimeout(() => setActionToast(null), 3000);
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {actionToast && (
        <div className="p-3 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionToast}</span>
        </div>
      )}

      {/* MODULE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Academic Approvals Center</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Delegated academic sign-offs, syllabus completion reviews, marks moderation, and lesson plan approvals
          </p>
        </div>

        {/* SUB-TABS */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('vp-pending-approvals')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'vp-pending-approvals' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span>Pending Approvals</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
              {pendingApprovals.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('vp-completed-approvals')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-completed-approvals' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Completed ({completedApprovals.length})
          </button>
          <button
            onClick={() => setActiveTab('vp-rejected-approvals')}
            className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap ${
              activeTab === 'vp-rejected-approvals' ? 'bg-background shadow-xs text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Rejected / Returned ({rejectedOrReturned.length})
          </button>
        </div>
      </div>

      {/* LIST OF APPROVALS */}
      <div className="space-y-3">
        {displayedList.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl bg-card space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-sm text-foreground">No requests in this queue</h3>
            <p className="text-xs text-muted-foreground">
              {activeTab === 'vp-pending-approvals'
                ? 'All faculty submissions have been reviewed and approved.'
                : 'No historical approval records found under this status.'}
            </p>
          </div>
        ) : (
          displayedList.map((appr) => (
            <div
              key={appr.id}
              className="p-5 rounded-2xl border bg-card hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
                    {appr.type}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    {appr.sectionName} • {appr.subjectName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Submitted: {appr.submissionDate}</span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-foreground">{appr.title}</h3>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{appr.details}</p>
              </div>

              <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-muted-foreground">
                  Requested By: <strong className="text-foreground">{appr.requestedByStaffName}</strong> ({appr.role})
                  {appr.reviewReason && (
                    <div className="mt-1 text-foreground">
                      <strong>VP Reason / Commentary:</strong> {appr.reviewReason} ({appr.reviewedAt})
                    </div>
                  )}
                </div>

                {appr.status === 'pending' && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedApproval(appr);
                        setActionType('return');
                        setReasonText('');
                      }}
                      className="px-3 py-1.5 rounded-lg font-semibold border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Return for Correction</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedApproval(appr);
                        setActionType('reject');
                        setReasonText('');
                      }}
                      className="px-3 py-1.5 rounded-lg font-semibold border border-rose-300 dark:border-rose-800 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                    <button
                      onClick={() => handleQuickApprove(appr)}
                      className="px-4 py-1.5 rounded-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* REJECT / RETURN REASON MODAL */}
      {actionType && selectedApproval && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-card border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b">
              <h2 className="text-base font-bold flex items-center gap-2">
                <AlertTriangle
                  className={`w-5 h-5 ${actionType === 'reject' ? 'text-rose-500' : 'text-amber-500'}`}
                />
                <span>
                  {actionType === 'reject' ? 'Reject Academic Request' : 'Return Request for Correction'}
                </span>
              </h2>
              <button
                onClick={() => setActionType(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 space-y-1 text-xs">
              <div className="font-bold text-foreground">{selectedApproval.title}</div>
              <div className="text-muted-foreground">
                Submitted by {selectedApproval.requestedByStaffName} on {selectedApproval.submissionDate}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-foreground">
                Mandatory Explanation / Required Adjustments:
              </label>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder={
                  actionType === 'reject'
                    ? 'State the official pedagogical or statutory reason for rejecting this request...'
                    : 'Specify the exact items or formatting the teacher must correct before resubmitting...'
                }
                rows={3}
                required
                className="w-full text-xs rounded-xl border bg-background p-2.5 mt-1 focus:outline-hidden focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setActionType(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecisionWithReason}
                className={`px-4 py-2 text-xs font-semibold rounded-lg text-white ${
                  actionType === 'reject' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-amber-600 hover:bg-amber-500'
                }`}
              >
                Confirm {actionType === 'reject' ? 'Rejection' : 'Return'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
