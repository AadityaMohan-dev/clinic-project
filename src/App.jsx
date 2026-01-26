import Footer from './navbar/Footer';
import AppointmentDashboard from './components/AppointmentDashboard';
import PatientsDetails from './components/PatientsDetails';
import Auth from './auth/Auth';
import Header from './navbar/Header';

export default function App() {
  return (

    <>
    {/* <Header/> */}
    {/* <Auth/> */}
    <AppointmentDashboard/>
    <PatientsDetails/>
    <Footer/>
    </>
  );
}