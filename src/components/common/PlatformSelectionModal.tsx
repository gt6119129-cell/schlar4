import React from 'react';
import { RoleConfig, PlatformType } from '../../config/roles';
import { Monitor, Smartphone, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface PlatformSelectionModalProps {
  isOpen: boolean;
  role: RoleConfig | null;
  onSelectPlatform: (platform: PlatformType) => void;
  onCancel: () => void;
}

export const PlatformSelectionModal: React.FC<PlatformSelectionModalProps> = ({
  isOpen,
  role,
  onSelectPlatform,
  onCancel,
}) => {
  if (!isOpen || !role) return null;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border p-5 sm:p-8 shadow-2xl transition-colors max-h-[92vh] overflow-y-auto"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b mb-6" style={{ borderColor: 'var(--color-border)' }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase"
                style={{
                  backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.05))',
                  color: 'var(--color-primary)',
                  border: '1px solid var(--color-border)',
                }}
              >
                Dual Experience Supported
              </span>
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                {role.name} Role
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight" style={{ color: 'var(--color-text)' }}>
              Choose Your Platform Experience
            </h2>
            <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              The <strong>{role.name}</strong> role includes both an expansive desktop Web Portal and an
              app-like touch Mobile Experience. Select how you would like to test this role.
            </p>
          </div>
        </div>

        {/* 2 Platform Choices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {/* Choice 1: Web Portal */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => onSelectPlatform('web')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectPlatform('web');
              }
            }}
            className="group flex flex-col justify-between p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 border transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-primary)',
                }}
              >
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                Web Portal
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Desktop classroom control center with comprehensive gradebooks, multi-class attendance registers, and detailed curriculum rubrics.
              </p>
            </div>

            <div
              className="pt-4 mt-4 border-t flex items-center justify-between text-xs font-bold"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
            >
              <span>Launch Web Portal</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Choice 2: Mobile App Experience */}
          <div
            tabIndex={0}
            role="button"
            onClick={() => onSelectPlatform('mobile')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectPlatform('mobile');
              }
            }}
            className="group flex flex-col justify-between p-5 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-md focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 border transition-transform duration-200 group-hover:scale-105"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-secondary)',
                }}
              >
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                Mobile App Experience
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                Phone-first mobile roster with fast 1-tap attendance roll calls, daily schedule check, and homework status on the go.
              </p>
            </div>

            <div
              className="pt-4 mt-4 border-t flex items-center justify-between text-xs font-bold"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-secondary)' }}
            >
              <span>Launch Mobile App</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Footer info & Return */}
        <div className="flex items-center justify-between pt-4 border-t text-xs" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-1.5" style={{ color: 'var(--color-text-secondary)' }}>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Shared live demo data across both web and mobile platforms</span>
          </div>

          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium hover:opacity-85 transition-opacity"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Roles</span>
          </button>
        </div>
      </div>
    </div>
  );
};
