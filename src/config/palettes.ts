import { BasePaletteColors, DesignTokens, ThemePalette } from '../types/theme';

export const DEFAULT_PALETTE_ID = 'palette-7-petrol-copper';

export const SEMANTIC_DEFAULTS = {
  text: '#202A33',
  textSecondary: '#667085',
  border: '#E1E5EA',
  success: '#16845B',
  warning: '#B7791F',
  error: '#C0393B',
  info: '#2878B5',
  sidebarText: '#FFFFFF',
};

export function normalizeHex(val: string): string {
  if (!val) return '';
  const clean = val.trim().replace(/^#/, '');
  if (clean.length === 3) {
    const r = clean[0] + clean[0];
    const g = clean[1] + clean[1];
    const b = clean[2] + clean[2];
    return `#${r}${g}${b}`.toUpperCase();
  }
  return `#${clean}`.toUpperCase();
}

export function isValidHex(val: string): boolean {
  if (!val) return false;
  const clean = val.trim().replace(/^#/, '');
  return /^[0-9A-Fa-f]{6}$/.test(clean) || /^[0-9A-Fa-f]{3}$/.test(clean);
}

export function buildFullTokens(
  base: BasePaletteColors,
  overrides: Partial<DesignTokens> = {}
): DesignTokens {
  const normPrimary = normalizeHex(base.primary);
  const normSecondary = normalizeHex(base.secondary);
  const normAccent = normalizeHex(base.accent);
  const normBg = normalizeHex(base.background);
  const normSurface = normalizeHex(base.surface);

  return {
    primary: normPrimary,
    secondary: normSecondary,
    accent: normAccent,
    background: normBg,
    surface: normSurface,
    text: overrides.text ? normalizeHex(overrides.text) : SEMANTIC_DEFAULTS.text,
    textSecondary: overrides.textSecondary ? normalizeHex(overrides.textSecondary) : SEMANTIC_DEFAULTS.textSecondary,
    border: overrides.border ? normalizeHex(overrides.border) : SEMANTIC_DEFAULTS.border,
    success: overrides.success ? normalizeHex(overrides.success) : SEMANTIC_DEFAULTS.success,
    warning: overrides.warning ? normalizeHex(overrides.warning) : SEMANTIC_DEFAULTS.warning,
    error: overrides.error ? normalizeHex(overrides.error) : SEMANTIC_DEFAULTS.error,
    info: overrides.info ? normalizeHex(overrides.info) : SEMANTIC_DEFAULTS.info,
    sidebar: overrides.sidebar ? normalizeHex(overrides.sidebar) : normPrimary,
    sidebarText: overrides.sidebarText ? normalizeHex(overrides.sidebarText) : SEMANTIC_DEFAULTS.sidebarText,
    focusRing: overrides.focusRing ? normalizeHex(overrides.focusRing) : normSecondary,
    // Supporting derivations
    hoverPrimary: overrides.hoverPrimary,
    hoverSecondary: overrides.hoverSecondary,
    subtleAccent: overrides.subtleAccent,
    tableHeader: overrides.tableHeader || '#F8FAFC',
    inputBg: overrides.inputBg || '#FFFFFF',
  };
}

export const PRESET_PALETTES: ThemePalette[] = [
  {
    id: 'palette-1-navy-teal',
    name: 'Navy & Teal',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#172B4D',
      secondary: '#246B78',
      accent: '#42B8A5',
      background: '#F4F7FA',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-2-forest-champagne',
    name: 'Forest & Champagne',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#263C2C',
      secondary: '#47745B',
      accent: '#D6B879',
      background: '#F6F1E7',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-3-oxblood-blush',
    name: 'Oxblood & Blush',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#542333',
      secondary: '#873F50',
      accent: '#D9A6A0',
      background: '#F7F0E9',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-4-cobalt-lime',
    name: 'Cobalt & Electric Lime',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#2347D8',
      secondary: '#17234A',
      accent: '#C7F36B',
      background: '#F4F6FC',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-5-terracotta-sage',
    name: 'Terracotta & Sage',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#B85C42',
      secondary: '#829783',
      accent: '#D58A68',
      background: '#F4EFE5',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-6-graphite-lavender',
    name: 'Graphite & Ice Lavender',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#252936',
      secondary: '#51586A',
      accent: '#B8B8E8',
      background: '#F0F0F7',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-7-petrol-copper',
    name: 'Petrol & Copper',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#164E55',
      secondary: '#287B7A',
      accent: '#C47D54',
      background: '#F5F0E7',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-8-indigo-marigold',
    name: 'Indigo & Marigold',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#343477',
      secondary: '#5555A5',
      accent: '#E7B844',
      background: '#F5F2E8',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-9-royal-purple-gold',
    name: 'Royal Purple & Gold',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#45266E',
      secondary: '#7047A3',
      accent: '#E4BD62',
      background: '#F7F3FA',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-10-emerald-coral',
    name: 'Emerald & Coral',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#075B48',
      secondary: '#159A79',
      accent: '#FF8066',
      background: '#F0F8F4',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-11-black-gold',
    name: 'Black & Gold',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#191919',
      secondary: '#343434',
      accent: '#D5AD55',
      background: '#F4F1E9',
      surface: '#FFFFFF',
    }),
  },
  {
    id: 'palette-12-sky-midnight',
    name: 'Sky & Midnight',
    isPreset: true,
    tokens: buildFullTokens({
      primary: '#12304A',
      secondary: '#2676A8',
      accent: '#65C7E8',
      background: '#EFF7FC',
      surface: '#FFFFFF',
    }),
  },
];

export function deriveDarkTokens(lightTokens: DesignTokens): DesignTokens {
  return {
    ...lightTokens,
    background: '#0B0F17',
    surface: '#151D2A',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    border: '#243042',
    sidebar: '#0E1624',
    sidebarText: '#F8FAFC',
    tableHeader: '#1A2436',
    inputBg: '#111827',
    // Retain vivid primary, secondary, and accent while ensuring legible contrast
    focusRing: lightTokens.secondary,
  };
}
