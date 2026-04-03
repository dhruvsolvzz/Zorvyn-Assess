import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Finance Data
      transactions: [],
      isLoadingData: false,
      
      // Role State (Directly toggleable without auth)
      role: 'admin', 
      
      // UI State
      searchQuery: '',
      activeCategory: 'All',
      sortBy: 'date',

      // Actions
      setRole: (role) => set({ role }),
      
      fetchTransactions: () => {
        // No-op for localStorage
      },

      addTransaction: (t) => {
        const newTransaction = {
          id: t.id || crypto.randomUUID(),
          date: t.date,
          amount: parseFloat(t.amount),
          category: t.category,
          type: t.type,
          description: t.description,
        };
        set((state) => ({ transactions: [newTransaction, ...state.transactions] }));
      },

      updateTransaction: (id, updated) => {
        set((state) => ({
          transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) }));
      },

      clearAllTransactions: () => {
        set({ transactions: [] });
      },

      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setActiveCategory: (activeCategory) => set({ activeCategory }),
      setSortBy: (sortBy) => set({ sortBy }),
    }),
    { 
      name: 'finance-dashboard-v5-direct-role-toggle',
      partialize: (state) => ({ 
        transactions: state.transactions,
        role: state.role,
        searchQuery: state.searchQuery,
        activeCategory: state.activeCategory,
        sortBy: state.sortBy 
      }) 
    },
  ),
);
