import { Button } from "./button";
import { cn } from "../../lib/utils";
import { ArrowUpRight } from "lucide-react";

interface ButtonColorfulProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
}

export function ButtonColorful({
    className,
    label = "Explore Components",
    ...props
}: ButtonColorfulProps) {
    return (
        <Button
            className={cn(
                "relative h-10 px-2 overflow-hidden",
                "bg-zinc-100", "cursor-pointer",
                "transition-all duration-00",
                "group",
                className
            )}
            {...props}
        >
            {/* Gradient background effect (Customized to Blue & White) */}
            <div
                className={cn(
                    "absolute inset-0",
                    "bg-gradient-to-r from-blue-600 via-blue-400 to-white",
                    "opacity-40 group-hover:opacity-80",
                    "blur transition-opacity duration-500"
                )}
            />

            {/* Content */}
            <div className="relative flex items-center justify-center gap-2">
                <span className="text-black font-medium">{label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-black/90" />
            </div>
        </Button>
    );
}