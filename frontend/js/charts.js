function renderTrendChart(canvasId, data) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  // Extract unique regions and years
  const regions = {};
  const years = new Set();

  data.forEach((trend) => {
    regions[trend.region] = [];
    trend.data.forEach((point) => {
      years.add(point.year);
    });
  });

  // Sort years
  const sortedYears = Array.from(years).sort((a, b) => a - b);

  // Prepare datasets
  const colors = [
    "#4ade80",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];

  const datasets = data.map((trend, index) => {
    const dataPoints = sortedYears.map((year) => {
      const point = trend.data.find((d) => d.year === year);
      return point ? point.forest_cover_pct : null;
    });

    return {
      label: trend.region,
      data: dataPoints,
      borderColor: colors[index % colors.length],
      backgroundColor: colors[index % colors.length] + "20",
      borderWidth: 2.5,
      pointRadius: 4,
      pointBackgroundColor: colors[index % colors.length],
      pointBorderColor: "#0a1f0f",
      pointBorderWidth: 2,
      pointHoverRadius: 6,
      tension: 0.4,
      fill: false,
    };
  });

  // Destroy existing chart if it exists
  if (window.trendChartInstance) {
    window.trendChartInstance.destroy();
  }

  const ctx = canvas.getContext("2d");
  window.trendChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: sortedYears,
      datasets: datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "#e5e7eb",
            font: {
              family: "'Syne', sans-serif",
              size: 12,
              weight: "600",
            },
            padding: 15,
            usePointStyle: true,
            pointStyle: "circle",
          },
        },
        title: {
          display: false,
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: "Year",
            color: "#e5e7eb",
            font: {
              family: "'DM Sans', sans-serif",
              size: 12,
            },
          },
          ticks: {
            color: "#9ca3af",
            font: {
              family: "'DM Sans', sans-serif",
            },
          },
          grid: {
            color: "rgba(34, 197, 94, 0.1)",
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: "Forest Cover (%)",
            color: "#e5e7eb",
            font: {
              family: "'DM Sans', sans-serif",
              size: 12,
            },
          },
          ticks: {
            color: "#9ca3af",
            font: {
              family: "'DM Sans', sans-serif",
            },
          },
          grid: {
            color: "rgba(34, 197, 94, 0.1)",
          },
          min: 0,
          max: 100,
        },
      },
    },
  });
}

function showImage(imgId, base64String) {
  const img = document.getElementById(imgId);
  if (img && base64String) {
    img.src = `data:image/png;base64,${base64String}`;
  }
}

function animateCounter(element, target, duration = 1500) {
  let current = 0;
  const increment = target / (duration / 16);
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = Math.round(target).toLocaleString();
      clearInterval(interval);
    } else {
      element.textContent = Math.round(current).toLocaleString();
    }
  }, 16);
}

function animateCounterDecimal(element, target, decimals = 1, duration = 1500) {
  let current = 0;
  const increment = target / (duration / 16);
  const interval = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toFixed(decimals);
      clearInterval(interval);
    } else {
      element.textContent = current.toFixed(decimals);
    }
  }, 16);
}
