import React from "react";
import Header from "../navbar/Header"; 

function Layout_background({ children, showNavbar = true }) {
  return (
    <div className="relative min-h-screen w-full flex flex-col">
      {/* THE PINNED GRADIENT LAYER */}
      <div 
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: -1,
          background: `radial-gradient(100% 100% at top center, #ffffff 0%, #bfdbfe 100%)`,
          backgroundAttachment: 'fixed'
        }}
      />
      
      {showNavbar && <Header />}
      
      <main className="relative flex-1 w-full z-10">
        {children}
      </main>
    </div>
  );
}

export default Layout_background;