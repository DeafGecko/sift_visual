'use client';
import { useEffect } from 'react';
import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import { useSettingsStore } from '@/store/useSettingsStore';

export default function AccessibilityBar() {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const reducedMotion = useSettingsStore((s) => s.reducedMotion);
  const setReducedMotion = useSettingsStore((s) => s.setReducedMotion);

  // Font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  // High contrast
  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
      root.style.setProperty('--background', '#000000');
      root.style.setProperty('--foreground', '#ffffff');
      root.style.setProperty('--card', '#111111');
      root.style.setProperty('filter', 'contrast(1.4)');
    } else {
      root.classList.remove('high-contrast');
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--card');
      root.style.removeProperty('filter');
    }
  }, [highContrast]);

  // Reduced motion — persisted via Zustand, applied via style tag
  useEffect(() => {
    const styleId = 'sift-reduce-motion';
    const existing = document.getElementById(styleId);
    const root = document.documentElement;
    if (reducedMotion) {
      root.setAttribute('data-reduce-motion', 'true');
      if (!existing) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          *, *::before, *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            transition-delay: 0ms !important;
          }
          [data-reduce-motion="true"] tr {
            opacity: 1 !important;
            transform: none !important;
          }
          [data-reduce-motion="true"] .fixed.bottom-8 {
            display: none !important;
          }
        `;
        document.head.appendChild(style);
      }
    } else {
      root.removeAttribute('data-reduce-motion');
      existing?.remove();
    }
  }, [reducedMotion]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility options"
        aria-expanded={isOpen}
        title="Accessibility options"
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-card border border-white/5 text-foreground/50 hover:text-foreground hover:bg-white/10 transition-colors"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="13" r="11"/>
          <path d="M73 32H56l-3 15h14l8 20a5 5 0 0 0 9-4L74 40z"/>
          <path d="M53 49l-3-17H30a5 5 0 0 0 0 10h16l2 10-14 4a5 5 0 0 0-3 6l6 20a5 5 0 0 0 9-3l-4-15 14-4a5 5 0 0 0 4-5z"/>
        </svg>
        <span className="sr-only">Accessibility options</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Accessibility options"
          className="absolute top-12 right-0 bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl w-72 space-y-4 z-50"
        >
          <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">
            ♿ Accessibility Options
          </h3>

          {/* Text Size */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-white">Text Size</label>
              <span className="text-xs text-white/40">{fontSize}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setFontSize(Math.max(75, fontSize - 10))} aria-label="Decrease text size"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white">
                <Minus size={14} />
              </button>
              <div className="flex-1 bg-white/5 rounded-lg h-2 relative">
                <div className="absolute left-0 top-0 h-full bg-emerald-500 rounded-lg"
                  style={{ width: `${((fontSize - 75) / 75) * 100}%` }} />
              </div>
              <button onClick={() => setFontSize(Math.min(150, fontSize + 10))} aria-label="Increase text size"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white">
                <Plus size={14} />
              </button>
            </div>
            <div className="flex justify-between mt-2">
              {[75, 100, 125, 150].map((size, i) => (
                <button key={size} onClick={() => setFontSize(size)} aria-label={`Set text size to ${size}%`}
                  className={`px-2 py-1 rounded-lg ${fontSize === size ? 'bg-emerald-500/20 text-emerald-400' : 'text-white/30 hover:text-white'}`}
                  style={{ fontSize: `${10 + i * 2}px` }}>
                  A
                </button>
              ))}
            </div>
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between py-2 border-t border-white/10">
            <div>
              <div className="text-sm font-medium text-white">High Contrast</div>
              <div className="text-xs text-white/40">Increase color contrast</div>
            </div>
            <button role="switch" aria-checked={highContrast} onClick={() => setHighContrast(!highContrast)}
              className={`relative inline-flex w-11 h-6 rounded-full flex-shrink-0 ${highContrast ? 'bg-emerald-500' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
              <span className="sr-only">{highContrast ? 'Disable' : 'Enable'} high contrast</span>
            </button>
          </div>

          {/* Pause Animation — reads from Zustand, persists! */}
          <div className="flex items-center justify-between py-2 border-t border-white/10">
            <div>
              <div className="text-sm font-medium text-white">Pause Animation</div>
              <div className="text-xs text-white/40">Stop all motion and transitions</div>
            </div>
            <button role="switch" aria-checked={reducedMotion} onClick={() => setReducedMotion(!reducedMotion)}
              className={`relative inline-flex w-11 h-6 rounded-full flex-shrink-0 ${reducedMotion ? 'bg-emerald-500' : 'bg-white/10'}`}>
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} />
              <span className="sr-only">{reducedMotion ? 'Disable' : 'Enable'} pause animation</span>
            </button>
          </div>

          {/* Keyboard Shortcuts */}
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
            <div className="space-y-1.5">
              {[
                { key: 'Alt + S', desc: 'Skip to main content' },
                { key: 'Alt + N', desc: 'Skip to navigation' },
                { key: 'Esc', desc: 'Stop reading aloud' },
                { key: 'Tab', desc: 'Navigate elements' },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="text-xs text-white/50">{s.desc}</span>
                  <kbd className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-white/60 font-mono">{s.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setIsOpen(false)}
            className="w-full py-2 text-xs text-white/40 hover:text-white border border-white/10 rounded-xl hover:bg-white/5">
            Close
          </button>
        </div>
      )}
    </div>
  );
}
