'use client'

import { useState, useEffect } from 'react'

// Simple Line Chart Component
export function LineChart({ data, title, color = '#2563eb' }: {
  data: Array<{ label: string; value: number }>
  title: string
  color?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !data || data.length === 0) {
    return <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading chart...</p>
    </div>
  }

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  return (
    <div className="h-64 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>
      <div className="relative h-48">
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={`${percent}%`}
              x2="100%"
              y2={`${percent}%`}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}
          
          {/* Chart line */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100
              const y = 100 - ((point.value - minValue) / range) * 100
              return `${x},${y}`
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - ((point.value - minValue) / range) * 100
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill={color}
                className="hover:r-6 transition-all cursor-pointer"
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </circle>
            )
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>{minValue}</span>
        </div>
        
        {/* X-axis labels */}
        <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 mt-2">
          {data.map((point, index) => (
            <span key={index} className="transform -rotate-45 origin-top-left">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Simple Bar Chart Component
export function BarChart({ data, title, color = '#10b981' }: {
  data: Array<{ label: string; value: number }>
  title: string
  color?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !data || data.length === 0) {
    return <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading chart...</p>
    </div>
  }

  const maxValue = Math.max(...data.map(d => d.value))

  return (
    <div className="h-64 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-4">{title}</h4>
      <div className="flex items-end justify-between h-48 gap-2">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t-md transition-all duration-500 hover:opacity-80 cursor-pointer relative group"
                style={{
                  height: `${height}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              >
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </div>
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center transform -rotate-45 origin-top">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// Donut Chart Component
export function DonutChart({ data, title }: {
  data: Array<{ label: string; value: number; color: string }>
  title: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !data || data.length === 0) {
    return <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading chart...</p>
    </div>
  }

  const total = data.reduce((sum, item) => sum + item.value, 0)
  let cumulativePercentage = 0

  const radius = 80
  const strokeWidth = 20
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI

  return (
    <div className="h-64 p-4">
      <h4 className="text-sm font-medium text-gray-700 mb-4 text-center">{title}</h4>
      <div className="flex items-center justify-center">
        <div className="relative">
          <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
            <circle
              stroke="#f3f4f6"
              fill="transparent"
              strokeWidth={strokeWidth}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`
              const strokeDashoffset = -cumulativePercentage * circumference / 100
              cumulativePercentage += percentage

              return (
                <circle
                  key={index}
                  stroke={item.color}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  r={normalizedRadius}
                  cx={radius}
                  cy={radius}
                  className="transition-all duration-500 hover:stroke-opacity-80"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{total}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        </div>
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
export function MetricCard({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon,
  color = 'blue' 
}: {
  title: string
  value: string | number
  change?: string
  trend?: 'up' | 'down' | 'stable'
  icon?: any
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    purple: 'bg-purple-100 text-purple-600'
  }

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    stable: 'text-gray-600'
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && trend && (
            <p className={`text-sm ${trendColors[trend]} flex items-center gap-1 mt-1`}>
              {trend === 'up' && '↗'}
              {trend === 'down' && '↘'}
              {trend === 'stable' && '→'}
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}
