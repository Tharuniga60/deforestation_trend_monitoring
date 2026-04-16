import React, { useState, useEffect } from 'react'
import { getTrendChart, getHotspotChart, getHeatmap } from '../services/api'

function Charts() {
  const [trendChart, setTrendChart] = useState(null)
  const [hotspotChart, setHotspotChart] = useState(null)
  const [heatmap, setHeatmap] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('trend')

  useEffect(() => {
    async function loadCharts() {
      try {
        const [trend, hotspot, heat] = await Promise.all([
          getTrendChart(),
          getHotspotChart(),
          getHeatmap()
        ])
        setTrendChart(trend.image)
        setHotspotChart(hotspot.image)
        setHeatmap(heat.image)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadCharts()
  }, [])

  if (loading) return <div className="loading">Loading charts...</div>
  if (error) return <div className="error">Error: {error}</div>

  const currentImage = activeTab === 'trend' ? trendChart : 
                       activeTab === 'hotspot' ? hotspotChart : heatmap

  return (
    <div>
      <h1 className="page-title">Visualizations</h1>

      <div className="chart-controls">
        <button 
          className={`btn ${activeTab === 'trend' ? '' : ''}`}
          style={{ 
            backgroundColor: activeTab === 'trend' ? '#2ecc71' : '#1a3d26',
            color: activeTab === 'trend' ? '#0d2b1a' : '#fff'
          }}
          onClick={() => setActiveTab('trend')}
        >
          Trend Chart
        </button>
        <button 
          className={`btn ${activeTab === 'hotspot' ? '' : ''}`}
          style={{ 
            backgroundColor: activeTab === 'hotspot' ? '#2ecc71' : '#1a3d26',
            color: activeTab === 'hotspot' ? '#0d2b1a' : '#fff'
          }}
          onClick={() => setActiveTab('hotspot')}
        >
          Hotspot Chart
        </button>
        <button 
          className={`btn ${activeTab === 'heatmap' ? '' : ''}`}
          style={{ 
            backgroundColor: activeTab === 'heatmap' ? '#2ecc71' : '#1a3d26',
            color: activeTab === 'heatmap' ? '#0d2b1a' : '#fff'
          }}
          onClick={() => setActiveTab('heatmap')}
        >
          Heatmap
        </button>
      </div>

      <div className="chart-container">
        {currentImage && (
          <img 
            src={`data:image/png;base64,${currentImage}`} 
            alt={activeTab + ' chart'}
            className="api-image"
          />
        )}
      </div>
    </div>
  )
}

export default Charts