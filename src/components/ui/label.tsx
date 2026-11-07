import type { ComponentProps, ReactNode } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@/lib/utils';

export function Label({ className, ...props }: ComponentProps<typeof LabelPrimitive.Root>) {
  return <LabelPrimitive.Root data-slot="label" className={cn('text-[13px] leading-5 font-semibold text-subtle-foreground select-none', className)} {...props} />;
}

/** Label + control + hint/error, stacked. Wrap any Input/Select/Textarea. */
export function Field({ label, hint, error, htmlFor, className, children, required }: { label: ReactNode; hint?: ReactNode; error?: ReactNode; htmlFor?: string; className?: string; children: ReactNode; required?: boolean }) {
  return (
    <div className={cn('flex min-w-0 flex-col gap-1.5', className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
      </Label>
      {children}
      {error ? <p className="text-xs text-danger">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
