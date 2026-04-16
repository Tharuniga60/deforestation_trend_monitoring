const API_BASE = '/api'

async function fetchJSON(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  return response.json()
}

export async function getSummary() {
  return fetchJSON(`${API_BASE}/summary`)
}

export async function getTrends(region = null) {
  const params = new URLSearchParams()
  if (region) params.append('region', region)
  const url = `${API_BASE}/trends${params.toString() ? '?' + params.toString() : ''}`
  return fetchJSON(url)
}

export async function getHotspots(topN = 5) {
  return fetchJSON(`${API_BASE}/hotspots?top_n=${topN}`)
}

export async function getTrendChart() {
  return fetchJSON(`${API_BASE}/charts/trend-chart`)
}

export async function getHotspotChart() {
  return fetchJSON(`${API_BASE}/charts/hotspot-chart`)
}

export async function getHeatmap() {
  return fetchJSON(`${API_BASE}/charts/heatmap`)
}

export async function getReport() {
  return fetchJSON(`${API_BASE}/report`)
}

export async function getForestCover(region = null, year = null) {
  const params = new URLSearchParams()
  if (region) params.append('region', region)
  if (year) params.append('year', year)
  const url = `${API_BASE}/forest-cover${params.toString() ? '?' + params.toString() : ''}`
  return fetchJSON(url)
}