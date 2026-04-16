import React, { useState, useEffect } from 'react'
import { getReport } from '../services/api'

function Report() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadReport() {
      try {
        const data = await getReport()
        setReport(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadReport()
  }, [])

  if (loading) return <div className="loading">Generating report...</div>
  if (error) return <div className="error">Error: {error}</div>

  const getRiskColor = (label) => {
    if (label === 'Critical') return 'risk-critical'
    if (label === 'High') return 'risk-high'
    if (label === 'Medium') return 'risk-medium'
    return 'risk-low'
  }

  return (
    <div>
      <h1 className="page-title">Deforestation Report</h1>
      
      <p style={{ color: '#a8d5a2', marginBottom: '1rem' }}>
        Generated: {new Date(report.generated_at).toLocaleString()}
      </p>

      <div className="report-section">
        <h2>Summary Statistics</h2>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{report.summary.latest_year}</div>
            <div className="stat-label">Latest Year</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{report.summary.avg_forest_cover_pct?.toFixed(1)}%</div>
            <div className="stat-label">Avg Forest Cover</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{(report.summary.total_annual_loss_ha / 1000).toFixed(0)}K</div>
            <div className="stat-label">Annual Loss (ha)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{report.summary.global_trend}</div>
            <div className="stat-label">Global Trend</div>
          </div>
        </div>
      </div>

      <div className="report-section">
        <h2>Priority Hotspots</h2>
        <div className="hotspot-list">
          {report.hotspots.slice(0, 5).map((hotspot, index) => (
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

      <div className="report-section">
        <h2>Recommendations</h2>
        <ul className="recommendations-list">
          {report.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Report