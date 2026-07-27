import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-xs font-bold tracking-wider rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#ffffff] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-[#ffffff] text-white hover:bg-[#e4e4e7]',
        destructive: 'bg-red-800 text-white hover:bg-red-900',
        outline: 'border border-[#27272a] bg-transparent hover:bg-[#0a0a0a] hover:border-[#ffffff]',
        secondary: 'bg-[#0a0a0a] text-[#ffffff] hover:bg-[#171717]',
        ghost: 'hover:bg-[#0a0a0a] hover:text-[#ffffff]',
        link: 'text-[#ffffff] underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[10px]',
        lg: 'h-12 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
