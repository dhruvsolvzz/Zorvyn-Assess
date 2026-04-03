import React from 'react';

/**
 * Premium Currency Display Component
 * Provides a standardized, high-fidelity way to display monetary values
 * with distinct styling for the currency symbol and tabular numbers.
 */
export const CurrencyDisplay = ({ 
  amount, 
  type, 
  showSign = false, 
  className = "", 
  size = "md" 
}) => {
  const isIncome = type === 'Income';
  const isExpense = type === 'Expense';
  
  const formattingOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };

  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-2xl",
    "2xl": "text-4xl",
    "3xl": "text-5xl",
    "4xl": "text-6xl",
  };

  const sign = isIncome ? "+" : "-";

  return (
    <div className={`inline-flex items-baseline font-black tracking-tight ${sizeClasses[size] || sizeClasses.md} ${className}`}>
      {showSign && (isIncome || isExpense) && (
        <span className={`mr-1 ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
          {sign}
        </span>
      )}
      <span className="text-primary/60 mr-0.5 select-none font-bold">$</span>
      <span className="tabular-nums">
        {Math.abs(amount).toLocaleString(undefined, formattingOptions)}
      </span>
    </div>
  );
};
