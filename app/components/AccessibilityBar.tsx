'use client';
import { useState, useEffect } from 'react';
import { Minus, Plus, Accessibility } from 'lucide-react';

export default function AccessibilityBar() {
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  }, [reducedMotion]);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility options"
        aria-expanded={isOpen}
        title="Accessibility options"
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-card border border-white/5 text-foreground/50 hover:text-foreground hover:bg-white/10 transition-colors text-sm font-medium"
      >
        <Accessibility size={15} aria-hidden="true" />
        <span className="text-xs">Accessibility</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Accessibility options"
          className="absolute top-12 right-0 bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl w-72 space-y-4 z-50"
        >
          <h3 className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
            ♿ Accessibility Options
          </h3>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Text Size</label>
              <span className="text-xs text-foreground/40">{fontSize}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFontSize(Math.max(75, fontSize - 10))}
                aria-label="Decrease text size"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              >
                <Minus size={14} />
              </button>
              <div className="flex-1 bg-white/5 rounded-lg h-2 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-emerald-500 rounded-lg transition-all"
                  style={{ width: `${((fontSize - 75) / 75) * 100}%` }}
                />
              </div>
              <button
                onClick={() => setFontSize(Math.min(150, fontSize + 10))}
                aria-label="Increase text size"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="flex justify-between mt-2">
              {[75, 100, 125, 150].map((size, i) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  aria-label={`Set text size to ${size}%`}
                  className={`text-xs px-2 py-1 rounded-lg transition-colors ${fontSize === size ? 'bg-emerald-500/20 text-emerald-400' : 'text-foreground/30 hover:text-foreground'}`}
                  style={{ fontSize: `${10 + i * 2}px` }}
                >
                  A
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <div className="text-sm font-medium">High Contrast</div>
              <div className="text-xs text-foreground/40">Increase color contrast</div>
            </div>
            <button
              role="switch"
              aria-checked={highContrast}
              onClick={() => setHighContrast(!highContrast)}
              className={`relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0 ${highContrast ? 'bg-emerald-500' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
              <span className="sr-only">{highContrast ? 'Disable' : 'Enable'} high contrast</span>
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-t border-white/5">
            <div>
              <div className="text-sm font-medium">Reduce Motion</div>
              <div className="text-xs text-foreground/40">Disable animations</div>
            </div>
            <button
              role="switch"
              aria-checked={reducedMotion}
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`relative inline-flex w-11 h-6 rounded-full transition-colors flex-shrink-0 ${reducedMotion ? 'bg-emerald-500' : 'bg-white/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${reducedMotion ? 'translate-x-6' : 'translate-x-1'}`} />
              <span className="sr-only">{reducedMotion ? 'Disable' : 'Enable'} reduced motion</span>
            </button>
          </div>

          <div className="border-t border-white/5 pt-3">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-2">Keyboard Shortcuts</p>
            <div className="space-y-1.5">
              {[
                { key: 'Alt + S', desc: 'Skip to main content' },
                { key: 'Alt + N', desc: 'Skip to navigation' },
                { key: 'Esc', desc: 'Stop reading aloud' },
                { key: 'Tab', desc: 'Navigate elements' },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between">
                  <span className="text-xs text-foreground/50">{s.desc}</span>
                  <kbd className="text-xs bg-white/5 border border-white/10 px-2 py-0.5 rounded-lg text-foreground/60 font-mono">{s.key}</kbd>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-full py-2 text-xs text-foreground/40 hover:text-foreground border border-white/5 rounded-xl hover:bg-white/5 transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
