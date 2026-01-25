import Hero from './components/sections/hero';
import TestimonialsSection from './components/ui/testimonial-v2';
import { AuroraBackground } from './components/ui/aurora-background';
import MapSection from './components/sections/map-section';
import Header from './navbar/Header';
import Footer from './navbar/Footer';
import AppointmentDashboard from './components/AppointmentDashboard';
import PatientsDetails from './components/PatientsDetails';
import AddAppointment from './components/modal/AddAppointment';
import { Edit } from 'lucide-react';
import EditAppointment from './components/modal/EditAppointment';

export default function App() {
  return (

    <>
    <AppointmentDashboard/>
    <PatientsDetails/>
    <Footer/>
 
    </>
  );
}