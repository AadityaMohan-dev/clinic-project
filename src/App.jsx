import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/sections/hero';
import { AuroraBackground } from './components/ui/aurora-background';
import TestimonialsSection from './components/ui/testimonial-v2';
import MapSection from './components/sections/map-section';
import AboutUsSection from './components/sections/about-us-section';
import Auth from './auth/Auth';
import Header from './navbar/Header';

import Footer from './navbar/Footer';
import AppointmentDashboard from './components/AppointmentDashboard';
import PatientsDetails from './components/PatientsDetails';

function Home() {
  return (

    <>
    <AuroraBackground>
      <div className="bg-transparent">
        <Hero />
      </div>
      <div className="bg-transparent ">
         <TestimonialsSection />
      </div>
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
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/about" element={<><Header/> <AboutUsSection /></>} />
        <Route path="/services" element={<><Header/> <AboutUsSection /></>} />
        <Route path="/contact" element={<><Header/> <MapSection /></>} />
        <Route path="/dashboard" element={<>
              <Header/>
              <AppointmentDashboard />
              <PatientsDetails />
              <Footer/>
            </>} />
      </Routes>
    </Router>
  );
}