import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AppearanceMode, DesignTokens, ThemePalette } from '../types/theme';
import {
  DEFAULT_PALETTE_ID,
  deriveDarkTokens,
  PRESET_PALETTES,
} from '../config/palettes';

interface ThemeContextValue {
  activePaletteId: string;
  activePalette: ThemePalette;
  effectiveTokens: DesignTokens;
  previewPalette: ThemePalette | null;
  isPreviewActive: boolean;
  appearance: AppearanceMode;
  effectiveAppearance: 'light' | 'dark';
  allPalettes: ThemePalette[];
  presetPalettes: ThemePalette[];
  customPalettes: ThemePalette[];
  selectPalette: (paletteId: string) => void;
  setPreviewPalette: (palette: ThemePalette | null) => void;
  applyPreview: () => void;
  cancelPreview: () => void;
  saveCustomPalette: (name: string, tokens: DesignTokens, overwriteId?: string) => { success: boolean; id: string; error?: string };
  renameCustomPalette: (id: string, newName: string) => { success: boolean; error?: string };
  duplicateCustomPalette: (id: string) => { success: boolean; newId?: string; error?: string };
  deleteCustomPalette: (id: string) => { success: boolean; error?: string };
  resetToDefault: () => void;
  setAppearance: (mode: AppearanceMode) => void;
}

const STORAGE_KEY_PALETTE_ID = 'schlar_active_palette_id';
const STORAGE_KEY_CUSTOM_PALETTES = 'schlar_custom_palettes';
const STORAGE_KEY_APPEARANCE = 'schlar_appearance_mode';

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load custom palettes from localStorage
  const [customPalettes, setCustomPalettes] = useState<ThemePalette[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_PALETTES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter((p) => p && typeof p.id === 'string' && !p.isPreset);
        }
      }
    } catch (e) {
      console.warn('Failed to load custom palettes from localStorage:', e);
    }
    return [];
  });

  // Combined palette list
  const allPalettes = useMemo(() => {
    return [...PRESET_PALETTES, ...customPalettes];
  }, [customPalettes]);

  // Load active palette ID from localStorage
  const [activePaletteId, setActivePaletteId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PALETTE_ID);
      if (stored) {
        return stored;
      }
    } catch (e) {
      console.warn('Failed to load active palette ID:', e);
    }
    return DEFAULT_PALETTE_ID;
  });

  // Appearance mode: light | dark | system
  const [appearance, setAppearanceModeState] = useState<AppearanceMode>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_APPEARANCE);
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        return stored;
      }
    } catch (e) {
      console.warn('Failed to load appearance preference:', e);
    }
    return 'light';
  });

  // System dark mode watcher
  const [systemIsDark, setSystemIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const effectiveAppearance: 'light' | 'dark' = useMemo(() => {
    if (appearance === 'system') {
      return systemIsDark ? 'dark' : 'light';
    }
    return appearance;
  }, [appearance, systemIsDark]);

  // Preview palette draft state
  const [previewPalette, setPreviewPalette] = useState<ThemePalette | null>(null);

  // Active palette resolver with fallback
  const activePalette = useMemo(() => {
    const found = allPalettes.find((p) => p.id === activePaletteId);
    if (found) return found;
    // Fallback to Petrol & Copper preset
    const defaultFound = PRESET_PALETTES.find((p) => p.id === DEFAULT_PALETTE_ID);
    return defaultFound || PRESET_PALETTES[0];
  }, [allPalettes, activePaletteId]);

  // Palette currently being shown (preview takes precedence)
  const currentDisplayedPalette = previewPalette || activePalette;

  // Effective tokens considering appearance (light vs dark)
  const effectiveTokens = useMemo(() => {
    const baseTokens = currentDisplayedPalette.tokens;
    if (effectiveAppearance === 'dark') {
      return deriveDarkTokens(baseTokens);
    }
    return baseTokens;
  }, [currentDisplayedPalette, effectiveAppearance]);

  // Sync tokens to CSS Variables on document root
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Apply tokens
    root.style.setProperty('--color-primary', effectiveTokens.primary);
    root.style.setProperty('--color-secondary', effectiveTokens.secondary);
    root.style.setProperty('--color-accent', effectiveTokens.accent);
    root.style.setProperty('--color-background', effectiveTokens.background);
    root.style.setProperty('--color-surface', effectiveTokens.surface);
    root.style.setProperty('--color-text', effectiveTokens.text);
    root.style.setProperty('--color-text-secondary', effectiveTokens.textSecondary);
    root.style.setProperty('--color-border', effectiveTokens.border);
    root.style.setProperty('--color-success', effectiveTokens.success);
    root.style.setProperty('--color-warning', effectiveTokens.warning);
    root.style.setProperty('--color-error', effectiveTokens.error);
    root.style.setProperty('--color-info', effectiveTokens.info);
    root.style.setProperty('--color-sidebar', effectiveTokens.sidebar);
    root.style.setProperty('--color-sidebar-text', effectiveTokens.sidebarText);
    root.style.setProperty('--color-focus-ring', effectiveTokens.focusRing);
    root.style.setProperty('--color-table-header', effectiveTokens.tableHeader || (effectiveAppearance === 'dark' ? '#1A2436' : '#F8FAFC'));
    root.style.setProperty('--color-input-bg', effectiveTokens.inputBg || (effectiveAppearance === 'dark' ? '#111827' : '#FFFFFF'));

    // Dark class toggle
    if (effectiveAppearance === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [effectiveTokens, effectiveAppearance]);

  // Actions
  const selectPalette = (paletteId: string) => {
    const target = allPalettes.find((p) => p.id === paletteId);
    if (!target) return;
    setActivePaletteId(paletteId);
    setPreviewPalette(null);
    try {
      localStorage.setItem(STORAGE_KEY_PALETTE_ID, paletteId);
    } catch (e) {
      console.warn('Failed to persist active palette:', e);
    }
  };

  const applyPreview = () => {
    if (!previewPalette) return;
    // If previewing an existing palette
    const existing = allPalettes.find((p) => p.id === previewPalette.id);
    if (existing) {
      selectPalette(existing.id);
    } else {
      // It's a new or modified custom palette, save and apply
      const saved = saveCustomPalette(previewPalette.name, previewPalette.tokens, previewPalette.id);
      if (saved.success) {
        selectPalette(saved.id);
      }
    }
    setPreviewPalette(null);
  };

  const cancelPreview = () => {
    setPreviewPalette(null);
  };

  const saveCustomPalette = (name: string, tokens: DesignTokens, overwriteId?: string) => {
    const trimmedName = name.trim() || 'Custom Palette';

    // Prevent overwriting preset IDs
    if (overwriteId && PRESET_PALETTES.some((p) => p.id === overwriteId)) {
      return { success: false, id: '', error: 'Cannot overwrite built-in preset palettes.' };
    }

    const id = overwriteId || `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newPalette: ThemePalette = {
      id,
      name: trimmedName,
      isPreset: false,
      tokens,
      updatedAt: Date.now(),
      createdAt: overwriteId ? (customPalettes.find((p) => p.id === overwriteId)?.createdAt || Date.now()) : Date.now(),
    };

    const nextCustoms = overwriteId
      ? customPalettes.map((p) => (p.id === overwriteId ? newPalette : p))
      : [...customPalettes, newPalette];

    setCustomPalettes(nextCustoms);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PALETTES, JSON.stringify(nextCustoms));
    } catch (e) {
      console.warn('Failed to persist custom palette:', e);
    }

    return { success: true, id };
  };

  const renameCustomPalette = (id: string, newName: string) => {
    if (PRESET_PALETTES.some((p) => p.id === id)) {
      return { success: false, error: 'Cannot rename built-in preset palettes.' };
    }
    const trimmed = newName.trim();
    if (!trimmed) {
      return { success: false, error: 'Palette name cannot be empty.' };
    }
    const nextCustoms = customPalettes.map((p) => (p.id === id ? { ...p, name: trimmed, updatedAt: Date.now() } : p));
    setCustomPalettes(nextCustoms);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PALETTES, JSON.stringify(nextCustoms));
    } catch (e) {
      console.warn('Failed to persist renamed custom palette:', e);
    }
    return { success: true };
  };

  const duplicateCustomPalette = (id: string) => {
    const source = allPalettes.find((p) => p.id === id);
    if (!source) return { success: false, error: 'Palette not found.' };

    const newId = `custom-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const duplicated: ThemePalette = {
      id: newId,
      name: `${source.name} (Copy)`,
      isPreset: false,
      tokens: { ...source.tokens },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const nextCustoms = [...customPalettes, duplicated];
    setCustomPalettes(nextCustoms);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PALETTES, JSON.stringify(nextCustoms));
    } catch (e) {
      console.warn('Failed to persist duplicated palette:', e);
    }
    return { success: true, newId };
  };

  const deleteCustomPalette = (id: string) => {
    if (PRESET_PALETTES.some((p) => p.id === id)) {
      return { success: false, error: 'Preset palettes cannot be deleted.' };
    }

    const nextCustoms = customPalettes.filter((p) => p.id !== id);
    setCustomPalettes(nextCustoms);
    try {
      localStorage.setItem(STORAGE_KEY_CUSTOM_PALETTES, JSON.stringify(nextCustoms));
    } catch (e) {
      console.warn('Failed to persist deletion:', e);
    }

    // If active palette was deleted, fallback to default
    if (activePaletteId === id) {
      selectPalette(DEFAULT_PALETTE_ID);
    }
    if (previewPalette?.id === id) {
      setPreviewPalette(null);
    }

    return { success: true };
  };

  const resetToDefault = () => {
    selectPalette(DEFAULT_PALETTE_ID);
    setPreviewPalette(null);
  };

  const setAppearance = (mode: AppearanceMode) => {
    setAppearanceModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY_APPEARANCE, mode);
    } catch (e) {
      console.warn('Failed to persist appearance:', e);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        activePaletteId,
        activePalette,
        effectiveTokens,
        previewPalette,
        isPreviewActive: previewPalette !== null,
        appearance,
        effectiveAppearance,
        allPalettes,
        presetPalettes: PRESET_PALETTES,
        customPalettes,
        selectPalette,
        setPreviewPalette,
        applyPreview,
        cancelPreview,
        saveCustomPalette,
        renameCustomPalette,
        duplicateCustomPalette,
        deleteCustomPalette,
        resetToDefault,
        setAppearance,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
};
