'use client';
import { useEffect } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';

const ACCENT_COLORS: Record<string, string> = {
  Emerald: '#10b981',
  Blue: '#3b82f6',
  Purple: '#a855f7',
  Amber: '#f59e0b',
  Rose: '#f43f5e',
};

const FONT_SIZES: Record<string, string> = {
  Small: '13px',
  Medium: '15px',
  Large: '17px',
};

export default function SettingsApplier() {
  const {
    theme,
    accentColor,
    fontSize,
    compactMode,
    colorBlindMode,
    animations,
  } = useSettingsStore();

  useEffect(() => {
    const root = document.documentElement;

    // Theme
    if (theme === 'Dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'Light') {
      root.classList.remove('dark');
      root.classList.add('light');
    } else {
      // System
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', prefersDark);
    }

    // Accent color
    const color = ACCENT_COLORS[accentColor] || ACCENT_COLORS.Emerald;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--color-emerald-500', color);

    // Font size
    root.style.setProperty('--base-font-size', FONT_SIZES[fontSize] || '15px');
    document.body.style.fontSize = FONT_SIZES[fontSize] || '15px';

    // Compact mode
    root.style.setProperty('--row-padding', compactMode ? '0.375rem' : '0.75rem');
    root.classList.toggle('compact', compactMode);

    // Color blind mode
    if (colorBlindMode) {
      root.style.setProperty('--color-gain', '#3b82f6');
      root.style.setProperty('--color-loss', '#f59e0b');
    } else {
      root.style.setProperty('--color-gain', '#10b981');
      root.style.setProperty('--color-loss', '#ef4444');
    }

    // Animations
    if (!animations) {
      root.style.setProperty('--animation-duration', '0s');
      root.style.setProperty('--transition-duration', '0s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

  }, [theme, accentColor, fontSize, compactMode, colorBlindMode, animations]);

  return null;
}
