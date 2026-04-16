let mapInstance = null;
let markersLayer = null;

function initMap() {
  // Create map with full interaction options
  mapInstance = L.map("map", {
    center: [5, 20],
    zoom: 2,
    dragging: true,
    touchZoom: true,
    scrollWheelZoom: true,
    doubleClickZoom: true,
    boxZoom: true,
    drag: true,
    keyboard: true,
    zoomControl: true,
  });

  // CartoDB Dark Matter tiles
  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
      minZoom: 1,
    }
  ).addTo(mapInstance);

  // Create markers layer
  markersLayer = L.layerGroup().addTo(mapInstance);

  // Add legend
  addLegend(mapInstance);

  // Ensure map is responsive
  mapInstance.invalidateSize();
}

function renderHotspots(map, hotspots) {
  // Clear existing markers
  markersLayer.clearLayers();

  hotspots.forEach((hotspot) => {
    const lat = hotspot.latitude;
    const lon = hotspot.longitude;
    const loss = hotspot.avg_annual_loss_ha;
    const risk = hotspot.avg_risk_level;

    // Determine color and radius based on risk level
    const riskColors = {
      Low: "#4ade80",
      Medium: "#f59e0b",
      High: "#e74c3c",
      Critical: "#8b0000",
    };

    const color = riskColors[risk] || "#4ade80";
    const radius = Math.sqrt(loss / 50000) * 10 + 5; // Scale radius by loss

    // Create circle marker
    const marker = L.circleMarker([lat, lon], {
      radius: Math.min(radius, 30),
      fillColor: color,
      color: "#ffffff",
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.7,
    }).addTo(markersLayer);

    // Create popup content
    const popupContent = `
      <div style="min-width: 250px; color: #e5e7eb; font-family: 'DM Sans', sans-serif;">
        <h4 style="color: #22c55e; margin: 0 0 10px 0; font-family: 'Syne', sans-serif;">${hotspot.region}</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 5px; color: #9ca3af;">Loss Score:</td>
            <td style="padding: 5px; font-weight: 600; color: #22c55e;">${hotspot.score.toFixed(2)}</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #9ca3af;">Annual Loss:</td>
            <td style="padding: 5px; font-weight: 600;">${(hotspot.avg_annual_loss_ha / 1000).toFixed(1)}k ha</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #9ca3af;">Loss %:</td>
            <td style="padding: 5px; font-weight: 600;">${hotspot.avg_annual_loss_pct.toFixed(2)}%</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #9ca3af;">Risk Level:</td>
            <td style="padding: 5px; font-weight: 600; color: ${riskColors[risk]}">${risk}</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #9ca3af;">Critical Regions:</td>
            <td style="padding: 5px; font-weight: 600;">${hotspot.critical_regions}</td>
          </tr>
          <tr>
            <td style="padding: 5px; color: #9ca3af;">Biodiversity:</td>
            <td style="padding: 5px; font-weight: 600;">${hotspot.avg_biodiversity_index.toFixed(1)}/10</td>
          </tr>
        </table>
      </div>
    `;

    marker.bindPopup(popupContent, {
      className: "custom-popup",
      maxWidth: 300,
    });
  });
}

function addLegend(map) {
  const legend = L.control({ position: "bottomright" });

  legend.onAdd = function (map) {
    const div = L.DomUtil.create("div", "maplegend");
    div.style.background = "rgba(13, 43, 26, 0.9)";
    div.style.border = "1px solid rgba(34, 197, 94, 0.3)";
    div.style.borderRadius = "6px";
    div.style.padding = "15px";
    div.style.fontSize = "12px";
    div.style.color = "#e5e7eb";
    div.style.fontFamily = "'DM Sans', sans-serif";
    div.style.lineHeight = "1.8";

    const title = document.createElement("div");
    title.style.fontWeight = "700";
    title.style.fontFamily = "'Syne', sans-serif";
    title.style.marginBottom = "10px";
    title.style.color = "#22c55e";
    title.textContent = "Risk Levels";
    div.appendChild(title);

    const riskLevels = [
      { label: "Low", color: "#4ade80" },
      { label: "Medium", color: "#f59e0b" },
      { label: "High", color: "#e74c3c" },
      { label: "Critical", color: "#8b0000" },
    ];

    riskLevels.forEach((level) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.gap = "8px";
      row.style.marginBottom = "5px";

      const circle = document.createElement("div");
      circle.style.width = "12px";
      circle.style.height = "12px";
      circle.style.borderRadius = "50%";
      circle.style.backgroundColor = level.color;
      circle.style.border = "1px solid #ffffff";

      const label = document.createElement("span");
      label.textContent = level.label;

      row.appendChild(circle);
      row.appendChild(label);
      div.appendChild(row);
    });

    return div;
  };

  legend.addTo(map);
}
