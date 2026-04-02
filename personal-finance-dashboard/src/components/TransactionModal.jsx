import { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { useStore } from '../store/useStore';
import gsap from 'gsap';

export function TransactionModal({ isOpen, onClose, transactionToEdit }) {
  const { addTransaction, updateTransaction } = useStore();
  const [visible, setVisible] = useState(false);

  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('Expense');
  const [description, setDescription] = useState('');

  const overlayRef = useRef(null);
  const panelRef = useRef(null);

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

  // GSAP entrance
  useEffect(() => {
    if (isOpen) {
      setVisible(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!visible) return;

    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) return;

    if (isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(
        overlay,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      ).fromTo(
        panel,
        { opacity: 0, scale: 0.92, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: 'back.out(1.7)',
        },
        '-=0.15'
      );
    }
  }, [visible, isOpen]);

  const handleClose = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!overlay || !panel) {
      onClose();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onClose();
      },
    });

    tl.to(panel, {
      opacity: 0,
      scale: 0.92,
      y: 20,
      duration: 0.25,
      ease: 'power2.in',
    }).to(
      overlay,
      { opacity: 0, duration: 0.2, ease: 'power2.in' },
      '-=0.1'
    );
  };

  if (!visible && !isOpen) return null;

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
        id: crypto.randomUUID(),
        date,
        amount: parseFloat(amount),
        category,
        type,
        description,
      });
    }
    handleClose();
  };

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={panelRef}
        className="bg-card text-card-foreground rounded-2xl shadow-xl w-full max-w-md border overflow-hidden"
        style={{ opacity: 0 }}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">
            {transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={handleClose}
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
              onClick={handleClose}
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
