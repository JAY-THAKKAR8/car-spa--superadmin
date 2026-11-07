import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export const fieldControl =
  'w-full min-w-0 rounded-md border border-transparent bg-muted/80 px-3.5 text-sm text-foreground transition-[border-color,box-shadow,background-color] duration-200 outline-none placeholder:text-placeholder hover:bg-muted focus-visible:border-brand focus-visible:bg-card focus-visible:ring-4 focus-visible:ring-ring/15 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70 aria-[invalid=true]:border-danger aria-[invalid=true]:ring-danger/15';

export function Input({ className, type = 'text', ...props }: ComponentProps<'input'>) {
  return <input data-slot="input" type={type} className={cn(fieldControl, 'h-10 py-1 file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium', className)} {...props} />;
}

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return <textarea data-slot="textarea" className={cn(fieldControl, 'min-h-20 py-2 leading-relaxed', className)} {...props} />;
}

/** Native <select> styled like the inputs — keeps keyboard/mobile behaviour and existing value handling. */
export function Select({ className, children, ...props }: ComponentProps<'select'>) {
  return (
    <div className={cn('relative', className)}>
      <select data-slot="select" className={cn(fieldControl, 'h-10 cursor-pointer appearance-none py-1 pr-9')} {...props}>
        {children}
      </select>
      <svg aria-hidden viewBox="0 0 16 16" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="m4 6 4 4 4-4" />
      </svg>
    </div>
  );
}
