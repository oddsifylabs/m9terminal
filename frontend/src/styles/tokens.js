/**
 * M9 Terminal Design Tokens
 * Based on Oddsify Labs Brand Bible v2.0
 */

export const colors = {
  // Primary
  marketBlack: '#0F1115',
  terminalNavy: '#131A24',
  
  // Accent
  signalGreen: '#00D27A',
  dataBlue: '#2B7FFF',
  
  // Neutral
  slate: '#6B7280',
  cloud: '#E5E7EB',
  white: '#FFFFFF',
  
  // Semantic
  success: '#00D27A',
  error: '#EF4444',
  warning: '#F59E0B',
  info: '#2B7FFF',
};

export const typography = {
  primary: "'Inter', 'Geist', 'SF Pro', sans-serif",
  mono: "'JetBrains Mono', monospace",
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const spacing = {
  '0': '0',
  'xs': '4px',
  'sm': '8px',
  'md': '16px',
  'lg': '24px',
  'xl': '32px',
  'xxl': '48px',
  '3xl': '64px',
};

export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
};

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
};

export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px',
};

/**
 * Component Variants
 */

export const button = {
  primary: {
    background: colors.signalGreen,
    color: colors.marketBlack,
    hover: '#00B85F',
    active: '#00994D',
  },
  secondary: {
    background: colors.terminalNavy,
    color: colors.signalGreen,
    border: `1px solid ${colors.signalGreen}`,
    hover: colors.marketBlack,
  },
  ghost: {
    background: 'transparent',
    color: colors.slate,
    border: `1px solid ${colors.slate}`,
    hover: colors.cloud,
  },
};

export const alert = {
  success: {
    background: `rgba(${parseInt(colors.signalGreen.slice(1), 16) >> 16 & 255}, ${parseInt(colors.signalGreen.slice(1), 16) >> 8 & 255}, ${parseInt(colors.signalGreen.slice(1), 16) & 255}, 0.1)`,
    text: colors.signalGreen,
    border: colors.signalGreen,
  },
  error: {
    background: 'rgba(239, 68, 68, 0.1)',
    text: '#FCA5A5',
    border: '#EF4444',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.1)',
    text: '#FCD34D',
    border: '#F59E0B',
  },
  info: {
    background: `rgba(43, 127, 255, 0.1)`,
    text: colors.dataBlue,
    border: colors.dataBlue,
  },
};

export const input = {
  background: colors.terminalNavy,
  border: `1px solid rgba(107, 114, 128, 0.2)`,
  text: colors.white,
  placeholder: colors.slate,
  focusBorder: colors.signalGreen,
  focusShadow: `0 0 0 3px rgba(0, 210, 122, 0.1)`,
};

export const card = {
  background: colors.terminalNavy,
  border: `1px solid rgba(107, 114, 128, 0.1)`,
  borderRadius: borderRadius.lg,
  padding: spacing.lg,
};

/**
 * Utility Exports for CSS Variables
 */

export const cssVariables = `
  --color-market-black: ${colors.marketBlack};
  --color-terminal-navy: ${colors.terminalNavy};
  --color-signal-green: ${colors.signalGreen};
  --color-data-blue: ${colors.dataBlue};
  --color-slate: ${colors.slate};
  --color-cloud: ${colors.cloud};
  --color-white: ${colors.white};
  
  --font-primary: ${typography.primary};
  --font-mono: ${typography.mono};
  
  --spacing-xs: ${spacing.xs};
  --spacing-sm: ${spacing.sm};
  --spacing-md: ${spacing.md};
  --spacing-lg: ${spacing.lg};
  --spacing-xl: ${spacing.xl};
  --spacing-xxl: ${spacing.xxl};
  
  --radius-sm: ${borderRadius.sm};
  --radius-md: ${borderRadius.md};
  --radius-lg: ${borderRadius.lg};
  --radius-xl: ${borderRadius.xl};
  
  --transition-fast: ${transitions.fast};
  --transition-base: ${transitions.base};
  --transition-slow: ${transitions.slow};
`;
