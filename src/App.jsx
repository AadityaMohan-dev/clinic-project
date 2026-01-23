import { useState } from 'react'
import './App.css'
import AppointmentDashboard from './components/AppointmentDashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <AppointmentDashboard/>
      </div>
    </>
  )
}

export default App
