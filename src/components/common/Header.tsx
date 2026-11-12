import React, { useState } from 'react';
import { SchlarLogo } from '../brand/SchlarLogo';
import { useTheme } from '../../context/ThemeContext';
import {
  Sun,
  Moon,
  Monitor,
  Palette,
  ArrowLeft,
  Menu,
  X,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { ResetDemoModal } from './ResetDemoModal';

interface HeaderProps {
  currentRoleName?: string;
  onExitWorkspace?: () => void;
  activeSection?: string;
  onNavigateSection?: (sectionId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoleName,
  onExitWorkspace,
  activeSection = 'workspaces',
  onNavigateSection,
}) => {
  const { appearance, setAppearance, activePalette, isPreviewActive, cancelPreview, applyPreview } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const toggleAppearance = () => {
    if (appearance === 'light') setAppearance('dark');
    else if (appearance === 'dark') setAppearance('system');
    else setAppearance('light');
  };

  const appearanceLabel =
    appearance === 'light' ? 'Light' : appearance === 'dark' ? 'Dark' : 'System';

  const AppearanceIcon =
    appearance === 'light' ? Sun : appearance === 'dark' ? Moon : Monitor;

  return (
    <header
      className="sticky top-0 z-40 w-full transition-colors backdrop-blur-md border-b"
      style={{
        backgroundColor: 'rgba(var(--color-surface), 0.92)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
      }}
    >
      {/* Draft Preview Active Banner */}
      {isPreviewActive && (
        <div
          className="w-full py-1.5 px-4 text-xs font-medium flex items-center justify-between text-white transition-colors"
          style={{ backgroundColor: 'var(--color-accent)' }}
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              Previewing theme draft: <strong>{activePalette.name}</strong>. This preview is not yet saved to permanent settings.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={cancelPreview}
              className="px-2.5 py-0.5 rounded bg-black/20 hover:bg-black/35 text-white text-[11px] font-semibold transition-colors"
            >
              Cancel Preview
            </button>
            <button
              onClick={applyPreview}
              className="px-2.5 py-0.5 rounded bg-white text-slate-900 hover:bg-slate-100 text-[11px] font-bold shadow-sm transition-colors"
            >
              Apply to SCHLAR
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark & Label */}
          <div className="flex items-center gap-3 shrink-0">
            {currentRoleName ? (
              <button
                onClick={onExitWorkspace}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all hover:opacity-90"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-primary)',
                }}
                title="Return to Role Selection"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Role Selection</span>
              </button>
            ) : null}

            <button
              onClick={() => {
                if (currentRoleName && onExitWorkspace) {
                  onExitWorkspace();
                } else if (onNavigateSection) {
                  onNavigateSection('welcome');
                }
              }}
              className="text-left focus:outline-none"
            >
              <SchlarLogo />
            </button>
          </div>

          {/* Zone 2: Navigation Links (single-line, clean text with hover underlines) */}
          {!currentRoleName ? (
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <button
                onClick={() => onNavigateSection?.('workspaces')}
                className={`transition-colors whitespace-nowrap hover:opacity-100 ${
                  activeSection === 'workspaces' ? 'font-semibold' : 'opacity-75'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                10 Workspaces
              </button>
              <button
                onClick={() => onNavigateSection?.('themes')}
                className={`transition-colors whitespace-nowrap hover:opacity-100 ${
                  activeSection === 'themes' ? 'font-semibold' : 'opacity-75'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                Theme Gallery
              </button>
              <button
                onClick={() => onNavigateSection?.('customizer')}
                className={`transition-colors whitespace-nowrap hover:opacity-100 ${
                  activeSection === 'customizer' ? 'font-semibold' : 'opacity-75'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                Theme Editor
              </button>
              <button
                onClick={() => onNavigateSection?.('architecture')}
                className={`transition-colors whitespace-nowrap hover:opacity-100 ${
                  activeSection === 'architecture' ? 'font-semibold' : 'opacity-75'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                Architecture
              </button>
            </nav>
          ) : (
            <div className="hidden md:flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
              <span>Active Workspace</span>
              <span>·</span>
              <strong style={{ color: 'var(--color-text)' }}>{currentRoleName}</strong>
            </div>
          )}

          {/* Zone 3: Primary Action & Appearance Controls */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Active Palette Quick Indicator */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
              title={`Current Palette: ${activePalette.name}`}
            >
              <Palette className="w-3.5 h-3.5" style={{ color: 'var(--color-primary)' }} />
              <span className="max-w-[110px] truncate" style={{ color: 'var(--color-text)' }}>
                {activePalette.name}
              </span>
              <div
                className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                style={{ backgroundColor: activePalette.tokens.accent }}
              />
            </div>

            {/* Reset Demo Benchmark Button */}
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-md border transition-colors hover:opacity-90 text-amber-600 dark:text-amber-400"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              title="Restore benchmark demo dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Reset Demo</span>
            </button>

            {/* Appearance Mode Switcher */}
            <button
              onClick={toggleAppearance}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              aria-label={`Toggle appearance mode. Current: ${appearanceLabel}`}
              title={`Appearance: ${appearanceLabel} (Click to switch)`}
            >
              <AppearanceIcon className="w-3.5 h-3.5" style={{ color: 'var(--color-secondary)' }} />
              <span className="hidden sm:inline">{appearanceLabel}</span>
            </button>

            {/* Mobile menu toggle */}
            {!currentRoleName && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md border"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text)',
                }}
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && !currentRoleName && (
        <div
          className="md:hidden border-t px-4 py-3 flex flex-col gap-2 transition-all"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            onClick={() => {
              onNavigateSection?.('workspaces');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            10 Workspaces
          </button>
          <button
            onClick={() => {
              onNavigateSection?.('themes');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            Theme Gallery (12 Presets)
          </button>
          <button
            onClick={() => {
              onNavigateSection?.('customizer');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            Theme Customizer & Code Editor
          </button>
          <button
            onClick={() => {
              onNavigateSection?.('architecture');
              setMobileMenuOpen(false);
            }}
            className="text-left py-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            System & Token Architecture
          </button>
        </div>
      )}

      <ResetDemoModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
      />
    </header>
  );
};
