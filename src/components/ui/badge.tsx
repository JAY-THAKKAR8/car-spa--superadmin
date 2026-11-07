import type { ComponentProps } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

export const badgeVariants = cva('inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-transparent px-2.5 py-0.5 text-xs leading-5 font-semibold whitespace-nowrap [&_svg]:size-3', {
  variants: {
    tone: {
      neutral: 'bg-neutral-soft text-neutral',
      brand: 'bg-brand-soft text-brand-on-soft',
      success: 'bg-success-soft text-success',
      warning: 'bg-warning-soft text-warning',
      danger: 'bg-danger-soft text-danger',
      info: 'bg-info-soft text-info',
      purple: 'bg-purple-soft text-purple',
      outline: 'border-border bg-card text-subtle-foreground',
    },
  },
  defaultVariants: { tone: 'neutral' },
});

export interface BadgeProps extends ComponentProps<'span'>, VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

export function Badge({ className, tone, dot, children, ...props }: BadgeProps) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && <span aria-hidden className="size-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
