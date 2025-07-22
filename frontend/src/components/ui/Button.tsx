import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105',
    secondary: 'bg-white border-2 border-gray-200 hover:border-amber-300 text-gray-700 hover:text-amber-600 shadow-sm hover:shadow-md',
    ghost: 'text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-xl',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm font-medium',
    md: 'px-6 py-3 text-base font-semibold',
    lg: 'px-8 py-4 text-lg font-semibold',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-amber-500/30',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};