'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, BarChart2, Globe, HelpCircle, ChevronRight, Search } from 'lucide-react';
import { DEFINITIONS } from '@/app/components/EduTooltip';

const CATEGORIES = [
  {
    id: 'basics',
    label: 'Market Basics',
    icon: BookOpen,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    terms: ['S&P 500', 'NASDAQ', 'Dow Jones', 'Russell 2000', 'Market Cap', 'Symbol', 'Sector', 'Volume'],
    description: 'Core concepts every investor should know before entering the market.',
  },
  {
    id: 'price',
    label: 'Price & Data',
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    terms: ['Price', 'Open', 'High', 'Low', 'Change', 'VWAP', 'Volume Bars', 'Top Gainers', 'Top Losers'],
    description: 'Understanding price data, how it is calculated, and what it tells you.',
  },
  {
    id: 'technical',
    label: 'Technical Analysis',
    icon: BarChart2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    terms: ['Candlestick', 'Line Chart', 'Area Chart', 'MA20', 'MA50', 'MA200', 'Heat Map'],
    description: 'Chart types and indicators used to analyze price movements and trends.',
  },
  {
    id: 'forex',
    label: 'Forex & Futures',
    icon: Globe,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    terms: ['Pair', 'Base', 'Quote', 'Rate', 'Bid', 'Ask', 'Major Pairs', 'Cross Pairs', 'Exotic Pairs', 'Contract', 'Equity Futures', 'Commodities', 'Bonds'],
    description: 'Currency pairs, exchange rates, and futures contracts explained.',
  },
  {
    id: 'sizing',
    label: 'Market Sizing',
    icon: HelpCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    terms: ['Mega Cap', 'Large Cap', 'Mid Cap', 'Min Change', 'Max Change'],
    description: 'How companies are categorized by size and what that means for investors.',
  },
];

export default function LearningLabPage() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');

  const searchResults = searchVal.length > 1
    ? Object.entries(DEFINITIONS).filter(([term]) =>
        term.toLowerCase().includes(searchVal.toLowerCase())
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 min-h-screen bg-background text-foreground"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
            <BookOpen size={20} className="text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold">Learning Lab</h1>
        </div>
        <p className="text-foreground/40 text-sm">
          Master financial terminology — {Object.keys(DEFINITIONS).length} terms explained with real examples
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/30" />
        <input
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          placeholder="Search any financial term..."
          className="w-full max-w-lg bg-card border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Search Results */}
      {searchVal.length > 1 ? (
        <div>
          <p className="text-xs text-foreground/40 mb-4">{searchResults.length} results for "{searchVal}"</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map(([term, def]) => (
              <motion.button
                key={term}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setSelectedTerm(selectedTerm === term ? null : term)}
                className="text-left bg-card rounded-xl px-5 py-4 hover:bg-white/10 transition-colors border border-white/5"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-emerald-400">{term}</span>
                  <ChevronRight size={14} className={`text-foreground/30 transition-transform ${selectedTerm === term ? 'rotate-90' : ''}`} />
                </div>
                <p className="text-xs text-foreground/50">{def.short}</p>
                {selectedTerm === term && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-foreground/70 leading-relaxed">{def.detail}</p>
                    {def.example && <p className="text-xs text-foreground/40 italic mt-2">💡 {def.example}</p>}
                  </motion.div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex gap-6">
          {/* Category cards left column */}
          <div className="w-56 flex-shrink-0 space-y-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat); setSelectedTerm(null); }}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                    activeCategory.id === cat.id
                      ? `${cat.bg} ${cat.border} ${cat.color} border`
                      : 'bg-card border-white/5 text-foreground/50 hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={16} />
                    <div>
                      <div className="text-xs font-semibold">{cat.label}</div>
                      <div className="text-xs opacity-60 mt-0.5">{cat.terms.length} terms</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Terms right column */}
          <div className="flex-1">
            <div className="mb-4">
              <h2 className={`text-lg font-bold ${activeCategory.color}`}>{activeCategory.label}</h2>
              <p className="text-xs text-foreground/40 mt-1">{activeCategory.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeCategory.terms.map((term, index) => {
                const def = DEFINITIONS[term];
                if (!def) return null;
                return (
                  <motion.button
                    key={term}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    onClick={() => setSelectedTerm(selectedTerm === term ? null : term)}
                    className="text-left bg-card rounded-xl px-5 py-4 hover:bg-white/10 transition-colors border border-white/5 hover:border-white/10"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-bold ${activeCategory.color}`}>{term}</span>
                      <ChevronRight size={14} className={`text-foreground/30 transition-transform ${selectedTerm === term ? 'rotate-90' : ''}`} />
                    </div>
                    <p className="text-xs text-foreground/50">{def.short}</p>
                    {selectedTerm === term && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-3 pt-3 border-t border-white/10"
                      >
                        <p className="text-xs text-foreground/70 leading-relaxed">{def.detail}</p>
                        {def.example && (
                          <p className="text-xs text-foreground/40 italic mt-2">💡 {def.example}</p>
                        )}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
