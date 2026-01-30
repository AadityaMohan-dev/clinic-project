import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MapSection from './components/sections/map-section';
import AboutUsSection from './components/sections/about-us-section';
import TestimonialsSection from './components/ui/testimonial-v2'; 
import Hero from './components/sections/hero';
import { AuroraBackground } from './components/ui/aurora-background';
import Auth from './auth/Auth';
import AppointmentDashboard from './components/AppointmentDashboard';
import PatientsDetails from './components/PatientsDetails';
import PatientDashboard from './components/PatientDashboard';
import Layout_background from "./components/Layout_background";

function AppLayout() {
  return (
    <Layout_background showNavbar={true}>
      <Outlet />
    </Layout_background>
  );
}

function Home() {
  return (
    <AuroraBackground>
      <div className="bg-transparent"><Hero /></div>
      <div className="bg-transparent"><TestimonialsSection /></div>
      <div className="bg-transparent pb-10"><MapSection /></div>
    </AuroraBackground>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        
        <Route 
          path="/login" 
          element={
            <Layout_background showNavbar={false}>
              <Auth />
            </Layout_background>
          } 
        />
        

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<AppointmentDashboard />} />
          <Route path="/about" element={<AboutUsSection />} />
          <Route path="/services" element={<AboutUsSection />} />
          <Route path="/contact" element={<MapSection />} />
          <Route path="/patients/:id" element={<PatientsDetails />} />
          <Route path="/patientdashboard" element={<PatientDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}