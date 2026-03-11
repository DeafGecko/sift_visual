'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const lessons = [
  {
    category: 'Basics',
    items: [
      {
        term: '📈 What is a Stock?',
        description: 'A stock represents ownership in a company. When you buy a share, you own a small piece of that business and can profit if the company grows.',
      },
      {
        term: '📊 What is Volume?',
        description: 'Volume is the number of shares traded during a given period. High volume often means strong interest in a stock — either buying or selling.',
      },
      {
        term: '💹 What is Market Cap?',
        description: 'Market Cap = Share Price × Total Shares. It tells you the total value of a company. Large cap (>$10B), Mid cap ($2B-$10B), Small cap (<$2B).',
      },
    ],
  },
  {
    category: 'Indices',
    items: [
      {
        term: '🏦 What is the S&P 500?',
        description: 'The S&P 500 tracks the 500 largest US companies. It\'s the most widely followed indicator of the overall US stock market health.',
      },
      {
        term: '💻 What is the NASDAQ?',
        description: 'The NASDAQ is heavily weighted toward technology companies like Apple, Microsoft, and Google. It\'s a key indicator of tech sector performance.',
      },
      {
        term: '🏭 What is the DOW Jones?',
        description: 'The Dow Jones Industrial Average tracks 30 large US companies. It\'s one of the oldest and most recognized stock market indices.',
      },
    ],
  },
  {
    category: 'Technical Analysis',
    items: [
      {
        term: '📉 What is RSI?',
        description: 'RSI (Relative Strength Index) measures if a stock is overbought (>70) or oversold (<30). It helps traders identify potential reversals.',
      },
      {
        term: '📐 What is MACD?',
        description: 'MACD (Moving Average Convergence Divergence) shows momentum and trend direction. When the MACD crosses above the signal line, it\'s often a buy signal.',
      },
      {
        term: '〰️ What are Moving Averages?',
        description: 'Moving averages smooth out price data. The 50-day and 200-day MAs are key levels. When price crosses above the 200 MA it\'s considered bullish.',
      },
    ],
  },
  {
    category: 'Market Terms',
    items: [
      {
        term: '🟢 What are Gainers?',
        description: 'Top gainers are stocks with the highest percentage price increase for the day. They often signal strong momentum or positive news.',
      },
      {
        term: '🔴 What are Losers?',
        description: 'Top losers are stocks with the biggest percentage drops for the day. They may signal bad news, earnings misses, or sector weakness.',
      },
      {
        term: '🌡️ What is a Heat Map?',
        description: 'A heat map shows market performance visually. Green = up, Red = down. Larger boxes = larger companies. It gives a quick overview of the whole market.',
      },
    ],
  },
];

export default function LearningLab() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ term: string; description: string } | null>(null);

  return (
    <>
      {/* Floating ? Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-emerald-500 text-white font-bold text-lg shadow-lg flex items-center justify-center z-50"
        aria-label="Open Learning Lab"
      >
        ?
      </motion.button>

      {/* Main Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card text-foreground border-white/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              🎓 Learning Lab
            </DialogTitle>
            {/* <p className="text-foreground/50 text-sm">Click any topic to learn more</p> */}
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {lessons.map((section) => (
              <div key={section.category}>
                <h3 className="text-xs font-semibold text-foreground/40 uppercase tracking-widest mb-2">
                  {section.category}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item) => (
                    <motion.button
                      key={item.term}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelected(selected?.term === item.term ? null : item)}
                      className="w-full text-left px-4 py-3 rounded-lg bg-background hover:bg-white/5 transition-colors"
                    >
                      <div className="text-sm font-medium text-foreground">{item.term}</div>
                      <AnimatePresence>
                        {selected?.term === item.term && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-sm text-foreground/60 mt-2"
                          >
                            {item.description}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
