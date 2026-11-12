import React from 'react';

interface SchlarLogoProps {
  variant?: 'full' | 'compact' | 'symbol' | 'sidebar';
  className?: string;
  inverted?: boolean;
}

export const SchlarLogo: React.FC<SchlarLogoProps> = ({
  variant = 'full',
  className = '',
  inverted = false,
}) => {
  // SVG emblem: geometric structure + academic vertex + stylized "S" ribbon
  const symbolSvg = (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      style={{ width: '100%', height: '100%' }}
      aria-label="SCHLAR Brand Emblem"
    >
      {/* Outer structural shield / hexagonal prism */}
      <rect
        x="2"
        y="2"
        width="36"
        height="36"
        rx="8"
        fill={inverted ? 'rgba(255, 255, 255, 0.12)' : 'var(--color-primary)'}
        stroke={inverted ? 'rgba(255, 255, 255, 0.25)' : 'var(--color-secondary)'}
        strokeWidth="1.5"
      />
      {/* Dynamic structural "S" geometry & graduation chevron */}
      <path
        d="M26 12H16C13.7909 12 12 13.7909 12 16C12 18.2091 13.7909 20 16 20H24C26.2091 20 28 21.7909 28 24C28 26.2091 26.2091 28 24 28H14"
        stroke={inverted ? '#FFFFFF' : '#FFFFFF'}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Distinctive accent node: beacon of learning */}
      <circle
        cx="26"
        cy="12"
        r="2.75"
        fill="var(--color-accent)"
      />
      <circle
        cx="14"
        cy="28"
        r="2.75"
        fill="var(--color-accent)"
      />
    </svg>
  );

  if (variant === 'symbol') {
    return (
      <div className={`w-8 h-8 ${className}`}>
        {symbolSvg}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <div className="w-8 h-8">{symbolSvg}</div>
        <div className="flex flex-col min-w-0">
          <span className="text-base font-extrabold tracking-wider text-white uppercase leading-none">
            SCHLAR
          </span>
          <span className="text-[10px] tracking-wide text-white/70 uppercase font-medium mt-1">
            Operations Platform
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2.5 ${className}`}>
        <div className="w-7 h-7">{symbolSvg}</div>
        <span
          className="text-base font-extrabold tracking-wider uppercase leading-none transition-colors"
          style={{ color: inverted ? '#FFFFFF' : 'var(--color-primary)' }}
        >
          SCHLAR
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      <div className="w-9 h-9">{symbolSvg}</div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span
            className="text-xl font-extrabold tracking-wider uppercase leading-none transition-colors"
            style={{ color: inverted ? '#FFFFFF' : 'var(--color-primary)' }}
          >
            SCHLAR
          </span>
          <span
            className="text-[10px] font-semibold px-1.5 py-0.5 rounded tracking-wide uppercase transition-colors"
            style={{
              backgroundColor: 'var(--color-subtle-accent, rgba(0,0,0,0.06))',
              color: 'var(--color-accent)',
              border: '1px solid var(--color-border)',
            }}
          >
            SaaS
          </span>
        </div>
        <span
          className="text-[11px] font-medium tracking-tight transition-colors hidden sm:inline-block"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          School Management Platform
        </span>
      </div>
    </div>
  );
};
