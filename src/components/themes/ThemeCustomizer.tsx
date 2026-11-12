import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { DesignTokens, ThemePalette } from '../../types/theme';
import {
  isValidHex,
  normalizeHex,
} from '../../config/palettes';
import {
  CSS_EXAMPLE_TEMPLATE,
  exportPaletteAsCss,
  exportPaletteAsJson,
  JSON_EXAMPLE_TEMPLATE,
  parseCssVariables,
  parseJsonPalette,
} from '../../utils/themeParser';
import {
  Check,
  AlertCircle,
  Eye,
  RotateCcw,
  Sparkles,
  FileCode,
  Save,
  CheckCircle2,
  Sliders,
  Code2,
} from 'lucide-react';

interface ThemeCustomizerProps {
  onSavePaletteRequest: (paletteDraft: { name: string; tokens: DesignTokens; id?: string }) => void;
  targetPalette?: ThemePalette;
}

type CustomizerTab = 'controls' | 'code';
type CodeFormat = 'css' | 'json';

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  onSavePaletteRequest,
  targetPalette,
}) => {
  const {
    activePalette,
    setPreviewPalette,
    applyPreview,
    cancelPreview,
    previewPalette,
    resetToDefault,
  } = useTheme();

  // Active tab: Individual Controls vs Code Editor
  const [activeTab, setActiveTab] = useState<CustomizerTab>('controls');
  const [codeFormat, setCodeFormat] = useState<CodeFormat>('css');

  // Draft tokens state
  const [draftTokens, setDraftTokens] = useState<DesignTokens>(() => {
    return targetPalette ? { ...targetPalette.tokens } : { ...activePalette.tokens };
  });

  const [draftName, setDraftName] = useState<string>(() => {
    return targetPalette ? `${targetPalette.name} (Custom)` : 'Custom Theme';
  });

  // Code editor text state
  const [codeContent, setCodeContent] = useState<string>('');
  const [codeValidationErrors, setCodeValidationErrors] = useState<string[]>([]);
  const [codeValidationSuccess, setCodeValidationSuccess] = useState<string | null>(null);

  // Sync draft when targetPalette changes
  useEffect(() => {
    if (targetPalette) {
      setDraftTokens({ ...targetPalette.tokens });
      setDraftName(targetPalette.isPreset ? `${targetPalette.name} (Custom)` : targetPalette.name);
      if (codeFormat === 'css') {
        setCodeContent(exportPaletteAsCss(targetPalette));
      } else {
        setCodeContent(exportPaletteAsJson(targetPalette));
      }
    }
  }, [targetPalette, codeFormat]);

  // Sync code editor content when tab changes or format changes
  useEffect(() => {
    if (activeTab === 'code' && !codeContent) {
      const palette: ThemePalette = {
        id: 'draft',
        name: draftName,
        isPreset: false,
        tokens: draftTokens,
      };
      if (codeFormat === 'css') {
        setCodeContent(exportPaletteAsCss(palette));
      } else {
        setCodeContent(exportPaletteAsJson(palette));
      }
    }
  }, [activeTab, codeFormat, draftName, draftTokens, codeContent]);

  // Method A: Update individual color token
  const handleTokenChange = (key: keyof DesignTokens, rawValue: string) => {
    setDraftTokens((prev) => {
      const updated = { ...prev, [key]: rawValue };
      // If primary updated and sidebar not explicitly customized, sync sidebar
      if (key === 'primary' && prev.sidebar === prev.primary) {
        updated.sidebar = rawValue;
      }
      return updated;
    });

    // If valid hex, trigger live preview draft
    if (isValidHex(rawValue)) {
      const norm = normalizeHex(rawValue);
      const updatedTokens = { ...draftTokens, [key]: norm };
      setPreviewPalette({
        id: 'custom-preview-draft',
        name: draftName,
        isPreset: false,
        tokens: updatedTokens,
      });
    }
  };

  // Method B & C: Validate and load code
  const handleValidateCode = (): boolean => {
    setCodeValidationErrors([]);
    setCodeValidationSuccess(null);

    if (codeFormat === 'css') {
      const result = parseCssVariables(codeContent);
      if (!result.isValid) {
        setCodeValidationErrors(result.errors);
        return false;
      }
      if (result.parsedTokens) {
        setDraftTokens(result.parsedTokens);
        setCodeValidationSuccess('CSS variables successfully validated!');
        return true;
      }
    } else {
      const result = parseJsonPalette(codeContent);
      if (!result.isValid) {
        setCodeValidationErrors(result.errors);
        return false;
      }
      if (result.parsedTokens) {
        setDraftTokens(result.parsedTokens);
        if (result.paletteName) setDraftName(result.paletteName);
        setCodeValidationSuccess('JSON palette schema successfully validated!');
        return true;
      }
    }
    return false;
  };

  const handlePreviewFromCode = () => {
    if (handleValidateCode()) {
      const parsedTokens = codeFormat === 'css'
        ? parseCssVariables(codeContent).parsedTokens!
        : parseJsonPalette(codeContent).parsedTokens!;

      setPreviewPalette({
        id: 'code-preview-draft',
        name: draftName,
        isPreset: false,
        tokens: parsedTokens,
      });
    }
  };

  const handleLoadExample = () => {
    if (codeFormat === 'css') {
      setCodeContent(CSS_EXAMPLE_TEMPLATE);
    } else {
      setCodeContent(JSON_EXAMPLE_TEMPLATE);
    }
    setCodeValidationErrors([]);
    setCodeValidationSuccess('Loaded reference template.');
  };

  const handleClearEditor = () => {
    setCodeContent('');
    setCodeValidationErrors([]);
    setCodeValidationSuccess(null);
  };

  const handleApplyToSchlar = () => {
    // If on code tab, validate first
    if (activeTab === 'code') {
      const ok = handleValidateCode();
      if (!ok) return;
    }
    // Commit the draft tokens
    const currentDraftPalette: ThemePalette = {
      id: 'active-custom',
      name: draftName,
      isPreset: false,
      tokens: draftTokens,
    };
    setPreviewPalette(currentDraftPalette);
    applyPreview();
  };

  const handleSavePaletteClick = () => {
    // Validate if on code tab
    if (activeTab === 'code') {
      const ok = handleValidateCode();
      if (!ok) return;
    }
    onSavePaletteRequest({
      name: draftName,
      tokens: draftTokens,
      id: targetPalette && !targetPalette.isPreset ? targetPalette.id : undefined,
    });
  };

  const isPreviewingCurrent = previewPalette !== null;

  return (
    <section id="customizer" className="py-12 sm:py-16 border-b transition-colors" style={{ borderColor: 'var(--color-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div
              className="text-xs font-semibold tracking-wider uppercase mb-1 transition-colors"
              style={{ color: 'var(--color-secondary)' }}
            >
              Interactive Theme Engine
            </div>
            <h2
              className="text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors"
              style={{ color: 'var(--color-text)' }}
            >
              Customize Your Theme
            </h2>
            <p
              className="text-sm sm:text-base font-normal mt-1 max-w-2xl transition-colors"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Tailor token definitions using individual visual pickers or by pasting CSS custom properties and JSON
              specifications. Changes update the live interactive preview below before permanent commitment.
            </p>
          </div>

          {/* Top Customizer Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleApplyToSchlar}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white shadow-sm transition-all hover:opacity-95 active:scale-[0.98]"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              <Check className="w-4 h-4" />
              <span>Apply to SCHLAR</span>
            </button>

            <button
              onClick={handleSavePaletteClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            >
              <Save className="w-4 h-4" style={{ color: 'var(--color-secondary)' }} />
              <span>Save Custom Palette</span>
            </button>

            {isPreviewingCurrent && (
              <button
                onClick={cancelPreview}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs font-medium border text-rose-600 transition-colors hover:bg-rose-50 dark:hover:bg-rose-950/30"
                style={{ borderColor: 'var(--color-border)' }}
              >
                Cancel Preview
              </button>
            )}

            <button
              onClick={resetToDefault}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium border transition-colors hover:opacity-80"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text-secondary)',
              }}
              title="Restore default Petrol & Copper palette"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>

        {/* Customizer Tabs & Inputs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customization Editors (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Tab Selection */}
            <div
              className="flex items-center justify-between p-1 rounded-lg border transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setActiveTab('controls')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'controls' ? 'font-bold shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 'controls' ? 'var(--color-background)' : 'transparent',
                    color: 'var(--color-text)',
                  }}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Method A: Individual Controls</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'code' ? 'font-bold shadow-sm' : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    backgroundColor: activeTab === 'code' ? 'var(--color-background)' : 'transparent',
                    color: 'var(--color-text)',
                  }}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Method B & C: CSS / JSON Code</span>
                </button>
              </div>

              {/* Theme Name Input */}
              <div className="hidden sm:flex items-center gap-2 px-2">
                <span className="text-[11px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Name:
                </span>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="px-2 py-0.5 text-xs font-semibold rounded border bg-transparent outline-none w-36"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                />
              </div>
            </div>

            {/* TAB 1: METHOD A - INDIVIDUAL CONTROLS */}
            {activeTab === 'controls' && (
              <div
                className="p-5 rounded-xl border transition-colors shadow-sm"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                <div className="mb-4">
                  <h4 className="text-sm font-bold tracking-tight mb-1" style={{ color: 'var(--color-text)' }}>
                    Design Token Color Fields
                  </h4>
                  <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    Pick or type exact 6-digit hex values. Controls immediately update the draft and live preview.
                  </p>
                </div>

                {/* Core Brand Tokens */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-secondary)' }}>
                      1. Core Brand Colors
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      <ColorControlField
                        label="Primary"
                        tokenKey="primary"
                        value={draftTokens.primary}
                        onChange={handleTokenChange}
                        desc="Wordmark, primary buttons, headers"
                      />
                      <ColorControlField
                        label="Secondary"
                        tokenKey="secondary"
                        value={draftTokens.secondary}
                        onChange={handleTokenChange}
                        desc="Secondary links, focus rings, badges"
                      />
                      <ColorControlField
                        label="Accent"
                        tokenKey="accent"
                        value={draftTokens.accent}
                        onChange={handleTokenChange}
                        desc="Key highlights, indicators, notices"
                      />
                      <ColorControlField
                        label="Background"
                        tokenKey="background"
                        value={draftTokens.background}
                        onChange={handleTokenChange}
                        desc="Main page backdrop"
                      />
                      <ColorControlField
                        label="Surface"
                        tokenKey="surface"
                        value={draftTokens.surface}
                        onChange={handleTokenChange}
                        desc="Cards, modals, navigation containers"
                      />
                      <ColorControlField
                        label="Sidebar"
                        tokenKey="sidebar"
                        value={draftTokens.sidebar}
                        onChange={handleTokenChange}
                        desc="Application workspace sidebar"
                      />
                    </div>
                  </div>

                  {/* Neutral & Structural Tokens */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-secondary)' }}>
                      2. Structural & Typography
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <ColorControlField
                        label="Text Primary"
                        tokenKey="text"
                        value={draftTokens.text}
                        onChange={handleTokenChange}
                        desc="Headings, primary body prose"
                      />
                      <ColorControlField
                        label="Text Secondary"
                        tokenKey="textSecondary"
                        value={draftTokens.textSecondary}
                        onChange={handleTokenChange}
                        desc="Captions, metadata, muted labels"
                      />
                      <ColorControlField
                        label="Border"
                        tokenKey="border"
                        value={draftTokens.border}
                        onChange={handleTokenChange}
                        desc="Hairline boundaries, dividers"
                      />
                    </div>
                  </div>

                  {/* Semantic Tokens */}
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block mb-2" style={{ color: 'var(--color-secondary)' }}>
                      3. Semantic Status Signals
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                      <ColorControlField
                        label="Success"
                        tokenKey="success"
                        value={draftTokens.success}
                        onChange={handleTokenChange}
                        desc="Completed, nominal, paid"
                      />
                      <ColorControlField
                        label="Warning"
                        tokenKey="warning"
                        value={draftTokens.warning}
                        onChange={handleTokenChange}
                        desc="Due soon, caution, attention"
                      />
                      <ColorControlField
                        label="Error"
                        tokenKey="error"
                        value={draftTokens.error}
                        onChange={handleTokenChange}
                        desc="Overdue, critical alerts"
                      />
                      <ColorControlField
                        label="Info"
                        tokenKey="info"
                        value={draftTokens.info}
                        onChange={handleTokenChange}
                        desc="System notices, circulars"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: METHOD B & C - CODE EDITOR */}
            {activeTab === 'code' && (
              <div
                className="p-5 rounded-xl border transition-colors shadow-sm"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-border)',
                }}
              >
                {/* Editor Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b mb-3" style={{ borderColor: 'var(--color-border)' }}>
                  {/* Format Selector */}
                  <div className="flex items-center gap-1 p-0.5 rounded border" style={{ borderColor: 'var(--color-border)' }}>
                    <button
                      onClick={() => {
                        setCodeFormat('css');
                        const p: ThemePalette = { id: 'd', name: draftName, isPreset: false, tokens: draftTokens };
                        setCodeContent(exportPaletteAsCss(p));
                        setCodeValidationErrors([]);
                        setCodeValidationSuccess(null);
                      }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded ${
                        codeFormat === 'css' ? 'bg-black/10 dark:bg-white/10' : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{ color: 'var(--color-text)' }}
                    >
                      CSS Variables
                    </button>
                    <button
                      onClick={() => {
                        setCodeFormat('json');
                        const p: ThemePalette = { id: 'd', name: draftName, isPreset: false, tokens: draftTokens };
                        setCodeContent(exportPaletteAsJson(p));
                        setCodeValidationErrors([]);
                        setCodeValidationSuccess(null);
                      }}
                      className={`px-2.5 py-1 text-xs font-semibold rounded ${
                        codeFormat === 'json' ? 'bg-black/10 dark:bg-white/10' : 'opacity-60 hover:opacity-100'
                      }`}
                      style={{ color: 'var(--color-text)' }}
                    >
                      JSON Palette
                    </button>
                  </div>

                  {/* Code Editor Utility Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleLoadExample}
                      className="px-2 py-1 text-xs rounded border hover:opacity-85 transition-opacity"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      Load Example
                    </button>
                    <button
                      onClick={handleClearEditor}
                      className="px-2 py-1 text-xs rounded border hover:opacity-85 transition-opacity"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                    >
                      Clear Editor
                    </button>
                    <button
                      onClick={handleValidateCode}
                      className="px-2.5 py-1 text-xs font-semibold rounded text-white transition-opacity hover:opacity-90"
                      style={{ backgroundColor: 'var(--color-secondary)' }}
                    >
                      Validate
                    </button>
                    <button
                      onClick={handlePreviewFromCode}
                      className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border transition-opacity hover:opacity-90"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-primary)' }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>

                {/* Validation Feedback Messages */}
                {codeValidationErrors.length > 0 && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs mb-3 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Validation Errors ({codeValidationErrors.length}):</span>
                    </div>
                    <ul className="list-disc pl-5 space-y-0.5">
                      {codeValidationErrors.map((err, i) => (
                        <li key={i}>{err}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {codeValidationSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs mb-3 flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{codeValidationSuccess}</span>
                  </div>
                )}

                {/* Textarea Code Input */}
                <textarea
                  value={codeContent}
                  onChange={(e) => {
                    setCodeContent(e.target.value);
                    setCodeValidationErrors([]);
                    setCodeValidationSuccess(null);
                  }}
                  rows={15}
                  spellCheck={false}
                  aria-label="Code Editor for Theme Customization"
                  className="w-full font-mono text-xs p-3 rounded-lg border outline-none focus:ring-2 resize-y transition-colors leading-relaxed"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)',
                  }}
                  placeholder={codeFormat === 'css' ? ':root {\n  --color-primary: #123456;\n  ...\n}' : '{\n  "name": "My Palette",\n  ...\n}'}
                />

                <div className="mt-2 text-[11px] flex items-center justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                  <span>Pasted input is validated strictly against color specifications (no arbitrary scripts executed).</span>
                  <span className="font-mono">{codeContent.length} chars</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Live Interface Mockup (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            <div
              className="p-5 rounded-xl border transition-colors shadow-sm"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--color-text)' }}>
                    Live SCHLAR Component Preview
                  </span>
                </div>

                {isPreviewingCurrent ? (
                  <span
                    className="flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
                    style={{ backgroundColor: 'var(--color-accent)', color: '#FFFFFF' }}
                  >
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Draft Active</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                    Real-time Tokens
                  </span>
                )}
              </div>

              {/* Realistic Miniature SCHLAR Interface */}
              <div
                className="rounded-lg border overflow-hidden p-3 transition-colors flex flex-col gap-3 text-xs"
                style={{
                  backgroundColor: draftTokens.background,
                  borderColor: draftTokens.border,
                  color: draftTokens.text,
                }}
              >
                {/* 1. Header Bar */}
                <div
                  className="p-2.5 rounded-md border flex items-center justify-between transition-colors"
                  style={{
                    backgroundColor: draftTokens.surface,
                    borderColor: draftTokens.border,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] text-white"
                      style={{ backgroundColor: draftTokens.primary }}
                    >
                      S
                    </div>
                    <span className="font-extrabold tracking-wider text-[11px] uppercase" style={{ color: draftTokens.primary }}>
                      SCHLAR
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium" style={{ color: draftTokens.textSecondary }}>
                      Term 1
                    </span>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: draftTokens.accent }} />
                  </div>
                </div>

                {/* 2. Mini Sidebar & Main Content Split */}
                <div className="flex gap-2">
                  {/* Sidebar mockup */}
                  <div
                    className="w-24 rounded-md p-2 flex flex-col gap-1.5 shrink-0 transition-colors"
                    style={{ backgroundColor: draftTokens.sidebar, color: draftTokens.sidebarText }}
                  >
                    <div className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                      Workspace
                    </div>
                    <div className="p-1 rounded text-[10px] font-semibold bg-white/15">
                      Overview
                    </div>
                    <div className="p-1 rounded text-[10px] opacity-75 hover:opacity-100">
                      Attendance
                    </div>
                    <div className="p-1 rounded text-[10px] opacity-75 hover:opacity-100">
                      Gradebook
                    </div>
                  </div>

                  {/* Main content viewport */}
                  <div className="flex-1 flex flex-col gap-2 min-w-0">
                    {/* Dashboard Metric Card */}
                    <div
                      className="p-2.5 rounded-md border flex items-center justify-between transition-colors"
                      style={{
                        backgroundColor: draftTokens.surface,
                        borderColor: draftTokens.border,
                      }}
                    >
                      <div>
                        <div className="text-[10px] font-medium" style={{ color: draftTokens.textSecondary }}>
                          Daily Attendance
                        </div>
                        <div className="text-base font-extrabold font-mono tabular-nums" style={{ color: draftTokens.primary }}>
                          98.4%
                        </div>
                      </div>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: draftTokens.success }}
                      >
                        Nominal
                      </span>
                    </div>

                    {/* Interactive Form Field Simulation */}
                    <div
                      className="p-2.5 rounded-md border transition-colors"
                      style={{
                        backgroundColor: draftTokens.surface,
                        borderColor: draftTokens.border,
                      }}
                    >
                      <label className="text-[10px] font-semibold block mb-1" style={{ color: draftTokens.text }}>
                        Quick Student Search
                      </label>
                      <div
                        className="p-1.5 rounded border text-[11px] flex items-center justify-between"
                        style={{
                          backgroundColor: draftTokens.background,
                          borderColor: draftTokens.focusRing,
                        }}
                      >
                        <span style={{ color: draftTokens.text }}>Liam Montgomery (Gr 10)</span>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: draftTokens.secondary }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Table Header & Status Badges */}
                <div
                  className="rounded-md border overflow-hidden transition-colors"
                  style={{
                    backgroundColor: draftTokens.surface,
                    borderColor: draftTokens.border,
                  }}
                >
                  <div
                    className="p-2 border-b flex items-center justify-between text-[10px] font-bold uppercase tracking-wider"
                    style={{
                      backgroundColor: draftTokens.background,
                      borderColor: draftTokens.border,
                      color: draftTokens.textSecondary,
                    }}
                  >
                    <span>Academic Audit Status</span>
                    <span>Action</span>
                  </div>

                  <div className="p-2 flex items-center justify-between text-[11px] border-b" style={{ borderColor: draftTokens.border }}>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: draftTokens.success }} />
                      <span>Term Examination Schedule</span>
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: draftTokens.success }}>Verified</span>
                  </div>

                  <div className="p-2 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: draftTokens.warning }} />
                      <span>Pending Fee Reconciliations</span>
                    </div>
                    <span className="text-[10px] font-semibold" style={{ color: draftTokens.warning }}>Review (3)</span>
                  </div>
                </div>

                {/* 4. Action Buttons Simulation */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    className="flex-1 py-1 px-2 rounded text-[11px] font-bold text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: draftTokens.primary }}
                  >
                    Primary Action
                  </button>
                  <button
                    className="flex-1 py-1 px-2 rounded text-[11px] font-medium border transition-opacity hover:opacity-90"
                    style={{
                      backgroundColor: draftTokens.surface,
                      borderColor: draftTokens.border,
                      color: draftTokens.text,
                    }}
                  >
                    Secondary
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Reusable individual color token field
interface ColorControlFieldProps {
  label: string;
  tokenKey: keyof DesignTokens;
  value: string;
  desc?: string;
  onChange: (key: keyof DesignTokens, value: string) => void;
}

const ColorControlField: React.FC<ColorControlFieldProps> = ({
  label,
  tokenKey,
  value,
  desc,
  onChange,
}) => {
  const [localVal, setLocalVal] = useState(value);

  useEffect(() => {
    setLocalVal(value);
  }, [value]);

  const handleInputChange = (newVal: string) => {
    setLocalVal(newVal);
    if (isValidHex(newVal)) {
      onChange(tokenKey, newVal);
    }
  };

  const handlePickerChange = (newVal: string) => {
    setLocalVal(newVal.toUpperCase());
    onChange(tokenKey, newVal.toUpperCase());
  };

  const valid = isValidHex(localVal);

  return (
    <div
      className="p-2.5 rounded-lg border flex flex-col justify-between transition-colors"
      style={{
        backgroundColor: 'var(--color-background)',
        borderColor: valid ? 'var(--color-border)' : 'var(--color-error)',
      }}
    >
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="text-xs font-semibold truncate" style={{ color: 'var(--color-text)' }}>
          {label}
        </span>
        {/* Native color picker */}
        <input
          type="color"
          value={valid ? normalizeHex(localVal) : '#000000'}
          onChange={(e) => handlePickerChange(e.target.value)}
          aria-label={`Color picker for ${label}`}
          className="w-5 h-5 rounded cursor-pointer border-none bg-transparent p-0"
        />
      </div>

      <div className="flex items-center gap-1.5">
        <div
          className="w-4 h-4 rounded border shrink-0 shadow-sm"
          style={{
            backgroundColor: valid ? normalizeHex(localVal) : 'transparent',
            borderColor: 'rgba(0,0,0,0.15)',
          }}
        />
        <input
          type="text"
          value={localVal}
          onChange={(e) => handleInputChange(e.target.value)}
          aria-label={`Hex color input for ${label}`}
          className="w-full font-mono text-[11px] uppercase bg-transparent outline-none tracking-tight font-medium"
          style={{ color: valid ? 'var(--color-text)' : 'var(--color-error)' }}
          maxLength={7}
        />
      </div>

      {desc && (
        <span className="text-[10px] leading-tight mt-1 truncate" style={{ color: 'var(--color-text-secondary)' }}>
          {desc}
        </span>
      )}
    </div>
  );
};
