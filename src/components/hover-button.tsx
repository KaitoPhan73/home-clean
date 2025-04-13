"use client";

import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HoverButtonProps {
  defaultNode: ReactNode; // Node mặc định
  hoverNode: ReactNode; // Node khi hover
  tooltipText: string; // Text hiển thị trong tooltip
  href?: string; // Link điều hướng (optional)
  onClick?: () => void; // Custom onClick handler (optional)
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string; // Custom className
}

export function HoverButton({
  defaultNode,
  hoverNode,
  tooltipText,
  href,
  onClick,
  variant = "outline",
  size = "icon",
  className = "",
}: HoverButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    if (href) {
      router.push(href);
    }
    onClick?.();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`transition-all duration-200 ${className}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {isHovered ? hoverNode : defaultNode}
          <span className="sr-only">{tooltipText}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  );
}
