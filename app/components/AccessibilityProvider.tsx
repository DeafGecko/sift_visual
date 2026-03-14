'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface A11yContextType {
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const A11yContext = createContext<A11yContextType>({
  announceToScreenReader: () => {},
  speak: () => {},
  stopSpeaking: () => {},
  isSpeaking: false,
});

export const useA11y = () => useContext(A11yContext);

export default function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState('');
  const [assertiveMessage, setAssertiveMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (priority === 'assertive') {
      setAssertiveMessage('');
      setTimeout(() => setAssertiveMessage(message), 50);
    } else {
      setPoliteMessage('');
      setTimeout(() => setPoliteMessage(message), 50);
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl key shortcuts — work reliably on Mac
      if (e.ctrlKey && !e.metaKey && !e.shiftKey) {
        // Ctrl+M — skip to main content
        if (e.code === 'KeyM') {
          e.preventDefault();
          const main = document.querySelector('main') as HTMLElement;
          if (main) { main.setAttribute('tabindex', '-1'); main.focus(); }
          announceToScreenReader('Skipped to main content');
        }
        // Ctrl+B — skip to navigation (sidebar)
        if (e.code === 'KeyB') {
          e.preventDefault();
          const nav = document.querySelector('nav');
          const firstLink = nav?.querySelector('a') as HTMLElement;
          if (firstLink) firstLink.focus();
          announceToScreenReader('Skipped to navigation');
        }
        // Ctrl+1 — go to Dashboard
        if (e.code === 'Digit1') {
          e.preventDefault();
          window.location.href = '/';
          announceToScreenReader('Navigating to Dashboard');
        }
        // Ctrl+2 — go to Stocks
        if (e.code === 'Digit2') {
          e.preventDefault();
          window.location.href = '/markets/stocks';
          announceToScreenReader('Navigating to Stocks');
        }
        // Ctrl+3 — go to Watchlist
        if (e.code === 'Digit3') {
          e.preventDefault();
          window.location.href = '/watchlist';
          announceToScreenReader('Navigating to Watchlist');
        }
        // Ctrl+4 — go to Learning Lab
        if (e.code === 'Digit4') {
          e.preventDefault();
          window.location.href = '/learning';
          announceToScreenReader('Navigating to Learning Lab');
        }
        // Ctrl+5 — go to Settings
        if (e.code === 'Digit5') {
          e.preventDefault();
          window.location.href = '/settings';
          announceToScreenReader('Navigating to Settings');
        }
      }
      // Escape — stop speaking (always works)
      if (e.code === 'Escape') {
        stopSpeaking();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const skipLinkClass = "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-emerald-500 focus:text-black focus:rounded-xl focus:font-semibold focus:text-sm";

  return (
    <A11yContext.Provider value={{ announceToScreenReader, speak, stopSpeaking, isSpeaking }}>
      <a href="#main-content" className={skipLinkClass} style={{left: '1rem'}}>
        Skip to main content
      </a>
      <a href="#sidebar-nav" className={skipLinkClass} style={{left: '12rem'}}>
        Skip to navigation
      </a>
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {politeMessage}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertiveMessage}
      </div>
      {isSpeaking && (
        <div role="status" className="fixed top-4 right-20 z-50 flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-xl text-xs font-semibold shadow-lg">
          <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
          Reading aloud...
          <button onClick={stopSpeaking} className="ml-1 underline" aria-label="Stop reading aloud">
            Stop
          </button>
        </div>
      )}
      {children}
    </A11yContext.Provider>
  );
}
