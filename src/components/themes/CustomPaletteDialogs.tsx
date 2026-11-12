import React, { useState } from 'react';
import { DesignTokens, ThemePalette } from '../../types/theme';
import { exportPaletteAsCss, exportPaletteAsJson, parseCssVariables, parseJsonPalette } from '../../utils/themeParser';
import {
  X,
  Copy,
  Check,
  AlertTriangle,
  Upload,
  Download,
  Save,
  CheckCircle2,
} from 'lucide-react';

// 1. SAVE PALETTE DIALOG
interface SavePaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: { name: string; tokens: DesignTokens; id?: string } | null;
  existingCustomPalettes: ThemePalette[];
  onConfirmSave: (name: string, tokens: DesignTokens, overwriteId?: string) => void;
}

export const SavePaletteModal: React.FC<SavePaletteModalProps> = ({
  isOpen,
  onClose,
  draft,
  existingCustomPalettes,
  onConfirmSave,
}) => {
  if (!isOpen || !draft) return null;

  const [name, setName] = useState(draft.name || 'My SCHLAR Palette');
  const [overwriteId, setOverwriteId] = useState<string | undefined>(draft.id);

  // Check if name conflicts with an existing custom palette
  const conflictingPalette = existingCustomPalettes.find(
    (p) => p.name.trim().toLowerCase() === name.trim().toLowerCase() && p.id !== draft.id
  );

  const handleSave = () => {
    if (!name.trim()) return;
    onConfirmSave(name.trim(), draft.tokens, overwriteId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-xl border p-6 shadow-xl transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <Save className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Save Custom Palette
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:opacity-75" aria-label="Close dialog">
            <X className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text)' }}>
              Palette Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Amber & Slate, Crimson Minimal"
              className="w-full px-3 py-2 text-sm rounded-lg border outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              autoFocus
            />
          </div>

          {conflictingPalette && (
            <div className="p-3 rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>A palette named "{name}" already exists</span>
              </div>
              <p>Would you like to overwrite your existing custom palette, or use a distinct name?</p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOverwriteId(conflictingPalette.id)}
                  className={`px-2 py-1 rounded text-xs font-semibold border ${
                    overwriteId === conflictingPalette.id
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'border-amber-300 dark:border-amber-800'
                  }`}
                >
                  Overwrite "{conflictingPalette.name}"
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOverwriteId(undefined);
                    setName(`${name} (New)`);
                  }}
                  className="px-2 py-1 rounded text-xs font-medium border border-amber-300 dark:border-amber-800"
                >
                  Create New Duplicate
                </button>
              </div>
            </div>
          )}

          <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border hover:opacity-85"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-opacity hover:opacity-95 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Save Palette
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. EXPORT PALETTE MODAL
interface ExportPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: ThemePalette | null;
}

export const ExportPaletteModal: React.FC<ExportPaletteModalProps> = ({
  isOpen,
  onClose,
  palette,
}) => {
  if (!isOpen || !palette) return null;

  const [format, setFormat] = useState<'css' | 'json'>('css');
  const [copied, setCopied] = useState(false);

  const exportedText =
    format === 'css' ? exportPaletteAsCss(palette) : exportPaletteAsJson(palette);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg rounded-xl border p-6 shadow-xl transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <div>
              <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
                Export: {palette.name}
              </h3>
              <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
                Export specifications as CSS custom properties or JSON
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:opacity-75" aria-label="Close dialog">
            <X className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Format selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
              Format:
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded border" style={{ borderColor: 'var(--color-border)' }}>
              <button
                onClick={() => setFormat('css')}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  format === 'css' ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                CSS Variables
              </button>
              <button
                onClick={() => setFormat('json')}
                className={`px-3 py-1 text-xs font-semibold rounded ${
                  format === 'json' ? 'bg-black/10 dark:bg-white/10' : 'opacity-60'
                }`}
                style={{ color: 'var(--color-text)' }}
              >
                JSON Object
              </button>
            </div>
          </div>

          {/* Export text view */}
          <textarea
            readOnly
            value={exportedText}
            rows={12}
            className="w-full font-mono text-xs p-3 rounded-lg border outline-none resize-none leading-relaxed"
            style={{
              backgroundColor: 'var(--color-background)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
            }}
          />

          <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <span className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>
              Ready for use in production stylesheets or SCHLAR config.
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-medium rounded-lg border hover:opacity-85"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Close
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm transition-opacity hover:opacity-95"
                style={{ backgroundColor: 'var(--color-primary)' }}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Code'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 3. IMPORT PALETTE MODAL
interface ImportPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (palette: ThemePalette) => void;
}

export const ImportPaletteModal: React.FC<ImportPaletteModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState('');
  const [name, setName] = useState('Imported Palette');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImport = () => {
    setErrorMsg(null);
    if (!rawText.trim()) {
      setErrorMsg('Please paste CSS variables or a JSON palette object.');
      return;
    }

    // Try JSON first if starts with {
    if (rawText.trim().startsWith('{')) {
      const jsonRes = parseJsonPalette(rawText);
      if (jsonRes.isValid && jsonRes.parsedTokens) {
        onImportSuccess({
          id: `custom-import-${Date.now()}`,
          name: jsonRes.paletteName || name || 'Imported Palette',
          isPreset: false,
          tokens: jsonRes.parsedTokens,
          createdAt: Date.now(),
        });
        onClose();
        return;
      }
      setErrorMsg(jsonRes.errors.join(' '));
      return;
    }

    // Otherwise try CSS
    const cssRes = parseCssVariables(rawText);
    if (cssRes.isValid && cssRes.parsedTokens) {
      onImportSuccess({
        id: `custom-import-${Date.now()}`,
        name: name.trim() || 'Imported Palette',
        isPreset: false,
        tokens: cssRes.parsedTokens,
        createdAt: Date.now(),
      });
      onClose();
      return;
    }

    setErrorMsg(cssRes.errors.join(' '));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-xl border p-6 shadow-xl transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
              Import Palette
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:opacity-75" aria-label="Close dialog">
            <X className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
              Palette Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border outline-none"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1" style={{ color: 'var(--color-text)' }}>
              Paste CSS Variables or JSON
            </label>
            <textarea
              value={rawText}
              onChange={(e) => {
                setRawText(e.target.value);
                setErrorMsg(null);
              }}
              rows={8}
              placeholder=":root { --color-primary: #123456; ... } OR { &quot;primary&quot;: &quot;#123456&quot;, ... }"
              className="w-full font-mono text-xs p-3 rounded-lg border outline-none resize-none leading-relaxed"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium rounded-lg border hover:opacity-85"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm transition-opacity hover:opacity-95"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Validate & Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 4. RENAME PALETTE MODAL
interface RenamePaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: ThemePalette | null;
  onConfirmRename: (id: string, newName: string) => void;
}

export const RenamePaletteModal: React.FC<RenamePaletteModalProps> = ({
  isOpen,
  onClose,
  palette,
  onConfirmRename,
}) => {
  if (!isOpen || !palette) return null;

  const [newName, setNewName] = useState(palette.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onConfirmRename(palette.id, newName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border p-6 shadow-xl transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center justify-between pb-3 border-b mb-4" style={{ borderColor: 'var(--color-border)' }}>
          <h3 className="text-base font-bold" style={{ color: 'var(--color-text)' }}>
            Rename Palette
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded hover:opacity-75">
            <X className="w-4 h-4" style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold block mb-1.5" style={{ color: 'var(--color-text)' }}>
              New Name
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border outline-none focus:ring-2"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                color: 'var(--color-text)',
              }}
              autoFocus
            />
          </div>

          <div className="pt-3 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg border hover:opacity-85"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newName.trim()}
              className="px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm transition-opacity hover:opacity-95 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Update Name
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

// 5. DELETE CONFIRMATION MODAL
interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: ThemePalette | null;
  onConfirmDelete: (id: string) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  palette,
  onConfirmDelete,
}) => {
  if (!isOpen || !palette) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm rounded-xl border p-6 shadow-xl transition-colors"
        style={{
          backgroundColor: 'var(--color-surface)',
          borderColor: 'var(--color-border)',
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-rose-600 dark:text-rose-400">
              Delete Custom Palette?
            </h3>
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Are you sure you want to delete "{palette.name}"? This action cannot be undone.
            </span>
          </div>
        </div>

        <div className="pt-4 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--color-border)' }}>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg border hover:opacity-85"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmDelete(palette.id);
              onClose();
            }}
            className="px-4 py-1.5 text-xs font-bold text-white rounded-lg bg-rose-600 hover:bg-rose-700 shadow-sm"
          >
            Yes, Delete Palette
          </button>
        </div>
      </div>
    </div>
  );
};
