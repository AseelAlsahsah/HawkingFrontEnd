import type { ReactNode } from 'react';  
import { createContext, useContext, useState } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
}

interface ToastContextType {
  addToast: (message: string, type: Toast['type']) => void;
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: Toast['type']) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 5 seconds
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, toasts, removeToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-20 right-4 space-y-3 z-50">
        {toasts.map(toast => (
            <div
            key={toast.id}
            className={`max-w-sm w-full shadow-xl border backdrop-blur-sm animate-in slide-in-from-right-2 fade-in duration-200 ${
                toast.type === 'success' 
                ? 'bg-green-100 border-green-400 text-gray-900' 
                : toast.type === 'error' 
                ? 'bg-red-100 border-red-400 text-gray-900'
                : 'bg-yellow-100 border-yellow-400 text-gray-900'
            }`}
            >
            <div className="p-4">
                <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-5 h-5 mt-0.5 rounded-full ${
                    toast.type === 'success' 
                    ? 'bg-green-100 text-green-600' 
                    : toast.type === 'error' 
                    ? 'bg-red-100 text-red-600'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                    {toast.type === 'success' && '✓'}
                    {/* {toast.type === 'error' && '⚠'} */}
                    {toast.type === 'warning' && '!'}
                </div>
                
                {/* Message */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-5 truncate">{toast.message}</p>
                </div>
                
                {/* Close button */}
                <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 ml-2 p-1 -my-1 text-gray-600 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-150"
                    aria-label="Dismiss"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                </div>
            </div>
            </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
