import React from "react";
import { cn } from "../../lib/utils"; // Adjust path if your utils is elsewhere

export const ChatInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      autoComplete="off"
      ref={ref}
      name="message"
      className={cn(
        "flex min-h-[50px] w-full rounded-md bg-transparent px-3 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  );
});

ChatInput.displayName = "ChatInput";