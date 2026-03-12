'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, TrendingUp, BarChart2, Globe, HelpCircle, ChevronRight, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { DEFINITIONS } from './EduTooltip';

const CATEGORIES = [
  {
    id: 'basics',
    label: 'Market Basics',
    icon: BookOpen,
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    terms: ['S&P 500', 'NASDAQ', 'Dow Jones', 'Russell 2000', 'Market Cap', 'Symbol', 'Sector', 'Volume'],
  },
  {
    id: 'price',
    label: 'Price & Data',
    icon: TrendingUp,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    terms: ['Price', 'Open', 'High', 'Low', 'Change', 'VWAP', 'Volume Bars', 'Top Gainers', 'Top Losers'],
  },
  {
    id: 'technical',
    label: 'Technical Analysis',
    icon: BarChart2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    terms: ['Candlestick', 'Line Chart', 'Area Chart', 'MA20', 'MA50', 'MA200', 'Heat Map'],
  },
  {
    id: 'forex',
    label: 'Forex & Futures',
    icon: Globe,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    terms: ['Pair', 'Base', 'Quote', 'Rate', 'Bid', 'Ask', 'Major Pairs', 'Cross Pairs', 'Exotic Pairs', 'Contract', 'Equity Futures', 'Commodities', 'Bonds'],
  },
  {
    id: 'sizing',
    label: 'Market Sizing',
    icon: HelpCircle,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    terms: ['Mega Cap', 'Large Cap', 'Mid Cap', 'Min Change', 'Max Change'],
  },
];

const PAGE_TIPS: Record<string, { title: string; terms: string[] }> = {
  '/': { title: 'Dashboard Tips', terms: ['S&P 500', 'NASDAQ', 'Dow Jones', 'Russell 2000', 'Top Gainers', 'Top Losers', 'Volume'] },
  '/markets/stocks': { title: 'Stocks Page Tips', terms: ['Symbol', 'Price', 'Change', 'Open', 'High', 'Low', 'Volume'] },
  '/markets/futures': { title: 'Futures Tips', terms: ['Contract', 'Equity Futures', 'Commodities', 'Bonds', 'Price', 'Change'] },
  '/markets/forex': { title: 'Forex Tips', terms: ['Pair', 'Base', 'Quote', 'Rate', 'Bid', 'Ask', 'Major Pairs', 'Cross Pairs', 'Exotic Pairs'] },
  '/tools/heatmap': { title: 'Heat Map Tips', terms: ['Heat Map', 'Change', 'Sector', 'Market Cap', 'Volume'] },
  '/tools/screener': { title: 'Screener Tips', terms: ['Sector', 'Market Cap', 'Mega Cap', 'Large Cap', 'Mid Cap', 'Min Change', 'Max Change'] },
  '/tools/charts': { title: 'Charts Tips', terms: ['Candlestick', 'Line Chart', 'Area Chart', 'MA20', 'MA50', 'Volume Bars', 'VWAP'] },
};

export default function LearningLab() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('basics');
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [searchVal, setSearchVal] = useState('');
  const [activeTab, setActiveTab] = useState<'learn' | 'page'>('page');
  const pathname = usePathname();

  const pageTip = PAGE_TIPS[pathname] ?? PAGE_TIPS['/'];

  const searchResults = searchVal.length > 1
    ? Object.entries(DEFINITIONS).filter(([term]) =>
        term.toLowerCase().includes(searchVal.toLowerCase())
      )
    : [];

  const activeTerms = activeTab === 'page'
    ? pageTip.terms
    : CATEGORIES.find((c) => c.id === activeCategory)?.terms ?? [];

  return (
    <>
      {/* Floating ? Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-12 h-12 bg-emerald-500 hover:bg-emerald-400 text-background rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center z-40 transition-colors"
        aria-label="Open Learning Lab"
      >
        <HelpCircle size={22} />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setIsOpen(false); setSelectedTerm(null); setSearchVal(''); }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-zinc-950 border-l border-white/10 z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <BookOpen size={16} className="text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Learning Lab</h2>
                    <p className="text-xs text-foreground/40">Financial terms explained</p>
                  </div>
                </div>
                <button
                  onClick={() => { setIsOpen(false); setSelectedTerm(null); setSearchVal(''); }}
                  className="text-foreground/40 hover:text-foreground transition-colors p-1 rounded-lg hover:bg-white/5"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Search */}
              <div className="px-6 py-3 border-b border-white/10">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
                  <input
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search any term..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
              </div>

              {/* Search Results */}
              {searchVal.length > 1 ? (
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-2">
                  <p className="text-xs text-foreground/40 mb-3">{searchResults.length} results for "{searchVal}"</p>
                  {searchResults.map(([term, def]) => (
                    <button
                      key={term}
                      onClick={() => setSelectedTerm(selectedTerm === term ? null : term)}
                      className="w-full text-left bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-emerald-400">{term}</span>
                        <ChevronRight size={14} className={`text-foreground/30 transition-transform ${selectedTerm === term ? 'rotate-90' : ''}`} />
                      </div>
                      <p className="text-xs text-foreground/50 mt-1">{def.short}</p>
                      {selectedTerm === term && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/10">
                          <p className="text-xs text-foreground/70 leading-relaxed">{def.detail}</p>
                          {def.example && <p className="text-xs text-foreground/40 italic mt-2">💡 {def.example}</p>}
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  {/* Tabs */}
                  <div className="flex px-6 pt-4 gap-2">
                    <button
                      onClick={() => setActiveTab('page')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${activeTab === 'page' ? 'bg-emerald-500 text-background' : 'bg-white/5 text-foreground/50 hover:text-foreground'}`}
                    >
                      📍 This Page
                    </button>
                    <button
                      onClick={() => setActiveTab('learn')}
                      className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-colors ${activeTab === 'learn' ? 'bg-emerald-500 text-background' : 'bg-white/5 text-foreground/50 hover:text-foreground'}`}
                    >
                      📚 All Topics
                    </button>
                  </div>

                  {/* This Page tab */}
                  {activeTab === 'page' && (
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                      <p className="text-xs text-foreground/40 mb-4">
                        Key terms for <span className="text-emerald-500 font-semibold">{pageTip.title}</span>
                      </p>
                      <div className="space-y-2">
                        {pageTip.terms.map((term) => {
                          const def = DEFINITIONS[term];
                          if (!def) return null;
                          return (
                            <button
                              key={term}
                              onClick={() => setSelectedTerm(selectedTerm === term ? null : term)}
                              className="w-full text-left bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-emerald-400">{term}</span>
                                <ChevronRight size={14} className={`text-foreground/30 transition-transform ${selectedTerm === term ? 'rotate-90' : ''}`} />
                              </div>
                              <p className="text-xs text-foreground/50 mt-1">{def.short}</p>
                              {selectedTerm === term && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/10">
                                  <p className="text-xs text-foreground/70 leading-relaxed">{def.detail}</p>
                                  {def.example && <p className="text-xs text-foreground/40 italic mt-2">💡 {def.example}</p>}
                                </motion.div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* All Topics tab */}
                  {activeTab === 'learn' && (
                    <div className="flex flex-1 overflow-hidden">
                      {/* Category sidebar */}
                      <div className="w-36 border-r border-white/10 py-4 px-3 space-y-1 flex-shrink-0">
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          return (
                            <button
                              key={cat.id}
                              onClick={() => { setActiveCategory(cat.id); setSelectedTerm(null); }}
                              className={`w-full flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl text-center transition-colors ${
                                activeCategory === cat.id ? `${cat.bg} ${cat.color}` : 'text-foreground/40 hover:text-foreground hover:bg-white/5'
                              }`}
                            >
                              <Icon size={16} />
                              <span className="text-xs font-medium leading-tight">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Terms list */}
                      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                        {CATEGORIES.find((c) => c.id === activeCategory)?.terms.map((term) => {
                          const def = DEFINITIONS[term];
                          if (!def) return null;
                          return (
                            <button
                              key={term}
                              onClick={() => setSelectedTerm(selectedTerm === term ? null : term)}
                              className="w-full text-left bg-white/5 rounded-xl px-4 py-3 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-emerald-400">{term}</span>
                                <ChevronRight size={14} className={`text-foreground/30 transition-transform ${selectedTerm === term ? 'rotate-90' : ''}`} />
                              </div>
                              <p className="text-xs text-foreground/50 mt-1">{def.short}</p>
                              {selectedTerm === term && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 pt-3 border-t border-white/10">
                                  <p className="text-xs text-foreground/70 leading-relaxed">{def.detail}</p>
                                  {def.example && <p className="text-xs text-foreground/40 italic mt-2">💡 {def.example}</p>}
                                </motion.div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Footer */}
              <div className="px-6 py-3 border-t border-white/10">
                <p className="text-xs text-foreground/30 text-center">
                  Hover any <span className="text-emerald-500/60">?</span> icon in the app for quick definitions
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
