import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-base)]',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-soft)]',
        outline:
          'border border-[var(--border)] bg-[var(--bg-base)] px-4 py-2 text-[var(--text-1)] hover:bg-[var(--bg-soft)]',
        ghost:
          'px-3 py-2 text-[var(--text-2)] hover:bg-[var(--bg-soft)] hover:text-[var(--text-1)]'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, type = 'button', ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export { Button, buttonVariants }
