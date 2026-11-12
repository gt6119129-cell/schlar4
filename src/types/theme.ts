export interface DesignTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  sidebar: string;
  sidebarText: string;
  focusRing: string;
  // Derived / supporting tokens
  hoverPrimary?: string;
  hoverSecondary?: string;
  subtleAccent?: string;
  tableHeader?: string;
  inputBg?: string;
}

export interface BasePaletteColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
}

export interface ThemePalette {
  id: string;
  name: string;
  isPreset: boolean;
  tokens: DesignTokens;
  createdAt?: number;
  updatedAt?: number;
}

export type AppearanceMode = 'light' | 'dark' | 'system';

export type ThemeFilter = 'all' | 'presets' | 'custom';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
  parsedTokens?: DesignTokens;
  paletteName?: string;
}
