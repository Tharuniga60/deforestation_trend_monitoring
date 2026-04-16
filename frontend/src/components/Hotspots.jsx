import React, { useState, useEffect } from 'react'
import { getHotspots } from '../services/api'

function Hotspots() {
  const [hotspots, setHotspots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [topN, setTopN] = useState(5)

  useEffect(() => {
    async function loadHotspots() {
      try {
        const data = await getHotspots(topN)
        setHotspots(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadHotspots()
  }, [topN])

  if (loading) return <div className="loading">Loading hotspots...</div>
  if (error) return <div className="error">Error: {error}</div>

  const getRiskColor = (label) => {
    if (label === 'Critical') return 'risk-critical'
    if (label === 'High') return 'risk-high'
    if (label === 'Medium') return 'risk-medium'
    return 'risk-low'
  }

  return (
    <div>
      <h1 className="page-title">Deforestation Hotspots</h1>

      <div className="chart-controls">
        <select 
          value={topN} 
          onChange={(e) => setTopN(Number(e.target.value))}
        >
          <option value={5}>Top 5</option>
          <option value={10}>Top 10</option>
        </select>
      </div>

      <div className="card">
        <h2 className="card-header">Current Hotspots</h2>
        <div className="hotspot-list">
          {hotspots.map((hotspot, index) => (
            <div key={hotspot.region} className="hotspot-item">
              <div className="hotspot-rank">{index + 1}</div>
              <div className="hotspot-info">
                <div className="hotspot-name">
                  {hotspot.region}
                  {hotspot.latitude !== 0 && (
                    <span style={{ fontSize: '0.8rem', color: '#a8d5a2', marginLeft: '0.5rem' }}>
                      ({hotspot.latitude?.toFixed(2)}, {hotspot.longitude?.toFixed(2)})
                    </span>
                  )}
                </div>
                <div className="hotspot-details">
                  Annual Loss: {hotspot.avg_annual_loss_pct?.toFixed(2)}% | 
                  {hotspot.avg_annual_loss_ha?.toLocaleString()} ha/year
                </div>
                <div className="hotspot-details">
                  Biodiversity: {hotspot.avg_biodiversity_index?.toFixed(2)} | 
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

      <div className="card">
        <h2 className="card-header">Risk Score Methodology</h2>
        <p style={{ color: '#a8d5a2' }}>
          Scores are calculated using a weighted formula: 40% annual loss percentage + 
          30% risk level + 30% inverse biodiversity index. 
          Higher scores indicate greater deforestation risk.
        </p>
      </div>
    </div>
  )
}

export default Hotspots