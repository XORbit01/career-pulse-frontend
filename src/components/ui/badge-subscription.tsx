
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        premium: "border-transparent bg-gradient-to-r from-jobify-blue to-jobify-teal text-white animate-pulse-slow",
      },
      size: {
        default: "px-2.5",
        sm: "px-2",
        lg: "px-3",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeSubscriptionProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const BadgeSubscription = ({
  className,
  variant,
  size,
  ...props
}: BadgeSubscriptionProps) => {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
};

export { BadgeSubscription, badgeVariants };
