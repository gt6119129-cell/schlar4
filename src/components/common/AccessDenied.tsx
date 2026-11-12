import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface AccessDeniedProps {
  requiredPermission?: string;
  roleName: string;
  onReturnToOverview: () => void;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  requiredPermission,
  roleName,
  onReturnToOverview,
}) => {
  return (
    <div
      className="p-8 sm:p-12 rounded-2xl border text-center max-w-lg mx-auto my-12 transition-colors shadow-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 mb-4">
        <ShieldAlert className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>
        Access Restricted
      </h3>

      <p className="text-xs leading-relaxed text-slate-500 mb-4">
        The current active role (<strong>{roleName}</strong>) does not hold the required authorization
        {requiredPermission && (
          <>
            {' '}
            (<code className="font-mono text-[11px] px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 text-rose-600">{requiredPermission}</code>)
          </>
        )}{' '}
        to access this operational module or perform this action.
      </p>

      <div className="p-3 rounded-lg border bg-black/[0.02] text-[11px] text-slate-400 mb-6" style={{ borderColor: 'var(--color-border)' }}>
        <span>SCHLAR RBAC enforcement · Role policy check failed</span>
      </div>

      <button
        onClick={onReturnToOverview}
        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm hover:opacity-95"
        style={{ backgroundColor: 'var(--color-primary)' }}
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Workspace Overview</span>
      </button>
    </div>
  );
};
