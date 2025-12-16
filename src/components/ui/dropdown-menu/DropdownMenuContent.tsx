import React from 'react';

interface DropdownMenuContentProps {
  children: React.ReactNode;
  isOpen?: boolean;
}

export const DropdownMenuContent = ({ children, isOpen }: DropdownMenuContentProps) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-10">
      {children}
    </div>
  );
};