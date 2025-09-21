import React, { useEffect, useRef } from 'react';
import { Modal as ModalType } from '@shared/uiTypes';

interface ModalProps {
  modal: ModalType;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ modal, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && modal.closable !== false) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [modal.closable, onClose]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (modal.closable !== false) {
          onClose();
        }
      }
    };

    if (modal.backdrop !== false) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [modal.closable, modal.backdrop, onClose]);

  const getSizeClasses = (size?: string) => {
    switch (size) {
      case 'sm':
        return 'max-w-md';
      case 'md':
        return 'max-w-lg';
      case 'lg':
        return 'max-w-2xl';
      case 'xl':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-full h-full';
      default:
        return 'max-w-lg';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {modal.backdrop !== false && (
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      )}
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl w-full ${getSizeClasses(modal.size)}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{modal.title}</h3>
            {modal.closable !== false && (
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {modal.content}
          </div>

          {/* Actions */}
          {modal.actions && modal.actions.length > 0 && (
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
              {modal.actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  disabled={action.disabled}
                  className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    action.style === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                      : action.style === 'danger'
                      ? 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500'
                  } ${
                    action.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};