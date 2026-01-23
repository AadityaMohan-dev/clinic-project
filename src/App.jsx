import { useState } from 'react'
import './App.css'
import AppointmentDashboard from './components/AppointmentDashboard'
import Header from './navbar/Header'
import Footer from './navbar/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header/>
        <AppointmentDashboard/>
        <Footer/>
      </div>
    </>
  )
}

export default App
