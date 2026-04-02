import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set) => ({
      transactions: [],
      role: 'admin',
      searchQuery: '',
      activeCategory: 'All',
      sortBy: 'date',
      addTransaction: (t) => set((state) => ({ transactions: [...state.transactions, t] })),
      updateTransaction: (id, updated) =>
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        })),
      deleteTransaction: (id) =>
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),
      clearAllTransactions: () => set({ transactions: [] }),
      setRole: (role) => set({ role }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    { name: 'finance-dashboard-storage' },
  ),
);

