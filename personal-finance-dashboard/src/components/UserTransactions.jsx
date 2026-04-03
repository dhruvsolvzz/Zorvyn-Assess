import { useMemo, useRef, useEffect } from 'react';
import { CurrencyDisplay } from './ui/CurrencyDisplay';
import { useStore } from '../store/useStore';
import { FiSearch, FiFilter, FiTrendingUp, FiTrendingDown, FiCalendar, FiTag } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import gsap from 'gsap';

const CATEGORY_COLORS = {
  Salary: { bg: 'rgba(155,164,245,0.08)', text: '#A0A8F8', border: 'rgba(155,164,245,0.15)' },
  Freelance: { bg: 'rgba(167,139,240,0.08)', text: '#B8A4F8', border: 'rgba(167,139,240,0.15)' },
  Housing: { bg: 'rgba(232,120,138,0.08)', text: '#E8788A', border: 'rgba(232,120,138,0.15)' },
  Food: { bg: 'rgba(228,176,96,0.08)', text: '#E4B060', border: 'rgba(228,176,96,0.15)' },
  Utilities: { bg: 'rgba(94,199,212,0.08)', text: '#5EC7D4', border: 'rgba(94,199,212,0.15)' },
  Transport: { bg: 'rgba(139,147,240,0.08)', text: '#8B93F0', border: 'rgba(139,147,240,0.15)' },
  Shopping: { bg: 'rgba(220,130,180,0.08)', text: '#DC82B4', border: 'rgba(220,130,180,0.15)' },
  Dining: { bg: 'rgba(224,160,100,0.08)', text: '#E0A064', border: 'rgba(224,160,100,0.15)' },
  Health: { bg: 'rgba(94,221,181,0.08)', text: '#5EDDB5', border: 'rgba(94,221,181,0.15)' },
  Subscriptions: { bg: 'rgba(180,140,240,0.08)', text: '#B48CF0', border: 'rgba(180,140,240,0.15)' },
  Travel: { bg: 'rgba(80,200,190,0.08)', text: '#50C8BE', border: 'rgba(80,200,190,0.15)' },
  Entertainment: { bg: 'rgba(224,200,80,0.08)', text: '#E0C850', border: 'rgba(224,200,80,0.15)' },
};

const DEFAULT_COLOR = { bg: 'rgba(136,145,165,0.08)', text: '#8891A5', border: 'rgba(136,145,165,0.15)' };

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
            <FiTrendingUp className="w-5 h-5 text-emerald-400 cursor-pointer" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Total Income
            </p>
            <CurrencyDisplay
              amount={totalIncome}
              type="Income"
              showSign={true}
              size="lg"
              className="text-emerald-500"
            />
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
            <CurrencyDisplay
              amount={totalExpense}
              type="Expense"
              showSign={true}
              size="lg"
              className="text-rose-500"
            />
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
                    className={`text-lg font-black tracking-tight ${isIncome
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-foreground'
                      }`}
                  >
                    <CurrencyDisplay
                      amount={t.amount}
                      type={t.type}
                      showSign={true}
                      size="lg"
                    />
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
                    className={`text-xs font-bold ${isIncome ? 'text-emerald-500' : 'text-rose-500'
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
