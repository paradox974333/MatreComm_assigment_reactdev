import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  id,
  ...props
}) => {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={id} className="block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-4 py-3 border-2 border-gray-200 rounded-xl shadow-sm transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-amber-500/30 focus:border-amber-400 bg-gray-50/50 focus:bg-white',
          error && 'border-red-400 focus:ring-red-500/30 focus:border-red-400',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
};