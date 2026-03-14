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
      // Use e.code instead of e.key — Alt on Mac changes the character
      // Alt+S (KeyS) — skip to main content
      if (e.altKey && e.code === 'KeyS') {
        e.preventDefault();
        const main = document.querySelector('main') as HTMLElement;
        if (main) {
          main.setAttribute('tabindex', '-1');
          main.focus();
          announceToScreenReader('Skipped to main content');
        }
      }
      // Alt+N (KeyN) — skip to navigation
      if (e.altKey && e.code === 'KeyN') {
        e.preventDefault();
        const nav = document.querySelector('nav');
        const firstLink = nav?.querySelector('a') as HTMLElement;
        if (firstLink) {
          firstLink.focus();
          announceToScreenReader('Skipped to navigation');
        }
      }
      // Alt+H (KeyH) — go to home/dashboard
      if (e.altKey && e.code === 'KeyH') {
        e.preventDefault();
        window.location.href = '/';
        announceToScreenReader('Navigating to dashboard');
      }
      // Alt+W (KeyW) — go to watchlist
      if (e.altKey && e.code === 'KeyW') {
        e.preventDefault();
        window.location.href = '/watchlist';
        announceToScreenReader('Navigating to watchlist');
      }
      // Alt+L (KeyL) — go to learning lab
      if (e.altKey && e.code === 'KeyL') {
        e.preventDefault();
        window.location.href = '/learning';
        announceToScreenReader('Navigating to learning lab');
      }
      // Escape — stop speaking
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
