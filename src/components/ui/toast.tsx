'use client';

import { createContext, useCallback, useContext, useState, useEffect, useRef } from 'react';

type ToastVariant = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  title: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (opts: { title: string; variant?: ToastVariant }) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, variant = 'info' }: { title: string; variant?: ToastVariant }) => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, title, variant }]);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast container */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: number) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // trigger enter animation on next frame
    requestAnimationFrame(() => setVisible(true));

    timerRef.current = setTimeout(() => {
      setVisible(false);
      // allow exit animation to play before removing
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [toast.id, onDismiss]);

  const borderColor =
    toast.variant === 'success'
      ? '#22c55e'
      : toast.variant === 'error'
        ? '#d9453b'
        : '#3a322a';

  const accentColor =
    toast.variant === 'success'
      ? '#22c55e'
      : toast.variant === 'error'
        ? '#d9453b'
        : '#a09484';

  return (
    <div
      role="alert"
      style={{
        pointerEvents: 'auto',
        background: '#1c1915',
        border: `1px solid ${borderColor}`,
        borderRadius: 8,
        padding: '12px 20px',
        minWidth: 280,
        maxWidth: 400,
        boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateX(0)' : 'translateX(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: "'DM Sans', 'Space Grotesk', system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 600,
          color: '#f0e8dc',
          letterSpacing: 0.5,
        }}
      >
        {toast.title}
      </p>
      <div
        style={{
          marginTop: 6,
          height: 2,
          borderRadius: 1,
          background: `linear-gradient(90deg, ${accentColor}, transparent)`,
          animation: 'toast-progress 3s linear forwards',
        }}
      />
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
