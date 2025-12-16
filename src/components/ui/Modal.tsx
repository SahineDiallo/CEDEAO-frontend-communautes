import React, { useEffect } from 'react';
import { X } from 'lucide-react'; // Import the close icon

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  // Prevent closing the modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault(); // Prevent default Escape behavior
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white w-full max-w-3xl overflow-hidden md:w-3/4 md:rounded-none">
          {/* Fixed Header */}
          <div className="bg-white p-4 border-b border-gray-200 z-10">
            <div className="flex justify-between">
              <h5 className='font-semibold text-xl'>{title}</h5>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" /> {/* Close icon */}
              </button>
            </div>
          </div>

          {/* Scrollable Body */}
          <div className="pt-6 pb-6 px-6 overflow-y-auto" style={{ maxHeight: '80vh' }}>
            {children} {/* Render the form inside the modal */}
          </div>
        </div>
      </div>
  );
};

export default Modal;