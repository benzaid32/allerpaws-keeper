import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MobileCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  icon?: ReactNode;
  title?: string;
  subtitle?: string;
  rightContent?: ReactNode;
  footer?: ReactNode;
  noPadding?: boolean;
  variant?: "default" | "outline" | "ghost" | "highlight";
}

const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  onClick,
  animate = true,
  icon,
  title,
  subtitle,
  rightContent,
  footer,
  noPadding = false,
  variant = "default",
}) => {
  // Determine if the card is interactive
  const isInteractive = !!onClick;

  // Define variant styles
  const variantStyles = {
    default: "bg-card border border-border shadow-sm",
    outline: "bg-transparent border border-border",
    ghost: "bg-transparent border-none",
    highlight: "bg-primary/10 border border-primary/20",
  };

  // Animation variants
  const cardVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    tap: { scale: 0.98 },
  };

  // Wrapper component based on interactivity and animation
  const CardWrapper = isInteractive && animate ? motion.button : animate ? motion.div : "div";
  
  // Props for the wrapper
  const wrapperProps = {
    className: cn(
      "w-full rounded-lg overflow-hidden",
      variantStyles[variant],
      isInteractive && "active:bg-muted/50 transition-colors",
      className
    ),
    onClick,
    ...(animate && {
      initial: "initial",
      animate: "animate",
      whileTap: isInteractive ? "tap" : undefined,
      variants: cardVariants,
      transition: { duration: 0.2 },
    }),
  };

  return (
    <CardWrapper {...wrapperProps}>
      {/* Card header with icon, title, and right content */}
      {(icon || title || subtitle || rightContent) && (
        <div className={cn("flex items-center justify-between", !noPadding && "p-4 pb-2")}>
          <div className="flex items-center gap-3">
            {icon && <div className="flex-shrink-0">{icon}</div>}
            <div>
              {title && <h3 className="font-medium text-base">{title}</h3>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {rightContent && <div>{rightContent}</div>}
        </div>
      )}

      {/* Card content */}
      <div className={cn(!noPadding && "px-4 py-3")}>{children}</div>

      {/* Card footer */}
      {footer && (
        <div className={cn("border-t", !noPadding && "px-4 py-3")}>
          {footer}
        </div>
      )}
    </CardWrapper>
  );
};

export default MobileCard; 