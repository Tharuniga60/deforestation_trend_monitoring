// Global state
let appState = {
  allData: null,
  filteredTrends: null,
  selectedRegion: null,
  startYear: 2010,
  endYear: 2024,
  isLoading: false,
};

let filterDebounceTimer = null;

// Update clock every second
function updateClock() {
  const clockElement = document.getElementById("liveClock");
  if (clockElement) {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString();
  }
}

// Show/hide loading indicator
function setLoading(isLoading) {
  appState.isLoading = isLoading;
  const loadingEl = document.getElementById("loadingIndicator");
  if (loadingEl) {
    if (isLoading) {
      loadingEl.style.display = "block";
    } else {
      loadingEl.style.display = "none";
    }
  }
}

// Populate region select
async function populateRegionSelect() {
  const select = document.getElementById("regionSelect");
  if (!select) return;

  try {
    const response = await fetch("http://localhost:8000/api/forest-cover");
    const data = await response.json();

    // Extract unique regions from data
    const regions = [...new Set(data.data.map((d) => d.region))].sort();

    regions.forEach((region) => {
      const option = document.createElement("option");
      option.value = region;
      option.textContent = region;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error populating regions:", error);
  }
}

// Load all data in parallel
async function loadAllData() {
  try {
    setLoading(true);

    // Make all API calls in parallel using Promise.all
    const [summary, trends, hotspots, trendChart, hotspotChart, heatmap, report] =
      await Promise.all([
        getSummary(),
        getTrends(appState.selectedRegion, appState.startYear, appState.endYear),
        getHotspots(5),
        getTrendChart(),
        getHotspotChart(),
        getHeatmap(),
        getReport()
      ]);

    appState.allData = {
      summary,
      trends,
      hotspots,
      trendChart,
      hotspotChart,
      heatmap,
      report,
    };

    setLoading(false);
    return appState.allData;
  } catch (error) {
    console.error("Error loading data:", error);
    setLoading(false);
    return null;
  }
}

// Populate KPI cards
function populateKPIs(data) {
  if (!data || !data.summary) return;

  const summary = data.summary;

  // Forest Cover %
  const coverElement = document.querySelector("#kpiForestCover .kpi-value");
  if (coverElement) {
    animateCounterDecimal(
      coverElement,
      summary.avg_forest_cover_pct,
      1,
      1500
    );
  }

  // Annual Loss (ha)
  const lossElement = document.querySelector("#kpiAnnualLoss .kpi-value");
  if (lossElement) {
    const lossInMillions = summary.total_annual_loss_ha / 1000000;
    animateCounterDecimal(lossElement, lossInMillions, 2, 1500);
  }

  // Critical Regions
  const criticalElement = document.querySelector("#kpiCritical .kpi-value");
  if (criticalElement) {
    animateCounter(criticalElement, summary.critical_high_risk_regions, 1500);
  }

  // Global Trend
  const trendElement = document.querySelector("#kpiTrend .kpi-value");
  if (trendElement) {
    trendElement.textContent = summary.global_trend;
    const card = document.getElementById("kpiTrend");
    if (summary.global_trend === "Worsening") {
      card.className = "kpi-card trending-down";
    } else if (summary.global_trend === "Improving") {
      card.className = "kpi-card trending-up";
    } else {
      card.className = "kpi-card neutral";
    }
  }
}

// Render trend chart
function renderChart(data) {
  if (data && data.trends && data.trends.length > 0) {
    renderTrendChart("trendChart", data.trends);
  }
}

// Render map with hotspots
function renderMap(data) {
  if (data && data.hotspots) {
    renderHotspots(mapInstance, data.hotspots);
    // Ensure map is properly sized after rendering
    setTimeout(() => {
      if (mapInstance) {
        mapInstance.invalidateSize();
      }
    }, 100);
  }
}

// Show images
function showImages(data) {
  if (data.trendChart && data.trendChart.image) {
    showImage("hotspotChartImg", data.trendChart.image);
  }
  if (data.hotspotChart && data.hotspotChart.image) {
    showImage("heatmapImg", data.hotspotChart.image);
  }
  if (data.heatmap && data.heatmap.image) {
    showImage("heatmapImg", data.heatmap.image);
  }
}

// Populate report
function populateReport(data) {
  if (!data || !data.report) return;

  const report = data.report;

  // Summary stats
  if (report.summary) {
    const summaryContainer = document.querySelector(".report-summary");
    if (summaryContainer && summaryContainer.children.length === 0) {
      summaryContainer.innerHTML = `
        <div class="summary-card">
          <div class="summary-card-title">Forest Cover %</div>
          <div class="summary-card-value">${report.summary.avg_forest_cover_pct.toFixed(1)}%</div>
        </div>
        <div class="summary-card">
          <div class="summary-card-title">Annual Loss</div>
          <div class="summary-card-value">${(report.summary.total_annual_loss_ha / 1000000).toFixed(2)}M ha</div>
        </div>
        <div class="summary-card">
          <div class="summary-card-title">Critical Regions</div>
          <div class="summary-card-value">${report.summary.critical_high_risk_regions}</div>
        </div>
        <div class="summary-card">
          <div class="summary-card-title">Global Trend</div>
          <div class="summary-card-value">${report.summary.global_trend}</div>
        </div>
      `;
    }
  }

  // Recommendations
  if (report.recommendations) {
    const recContainer = document.querySelector(".recommendations");
    if (recContainer) {
      const olElement = recContainer.querySelector("ol");
      if (olElement) {
        olElement.innerHTML = report.recommendations
          .map((rec) => `<li>${rec}</li>`)
          .join("");
      }
    }
  }
}

// Handle filter apply with debouncing
async function applyFilters() {
  const regionSelect = document.getElementById("regionSelect");
  const startYearInput = document.getElementById("startYear");
  const endYearInput = document.getElementById("endYear");

  appState.selectedRegion = regionSelect.value || null;
  appState.startYear = parseInt(startYearInput.value) || 2010;
  appState.endYear = parseInt(endYearInput.value) || 2024;

  // Clear previous debounce timer
  if (filterDebounceTimer) {
    clearTimeout(filterDebounceTimer);
  }

  // Debounce filter application (wait 500ms after last change)
  filterDebounceTimer = setTimeout(async () => {
    try {
      const data = await loadAllData();
      if (data) {
        populateKPIs(data);
        renderChart(data);
        renderMap(data);
        showImages(data);
      }
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }, 500);
}

// Handle filter reset
async function resetFilters() {
  document.getElementById("regionSelect").value = "";
  document.getElementById("startYear").value = "2010";
  document.getElementById("endYear").value = "2024";

  appState.selectedRegion = null;
  appState.startYear = 2010;
  appState.endYear = 2024;

  // Clear debounce timer
  if (filterDebounceTimer) {
    clearTimeout(filterDebounceTimer);
  }

  try {
    const data = await loadAllData();
    if (data) {
      populateKPIs(data);
      renderChart(data);
      renderMap(data);
      showImages(data);
    }
  } catch (error) {
    console.error("Error resetting filters:", error);
  }
}

// Initialize app
async function initApp() {
  // Start clock
  updateClock();
  setInterval(updateClock, 1000);

  // Initialize map
  initMap();

  // Add map event listeners for drag feedback
  if (mapInstance) {
    mapInstance.on("dragstart", () => {
      const mapEl = document.getElementById("map");
      if (mapEl) mapEl.classList.add("dragging");
    });
    mapInstance.on("dragend", () => {
      const mapEl = document.getElementById("map");
      if (mapEl) mapEl.classList.remove("dragging");
    });
  }

  // Populate region select
  await populateRegionSelect();

  // Load all data
  const data = await loadAllData();
  if (data) {
    populateKPIs(data);
    renderChart(data);
    renderMap(data);
    showImages(data);
    populateReport(data);
  } else {
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.textContent =
      "Failed to load data. Make sure the backend is running on http://localhost:8000";
    document.querySelector(".container").prepend(errorDiv);
  }

  // Attach event listeners
  document
    .getElementById("applyButton")
    .addEventListener("click", applyFilters);
  document
    .getElementById("resetButton")
    .addEventListener("click", resetFilters);
}

// Run app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
