import Hero from './components/sections/hero';
import TestimonialsSection from './components/ui/testimonial-v2';
import { AuroraBackground } from './components/ui/aurora-background';
import MapSection from './components/sections/map-section';
import AboutUsSection from './components/sections/about-us-section';
import Header from './navbar/Header';
import Footer from './navbar/Footer';

export default function App() {
  return (

    <>
    
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
      {/* for a line */}
      {/* <div className="bg-transparent border-t border-neutral-200/50"> */} 
      <div className="bg-transparent ">
         <TestimonialsSection />
      </div>

      {/* 3. Map Section */}
      <div className="bg-transparent pb-10">
        <MapSection />
      </div>
    </AuroraBackground>

    {/* 2. Add About Section Here */}
      <div className="bg-transparent">
        <AboutUsSection />
      </div>
 
    </>
  );
}