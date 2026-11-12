import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { ThemeFilter, ThemePalette } from '../../types/theme';
import {
  Check,
  Palette,
  Copy,
  Trash2,
  Edit2,
  Download,
  Plus,
  Sparkles,
} from 'lucide-react';

interface ThemeGalleryProps {
  onOpenCustomizer: (targetPalette?: ThemePalette) => void;
  onExportPalette: (palette: ThemePalette) => void;
  onRenamePalette: (palette: ThemePalette) => void;
  onDeletePalette: (palette: ThemePalette) => void;
}

export const ThemeGallery: React.FC<ThemeGalleryProps> = ({
  onOpenCustomizer,
  onExportPalette,
  onRenamePalette,
  onDeletePalette,
}) => {
  const {
    activePaletteId,
    allPalettes,
    presetPalettes,
    customPalettes,
    selectPalette,
    duplicateCustomPalette,
    setPreviewPalette,
    previewPalette,
  } = useTheme();

  const [activeFilter, setActiveFilter] = useState<ThemeFilter>('all');

  const filteredPalettes = allPalettes.filter((p) => {
    if (activeFilter === 'presets') return p.isPreset;
    if (activeFilter === 'custom') return !p.isPreset;
    return true;
  });

  return (
    <section id="themes" className="py-12 sm:py-16 border-b transition-colors" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div
              className="text-xs font-semibold tracking-wider uppercase mb-1 transition-colors"
              style={{ color: 'var(--color-secondary)' }}
            >
              Visual Identity & Design System
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors"
              style={{ color: 'var(--color-text)' }}
            >
              Choose Your Theme
            </h2>
            <p
              className="text-sm sm:text-base font-normal mt-1 max-w-2xl transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              SCHLAR includes 12 carefully calibrated built-in color systems and supports unlimited user-created
              palettes. Choose a palette below or launch the custom editor to inspect token mappings and hex codes.
            </p>
          </div>

          {/* Action Bar: Create Custom + Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onOpenCustomizer()}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white shadow-sm transition-all hover:opacity-95 whitespace-nowrap"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Plus className="w-4 h-4" />
              <span>Create Custom Theme</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs with Live Accurate Counts */}
        <div
          className="flex items-center gap-1 p-1 rounded-lg border w-fit mb-8 max-w-full overflow-x-auto transition-colors"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeFilter === 'all' ? 'var(--color-background)' : 'transparent',
              color: 'var(--color-text)',
            }}
          >
            All Themes ({allPalettes.length})
          </button>

          <button
            onClick={() => setActiveFilter('presets')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilter === 'presets'
                ? 'font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeFilter === 'presets' ? 'var(--color-background)' : 'transparent',
              color: 'var(--color-text)',
            }}
          >
            Preset Themes ({presetPalettes.length})
          </button>

          <button
            onClick={() => setActiveFilter('custom')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeFilter === 'custom'
                ? 'font-bold shadow-sm'
                : 'opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: activeFilter === 'custom' ? 'var(--color-background)' : 'transparent',
              color: 'var(--color-text)',
            }}
          >
            My Custom Themes ({customPalettes.length})
          </button>
        </div>

        {/* Theme Cards Responsive Grid (3-4 cols desktop, 2 cols tablet, 1-2 mobile) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPalettes.map((palette) => {
            const isActive = activePaletteId === palette.id;
            const isPreviewing = previewPalette?.id === palette.id;
            const { tokens } = palette;

            return (
              <div
                key={palette.id}
                className={`relative flex flex-col justify-between rounded-xl border p-5 transition-all duration-200 shadow-sm ${
                  isActive
                    ? 'ring-2'
                    : 'hover:shadow-md'
                }`}
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: isActive ? 'var(--color-primary)' : 'var(--color-border)',
                  // Selection ring outline color
                  ...(isActive ? { outlineColor: 'var(--color-primary)' } : {}),
                }}
              >
                <div>
                  {/* Palette Header: Name + Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-base font-bold tracking-tight truncate" style={{ color: 'var(--color-text)' }}>
                          {palette.name}
                        </h3>
                        {isActive && (
                          <span
                            className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0"
                            style={{
                              backgroundColor: 'var(--color-primary)',
                              color: 'var(--color-sidebar-text, #ffffff)',
                            }}
                          >
                            <Check className="w-2.5 h-2.5" />
                            <span>Active</span>
                          </span>
                        )}
                        {isPreviewing && !isActive && (
                          <span
                            className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0"
                            style={{
                              backgroundColor: 'var(--color-accent)',
                              color: '#FFFFFF',
                            }}
                          >
                            <Sparkles className="w-2.5 h-2.5" />
                            <span>Preview</span>
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-medium block mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                        {palette.isPreset ? 'Built-in Palette' : 'Custom User Palette'}
                      </span>
                    </div>

                    {/* Custom Palette Options Dropdown / Actions */}
                    {!palette.isPreset && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => onRenamePalette(palette)}
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
                          title="Rename Palette"
                          aria-label={`Rename ${palette.name}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" style={{ color: 'var(--color-text-secondary)' }} />
                        </button>
                        <button
                          onClick={() => duplicateCustomPalette(palette.id)}
                          className="p-1 rounded hover:bg-black/5 dark:hover:bg-white/10"
                          title="Duplicate Palette"
                          aria-label={`Duplicate ${palette.name}`}
                        >
                          <Copy className="w-3.5 h-3.5" style={{ color: 'var(--color-text-secondary)' }} />
                        </button>
                        <button
                          onClick={() => onDeletePalette(palette)}
                          className="p-1 rounded hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950/40"
                          title="Delete Palette"
                          aria-label={`Delete ${palette.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Miniature Interface Preview */}
                  <div
                    className="w-full h-24 rounded-lg border overflow-hidden p-2 flex gap-1.5 mb-4 select-none"
                    style={{
                      backgroundColor: tokens.background,
                      borderColor: tokens.border,
                    }}
                    aria-label={`Preview mockup for ${palette.name}`}
                  >
                    {/* Simulated Sidebar */}
                    <div
                      className="w-10 rounded flex flex-col items-center py-1.5 gap-1.5 shrink-0"
                      style={{ backgroundColor: tokens.sidebar }}
                    >
                      <div className="w-4 h-4 rounded bg-white/20" />
                      <div className="w-5 h-1 rounded bg-white/30" />
                      <div className="w-5 h-1 rounded bg-white/30" />
                      <div className="w-5 h-1 rounded bg-white/30" />
                    </div>

                    {/* Simulated Content Area */}
                    <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                      {/* Top bar */}
                      <div
                        className="h-4 rounded px-2 flex items-center justify-between border"
                        style={{
                          backgroundColor: tokens.surface,
                          borderColor: tokens.border,
                        }}
                      >
                        <div className="w-12 h-1.5 rounded" style={{ backgroundColor: tokens.primary }} />
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tokens.secondary }} />
                      </div>

                      {/* Mini cards row */}
                      <div className="flex-1 grid grid-cols-2 gap-1.5">
                        <div
                          className="rounded border p-1 flex flex-col justify-between"
                          style={{
                            backgroundColor: tokens.surface,
                            borderColor: tokens.border,
                          }}
                        >
                          <div className="w-8 h-1 rounded" style={{ backgroundColor: tokens.textSecondary }} />
                          <div className="w-4 h-2 rounded font-bold" style={{ backgroundColor: tokens.primary }} />
                        </div>

                        <div
                          className="rounded border p-1 flex flex-col justify-between"
                          style={{
                            backgroundColor: tokens.surface,
                            borderColor: tokens.border,
                          }}
                        >
                          <div className="w-6 h-1 rounded" style={{ backgroundColor: tokens.textSecondary }} />
                          <div className="w-8 h-2 rounded" style={{ backgroundColor: tokens.accent }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5 Base Swatches with EXACT HEX CODES displayed */}
                  <div className="space-y-1.5 mb-5">
                    <span className="text-[10px] font-bold uppercase tracking-wider block" style={{ color: 'var(--color-text-secondary)' }}>
                      Core Color Hex Specs
                    </span>

                    <div className="grid grid-cols-5 gap-1.5">
                      {/* Primary */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-full h-6 rounded border shadow-inner mb-1"
                          style={{ backgroundColor: tokens.primary, borderColor: 'rgba(0,0,0,0.1)' }}
                          title={`Primary: ${tokens.primary}`}
                        />
                        <span className="text-[9px] font-mono font-medium truncate w-full text-center" style={{ color: 'var(--color-text)' }}>
                          {tokens.primary}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter" style={{ color: 'var(--color-text-secondary)' }}>
                          Prim
                        </span>
                      </div>

                      {/* Secondary */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-full h-6 rounded border shadow-inner mb-1"
                          style={{ backgroundColor: tokens.secondary, borderColor: 'rgba(0,0,0,0.1)' }}
                          title={`Secondary: ${tokens.secondary}`}
                        />
                        <span className="text-[9px] font-mono font-medium truncate w-full text-center" style={{ color: 'var(--color-text)' }}>
                          {tokens.secondary}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter" style={{ color: 'var(--color-text-secondary)' }}>
                          Sec
                        </span>
                      </div>

                      {/* Accent */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-full h-6 rounded border shadow-inner mb-1"
                          style={{ backgroundColor: tokens.accent, borderColor: 'rgba(0,0,0,0.1)' }}
                          title={`Accent: ${tokens.accent}`}
                        />
                        <span className="text-[9px] font-mono font-medium truncate w-full text-center" style={{ color: 'var(--color-text)' }}>
                          {tokens.accent}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter" style={{ color: 'var(--color-text-secondary)' }}>
                          Acc
                        </span>
                      </div>

                      {/* Background */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-full h-6 rounded border shadow-inner mb-1"
                          style={{ backgroundColor: tokens.background, borderColor: 'rgba(0,0,0,0.15)' }}
                          title={`Background: ${tokens.background}`}
                        />
                        <span className="text-[9px] font-mono font-medium truncate w-full text-center" style={{ color: 'var(--color-text)' }}>
                          {tokens.background}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter" style={{ color: 'var(--color-text-secondary)' }}>
                          Bg
                        </span>
                      </div>

                      {/* Surface */}
                      <div className="flex flex-col items-center">
                        <div
                          className="w-full h-6 rounded border shadow-inner mb-1"
                          style={{ backgroundColor: tokens.surface, borderColor: 'rgba(0,0,0,0.15)' }}
                          title={`Surface: ${tokens.surface}`}
                        />
                        <span className="text-[9px] font-mono font-medium truncate w-full text-center" style={{ color: 'var(--color-text)' }}>
                          {tokens.surface}
                        </span>
                        <span className="text-[8px] uppercase tracking-tighter" style={{ color: 'var(--color-text-secondary)' }}>
                          Surf
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--color-border)' }}>
                  {isActive ? (
                    <button
                      disabled
                      className="flex-1 py-1.5 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-default transition-colors opacity-90"
                      style={{
                        backgroundColor: 'var(--color-background)',
                        color: 'var(--color-primary)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Current Active Theme</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => selectPalette(palette.id)}
                      className="flex-1 py-1.5 px-3 rounded-md text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]"
                      style={{ backgroundColor: 'var(--color-primary)' }}
                    >
                      Apply Palette
                    </button>
                  )}

                  {/* Preview Button */}
                  {!isActive && (
                    <button
                      onClick={() => setPreviewPalette(palette)}
                      className="py-1.5 px-2.5 rounded-md text-xs font-medium border transition-colors hover:opacity-85"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)',
                      }}
                      title="Preview this theme before applying"
                    >
                      Preview
                    </button>
                  )}

                  {/* Export action */}
                  <button
                    onClick={() => onExportPalette(palette)}
                    className="p-1.5 rounded-md border transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                    title="Export as CSS or JSON"
                    aria-label={`Export ${palette.name}`}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  {/* Edit in customizer */}
                  <button
                    onClick={() => onOpenCustomizer(palette)}
                    className="p-1.5 rounded-md border transition-colors hover:opacity-80"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text-secondary)',
                    }}
                    title="Open in Theme Editor"
                    aria-label={`Customize ${palette.name}`}
                  >
                    <Palette className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
