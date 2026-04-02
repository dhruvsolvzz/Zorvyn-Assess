import { useState, useMemo, useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { FiSearch, FiFilter, FiPlus, FiEdit2, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { format, parseISO } from 'date-fns';
import { TransactionModal } from './TransactionModal';
import gsap from 'gsap';

export function TransactionManager() {
  const {
    transactions,
    role,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    sortBy,
    setSortBy,
    deleteTransaction,
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const addBtnRef = useRef(null);
  const actionColRefs = useRef([]);
  const tableContainerRef = useRef(null);
  const prevRoleRef = useRef(role);

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
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return b.amount - a.amount;
    });

    return result;
  }, [transactions, searchQuery, activeCategory, sortBy]);

  // Animate admin elements when role changes
  useEffect(() => {
    if (prevRoleRef.current === role) return;
    prevRoleRef.current = role;

    const isAdmin = role === 'admin';

    // Animate the "Add Transaction" button
    if (addBtnRef.current) {
      if (isAdmin) {
        gsap.set(addBtnRef.current, { display: 'flex' });
        gsap.fromTo(
          addBtnRef.current,
          {
            opacity: 0,
            scale: 0.8,
            x: 30,
          },
          {
            opacity: 1,
            scale: 1,
            x: 0,
            duration: 0.6,
            ease: 'back.out(2)',
            delay: 0.3,
          }
        );
      } else {
        gsap.to(addBtnRef.current, {
          opacity: 0,
          scale: 0.8,
          x: 30,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            gsap.set(addBtnRef.current, { display: 'none' });
          },
        });
      }
    }

    // Animate action columns with stagger
    const actionEls = actionColRefs.current.filter(Boolean);
    if (actionEls.length > 0) {
      if (isAdmin) {
        actionEls.forEach((el) => gsap.set(el, { display: 'flex' }));
        gsap.fromTo(
          actionEls,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            stagger: 0.03,
            duration: 0.4,
            ease: 'power3.out',
            delay: 0.4,
          }
        );
      } else {
        gsap.to(actionEls, {
          opacity: 0,
          x: 20,
          stagger: 0.02,
          duration: 0.25,
          ease: 'power2.in',
          onComplete: () => {
            actionEls.forEach((el) => gsap.set(el, { display: 'none' }));
          },
        });
      }
    }

    // Subtle table container flash
    if (tableContainerRef.current) {
      gsap.fromTo(
        tableContainerRef.current,
        { borderColor: isAdmin ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)' },
        {
          borderColor: 'transparent',
          duration: 1.5,
          ease: 'power2.out',
          delay: 0.2,
        }
      );
    }
  }, [role]);

  const handleEdit = (t) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const isAdmin = role === 'admin';

  return (
    <div
      ref={tableContainerRef}
      className="card rounded-2xl shadow-sm overflow-hidden mb-8"
      style={{ border: '2px solid transparent', transition: 'none' }}
    >
      <div className="p-6 border-b flex flex-col xl:flex-row gap-4 justify-between items-center">
        <div className="flex-1 w-full flex flex-col sm:flex-row gap-4">
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
              <span className="hidden sm:inline">Sort: {sortBy === 'date' ? 'Date' : 'Amount'}</span>
            </button>
          </div>
        </div>

        {/* Add Transaction Button — always in DOM, visibility controlled by GSAP */}
        <button
          ref={addBtnRef}
          onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          className="w-full xl:w-auto items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer shadow-md shadow-blue-500/20 whitespace-nowrap"
          style={{ display: isAdmin ? 'flex' : 'none' }}
        >
          <FiPlus className="w-4 h-4" />
          Add Transaction
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
          <thead className="bg-muted/30 text-muted-foreground uppercase tracking-wider text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Type</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th
                className="px-6 py-4 text-right"
                style={{ display: isAdmin ? 'table-cell' : 'none' }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAndSortedTransactions.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-muted-foreground">
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
                <tr key={t.id} className="hover:bg-muted/30 transition-colors group">
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

                  {/* Actions column — always in DOM, animated via GSAP */}
                  <td
                    className="px-6 py-4 text-right"
                    style={{ display: isAdmin ? 'table-cell' : 'none' }}
                  >
                    <div
                      ref={(el) => {
                        actionColRefs.current[index] = el;
                      }}
                      className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                    >
                      <button
                        onClick={() => handleEdit(t)}
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-md transition-colors cursor-pointer"
                      >
                        <FiEdit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTransaction(t.id)}
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

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        transactionToEdit={editingTransaction}
      />
    </div>
  );
}
