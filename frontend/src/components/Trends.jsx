import React, { useState, useEffect } from 'react'
import { getTrends } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function Trends() {
  const [trends, setTrends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRegion, setSelectedRegion] = useState('')

  useEffect(() => {
    async function loadTrends() {
      try {
        const data = await getTrends(selectedRegion || null)
        setTrends(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTrends()
  }, [selectedRegion])

  if (loading) return <div className="loading">Loading trends...</div>
  if (error) return <div className="error">Error: {error}</div>

  const regions = [...new Set(trends.map(t => t.region))]
  
  const chartData = trends.flatMap(trend => 
    trend.data.map(d => ({
      region: trend.region,
      year: d.year,
      forest_cover_pct: d.forest_cover_pct,
      annual_loss_pct: d.annual_loss_pct,
      cover_yoy_change: d.cover_yoy_change,
      loss_3yr_avg: d.loss_3yr_avg
    }))
  ).sort((a, b) => a.year - b.year)

  return (
    <div>
      <h1 className="page-title">Forest Cover Trends</h1>

      <div className="chart-controls">
        <select 
          value={selectedRegion} 
          onChange={(e) => setSelectedRegion(e.target.value)}
        >
          <option value="">All Regions</option>
          {regions.map(r => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <h2 className="card-header">Forest Cover Over Time</h2>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2ecc71" />
              <XAxis dataKey="year" stroke="#a8d5a2" />
              <YAxis stroke="#a8d5a2" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1a3d26', border: '1px solid #2ecc71' }}
                labelStyle={{ color: '#fff' }}
              />
              <Legend />
              {selectedRegion ? (
                <Line 
                  type="monotone" 
                  dataKey="forest_cover_pct" 
                  name="Forest Cover %"
                  stroke="#2ecc71" 
                  strokeWidth={2}
                  dot={{ fill: '#2ecc71' }}
                />
              ) : (
                regions.map((region, idx) => (
                  <Line 
                    key={region}
                    type="monotone" 
                    dataKey={(d) => d.region === region ? d.forest_cover_pct : null}
                    name={region}
                    stroke={`hsl(${idx * 36}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ fill: '#2ecc71' }}
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 className="card-header">Trend Analysis by Region</h2>
        <div className="stats-grid">
          {trends.map(trend => (
            <div key={trend.region} className="stat-card">
              <div className="stat-value" style={{ 
                color: trend.trend === 'Worsening' ? '#e74c3c' : 
                      trend.trend === 'Improving' ? '#2ecc71' : '#f39c12' 
              }}>
                {trend.trend}
              </div>
              <div className="stat-label">{trend.region}</div>
              <div className="stat-label">Slope: {trend.slope?.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Trends