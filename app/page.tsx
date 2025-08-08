'use client'

import { useState } from 'react'
import LoginPage from './components/login-page'
import TechnicianDashboard from './components/technician-dashboard'
import DoctorDashboard from './components/doctor-dashboard'

export default function StrokeManagementSystem() {
  const [currentView, setCurrentView] = useState<'login' | 'technician' | 'doctor'>('login')
  const [user, setUser] = useState<any>(null)

  const handleLogin = (userType: 'technician' | 'doctor') => {
    setUser({
      name: userType === 'technician' ? 'Sarah Johnson' : 'Dr. Michael Chen',
      role: userType === 'technician' ? 'Lab Technician' : 'Neurologist',
      initials: userType === 'technician' ? 'SJ' : 'MC'
    })
    setCurrentView(userType)
  }

  const handleLogout = () => {
    setUser(null)
    setCurrentView('login')
  }

  return (
    <div className="min-h-screen">
      {currentView === 'login' && <LoginPage onLogin={handleLogin} />}
      {currentView === 'technician' && user && <TechnicianDashboard user={user} onLogout={handleLogout} />}
      {currentView === 'doctor' && user && <DoctorDashboard user={user} onLogout={handleLogout} />}
    </div>
  )
}
