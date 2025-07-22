import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  hover = false 
}) => {
  return (
    <div
      className={cn(
        'bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100/50',
        hover && 'hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-200/50 hover:-translate-y-1 transition-all duration-500 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('p-8 pb-4', className)}>
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cn('p-8 pt-0', className)}>
    {children}
  </div>
);