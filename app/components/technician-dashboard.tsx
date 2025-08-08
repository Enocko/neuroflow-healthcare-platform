'use client'

import { useState } from 'react'
import { Home, Users, FileText, Search, LogOut, CheckCircle, Info, Plus, UserPlus, Calendar, Clock, AlertTriangle, TrendingUp, Activity } from 'lucide-react'

interface Patient {
  id: number
  name: string
  age: number
  sex: string
  patientId: string
  status: 'pending' | 'urgent' | 'completed'
  chiefComplaint: string
  admissionTime: string
  lastUpdated: string
  priority: 'high' | 'medium' | 'low'
  labResults?: {
    cbc_status: string
    bmp_status: string
    glucose_level: string
    coagulation_status: string
    timestamp: string
    technician: string
  }
}

const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 65,
    sex: 'M',
    patientId: 'NF001',
    status: 'pending',
    chiefComplaint: 'Sudden onset left-sided weakness',
    admissionTime: '2024-01-15 14:30',
    lastUpdated: '2024-01-15 15:45',
    priority: 'high',
    labResults: {
      cbc_status: 'normal',
      bmp_status: 'abnormal',
      glucose_level: '180',
      coagulation_status: 'normal',
      timestamp: '2024-01-15 15:30',
      technician: 'Sarah Johnson'
    }
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 72,
    sex: 'F',
    patientId: 'NF002',
    status: 'urgent',
    chiefComplaint: 'Speech difficulties and confusion',
    admissionTime: '2024-01-15 15:15',
    lastUpdated: '2024-01-15 15:20',
    priority: 'high'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    age: 58,
    sex: 'M',
    patientId: 'NF003',
    status: 'completed',
    chiefComplaint: 'Dizziness and balance issues',
    admissionTime: '2024-01-15 15:45',
    lastUpdated: '2024-01-15 16:30',
    priority: 'medium',
    labResults: {
      cbc_status: 'normal',
      bmp_status: 'normal',
      glucose_level: '95',
      coagulation_status: 'normal',
      timestamp: '2024-01-15 16:15',
      technician: 'Sarah Johnson'
    }
  }
]

interface TechnicianDashboardProps {
  user: {
    name: string
    role: string
    initials: string
  }
  onLogout: () => void
}

export default function TechnicianDashboard({ user, onLogout }: TechnicianDashboardProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [currentView, setCurrentView] = useState<'dashboard' | 'patients' | 'lab-results'>('dashboard')
  const [patients, setPatients] = useState<Patient[]>(mockPatients)
  const [labResults, setLabResults] = useState({
    cbc_status: '',
    bmp_status: '',
    glucose_level: '',
    coagulation_status: ''
  })
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    sex: '',
    chiefComplaint: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  })

  // Safe filter function without toLowerCase
  const filteredPatients = patients.filter(patient => {
    // Ensure patient exists and has required properties
    if (!patient || typeof patient !== 'object') return false
    
    const searchValue = searchTerm ? String(searchTerm).trim() : ''
    if (!searchValue) return true
    
    // Safe string conversion with fallbacks - NO toLowerCase
    const patientName = patient.name ? String(patient.name) : ''
    const patientId = patient.patientId ? String(patient.patientId) : ''
    
    return patientName.includes(searchValue) || patientId.includes(searchValue)
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e?.target?.value || ''
    setSearchTerm(String(value))
  }

  const handleSubmitResults = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || !user) return

    const updatedPatients = patients.map(patient => {
      if (patient && patient.id === selectedPatient.id) {
        return {
          ...patient,
          labResults: {
            ...labResults,
            timestamp: new Date().toISOString(),
            technician: String(user.name || 'Unknown')
          },
          status: 'completed' as const,
          lastUpdated: new Date().toISOString()
        }
      }
      return patient
    })

    setPatients(updatedPatients)
    alert('Lab results saved successfully!')
    setLabResults({
      cbc_status: '',
      bmp_status: '',
      glucose_level: '',
      coagulation_status: ''
    })
    setSelectedPatient(null)
  }

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault()
    
    const patientIds = patients.map(p => p?.id || 0).filter(id => id > 0)
    const nextId = patientIds.length > 0 ? Math.max(...patientIds) + 1 : 1
    const nextPatientId = `NF${String(nextId).padStart(3, '0')}`
    
    const patient: Patient = {
      id: nextId,
      name: String(newPatient.name || ''),
      age: parseInt(String(newPatient.age || '0')) || 0,
      sex: String(newPatient.sex || ''),
      patientId: nextPatientId,
      status: 'pending',
      chiefComplaint: String(newPatient.chiefComplaint || ''),
      admissionTime: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      priority: newPatient.priority || 'medium'
    }

    setPatients([...patients, patient])
    setNewPatient({
      name: '',
      age: '',
      sex: '',
      chiefComplaint: '',
      priority: 'medium'
    })
    setShowAddPatient(false)
    alert('Patient added successfully!')
  }

  const getStatusColor = (status: string) => {
    switch (String(status || '')) {
      case 'urgent': return 'bg-red-100 text-red-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'completed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (String(priority || '')) {
      case 'high': return 'bg-red-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending Labs</p>
              <p className="text-2xl font-bold text-yellow-600">
                {patients.filter(p => p && p.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Urgent Cases</p>
              <p className="text-2xl font-bold text-red-600">
                {patients.filter(p => p && p.status === 'urgent').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-green-600">
                {patients.filter(p => p && p.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowAddPatient(true)}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
          >
            <UserPlus className="w-6 h-6 text-blue-600" />
            <span className="font-medium">Add New Patient</span>
          </button>
          
          <button
            onClick={() => setCurrentView('lab-results')}
            className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all"
          >
            <FileText className="w-6 h-6 text-green-600" />
            <span className="font-medium">View Lab Results</span>
          </button>

          <button className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all">
            <TrendingUp className="w-6 h-6 text-purple-600" />
            <span className="font-medium">Generate Report</span>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {patients.slice(0, 5).map((patient) => {
            if (!patient) return null
            
            return (
              <div key={patient.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(patient.priority)}`} />
                <div className="flex-1">
                  <p className="font-medium">{String(patient.name || 'Unknown Patient')}</p>
                  <p className="text-sm text-gray-600">{String(patient.chiefComplaint || 'No complaint listed')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {patient.lastUpdated ? new Date(patient.lastUpdated).toLocaleTimeString() : 'Unknown time'}
                  </p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                    {String(patient.status || 'unknown')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  const renderLabResults = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Lab Results Overview</h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Results
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Filter Results
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CBC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BMP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Glucose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coagulation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Technician</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.filter(p => p && p.labResults).map((patient) => {
                if (!patient || !patient.labResults) return null
                
                return (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getPatientInitials(patient.name)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{String(patient.name || 'Unknown')}</div>
                          <div className="text-sm text-gray-500">{String(patient.patientId || 'N/A')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.labResults.cbc_status === 'normal' ? 'bg-green-100 text-green-800' :
                        patient.labResults.cbc_status === 'abnormal' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {String(patient.labResults.cbc_status || 'pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.labResults.bmp_status === 'normal' ? 'bg-green-100 text-green-800' :
                        patient.labResults.bmp_status === 'abnormal' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {String(patient.labResults.bmp_status || 'pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(patient.labResults.glucose_level || 'N/A')} mg/dL
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        patient.labResults.coagulation_status === 'normal' ? 'bg-green-100 text-green-800' :
                        patient.labResults.coagulation_status === 'abnormal' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {String(patient.labResults.coagulation_status || 'pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {String(patient.labResults.technician || 'Unknown')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {patient.labResults.timestamp ? new Date(patient.labResults.timestamp).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const getPatientInitials = (name: string | undefined) => {
    if (!name || typeof name !== 'string') return 'U'
    return name.split(' ')
      .map(n => n && n.length > 0 ? n[0] : '')
      .join('')
      .substring(0, 2) || 'U'
  }

  // Safety check for user
  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="#ffffff"/>
              </svg>
            </div>
            <span className="font-bold text-lg">NeuroFlow</span>
          </div>
        </div>

        <nav className="flex-1 p-6">
          <div className="space-y-2">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Home size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentView('patients')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'patients' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              Patients
            </button>
            <button
              onClick={() => setCurrentView('lab-results')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'lab-results' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText size={20} />
              Lab Results
            </button>
          </div>
        </nav>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                {String(user.initials || 'U')}
              </div>
              <div>
                <div className="font-semibold text-sm">{String(user.name || 'Unknown User')}</div>
                <div className="text-xs text-gray-500">{String(user.role || 'Unknown Role')}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentView === 'dashboard' ? 'Technician Dashboard' :
                 currentView === 'patients' ? 'Patient Management' :
                 'Lab Results'}
              </h1>
              <p className="text-gray-600">
                {currentView === 'dashboard' ? 'Overview of patient data and lab activities' :
                 currentView === 'patients' ? 'Manage patient records and lab result entry' :
                 'View and manage laboratory test results'}
              </p>
            </div>
            {currentView === 'patients' && (
              <button
                onClick={() => setShowAddPatient(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={20} />
                Add Patient
              </button>
            )}
          </div>
        </header>

        {/* Render current view */}
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'lab-results' && renderLabResults()}
        {currentView === 'patients' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Selection */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Select Patient</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                    Step 1
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search by patient name or ID..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  />
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredPatients.map((patient) => {
                    // Early return if patient is invalid
                    if (!patient || typeof patient !== 'object' || !patient.id) {
                      return null
                    }
                    
                    return (
                      <div
                        key={patient.id}
                        onClick={() => setSelectedPatient(patient)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedPatient?.id === patient.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(patient.priority)}`} />
                            <div>
                              <div className="font-semibold text-gray-900">{String(patient.name || 'Unknown Patient')}</div>
                              <div className="text-sm text-gray-500">
                                ID: {String(patient.patientId || 'N/A')} • Age: {patient.age || 'N/A'} • {patient.sex === 'M' ? 'Male' : patient.sex === 'F' ? 'Female' : 'Unknown'}
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                            {patient.status === 'urgent' ? 'Urgent' :
                             patient.status === 'pending' ? 'Lab Pending' : 'Completed'}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Lab Results Form */}
            {selectedPatient && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Lab Results Entry</h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                      Step 2
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  {/* Selected Patient Info */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                      {getPatientInitials(selectedPatient.name)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{String(selectedPatient.name || 'Unknown Patient')}</h4>
                      <p className="text-sm text-gray-600">
                        Age: {selectedPatient.age || 'N/A'} • Sex: {selectedPatient.sex || 'N/A'} • ID: {String(selectedPatient.patientId || 'N/A')}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitResults} className="space-y-6">
                    {/* CBC Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Complete Blood Count (CBC)</h4>
                      <select
                        value={labResults.cbc_status}
                        onChange={(e) => setLabResults({...labResults, cbc_status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      >
                        <option value="">Select status...</option>
                        <option value="normal">Normal</option>
                        <option value="abnormal">Abnormal</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    {/* BMP Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Basic Metabolic Panel (BMP)</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">BMP Status</label>
                          <select
                            value={labResults.bmp_status}
                            onChange={(e) => setLabResults({...labResults, bmp_status: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                          >
                            <option value="">Select status...</option>
                            <option value="normal">Normal</option>
                            <option value="abnormal">Abnormal</option>
                            <option value="pending">Pending</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Glucose Level (mg/dL)</label>
                          <input
                            type="number"
                            value={labResults.glucose_level}
                            onChange={(e) => setLabResults({...labResults, glucose_level: e.target.value})}
                            placeholder="Enter glucose level"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Coagulation Section */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Coagulation Studies</h4>
                      <select
                        value={labResults.coagulation_status}
                        onChange={(e) => setLabResults({...labResults, coagulation_status: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      >
                        <option value="">Select status...</option>
                        <option value="normal">Normal</option>
                        <option value="abnormal">Abnormal</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => {
                          setLabResults({
                            cbc_status: '',
                            bmp_status: '',
                            glucose_level: '',
                            coagulation_status: ''
                          })
                        }}
                        className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear
                      </button>
                      <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                      >
                        Save Lab Results
                        <CheckCircle size={20} />
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Patient Modal */}
        {showAddPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold">Add New Patient</h3>
              </div>
              <form onSubmit={handleAddPatient} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sex</label>
                    <select
                      value={newPatient.sex}
                      onChange={(e) => setNewPatient({...newPatient, sex: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
                  <select
                    value={newPatient.priority}
                    onChange={(e) => setNewPatient({...newPatient, priority: e.target.value as 'high' | 'medium' | 'low'})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chief Complaint</label>
                  <textarea
                    value={newPatient.chiefComplaint}
                    onChange={(e) => setNewPatient({...newPatient, chiefComplaint: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPatient(false)}
                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
