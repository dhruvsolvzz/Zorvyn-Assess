import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { useStore } from '../store/useStore';

export function TransactionModal({ isOpen, onClose, transactionToEdit }) {
  const { addTransaction, updateTransaction } = useStore();

  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Expense');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (transactionToEdit) {
      setDate(transactionToEdit.date);
      setAmount(transactionToEdit.amount.toString());
      setCategory(transactionToEdit.category);
      setType(transactionToEdit.type);
      setDescription(transactionToEdit.description);
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setAmount('');
      setCategory('');
      setType('Expense');
      setDescription('');
    }
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, {
        date,
        amount: parseFloat(amount),
        category,
        type,
        description,
      });
    } else {
      addTransaction({
        id: Math.random().toString(36).substr(2, 9),
        date,
        amount: parseFloat(amount),
        category,
        type,
        description,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-md border overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring cursor-pointer"
              >
                <option value="Expense">Expense</option>
                <option value="Income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Category</label>
            <input
              type="text"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="e.g. Food, Housing, Salary..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Description</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-background border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="Transaction description"
            />
          </div>

          <div className="mt-6 flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors cursor-pointer shadow-md shadow-blue-500/20"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

