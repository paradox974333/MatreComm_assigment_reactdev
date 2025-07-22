import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <div className="relative inline-block w-full max-w-lg p-8 overflow-hidden text-left align-middle transition-all transform bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl sm:my-8 sm:align-middle animate-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
};