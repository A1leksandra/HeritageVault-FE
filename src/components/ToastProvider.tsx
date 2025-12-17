import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, type ToastState } from './Toast';

interface ToastContextType {
  showToast: (message: string, severity?: 'success' | 'info' | 'warning' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toastState, setToastState] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showToast = (message: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToastState({
      open: true,
      message,
      severity,
    });
  };

  const handleClose = () => {
    setToastState((prev) => ({ ...prev, open: false }));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast state={toastState} onClose={handleClose} />
    </ToastContext.Provider>
  );
}

