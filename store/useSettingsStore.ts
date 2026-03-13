import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: string;
  accentColor: string;
  fontSize: string;
  compactMode: boolean;
  animations: boolean;
  refreshInterval: string;
  priceFormat: string;
  showPremarket: boolean;
  showAfterHours: boolean;
  showVolume: boolean;
  showChangePercent: boolean;
  showMarketCap: boolean;
  colorBlindMode: boolean;
  reducedMotion: boolean;
  marketOpen: boolean;
  marketClose: boolean;
  priceAlerts: boolean;
  newsAlerts: boolean;
  analytics: boolean;
  crashReports: boolean;
  setTheme: (v: string) => void;
  setAccentColor: (v: string) => void;
  setFontSize: (v: string) => void;
  setCompactMode: (v: boolean) => void;
  setAnimations: (v: boolean) => void;
  setRefreshInterval: (v: string) => void;
  setPriceFormat: (v: string) => void;
  setShowPremarket: (v: boolean) => void;
  setShowAfterHours: (v: boolean) => void;
  setShowVolume: (v: boolean) => void;
  setShowChangePercent: (v: boolean) => void;
  setShowMarketCap: (v: boolean) => void;
  setColorBlindMode: (v: boolean) => void;
  setReducedMotion: (v: boolean) => void;
  setMarketOpen: (v: boolean) => void;
  setMarketClose: (v: boolean) => void;
  setPriceAlerts: (v: boolean) => void;
  setNewsAlerts: (v: boolean) => void;
  setAnalytics: (v: boolean) => void;
  setCrashReports: (v: boolean) => void;
  resetAll: () => void;
}

const DEFAULTS = {
  theme: 'Dark',
  accentColor: 'Emerald',
  fontSize: 'Medium',
  compactMode: false,
  animations: true,
  refreshInterval: '60s',
  priceFormat: 'USD',
  showPremarket: true,
  showAfterHours: true,
  showVolume: true,
  showChangePercent: true,
  showMarketCap: true,
  colorBlindMode: false,
  reducedMotion: false,
  marketOpen: true,
  marketClose: true,
  priceAlerts: false,
  newsAlerts: false,
  analytics: true,
  crashReports: true,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setTheme: (v) => set({ theme: v }),
      setAccentColor: (v) => set({ accentColor: v }),
      setFontSize: (v) => set({ fontSize: v }),
      setCompactMode: (v) => set({ compactMode: v }),
      setAnimations: (v) => set({ animations: v }),
      setRefreshInterval: (v) => set({ refreshInterval: v }),
      setPriceFormat: (v) => set({ priceFormat: v }),
      setShowPremarket: (v) => set({ showPremarket: v }),
      setShowAfterHours: (v) => set({ showAfterHours: v }),
      setShowVolume: (v) => set({ showVolume: v }),
      setShowChangePercent: (v) => set({ showChangePercent: v }),
      setShowMarketCap: (v) => set({ showMarketCap: v }),
      setColorBlindMode: (v) => set({ colorBlindMode: v }),
      setReducedMotion: (v) => set({ reducedMotion: v }),
      setMarketOpen: (v) => set({ marketOpen: v }),
      setMarketClose: (v) => set({ marketClose: v }),
      setPriceAlerts: (v) => set({ priceAlerts: v }),
      setNewsAlerts: (v) => set({ newsAlerts: v }),
      setAnalytics: (v) => set({ analytics: v }),
      setCrashReports: (v) => set({ crashReports: v }),
      resetAll: () => set(DEFAULTS),
    }),
    { name: 'sift-settings' }
  )
);
