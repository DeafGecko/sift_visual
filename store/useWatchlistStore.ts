import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistStore {
  watchlist: string[];
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  toggleWatchlist: (symbol: string) => void;
  isWatched: (symbol: string) => boolean;
  clearWatchlist: () => void;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (symbol) =>
        set((state) => ({ watchlist: [...state.watchlist, symbol] })),
      removeFromWatchlist: (symbol) =>
        set((state) => ({ watchlist: state.watchlist.filter((s) => s !== symbol) })),
      toggleWatchlist: (symbol) => {
        const { watchlist } = get();
        if (watchlist.includes(symbol)) {
          set({ watchlist: watchlist.filter((s) => s !== symbol) });
        } else {
          set({ watchlist: [...watchlist, symbol] });
        }
      },
      isWatched: (symbol) => get().watchlist.includes(symbol),
      clearWatchlist: () => set({ watchlist: [] }),
    }),
    { name: 'sift-watchlist' }
  )
);
