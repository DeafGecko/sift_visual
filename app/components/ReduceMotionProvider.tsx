'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import { useSettingsStore } from '@/store/useSettingsStore';

const ReduceMotionContext = createContext(false);
export const useReduceMotion = () => useContext(ReduceMotionContext);

export default function ReduceMotionProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useSettingsStore((s) => s.reducedMotion);

  return (
    <ReduceMotionContext.Provider value={reducedMotion}>
      <MotionConfig
        reducedMotion={reducedMotion ? 'always' : 'never'}
        transition={reducedMotion ? { duration: 0 } : undefined}
      >
        {children}
      </MotionConfig>
    </ReduceMotionContext.Provider>
  );
}
