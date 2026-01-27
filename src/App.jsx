import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import MapSection from './components/sections/map-section';
import AboutUsSection from './components/sections/about-us-section';
import TestimonialsSection from './components/ui/testimonial-v2'; 
import Hero from './components/sections/hero';
import { AuroraBackground } from './components/ui/aurora-background'; 
import Auth from './auth/Auth';
import Header from './navbar/Header';
import Footer from './navbar/Footer';
import AppointmentDashboard from './components/AppointmentDashboard';
import PatientsDetails from './components/PatientsDetails';
import PatientDashboard from './components/PatientDashboard'

// Layout Component using Outlet
function Layout() {
  return (
    <>
      
      <Header/>
      <main className="min-h-screen">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}

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


// 404 Page
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

// Main App
export default function App() {
  return (
    <Router>
      <Routes>
        {/* Routes with Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth />} />
        <Route path="/about" element={<><Header/> <AboutUsSection /></>} />
        <Route path="/services" element={<><Header/> <AboutUsSection /></>} />
        <Route path="/contact" element={<><Header/> <MapSection /></>} />
        <Route path="/patients/:id" element={<PatientsDetails/>} />
        <Route path="/dashboard" element={<AppointmentDashboard />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Auth Route (No Layout) */}
        <Route path="/login" element={<Auth />} />
      </Routes>
    </Router>
  );
}