import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MapSection from './components/sections/map-section';
import AboutUsSection from './components/sections/about-us-section';
import TestimonialsSection from './components/ui/testimonial-v2'; 
import Hero from './components/sections/hero';
import { AuroraBackground } from './components/ui/aurora-background'; 
import Auth from './auth/Auth';
import AppointmentDashboard from './components/AppointmentDashboard';
import PatientsDetails from './components/PatientsDetails';
import PatientDashboard from './components/PatientDashboard'
import Layout_background from "./components/Layout_background";

/**
 * 1. THE LAYOUT WRAPPER
 * This connects your background logic to the Router's Outlet.
 */
function AppLayout() {
  return (
    <Layout_background>
      <Outlet />
    </Layout_background>
  );
}

/**
 * 2. THE HOME COMPONENT
 * Defined here so the Router can find it.
 */
function Home() {
  return (
    <>
      <AuroraBackground>
        <div className="bg-transparent">
          <Hero />
        </div>
        <div className="bg-transparent">
          <TestimonialsSection />
        </div>
        <div className="bg-transparent pb-10">
          <MapSection />
        </div>
      </AuroraBackground>
      <div className="bg-transparent">
        <AboutUsSection />
      </div>
    </>
  );
}

/**
 * 3. THE 404 COMPONENT
 */
function NotFoundPage() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-900 mb-4">Page not found</p>
        <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block">
          Go Home
        </a>
      </div>
    </div>
  );
}

/**
 * 4. THE MAIN APP COMPONENT
 */
export default function App() {
  return (
    <Router>
      <Routes>
        {/* All routes inside AppLayout share the background and header */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutUsSection />} />
          <Route path="/services" element={<AboutUsSection />} />
          <Route path="/contact" element={<MapSection />} />
          <Route path="/patients/:id" element={<PatientsDetails />} />
          <Route path="/dashboard" element={<AppointmentDashboard />} />
          <Route path="/patientdashboard" element={<PatientDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Auth Route - No Layout (No Header/Global Background) */}
        <Route path="/login" element={<Auth />} />
      </Routes>
    </Router>
  );
}