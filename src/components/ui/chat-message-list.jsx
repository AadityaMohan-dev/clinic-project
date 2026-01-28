import React, { useEffect, useRef } from "react";
import { ArrowDown } from "lucide-react";

export function ChatMessageList({ children, className = "" }) {
  const scrollRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [children]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={scrollRef}
        className={`flex flex-col w-full h-full overflow-y-auto scroll-smooth ${className}`}
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex flex-col p-4">{children}</div>
      </div>
    </div>
  );
}