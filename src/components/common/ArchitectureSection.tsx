import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { exportPaletteAsCss, exportPaletteAsJson } from '../../utils/themeParser';
import { Check, Copy, Code, Layers, Shield, Sparkles } from 'lucide-react';

export const ArchitectureSection: React.FC = () => {
  const { activePalette } = useTheme();
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const handleCopy = (format: 'css' | 'json') => {
    const text = format === 'css' ? exportPaletteAsCss(activePalette) : exportPaletteAsJson(activePalette);
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <section id="architecture" className="py-12 sm:py-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div
            className="text-xs font-semibold tracking-wider uppercase mb-1 transition-colors"
            style={{ color: 'var(--color-secondary)' }}
          >
            System Foundation & Token Architecture
          </div>
          <h2
            className="text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors"
            style={{ color: 'var(--color-text)' }}
          >
            Design Tokens & Global Architecture
          </h2>
          <p
            className="text-sm sm:text-base font-normal mt-1 max-w-2xl transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Every component in SCHLAR binds directly to CSS custom properties defined on the document root.
            Inspecting the active tokens below illustrates how the design system propagates consistently.
          </p>
        </div>

        {/* 3 Technical Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            className="p-5 rounded-xl border transition-colors shadow-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                10 Isolated Role Workspaces
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Centralized role configurations with zero duplicate naming. Admins and Vice Principals have separate
              operational jurisdictions. Strict prohibition of student or super-admin role drift.
            </p>
          </div>

          <div
            className="p-5 rounded-xl border transition-colors shadow-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                12 Calibrated Color Palettes
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Built with exact hexadecimal specifications. Palette 7 (Petrol & Copper) is initialized as the primary default.
              All palettes adhere strictly to WCAG AA contrast standards and 60-30-10 color discipline.
            </p>
          </div>

          <div
            className="p-5 rounded-xl border transition-colors shadow-sm"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5" style={{ color: 'var(--color-accent)' }} />
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Persistent Custom Token Engine
              </h3>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
              Users can import, export, duplicate, rename, and edit custom CSS variables and JSON schemas stored
              in localStorage. Safe input sanitation strictly rejects malicious injections.
            </p>
          </div>
        </div>

        {/* Active CSS Variables Inspector Table */}
        <div
          className="rounded-xl border transition-colors shadow-sm overflow-hidden"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
          }}
        >
          <div
            className="p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            style={{ borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
              <h3 className="text-sm font-bold" style={{ color: 'var(--color-text)' }}>
                Active Document Root Tokens ({activePalette.name})
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopy('css')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded border transition-colors hover:opacity-85"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {copiedFormat === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'css' ? 'Copied CSS!' : 'Copy CSS Tokens'}</span>
              </button>

              <button
                onClick={() => handleCopy('json')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded border transition-colors hover:opacity-85"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                {copiedFormat === 'json' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFormat === 'json' ? 'Copied JSON!' : 'Copy JSON Tokens'}</span>
              </button>
            </div>
          </div>

          <div className="p-4 overflow-x-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {Object.entries(activePalette.tokens).map(([key, val]) => {
                if (!val || typeof val !== 'string') return null;
                return (
                  <div
                    key={key}
                    className="p-2 rounded border flex items-center justify-between gap-2"
                    style={{
                      backgroundColor: 'var(--color-background)',
                      borderColor: 'var(--color-border)',
                    }}
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider block truncate" style={{ color: 'var(--color-text-secondary)' }}>
                        {key}
                      </span>
                      <span className="font-mono text-xs font-semibold tabular-nums truncate block" style={{ color: 'var(--color-text)' }}>
                        {val}
                      </span>
                    </div>
                    <div
                      className="w-5 h-5 rounded border shrink-0 shadow-xs"
                      style={{
                        backgroundColor: val.startsWith('#') || val.startsWith('rgba') ? val : '#ccc',
                        borderColor: 'rgba(0,0,0,0.15)',
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
