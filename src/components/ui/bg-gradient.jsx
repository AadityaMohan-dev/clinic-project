import React from "react";
import { cn } from "../../lib/utils";

export const BackgroundGradient = ({ 
  className,
  // Let's use stronger colors for testing visibility
  gradientFrom = "#ffffff",
  gradientTo = "#bfdbfe", // A clear light blue
  gradientSize = "100% 100%",
  gradientPosition = "top center",
  gradientStop = "0%"
}) => {
  return (
    <div 
      className={cn(
        "fixed inset-0 w-full h-full pointer-events-none",
        className
      )}
      style={{
        zIndex: -1, // Changed from -50 to -1
        background: `radial-gradient(${gradientSize} at ${gradientPosition}, ${gradientFrom} ${gradientStop}, ${gradientTo} 100%)`,
        backgroundAttachment: 'fixed'
      }}
    />
  );
};