import React from "react";
import Header from "../navbar/Header";
import { BackgroundGradient } from "./ui/bg-gradient";

export default function Layout_background({ children }) {
  return (
    // Ensure the root container is relative and has no background color
    <div className="relative min-h-screen bg-transparent">
      {/* Increased Z-Index to -10 to ensure it's just behind content */}
      <BackgroundGradient className="opacity-100 visible" /> 
      
      <Header />
      
      <main className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
}