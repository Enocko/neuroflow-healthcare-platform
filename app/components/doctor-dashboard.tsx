'use client'

import { useState } from 'react'
import { Home, Users, Activity, Calendar, LogOut, Printer, CheckCircle, MessageSquare, Clock, AlertTriangle, Brain, Zap, FileText, TrendingUp, Bell, Heart, Timer, Target, Award } from 'lucide-react'
import { LineChart, BarChart, DonutChart, MetricCard } from './chart-components'

interface Patient {
  id: number
  name: string
  age: number
  sex: string
  patientId: string
  priority: 'urgent' | 'normal'
  arrivalTime: string
  status: string
  chiefComplaint: string
  vitals: {
    bp: string
    hr: string
    rr: string
    o2sat: string
  }
  labResults: {
    cbc: string
    bmp: string
    coagulation: string
  }
  imaging: string
  timeline: Array<{
    time: string
    event: string
    type: 'admission' | 'lab' | 'imaging' | 'consultation'
  }>
  riskScore: number
  strokeScale: {
    nihss: number
    lastAssessed: string
  }
}

const mockPatients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 65,
    sex: 'M',
    patientId: 'NF001',
    priority: 'urgent',
    arrivalTime: '14:30',
    status: 'Urgent',
    chiefComplaint: 'Sudden onset left-sided weakness',
    vitals: { bp: '180/95', hr: '88', rr: '16', o2sat: '98%' },
    labResults: { cbc: 'Normal', bmp: 'Elevated glucose (180 mg/dL)', coagulation: 'Normal' },
    imaging: 'CT Head: No acute hemorrhage, possible early ischemic changes',
    timeline: [
      { time: '14:30', event: 'Patient admitted to NeuroFlow unit', type: 'admission' },
      { time: '14:45', event: 'Vital signs recorded', type: 'lab' },
      { time: '15:00', event: 'Blood samples collected', type: 'lab' },
      { time: '15:30', event: 'CT scan completed', type: 'imaging' },
      { time: '15:45', event: 'Lab results available', type: 'lab' }
    ],
    riskScore: 85,
    strokeScale: { nihss: 12, lastAssessed: '15:50' }
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 72,
    sex: 'F',
    patientId: 'NF002',
    priority: 'normal',
    arrivalTime: '15:15',
    status: 'Lab Complete',
    chiefComplaint: 'Speech difficulties and confusion',
    vitals: { bp: '165/85', hr: '92', rr: '18', o2sat: '96%' },
    labResults: { cbc: 'Normal', bmp: 'Normal', coagulation: 'Slightly elevated INR' },
    imaging: 'CT Head: Normal, MRI pending',
    timeline: [
      { time: '15:15', event: 'Patient admitted to NeuroFlow unit', type: 'admission' },
      { time: '15:30', event: 'Initial assessment completed', type: 'consultation' },
      { time: '15:45', event: 'Lab results available', type: 'lab' }
    ],
    riskScore: 65,
    strokeScale: { nihss: 8, lastAssessed: '15:45' }
  },
  {
    id: 3,
    name: 'Robert Johnson',
    age: 58,
    sex: 'M',
    patientId: 'NF003',
    priority: 'normal',
    arrivalTime: '15:45',
    status: 'Imaging Done',
    chiefComplaint: 'Dizziness and balance issues',
    vitals: { bp: '140/80', hr: '76', rr: '14', o2sat: '99%' },
    labResults: { cbc: 'Normal', bmp: 'Normal', coagulation: 'Normal' },
    imaging: 'CT Head: Normal, no acute findings',
    timeline: [
      { time: '15:45', event: 'Patient admitted to NeuroFlow unit', type: 'admission' },
      { time: '16:00', event: 'CT scan completed', type: 'imaging' },
      { time: '16:15', event: 'Imaging results reviewed', type: 'consultation' }
    ],
    riskScore: 35,
    strokeScale: { nihss: 3, lastAssessed: '16:00' }
  }
]

// Mock analytics data
const responseTimeData = [
  { label: 'Mon', value: 12 },
  { label: 'Tue', value: 8 },
  { label: 'Wed', value: 15 },
  { label: 'Thu', value: 10 },
  { label: 'Fri', value: 7 },
  { label: 'Sat', value: 11 },
  { label: 'Sun', value: 9 }
]

const outcomeData = [
  { label: 'Jan', value: 94 },
  { label: 'Feb', value: 91 },
  { label: 'Mar', value: 96 },
  { label: 'Apr', value: 89 },
  { label: 'May', value: 92 },
  { label: 'Jun', value: 95 }
]

const treatmentData = [
  { label: 'tPA', value: 45, color: '#3b82f6' },
  { label: 'Thrombectomy', value: 23, color: '#10b981' },
  { label: 'Conservative', value: 67, color: '#f59e0b' },
  { label: 'Transfer', value: 12, color: '#ef4444' }
]

const nihssDistribution = [
  { label: '0-4', value: 34 },
  { label: '5-15', value: 28 },
  { label: '16-20', value: 15 },
  { label: '21-42', value: 8 }
]

interface DoctorDashboardProps {
  user: {
    name: string
    role: string
    initials: string
  }
  onLogout: () => void
}

export default function DoctorDashboard({ user, onLogout }: DoctorDashboardProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [currentView, setCurrentView] = useState<'dashboard' | 'patients' | 'consultations' | 'analytics'>('dashboard')
  const [consultation, setConsultation] = useState({
    diagnosis: '',
    nihss_score: '',
    treatment_plan: '',
    neurologist_notes: ''
  })

  const handleSubmitConsultation = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Consultation completed successfully!')
    setConsultation({
      diagnosis: '',
      nihss_score: '',
      treatment_plan: '',
      neurologist_notes: ''
    })
    setSelectedPatient(null)
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-green-600 bg-green-100'
  }

  const getPatientInitials = (name: string | undefined) => {
    if (!name || typeof name !== 'string') return 'U'
    return name.split(' ')
      .map(n => n && n.length > 0 ? n[0] : '')
      .join('')
      .substring(0, 2) || 'U'
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Critical Alerts */}
      <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Critical Alerts</h3>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between bg-white p-3 rounded-lg">
            <span className="text-sm">John Doe - NIHSS Score: 12 (High Risk)</span>
            <button className="text-red-600 hover:text-red-800 font-medium text-sm">Review</button>
          </div>
          <div className="flex items-center justify-between bg-white p-3 rounded-lg">
            <span className="text-sm">Jane Smith - Elevated INR, requires monitoring</span>
            <button className="text-red-600 hover:text-red-800 font-medium text-sm">Review</button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Active Patients"
          value={mockPatients.length}
          change="+2 from yesterday"
          trend="up"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="High Risk Cases"
          value={mockPatients.filter(p => p && p.riskScore >= 80).length}
          change="Critical attention needed"
          trend="stable"
          icon={Brain}
          color="red"
        />
        <MetricCard
          title="Avg Response Time"
          value="12 min"
          change="-3 min from last week"
          trend="down"
          icon={Clock}
          color="green"
        />
        <MetricCard
          title="Consultations Today"
          value="8"
          change="+1 from yesterday"
          trend="up"
          icon={MessageSquare}
          color="purple"
        />
      </div>

      {/* Patient Risk Assessment */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Patient Risk Assessment</h3>
        <div className="space-y-4">
          {mockPatients.map((patient) => {
            if (!patient || typeof patient !== 'object' || !patient.id) {
              return null
            }
            
            return (
              <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-semibold">
                    {getPatientInitials(patient.name)}
                  </div>
                  <div>
                    <h4 className="font-semibold">{String(patient.name || 'Unknown Patient')}</h4>
                    <p className="text-sm text-gray-600">NIHSS: {patient.strokeScale?.nihss || 'N/A'} • {String(patient.chiefComplaint || 'No complaint')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(patient.riskScore || 0)}`}>
                    Risk: {patient.riskScore || 0}%
                  </div>
                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Review
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-600" />
            <h3 className="font-semibold">Emergency Protocols</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">tPA Administration Protocol</button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">Thrombectomy Criteria</button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">Blood Pressure Management</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
            <h3 className="font-semibold">Documentation</h3>
          </div>
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">Generate Patient Report</button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">Export Lab Results</button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">Treatment Summary</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold">Analytics</h3>
          </div>
          <div className="space-y-2">
            <button 
              onClick={() => setCurrentView('analytics')}
              className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm"
            >
              View Performance Metrics
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">Outcome Statistics</button>
            <button className="w-full text-left p-2 hover:bg-gray-50 rounded text-sm">Quality Indicators</button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Key Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Door-to-Needle Time"
          value="38 min"
          change="-5 min from last month"
          trend="down"
          icon={Timer}
          color="green"
        />
        <MetricCard
          title="Patient Outcomes"
          value="92%"
          change="+3% improvement"
          trend="up"
          icon={Heart}
          color="blue"
        />
        <MetricCard
          title="Diagnostic Accuracy"
          value="96%"
          change="Consistent performance"
          trend="stable"
          icon={Target}
          color="purple"
        />
        <MetricCard
          title="Quality Score"
          value="4.8/5"
          change="+0.2 from last quarter"
          trend="up"
          icon={Award}
          color="yellow"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trends */}
        <div className="bg-white rounded-xl border border-gray-200">
          <LineChart
            data={responseTimeData}
            title="Weekly Response Time Trends (minutes)"
            color="#2563eb"
          />
        </div>

        {/* Patient Outcomes */}
        <div className="bg-white rounded-xl border border-gray-200">
          <LineChart
            data={outcomeData}
            title="Monthly Patient Outcomes (%)"
            color="#10b981"
          />
        </div>

        {/* Treatment Distribution */}
        <div className="bg-white rounded-xl border border-gray-200">
          <DonutChart
            data={treatmentData}
            title="Treatment Type Distribution"
          />
        </div>

        {/* NIHSS Score Distribution */}
        <div className="bg-white rounded-xl border border-gray-200">
          <BarChart
            data={nihssDistribution}
            title="NIHSS Score Distribution"
            color="#8b5cf6"
          />
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Performance Benchmarks</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Benchmark</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Door-to-Needle Time</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">38 min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">&lt; 60 min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45 min</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Exceeding
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Diagnostic Accuracy</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">96%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">&gt; 90%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">93%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Exceeding
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Patient Satisfaction</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.8/5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">&gt; 4.5</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">4.6/5</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Exceeding
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">30-Day Readmission</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">8%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">&lt; 10%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">12%</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Meeting
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-green-700">Key Insights</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">Response times have improved by 15% over the last month due to optimized protocols.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">Patient outcomes are consistently above national benchmarks across all severity levels.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">NIHSS assessments show high accuracy with 96% correlation to final diagnoses.</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-blue-700">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">Consider implementing AI-assisted triage to further reduce door-to-needle times.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">Focus on weekend coverage optimization to maintain consistent response times.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className="text-sm text-gray-700">Expand telemedicine consultations for rural areas to improve access to care.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

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
              onClick={() => setCurrentView('consultations')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'consultations' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Activity size={20} />
              Consultations
            </button>
            <button
              onClick={() => setCurrentView('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={20} />
              Analytics
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
                {currentView === 'dashboard' ? 'Clinical Dashboard' :
                 currentView === 'patients' ? 'Patient Management' :
                 currentView === 'consultations' ? 'Active Consultations' :
                 'Performance Analytics'}
              </h1>
              <p className="text-gray-600">
                {currentView === 'dashboard' ? 'Real-time patient monitoring and clinical decision support' :
                 currentView === 'patients' ? 'Review patient data and prescribe treatments' :
                 currentView === 'consultations' ? 'Manage ongoing patient consultations' :
                 'Track performance metrics and outcomes'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell size={20} />
              </button>
              <div className="flex gap-4">
                <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-blue-600">3</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Pending Reviews</div>
                </div>
                <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-center min-w-[100px]">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Today's Patients</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Render current view */}
        {currentView === 'dashboard' && renderDashboard()}
        {currentView === 'analytics' && renderAnalytics()}
        {(currentView === 'patients' || currentView === 'consultations') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Queue */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Patient Queue</h3>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
                    3 Pending
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {mockPatients.map((patient) => {
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
                        } ${patient.priority === 'urgent' ? 'border-l-4 border-l-red-500' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            patient.priority === 'urgent' ? 'bg-red-500' : 'bg-green-500'
                          }`} />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{String(patient.name || 'Unknown Patient')}</div>
                            <div className="text-sm text-gray-500">Age {patient.age || 'N/A'} • {String(patient.patientId || 'N/A')}</div>
                            <div className="text-xs text-gray-400">Arrived: {String(patient.arrivalTime || 'Unknown')}</div>
                            <div className={`inline-block px-2 py-1 mt-2 text-xs font-semibold rounded-full ${getRiskColor(patient.riskScore || 0)}`}>
                              Risk: {patient.riskScore || 0}%
                            </div>
                          </div>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            patient.status === 'Urgent' ? 'bg-red-100 text-red-700' :
                            patient.status === 'Lab Complete' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {String(patient.status || 'Unknown')}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Patient Details */}
            <div className="lg:col-span-2 space-y-6">
              {selectedPatient ? (
                <>
                  {/* Patient Overview */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Patient Overview</h3>
                        <div className="flex gap-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                            <Printer size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      {/* Patient Header */}
                      <div className="flex items-center gap-5 mb-6 pb-6 border-b border-gray-200">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-xl">
                          {getPatientInitials(selectedPatient.name)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900">{String(selectedPatient.name || 'Unknown Patient')}</h3>
                          <p className="text-gray-600">
                            Age: {selectedPatient.age || 'N/A'} • Sex: {String(selectedPatient.sex || 'N/A')} • ID: {String(selectedPatient.patientId || 'N/A')}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <strong>Chief Complaint:</strong> {String(selectedPatient.chiefComplaint || 'No complaint listed')}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskColor(selectedPatient.riskScore || 0)}`}>
                            Risk Score: {selectedPatient.riskScore || 0}%
                          </div>
                          <p className="text-xs text-gray-500 mt-1">NIHSS: {selectedPatient.strokeScale?.nihss || 'N/A'}</p>
                        </div>
                      </div>

                      {/* Patient Timeline */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Patient Timeline</h4>
                        <div className="space-y-3">
                          {selectedPatient.timeline && selectedPatient.timeline.map((event, index) => {
                            if (!event) return null
                            
                            return (
                              <div key={index} className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  event.type === 'admission' ? 'bg-blue-500' :
                                  event.type === 'lab' ? 'bg-green-500' :
                                  event.type === 'imaging' ? 'bg-purple-500' :
                                  'bg-orange-500'
                                }`} />
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{String(event.event || 'Unknown event')}</span>
                                  <span className="text-xs text-gray-500 ml-2">{String(event.time || 'Unknown time')}</span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Medical Data */}
                      <div className="space-y-6">
                        {/* Vital Signs */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Vital Signs</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600">Blood Pressure</span>
                              <span className="font-semibold">{String(selectedPatient.vitals?.bp || 'N/A')} mmHg</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600">Heart Rate</span>
                              <span className="font-semibold">{String(selectedPatient.vitals?.hr || 'N/A')} bpm</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600">Respiratory Rate</span>
                              <span className="font-semibold">{String(selectedPatient.vitals?.rr || 'N/A')} /min</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600">O2 Saturation</span>
                              <span className="font-semibold">{String(selectedPatient.vitals?.o2sat || 'N/A')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Lab Results */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Laboratory Results</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-medium text-gray-700">CBC:</span>
                              <span className="text-gray-900">{String(selectedPatient.labResults?.cbc || 'N/A')}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-100">
                              <span className="font-medium text-gray-700">BMP:</span>
                              <span className="text-gray-900">{String(selectedPatient.labResults?.bmp || 'N/A')}</span>
                            </div>
                            <div className="flex justify-between py-2">
                              <span className="font-medium text-gray-700">Coagulation:</span>
                              <span className="text-gray-900">{String(selectedPatient.labResults?.coagulation || 'N/A')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Imaging */}
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Imaging Studies</h4>
                          <p className="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                            {String(selectedPatient.imaging || 'No imaging results available')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Treatment Plan */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Treatment Plan</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full uppercase tracking-wide">
                          Consultation
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <form onSubmit={handleSubmitConsultation} className="space-y-6">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Diagnosis</h4>
                          <textarea
                            value={consultation.diagnosis}
                            onChange={(e) => setConsultation({...consultation, diagnosis: e.target.value})}
                            placeholder="Enter primary diagnosis and differential diagnoses..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                          />
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">NIHSS Score</h4>
                          <input
                            type="number"
                            value={consultation.nihss_score}
                            onChange={(e) => setConsultation({...consultation, nihss_score: e.target.value})}
                            placeholder="Enter NIHSS score (0-42)"
                            min="0"
                            max="42"
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">National Institutes of Health Stroke Scale (0-42)</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Treatment Plan</h4>
                          <textarea
                            value={consultation.treatment_plan}
                            onChange={(e) => setConsultation({...consultation, treatment_plan: e.target.value})}
                            placeholder="Describe the recommended treatment plan..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                          />
                        </div>

                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">Neurologist Notes</h4>
                          <textarea
                            value={consultation.neurologist_notes}
                            onChange={(e) => setConsultation({...consultation, neurologist_notes: e.target.value})}
                            placeholder="Additional clinical notes and observations..."
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                          />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <button
                            type="button"
                            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Save Draft
                          </button>
                          <button
                            type="submit"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
                          >
                            Complete Consultation
                            <CheckCircle size={20} />
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Patient Overview</h3>
                  </div>
                  <div className="p-12 text-center">
                    <Users size={64} className="mx-auto text-gray-300 mb-4" />
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Select a Patient</h4>
                    <p className="text-gray-600">Choose a patient from the queue to view their details and medical data.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
