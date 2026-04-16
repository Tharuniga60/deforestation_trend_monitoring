# DeforestWatch - Setup & Run Guide

## Project Structure

```
deforest-watch/
├── backend/
│   ├── main.py                    # FastAPI application
│   ├── requirements.txt           # Python dependencies
│   ├── data/
│   │   ├── generate_data.py       # Data generation script
│   │   └── sample_forest_data.csv # Generated dataset (700 rows)
│   ├── services/
│   │   ├── data_loader.py         # CSV data loading & caching
│   │   ├── trend_analysis.py      # Trend calculations
│   │   ├── hotspot_detector.py    # Hotspot detection with scoring
│   │   └── visualizer.py          # Chart generation (base64)
│   └── routes/
│       ├── forest_data.py         # Data access endpoints
│       └── analysis.py            # Analysis & reporting endpoints
├── frontend/
│   ├── index.html                 # Single-page dashboard
│   ├── css/
│   │   └── styles.css             # Dark theme styling
│   └── js/
│       ├── api.js                 # API fetch functions
│       ├── charts.js              # Chart.js rendering
│       ├── map.js                 # Leaflet map rendering
│       └── app.js                 # Main app logic
└── README.md
```

## Backend Setup

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Generate Sample Data (Automatic on startup)
The data will auto-generate on first startup if missing. Manual generation:
```bash
python data/generate_data.py
```

### 3. Run Backend Server
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Server runs at: http://localhost:8000
API Docs: http://localhost:8000/docs

## Frontend Setup

### Option 1: Static HTML (Simple)
Open `frontend/index.html` directly in browser or serve via HTTP.

### Option 2: Python HTTP Server
```bash
cd frontend
python -m http.server 3000
```
Access at: http://localhost:3000

### Option 3: Node.js Server (if npm installed)
```bash
cd frontend
npm run dev
```

## API Endpoints

### Data Access
- `GET /` - Health check
- `GET /api/forest-cover?region=&year=` - Forest cover data
- `GET /api/summary` - Global statistics

### Analysis
- `GET /api/trends?region=&start_year=&end_year=` - Trend analysis
- `GET /api/hotspots?top_n=5` - Top hotspots with coordinates
- `GET /api/report` - Comprehensive report with recommendations

### Charts (Base64 PNG)
- `GET /api/charts/trend-chart` - Forest cover trends
- `GET /api/charts/hotspot-chart` - Hotspot bar chart
- `GET /api/charts/heatmap` - Annual loss heatmap

## Features

✅ **Backend**
- ✓ 700 rows of forest data (10 regions, 2010-2024)
- ✓ Year-over-year trend analysis
- ✓ Hotspot detection with scoring algorithm
- ✓ Risk level classification (Low/Medium/High/Critical)
- ✓ Chart generation (Seaborn, matplotlib)
- ✓ Data caching for performance

✅ **Frontend**
- ✓ Dark theme (#0a1f0f, #22c55e accents)
- ✓ Real-time clock in header
- ✓ 4-card KPI dashboard with animated counters
- ✓ Region & year range filtering
- ✓ Chart.js trend chart (multi-line)
- ✓ Leaflet interactive map with hotspot markers
- ✓ Base64 image display (Seaborn charts)
- ✓ Comprehensive report with recommendations
- ✓ CORS enabled for API access
- ✓ Responsive CSS grid layout

## Troubleshooting

### Backend won't start
- Check port 8000 is available
- Verify Python 3.11+ installed
- Run: `pip install -r requirements.txt` again

### Frontend won't connect to backend
- Ensure backend is running on http://localhost:8000
- Check browser console for CORS errors
- Backend has CORS enabled for all origins

### Charts not rendering
- Check browser console for errors
- Verify CDN links are accessible (Chart.js, Leaflet)
- Inspect network requests to /api/charts/*

## Technologies

**Backend**
- FastAPI & Uvicorn
- Pandas & NumPy
- Seaborn & Matplotlib
- Pydantic

**Frontend**
- Vanilla JavaScript
- Chart.js (line charts)
- Leaflet.js (maps)
- Google Fonts (Syne, DM Sans)
- CartoDB tiles

## Dataset Details

- **700 rows** across 10 regions
- **15 years** (2010-2024) with random sampling
- **Random seed 42** for reproducibility
- **Realistic decay** in forest cover (0.3-1.5% per year)
- **Risk scoring** based on loss percentage
- **Biodiversity index** negatively correlated with loss
- **Carbon stock** derived from forest cover

## Risk Levels

- **Low**: < 0.5% annual loss (green #4ade80)
- **Medium**: 0.5-1% annual loss (yellow #f59e0b)
- **High**: 1-2% annual loss (orange #e74c3c)
- **Critical**: > 2% annual loss (red #8b0000)
