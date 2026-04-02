import { useState, useMemo, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiShield,
  FiDatabase,
} from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { TransactionModal } from './TransactionModal';
import gsap from 'gsap';

export function AdminTransactions() {
  const {
    transactions,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    deleteTransaction,
    clearAllTransactions,
  } = useStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data? This action cannot be undone.')) {
      clearAllTransactions();
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const headerRef = useRef(null);
  const toolbarRef = useRef(null);
  const tableRef = useRef(null);
  const rowRefs = useRef([]);

  const categories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category));
    return ['All', ...Array.from(cats)];
  }, [transactions]);

  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter((t) => t.description.toLowerCase().includes(lowerQ));
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

  // GSAP entrance animation
  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (headerRef.current) {
      tl.fromTo(
        headerRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 }
      );
    }
    if (toolbarRef.current) {
      tl.fromTo(
        toolbarRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    }
    if (tableRef.current) {
      tl.fromTo(
        tableRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5 },
        '-=0.3'
      );
    }

    return () => tl.kill();
  }, []);

  // GSAP row stagger when data changes
  useEffect(() => {
    const rows = rowRefs.current.filter(Boolean);
    if (rows.length === 0) return;

    gsap.fromTo(
      rows,
      { x: -15, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.03,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.1,
      }
    );
  }, [filteredAndSortedTransactions]);

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    // Find the row element and animate it out before deleting
    const rowIndex = filteredAndSortedTransactions.findIndex((t) => t.id === id);
    const rowEl = rowRefs.current[rowIndex];

    if (rowEl) {
      gsap.to(rowEl, {
        x: 60,
        opacity: 0,
        height: 0,
        padding: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => deleteTransaction(id),
      });
    } else {
      deleteTransaction(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin header badge */}
      <div
        ref={headerRef}
        className="flex items-center gap-3 p-4 rounded-xl border bg-card/60 backdrop-blur-sm"
        style={{
          borderColor: 'rgba(99,102,241,0.2)',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.05), transparent)',
        }}
      >
        <div className="p-2.5 rounded-xl bg-primary/10">
          <FiShield className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-foreground">Admin Control Panel</p>
          <p className="text-xs text-muted-foreground">
            Full access — Create, edit, and delete transactions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FiDatabase className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground">
            {transactions.length} records
          </span>
        </div>
      </div>

      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className="card rounded-2xl shadow-sm overflow-hidden"
        style={{ borderColor: 'rgba(99,102,241,0.15)' }}
      >
        <div className="p-5 border-b flex flex-col xl:flex-row gap-4 justify-between items-center">
          <div className="flex-1 w-full flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="appearance-none bg-background border rounded-lg pl-9 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
                className="flex items-center gap-2 px-3 py-2 bg-background border rounded-lg text-sm font-medium hover:bg-muted cursor-pointer"
              >
                <span className="inline-flex items-center">
                  <FiArrowUp className="h-4 w-4 -mr-1" />
                  <FiArrowDown className="h-4 w-4" />
                </span>
                <span className="hidden sm:inline">
                  Sort: {sortBy === 'date' ? 'Date' : 'Amount'}
                </span>
              </button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-xl text-sm font-semibold transition-all cursor-pointer hover:bg-rose-500/20 active:scale-[0.98]"
            >
              <FiTrash2 className="w-4 h-4" />
              Reset All
            </button>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-2.5 text-white rounded-xl text-sm font-semibold transition-all cursor-pointer shadow-lg whitespace-nowrap hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, #6366F1, #818CF8)',
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
              }}
            >
              <FiPlus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>

        {/* Table */}
        <div ref={tableRef} className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[700px]">
            <thead className="bg-muted/30 text-muted-foreground uppercase tracking-wider text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-2xl bg-muted mb-4 flex items-center justify-center border">
                        <FiSearch className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <p className="text-base font-medium text-foreground">No transactions found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAndSortedTransactions.map((t, index) => (
                  <tr
                    key={t.id}
                    ref={(el) => (rowRefs.current[index] = el)}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-foreground/80">
                      {format(parseISO(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 font-medium">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.type === 'Income'
                            ? 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-rose-100/50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                        }`}
                      >
                        {t.type}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-right font-semibold ${
                        t.type === 'Income' ? 'text-emerald-600 dark:text-emerald-400' : ''
                      }`}
                    >
                      {t.type === 'Income' ? '+' : '-'}$
                      {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(t)}
                          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors cursor-pointer"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors cursor-pointer"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
}
