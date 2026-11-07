import type { ComponentProps } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold tracking-[-0.01em] transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-spring)] select-none outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 focus-visible:outline-none active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-[inset_0_1px_0_rgb(255_255_255/0.18),0_1px_2px_rgb(11_116_128/0.35)] hover:bg-primary-hover',
        secondary: 'bg-muted text-foreground hover:bg-[#DFE6E8]',
        outline: 'border border-input bg-card text-foreground hover:bg-hover',
        ghost: 'text-subtle-foreground hover:bg-muted hover:text-foreground',
        soft: 'bg-brand-soft text-brand-on-soft hover:bg-brand-soft-strong',
        destructive: 'bg-destructive text-white shadow-xs hover:bg-danger',
        'destructive-outline': 'border border-danger-border bg-card text-danger shadow-xs hover:bg-danger-soft',
        success: 'bg-success text-white shadow-xs hover:bg-[#0E6A3D]',
        link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 rounded-[10px] px-3 text-[13px]',
        default: 'h-10 px-4',
        lg: 'h-12 rounded-[14px] px-5 text-[15px]',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded-[10px]',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button';
  return (
    <Comp data-slot="button" className={cn(buttonVariants({ variant, size }), className)} disabled={asChild ? undefined : disabled || loading} aria-busy={loading || undefined} {...props}>
      {asChild ? (
        children
      ) : (
        <>
          {loading && <Loader2 className="animate-spin" aria-hidden />}
          {children}
        </>
      )}
    </Comp>
  );
}
