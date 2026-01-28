import React, { useState } from "react";
import { Menu, X, Phone, Calendar } from "lucide-react";
import { BookingModal } from "../components/modal/BookingModal";

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
  ];

  const handleOpenBooking = (e) => {
    if (e) e.preventDefault();
    setIsBookingOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Main Header Container - Transparent and Fixed */}
      <header className="sticky top-0 z-50 w-full px-4 py-4 sm:px-6 lg:px-8 bg-transparent">
        
        {/* Floating Pill Wrapper */}
        <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-full border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.08)] px-6 py-2">
          <div className="flex justify-between items-center h-12 md:h-14">
            
            {/* Logo Section */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-400 rounded-full shadow-inner transform group-hover:scale-110 transition-transform duration-300">
                </div>
                <div className="hidden md:block">
                  <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                    O Dental Clinic
                  </h1>
                </div>
              </a>
            </div>

            {/* Centered Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-700 font-medium text-sm hover:text-black transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Desktop CTA Button (Pill Shape) */}
            <div className="hidden lg:flex items-center">
              <button
                onClick={handleOpenBooking}
                className="px-6 py-2 bg-black text-white rounded-full hover:bg-neutral-800 transition-all duration-300 font-medium text-sm shadow-sm active:scale-95"
              >
                Book Now
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="lg:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown (Matches Pill Design) */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out mt-2 ${
            isMobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-gray-100 shadow-xl px-4 py-6 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-200 font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <button
              onClick={handleOpenBooking}
              className="w-full mt-4 px-4 py-3 bg-black text-white rounded-full font-bold shadow-md active:scale-95"
            >
              Book Now
            </button>
          </div>
        </div>
      </header>

      {/* Booking Window Integration */}
      <BookingModal 
        isOpen={isBookingOpen} 
        onClose={() => setIsBookingOpen(false)} 
      />
    </>
  );
}

export default Header;