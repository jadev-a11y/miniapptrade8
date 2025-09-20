import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

// Логотип графика (замена для 📊)
export const ChartIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M3 17L9 11L13 15L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="21" cy="7" r="2" fill="currentColor"/>
    <circle cx="13" cy="15" r="2" fill="currentColor"/>
    <circle cx="9" cy="11" r="2" fill="currentColor"/>
    <circle cx="3" cy="17" r="2" fill="currentColor"/>
  </svg>
);

// Логотип роста (замена для 📈)
export const TrendUpIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="22,6 13,15 9,11 2,18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,6 22,6 22,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Логотип падения (замена для 📉)
export const TrendDownIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="22,18 13,9 9,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="16,18 22,18 22,12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Логотип денег (замена для 💰)
export const MoneyIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 8a6 6 0 0 0-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Логотип молнии (замена для ⚡)
export const BoltIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor"/>
  </svg>
);

// Логотип цели (замена для 🎯)
export const TargetIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

// Логотип лампочки (замена для 💡)
export const BulbIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M9 21h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 3a6 6 0 0 0-6 6c0 1 0 2 2 3v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4c2-1 2-2 2-3a6 6 0 0 0-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Логотип списка (замена для 📋)
export const ClipboardIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Логотип часов (замена для ⏰)
export const ClockIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Логотип обновления (замена для 🔄)
export const RefreshIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="23,4 23,10 17,10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <polyline points="1,20 1,14 7,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M3.51 15a9 9 0 0 0 14.85 4.36L23 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// Логотип канделя (замена для 📊 candlestick)
export const CandlestickIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <line x1="4" y1="6" x2="4" y2="18" stroke="currentColor" strokeWidth="2"/>
    <rect x="2" y="8" width="4" height="6" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2"/>
    <rect x="10" y="10" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="2" fill="none"/>
    <line x1="20" y1="2" x2="20" y2="22" stroke="currentColor" strokeWidth="2"/>
    <rect x="18" y="6" width="4" height="8" rx="1" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
  </svg>
);

// Логотип линии (замена для 📈 line)
export const LineChartIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <polyline points="3,17 6,11 12,15 18,9 22,13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="3" cy="17" r="2" fill="currentColor"/>
    <circle cx="6" cy="11" r="2" fill="currentColor"/>
    <circle cx="12" cy="15" r="2" fill="currentColor"/>
    <circle cx="18" cy="9" r="2" fill="currentColor"/>
    <circle cx="22" cy="13" r="2" fill="currentColor"/>
  </svg>
);

// Логотип объема (замена для 📊 volume)
export const VolumeIcon: React.FC<IconProps> = ({ size = 20, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="12" width="3" height="9" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    <rect x="7" y="8" width="3" height="13" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    <rect x="11" y="4" width="3" height="17" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    <rect x="15" y="10" width="3" height="11" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
    <rect x="19" y="6" width="3" height="15" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
  </svg>
);