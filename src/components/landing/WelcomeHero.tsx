import React from 'react';
import { ArrowRight, Layers, Palette, Shield } from 'lucide-react';

interface WelcomeHeroProps {
  onSelectRoleScroll: () => void;
  onExploreThemesScroll: () => void;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({
  onSelectRoleScroll,
  onExploreThemesScroll,
}) => {
  return (
    <section className="py-12 sm:py-16 md:py-20 border-b transition-colors" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Domain-authentic unboxed kicker */}
            <div
              className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase mb-3 transition-colors"
              style={{ color: 'var(--color-secondary)' }}
            >
              <span>Enterprise School Management</span>
              <span aria-hidden="true">·</span>
              <span>Prompt 1 Frontend Foundation</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4 transition-colors"
              style={{ color: 'var(--color-text)', textWrap: 'balance' }}
            >
              Welcome to SCHLAR
            </h1>

            <p
              className="text-lg sm:text-xl font-medium mb-4 transition-colors"
              style={{ color: 'var(--color-primary)' }}
            >
              Your school, connected.
            </p>

            <p
              className="text-sm sm:text-base leading-relaxed mb-8 max-w-2xl transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              SCHLAR brings institutional governance, academic timetabling, classroom attendance,
              tuition ledgers, human resources, library circulation, transit logistics, and examinations
              into one unified operations platform. Built with a 12-palette design system and dedicated
              workspaces for ten specialized school leadership roles.
            </p>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onSelectRoleScroll}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.99] whitespace-nowrap"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                <span>Choose Your Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreThemesScroll}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all hover:opacity-90 whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
              >
                <Palette className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
                <span>Browse 12 Themes</span>
              </button>
            </div>
          </div>

          {/* Clean Architecture Highlights Grid (Single elevation, hairline borders) */}
          <div className="lg:col-span-5">
            <div
              className="p-6 rounded-xl border transition-colors shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between pb-4 border-b mb-5" style={{ borderColor: 'var(--color-border)' }}>
                <span className="text-xs font-bold tracking-wider uppercase" style={{ color: 'var(--color-text-secondary)' }}>
                  Platform Architecture Summary
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.05))',
                    color: 'var(--color-accent)',
                  }}
                >
                  Phase 1 / 12
                </span>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 border mt-0.5"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      10 Specialized Workspaces
                    </strong>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Admin, Vice Principal, Teacher, Parent, Accountant, HR Manager, Librarian, Transport, Receptionist, Exam Coordinator.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 border mt-0.5"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-secondary)',
                    }}
                  >
                    <Palette className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      12 Built-in Palettes & Custom Editor
                    </strong>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      Full CSS variables engine, live token parsing, hex code validation, JSON import/export, and real-time live preview.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 border mt-0.5"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-accent)',
                    }}
                  >
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
                      Strict Governance Rules
                    </strong>
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      No Student or Super Admin roles. Decentralized permissions, role separation, and persistent state across page reloads.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
