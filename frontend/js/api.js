// Auto-detect API URL based on environment
const API_BASE = (function() {
  // For localhost development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:8000/api";
  }
  // For production - can be set via window.DEFOREST_API_URL
  return window.DEFOREST_API_URL || "https://deforest-watch-api.railway.app/api";
})();

const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url) {
  return url;
}

function getCachedData(url) {
  const cached = apiCache.get(getCacheKey(url));
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCachedData(url, data) {
  apiCache.set(getCacheKey(url), {
    data,
    timestamp: Date.now()
  });
}

async function handleError(response) {
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

async function getSummary() {
  try {
    const url = `${API_BASE}/summary`;
    const cached = getCachedData(url);
    if (cached) return cached;

    const response = await fetch(url);
    const data = await handleError(response);
    setCachedData(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching summary:", error);
    return null;
  }
}

async function getTrends(region = null, startYear = null, endYear = null) {
  try {
    let url = `${API_BASE}/trends?`;
    if (region) url += `region=${encodeURIComponent(region)}&`;
    if (startYear) url += `start_year=${startYear}&`;
    if (endYear) url += `end_year=${endYear}&`;

    const cached = getCachedData(url);
    if (cached) return cached;

    const response = await fetch(url);
    const data = await handleError(response);
    setCachedData(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching trends:", error);
    return [];
  }
}

async function getForestCover(region = null, year = null) {
  try {
    let url = `${API_BASE}/forest-cover?`;
    if (region) url += `region=${encodeURIComponent(region)}&`;
    if (year) url += `year=${year}&`;

    const cached = getCachedData(url);
    if (cached) return cached;

    const response = await fetch(url);
    const data = await handleError(response);
    setCachedData(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching forest cover:", error);
    return { count: 0, data: [] };
  }
}

async function getHotspots(topN = 5) {
  try {
    const url = `${API_BASE}/hotspots?top_n=${topN}`;
    const cached = getCachedData(url);
    if (cached) return cached;

    const response = await fetch(url);
    const data = await handleError(response);
    setCachedData(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching hotspots:", error);
    return [];
  }
}

async function getChart(chartType) {
  try {
    const url = `${API_BASE}/charts/${chartType}`;
    const cached = getCachedData(url);
    if (cached) return cached;

    const response = await fetch(url);
    const data = await handleError(response);
    setCachedData(url, data);
    return data;
  } catch (error) {
    console.error(`Error fetching ${chartType}:`, error);
    return { image: null, title: "" };
  }
}

async function getTrendChart() {
  return getChart("trend-chart");
}

async function getHotspotChart() {
  return getChart("hotspot-chart");
}

async function getHeatmap() {
  return getChart("heatmap");
}

async function getReport() {
  try {
    const url = `${API_BASE}/report`;
    const cached = getCachedData(url);
    if (cached) return cached;

    const response = await fetch(url);
    const data = await handleError(response);
    setCachedData(url, data);
    return data;
  } catch (error) {
    console.error("Error fetching report:", error);
    return null;
  }
}
