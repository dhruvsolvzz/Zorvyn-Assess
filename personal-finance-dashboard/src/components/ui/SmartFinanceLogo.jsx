import React from 'react';

export function SmartFinanceLogo({ className = "w-8 h-8" }) {
  return (
    <div className={`relative ${className} group`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md group-hover:scale-110 transition-transform duration-300"
      >
        {/* Background Circle / Subtle Glow */}
        <circle cx="50" cy="50" r="45" fill="currentColor" className="text-primary/5" />
        
        {/* The 'S' Chart Curve */}
        <path
          d="M25 75C25 75 35 85 50 85C65 85 75 75 75 60C75 45 65 35 50 35C35 35 25 45 25 60"
          stroke="url(#sf-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* The Upward Growth Tip */}
        <path
          d="M50 35H75V15"
          stroke="url(#sf-gradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Minimalist Data Points */}
        <circle cx="25" cy="75" r="3" fill="#10B981" />
        <circle cx="75" cy="15" r="4" fill="#6366F1" />

        <defs>
          <linearGradient id="sf-gradient" x1="25" y1="75" x2="75" y2="15" gradientUnits="userSpaceOnUse">
            <stop stopColor="#10B981" />
            <stop offset="0.5" stopColor="#6366F1" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
