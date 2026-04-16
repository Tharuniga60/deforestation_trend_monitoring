import React, { useState, useEffect } from 'react'
import { getSummary, getHotspots } from '../services/api'

function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        const [summaryData, hotspotsData] = await Promise.all([
          getSummary(),
          getHotspots(5)
        ])
        setSummary(summaryData)
        setHotspots(hotspotsData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) return <div className="loading">Loading dashboard...</div>
  if (error) return <div className="error">Error: {error}</div>

  const getRiskColor = (label) => {
    if (label === 'Critical') return 'risk-critical'
    if (label === 'High') return 'risk-high'
    if (label === 'Medium') return 'risk-medium'
    return 'risk-low'
  }

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{summary?.latest_year}</div>
          <div className="stat-label">Latest Year</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary?.avg_forest_cover_pct?.toFixed(1)}%</div>
          <div className="stat-label">Avg Forest Cover</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{(summary?.total_annual_loss_ha / 1000).toFixed(0)}K</div>
          <div className="stat-label">Total Annual Loss (ha)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary?.global_trend}</div>
          <div className="stat-label">Global Trend</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary?.regions_analyzed}</div>
          <div className="stat-label">Regions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary?.countries_analyzed}</div>
          <div className="stat-label">Countries</div>
        </div>
      </div>

      <div className="card">
        <h2 className="card-header">Top Deforestation Hotspots</h2>
        <div className="hotspot-list">
          {hotspots.map((hotspot, index) => (
            <div key={hotspot.region} className="hotspot-item">
              <div className="hotspot-rank">{index + 1}</div>
              <div className="hotspot-info">
                <div className="hotspot-name">{hotspot.region}</div>
                <div className="hotspot-details">
                  Loss: {hotspot.avg_annual_loss_pct?.toFixed(2)}% | 
                  {hotspot.avg_annual_loss_ha?.toLocaleString()} ha/year |
                  Risk: <span className={getRiskColor(hotspot.avg_risk_level)}>{hotspot.avg_risk_level}</span>
                </div>
              </div>
              <div className="hotspot-score">
                <div className="score-value">{(hotspot.score * 100).toFixed(0)}</div>
                <div className="stat-label">Risk Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard