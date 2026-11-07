import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  );
}
export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />;
}
export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}
export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return <tr className={cn('border-b border-border/70 transition-colors duration-150 hover:bg-hover data-[clickable=true]:cursor-pointer', className)} {...props} />;
}
export function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return <th className={cn('h-11 px-4 text-left align-middle text-[12px] font-semibold whitespace-nowrap text-muted-foreground first:pl-5 last:pr-5', className)} {...props} />;
}
export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return <td className={cn('px-4 py-3.5 align-middle whitespace-nowrap text-subtle-foreground first:pl-5 last:pr-5', className)} {...props} />;
}
