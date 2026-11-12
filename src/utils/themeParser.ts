import { DesignTokens, ThemePalette, ValidationResult } from '../types/theme';
import { isValidHex, normalizeHex, SEMANTIC_DEFAULTS } from '../config/palettes';

export const CSS_EXAMPLE_TEMPLATE = `:root {
  --color-primary: #1E3A8A;
  --color-secondary: #0D9488;
  --color-accent: #F59E0B;
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-text: #1E293B;
  --color-text-secondary: #64748B;
  --color-border: #E2E8F0;
  --color-success: #16A34A;
  --color-warning: #D97706;
  --color-error: #DC2626;
  --color-info: #0284C7;
  --color-sidebar: #1E3A8A;
  --color-sidebar-text: #FFFFFF;
  --color-focus-ring: #0D9488;
}`;

export const JSON_EXAMPLE_TEMPLATE = `{
  "name": "Sapphire & Amber",
  "primary": "#1E3A8A",
  "secondary": "#0D9488",
  "accent": "#F59E0B",
  "background": "#F8FAFC",
  "surface": "#FFFFFF",
  "text": "#1E293B",
  "textSecondary": "#64748B",
  "border": "#E2E8F0",
  "success": "#16A34A",
  "warning": "#D97706",
  "error": "#DC2626",
  "info": "#0284C7",
  "sidebar": "#1E3A8A",
  "sidebarText": "#FFFFFF",
  "focusRing": "#0D9488"
}`;

const CSS_VAR_MAP: Record<string, keyof DesignTokens> = {
  '--color-primary': 'primary',
  '--color-secondary': 'secondary',
  '--color-accent': 'accent',
  '--color-background': 'background',
  '--color-surface': 'surface',
  '--color-text': 'text',
  '--color-text-secondary': 'textSecondary',
  '--color-border': 'border',
  '--color-success': 'success',
  '--color-warning': 'warning',
  '--color-error': 'error',
  '--color-info': 'info',
  '--color-sidebar': 'sidebar',
  '--color-sidebar-text': 'sidebarText',
  '--color-focus-ring': 'focusRing',
};

const REQUIRED_KEYS: (keyof DesignTokens)[] = [
  'primary',
  'secondary',
  'accent',
  'background',
  'surface',
];

export function parseCssVariables(cssText: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const parsed: Partial<DesignTokens> = {};

  if (!cssText || !cssText.trim()) {
    return {
      isValid: false,
      errors: ['CSS content is empty. Please provide :root { --color-...: #hex; } declarations.'],
    };
  }

  // Regex to match variable declarations: --color-[name]: #val;
  const lineRegex = /(--color-[a-z0-9-]+)\s*:\s*([^;]+);?/gi;
  let match: RegExpExecArray | null;
  let matchesFound = 0;

  while ((match = lineRegex.exec(cssText)) !== null) {
    matchesFound++;
    const varName = match[1].toLowerCase();
    const rawVal = match[2].trim();

    if (!CSS_VAR_MAP[varName]) {
      warnings.push(`Ignored unsupported CSS variable: ${varName}`);
      continue;
    }

    if (!isValidHex(rawVal)) {
      errors.push(`Invalid hex color value "${rawVal}" for ${varName}. Expected format: #RRGGBB or #RGB.`);
      continue;
    }

    const tokenKey = CSS_VAR_MAP[varName];
    parsed[tokenKey] = normalizeHex(rawVal);
  }

  if (matchesFound === 0) {
    errors.push('No CSS custom properties found matching the pattern "--color-*: #hex;".');
  }

  // Check required tokens
  for (const key of REQUIRED_KEYS) {
    if (!parsed[key]) {
      errors.push(`Missing required token: --color-${key.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}`);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // Fill in semantic defaults for any optional omitted tokens
  const fullTokens: DesignTokens = {
    primary: parsed.primary!,
    secondary: parsed.secondary!,
    accent: parsed.accent!,
    background: parsed.background!,
    surface: parsed.surface!,
    text: parsed.text || SEMANTIC_DEFAULTS.text,
    textSecondary: parsed.textSecondary || SEMANTIC_DEFAULTS.textSecondary,
    border: parsed.border || SEMANTIC_DEFAULTS.border,
    success: parsed.success || SEMANTIC_DEFAULTS.success,
    warning: parsed.warning || SEMANTIC_DEFAULTS.warning,
    error: parsed.error || SEMANTIC_DEFAULTS.error,
    info: parsed.info || SEMANTIC_DEFAULTS.info,
    sidebar: parsed.sidebar || parsed.primary!,
    sidebarText: parsed.sidebarText || SEMANTIC_DEFAULTS.sidebarText,
    focusRing: parsed.focusRing || parsed.secondary!,
  };

  return {
    isValid: true,
    errors: [],
    warnings,
    parsedTokens: fullTokens,
  };
}

export function parseJsonPalette(jsonText: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!jsonText || !jsonText.trim()) {
    return {
      isValid: false,
      errors: ['JSON content is empty. Please provide a JSON object with palette colors.'],
    };
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(jsonText);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Syntax error';
    return {
      isValid: false,
      errors: [`Malformed JSON: ${message}`],
    };
  }

  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return {
      isValid: false,
      errors: ['Expected a JSON object containing key-value color pairs.'],
    };
  }

  const paletteName = typeof data.name === 'string' && data.name.trim() ? data.name.trim() : undefined;

  const validKeys: (keyof DesignTokens)[] = [
    'primary',
    'secondary',
    'accent',
    'background',
    'surface',
    'text',
    'textSecondary',
    'border',
    'success',
    'warning',
    'error',
    'info',
    'sidebar',
    'sidebarText',
    'focusRing',
  ];

  const parsed: Partial<DesignTokens> = {};

  for (const [key, val] of Object.entries(data)) {
    if (key === 'name') continue;
    if (!validKeys.includes(key as keyof DesignTokens)) {
      warnings.push(`Ignored unknown field in JSON: "${key}"`);
      continue;
    }
    if (typeof val !== 'string' || !isValidHex(val)) {
      errors.push(`Invalid hex color for field "${key}": "${val}". Expected format #RRGGBB or #RGB.`);
      continue;
    }
    parsed[key as keyof DesignTokens] = normalizeHex(val);
  }

  for (const key of REQUIRED_KEYS) {
    if (!parsed[key]) {
      errors.push(`Missing required color property: "${key}"`);
    }
  }

  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  const fullTokens: DesignTokens = {
    primary: parsed.primary!,
    secondary: parsed.secondary!,
    accent: parsed.accent!,
    background: parsed.background!,
    surface: parsed.surface!,
    text: parsed.text || SEMANTIC_DEFAULTS.text,
    textSecondary: parsed.textSecondary || SEMANTIC_DEFAULTS.textSecondary,
    border: parsed.border || SEMANTIC_DEFAULTS.border,
    success: parsed.success || SEMANTIC_DEFAULTS.success,
    warning: parsed.warning || SEMANTIC_DEFAULTS.warning,
    error: parsed.error || SEMANTIC_DEFAULTS.error,
    info: parsed.info || SEMANTIC_DEFAULTS.info,
    sidebar: parsed.sidebar || parsed.primary!,
    sidebarText: parsed.sidebarText || SEMANTIC_DEFAULTS.sidebarText,
    focusRing: parsed.focusRing || parsed.secondary!,
  };

  return {
    isValid: true,
    errors: [],
    warnings,
    parsedTokens: fullTokens,
    paletteName,
  };
}

export function exportPaletteAsCss(palette: ThemePalette): string {
  const { tokens } = palette;
  return `:root {
  /* ${palette.name} - SCHLAR Palette */
  --color-primary: ${tokens.primary};
  --color-secondary: ${tokens.secondary};
  --color-accent: ${tokens.accent};
  --color-background: ${tokens.background};
  --color-surface: ${tokens.surface};
  --color-text: ${tokens.text};
  --color-text-secondary: ${tokens.textSecondary};
  --color-border: ${tokens.border};
  --color-success: ${tokens.success};
  --color-warning: ${tokens.warning};
  --color-error: ${tokens.error};
  --color-info: ${tokens.info};
  --color-sidebar: ${tokens.sidebar};
  --color-sidebar-text: ${tokens.sidebarText};
  --color-focus-ring: ${tokens.focusRing};
}`;
}

export function exportPaletteAsJson(palette: ThemePalette): string {
  const payload = {
    name: palette.name,
    primary: palette.tokens.primary,
    secondary: palette.tokens.secondary,
    accent: palette.tokens.accent,
    background: palette.tokens.background,
    surface: palette.tokens.surface,
    text: palette.tokens.text,
    textSecondary: palette.tokens.textSecondary,
    border: palette.tokens.border,
    success: palette.tokens.success,
    warning: palette.tokens.warning,
    error: palette.tokens.error,
    info: palette.tokens.info,
    sidebar: palette.tokens.sidebar,
    sidebarText: palette.tokens.sidebarText,
    focusRing: palette.tokens.focusRing,
  };
  return JSON.stringify(payload, null, 2);
}
