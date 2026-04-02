import { useMemo, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { FiSearch, FiFilter, FiTrendingUp, FiTrendingDown, FiCalendar, FiTag } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import gsap from 'gsap';

const CATEGORY_COLORS = {
  Salary: { bg: 'rgba(99,102,241,0.12)', text: '#818CF8', border: 'rgba(99,102,241,0.25)' },
  Freelance: { bg: 'rgba(139,92,246,0.12)', text: '#A78BFA', border: 'rgba(139,92,246,0.25)' },
  Housing: { bg: 'rgba(244,63,94,0.12)', text: '#FB7185', border: 'rgba(244,63,94,0.25)' },
  Food: { bg: 'rgba(245,158,11,0.12)', text: '#FBBF24', border: 'rgba(245,158,11,0.25)' },
  Utilities: { bg: 'rgba(6,182,212,0.12)', text: '#22D3EE', border: 'rgba(6,182,212,0.25)' },
  Transport: { bg: 'rgba(59,130,246,0.12)', text: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
  Shopping: { bg: 'rgba(236,72,153,0.12)', text: '#F472B6', border: 'rgba(236,72,153,0.25)' },
  Dining: { bg: 'rgba(251,146,60,0.12)', text: '#FB923C', border: 'rgba(251,146,60,0.25)' },
  Health: { bg: 'rgba(16,185,129,0.12)', text: '#34D399', border: 'rgba(16,185,129,0.25)' },
  Subscriptions: { bg: 'rgba(168,85,247,0.12)', text: '#C084FC', border: 'rgba(168,85,247,0.25)' },
  Travel: { bg: 'rgba(20,184,166,0.12)', text: '#2DD4BF', border: 'rgba(20,184,166,0.25)' },
  Entertainment: { bg: 'rgba(234,179,8,0.12)', text: '#FACC15', border: 'rgba(234,179,8,0.25)' },
};

const DEFAULT_COLOR = { bg: 'rgba(148,163,184,0.12)', text: '#94A3B8', border: 'rgba(148,163,184,0.25)' };

function getCategoryColor(category) {
  return CATEGORY_COLORS[category] || DEFAULT_COLOR;
}

export function UserTransactions() {
  const {
    transactions,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
  } = useStore();

  const containerRef = useRef(null);
  const cardsRef = useRef([]);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return ['All', ...Array.from(cats)];
  }, [transactions]);

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.description.toLowerCase().includes(q));
    }
    if (activeCategory !== 'All') {
      result = result.filter((t) => t.category === activeCategory);
    }
    result.sort((a, b) => {
      if (sortBy === 'date') return new Date(b.date).getTime() - new Date(a.date).getTime();
      return b.amount - a.amount;
    });
    return result;
  }, [transactions, searchQuery, activeCategory, sortBy]);

  // GSAP stagger entrance for cards
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    gsap.fromTo(
      cards,
      { y: 40, opacity: 0, scale: 0.96 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.04,
        duration: 0.6,
        ease: 'power3.out',
        delay: 0.15,
      }
    );
  }, [filteredAndSorted]);

  // Summary statistics
  const totalIncome = filteredAndSorted
    .filter((t) => t.type === 'Income')
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filteredAndSorted
    .filter((t) => t.type === 'Expense')
    .reduce((s, t) => s + t.amount, 0);

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Summary bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm">
          <div className="p-2.5 rounded-xl bg-emerald-500/10">
            <FiTrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Total Income
            </p>
            <p className="text-xl font-black tracking-tight text-emerald-500">
              +${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 rounded-xl border bg-card/60 backdrop-blur-sm">
          <div className="p-2.5 rounded-xl bg-rose-500/10">
            <FiTrendingDown className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Total Expenses
            </p>
            <p className="text-xl font-black tracking-tight text-rose-500">
              -${totalExpense.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => {
            const color = cat === 'All' ? DEFAULT_COLOR : getCategoryColor(cat);
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer border"
                style={{
                  backgroundColor: isActive ? color.bg : 'transparent',
                  color: isActive ? color.text : 'var(--muted-foreground)',
                  borderColor: isActive ? color.border : 'var(--border)',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transaction Cards */}
      {filteredAndSorted.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          <div className="w-16 h-16 rounded-2xl bg-muted mb-4 flex items-center justify-center border mx-auto">
            <FiSearch className="w-6 h-6" />
          </div>
          <p className="text-base font-medium text-foreground">No transactions found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAndSorted.map((t, index) => {
            const color = getCategoryColor(t.category);
            const isIncome = t.type === 'Income';
            return (
              <div
                key={t.id}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group relative rounded-2xl border bg-card/50 backdrop-blur-sm p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
              >
                {/* Decorative gradient bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, ${color.text}, transparent)`,
                  }}
                />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wide"
                      style={{
                        backgroundColor: color.bg,
                        color: color.text,
                        border: `1px solid ${color.border}`,
                      }}
                    >
                      <FiTag className="w-3 h-3" />
                      {t.category}
                    </span>
                  </div>
                  <span
                    className={`text-lg font-black tracking-tight ${
                      isIncome
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-foreground'
                    }`}
                  >
                    {isIncome ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <p className="font-semibold text-sm text-foreground mb-2 leading-snug">
                  {t.description}
                </p>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <FiCalendar className="w-3 h-3" />
                  <span className="text-xs font-medium">
                    {format(parseISO(t.date), 'MMM dd, yyyy')}
                  </span>
                  <span className="mx-1 text-border">·</span>
                  <span
                    className={`text-xs font-bold ${
                      isIncome ? 'text-emerald-500' : 'text-rose-500'
                    }`}
                  >
                    {t.type}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
