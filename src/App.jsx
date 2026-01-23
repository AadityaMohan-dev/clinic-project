import Hero from './components/sections/hero';
import TestimonialsSection from './components/ui/testimonial-v2';
import { AuroraBackground } from './components/ui/aurora-background';

export default function App() {
  return (
    <AuroraBackground>
      {/* We use bg-transparent or bg-white/50 so the Aurora background 
        shows through slightly, or you can keep sections solid white if preferred.
        Based on "background throughout the website", I'll make the containers transparent.
      */}
      
      {/* 1. Hero Section (Responsive YUME Design) */}
      <div className="bg-transparent">
        <Hero />
      </div>

      {/* 2. Review Scroll Section */}
      <div className="bg-transparent border-t border-neutral-200/50">
         <TestimonialsSection />
      </div>
    </AuroraBackground>
  );
}