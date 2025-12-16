import React, { 
  useState, 
  ReactNode, 
  cloneElement, 
  isValidElement, 
  useRef, 
  useEffect 
} from 'react';

// Type for props that will be injected into children
interface DropdownMenuChildProps {
  isOpen?: boolean;
  toggleDropdown?: () => void;
  closeDropdown?: () => void;
}

// Main DropdownMenu component
interface DropdownMenuProps {
  children: ReactNode;
}

export const DropdownMenu = ({ children }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);
  const closeDropdown = () => setIsOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      {React.Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, {
            isOpen,
            toggleDropdown,
            closeDropdown,
          });
        }
        return child;
      })}
    </div>
  );
};


// DropdownContent component
interface DropdownContentProps extends DropdownMenuChildProps {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'right';
}

export const DropdownContent = ({
  children,
  isOpen,
  closeDropdown,
  className = '',
  align = 'left',
}: DropdownContentProps) => {
  if (!isOpen) return null;

  // Close dropdown when clicking on content (optional)
  const handleContentClick = () => {
    closeDropdown?.();
  };

  return (
    <div
      className={`absolute z-50 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
        align === 'right' ? 'right-0' : 'left-0'
      } ${className}`}
      onClick={handleContentClick}
    >
      <div className="py-1" role="menu" aria-orientation="vertical">
        {children}
      </div>
    </div>
  );
};

// DropdownTrigger.tsx
interface DropdownTriggerProps extends DropdownMenuChildProps {
  children: ReactNode;
  className?: string;
}

export const DropdownTrigger = ({
  children,
  isOpen,
  toggleDropdown,
  className = '',
}: DropdownTriggerProps) => {
  return (
    <button
      onClick={toggleDropdown}
      className={className}
      aria-expanded={isOpen}
      aria-haspopup="true"
      type="button"
    >
      {children}
    </button>
  );
};

// DropdownItem.tsx
interface DropdownItemProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const DropdownItem = ({
  children,
  className = '',
  onClick,
  disabled = false,
}: DropdownItemProps) => {
  return (
    <div
      className={`px-4 py-2 text-sm text-left w-full ${
        disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'cursor-pointer hover:bg-gray-100'
      } ${className}`}
      onClick={disabled ? undefined : onClick}
      role="menuitem"
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          onClick?.();
          e.preventDefault();
        }
      }}
      aria-disabled={disabled}
    >
      {children}
    </div>
  );
};