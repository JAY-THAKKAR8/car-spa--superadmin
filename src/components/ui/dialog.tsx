import type { ComponentProps, ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

export function DialogContent({ className, children, size = 'md', ...props }: ComponentProps<typeof DialogPrimitive.Content> & { size?: 'sm' | 'md' | 'lg' }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0E2A30]/35 backdrop-blur-[6px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          'fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-2xl bg-card shadow-xl outline-none ring-1 ring-black/5',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-[0.96] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-[0.94] data-[state=open]:slide-in-from-bottom-4 duration-300 ease-[var(--ease-spring)]',
          { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }[size],
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute top-4 right-4 grid size-7 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-[#DFE6E8] hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/35 focus-visible:outline-none">
          <X className="size-3.5" strokeWidth={2.5} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
export function DialogHeader({ title, description, icon }: { title: ReactNode; description?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex gap-3.5 px-6 pt-6 pb-2 pr-14">
      {icon && <div className="grid size-10 shrink-0 place-items-center rounded-[12px] bg-brand-soft text-primary [&_svg]:size-5">{icon}</div>}
      <div className="min-w-0">
        <DialogPrimitive.Title className="text-[19px] leading-7 font-semibold tracking-[-0.02em]">{title}</DialogPrimitive.Title>
        {description ? <DialogPrimitive.Description className="mt-0.5 text-[13px] text-muted-foreground">{description}</DialogPrimitive.Description> : <DialogPrimitive.Description className="sr-only">{typeof title === 'string' ? title : 'Dialog'}</DialogPrimitive.Description>}
      </div>
    </div>
  );
}
export function DialogBody({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex-1 overflow-y-auto px-6 py-5', className)} {...props} />;
}
export function DialogFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('flex flex-col-reverse gap-2 px-6 pt-2 pb-6 sm:flex-row sm:justify-end', className)} {...props} />;
}

/** Side drawer (mobile navigation). */
export function SheetContent({ className, children, side = 'left', ...props }: ComponentProps<typeof DialogPrimitive.Content> & { side?: 'left' | 'right' }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#0E2A30]/40 backdrop-blur-[4px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
      <DialogPrimitive.Content
        className={cn(
          'fixed inset-y-0 z-50 flex w-[min(85vw,300px)] flex-col bg-lacquer text-lacquer-text shadow-xl outline-none duration-300 ease-[var(--ease-spring)] data-[state=closed]:animate-out data-[state=open]:animate-in',
          side === 'left' ? 'left-0 data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left' : 'right-0 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right',
          className,
        )}
        {...props}
      >
        <DialogPrimitive.Title className="sr-only">Navigation</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">Main navigation</DialogPrimitive.Description>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
