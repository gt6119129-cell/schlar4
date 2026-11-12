import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { RotateCcw, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ResetDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ResetDemoModal: React.FC<ResetDemoModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { resetAllSchoolDataToDefaults } = useSchoolData();
  const [confirmed, setConfirmed] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    resetAllSchoolDataToDefaults();
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
      if (onSuccess) onSuccess();
    }, 1200);
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border shadow-2xl p-6 space-y-4 text-xs transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5 text-amber-600">
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm" style={{ color: 'var(--color-text)' }}>
                Restore Benchmark Demo Data
              </h3>
              <span className="text-[11px] text-slate-400">SCHLAR Campus Operations Reset</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700"
            disabled={successToast}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {successToast ? (
          <div className="p-4 rounded-xl bg-emerald-950 text-emerald-200 border border-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold block text-sm">Demo Data Restored!</span>
              <span className="text-[11px] text-emerald-300">
                All 10 roles, students, staff, classes, timetable, fees, and library records are reset to pristine defaults.
              </span>
            </div>
          </div>
        ) : (
          <>
            <p className="text-slate-500 leading-relaxed text-xs">
              This action will reset all modified student records, attendance marks, fee collections, library loans, transport routes, and visitor gate passes back to SCHLAR's verified benchmark demo dataset.
            </p>

            <div className="p-3 rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Notice</span>
              </div>
              <p>
                Local browser modifications stored under <code>schlar_school_data_v1</code> will be replaced with clean interconnected demo seed data.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg border text-slate-500 hover:text-slate-800"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
