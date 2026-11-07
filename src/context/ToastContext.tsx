import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ToastVariant = 'success' | 'error' | 'info';
type ToastFn = (message: string, variant?: ToastVariant) => void;
const ToastContext = createContext<ToastFn | null>(null);

const ICON = { success: CheckCircle2, error: XCircle, info: Info };
const TONE = { success: 'text-success', error: 'text-danger', info: 'text-info' };

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<{ id: string; message: string; variant: ToastVariant }[]>([]);

  const dismiss = useCallback((id: string) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const push = useCallback<ToastFn>(
    (message, variant = 'info') => {
      const id = Math.random().toString(36).slice(2);
      setToasts((t) => [...t.slice(-3), { id, message, variant }]);
      setTimeout(() => dismiss(id), variant === 'error' ? 6000 : 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-4 top-4 z-[100] flex flex-col items-center gap-2 sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-6 sm:items-end">
        {toasts.map((t) => {
          const Icon = ICON[t.variant];
          return (
            <div key={t.id} className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-lg border bg-card py-3 pr-2 pl-3.5 text-sm shadow-lg">
              <Icon className={cn('mt-0.5 size-4 shrink-0', TONE[t.variant])} aria-hidden />
              <p className="min-w-0 flex-1 leading-5 text-foreground">{t.message}</p>
              <button type="button" onClick={() => dismiss(t.id)} className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground" aria-label="Dismiss">
                <X className="size-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
