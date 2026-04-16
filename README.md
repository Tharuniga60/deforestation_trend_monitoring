# DeforestWatch - Global Deforestation Monitoring Platform

A full-stack application for monitoring and analyzing global deforestation trends with interactive visualizations and real-time analytics.

**Live Demo**: https://deforest-watch.vercel.app
**API Documentation**: https://deforest-watch-api.railway.app/docs
**Repository**: https://github.com/Tharuniga60/deforestation_trend_monitoring

## Project Structure

```
deforest-watch/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt         # Python dependencies
│   ├── Procfile                # Railway deployment configuration
│   ├── runtime.txt             # Python version specification
│   ├── data/
│   │   ├── generate_data.py    # Script to generate sample forest data
│   │   └── sample_forest_data.csv  # Generated dataset (700 rows)
│   ├── services/
│   │   ├── data_loader.py      # Data loading and caching
│   │   ├── trend_analysis.py   # Trend analysis utilities
│   │   ├── hotspot_detector.py # Hotspot detection algorithm
│   │   └── visualizer.py       # Chart generation
│   └── routes/
│       ├── forest_data.py      # Forest cover data endpoints
│       └── analysis.py         # Analysis and reporting endpoints
├── frontend/
│   ├── index.html              # Main dashboard HTML
│   ├── vercel.json             # Vercel deployment configuration
│   ├── css/
│   │   └── styles.css          # Dark theme styling
│   └── js/
│       ├── api.js              # API client with caching
│       ├── charts.js           # Chart rendering functions
│       ├── map.js              # Leaflet map integration
│       └── app.js              # Application initialization
├── DEPLOYMENT.md               # Production deployment guide
└── README.md
```

## Setup & Running Locally

### Backend
1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Generate sample data:
```bash
python data/generate_data.py
```

3. Run the FastAPI server:
```bash
python -m uvicorn main:app --host 0.0.0.0 --port 8000
```

Backend available at: `http://localhost:8000`

### Frontend
1. Open in browser:
```bash
open frontend/index.html
```

Or run a local server:
```bash
cd frontend
python -m http.server 3000
```

Frontend available at: `http://localhost:3000`

## Production Deployment

For complete deployment instructions to Railway (backend) and Vercel (frontend), see **[DEPLOYMENT.md](./DEPLOYMENT.md)**

**Quick Summary:**
- **Backend**: Deploy to Railway using GitHub integration (automatic Python detection)
- **Frontend**: Deploy to Vercel using GitHub integration (static files)
- **Cost**: FREE (using free tiers of Railway and Vercel)
- **Time**: ~10 minutes end-to-end

## Setup

## Features

### Dashboard
- **Live Clock**: Real-time time display
- **KPI Cards**: Forest cover %, annual loss, critical regions, global trend
- **Interactive Map**: Leaflet-powered map with drag/zoom support
  - Circle markers sized by deforestation loss
  - Color-coded by risk level (Low/Medium/High/Critical)
  - Popup information on hover/click
- **Visualizations**:
  - Trend charts (forest cover over time)
  - Hotspot bar charts (top regions by loss)
  - Heatmaps (annual loss percentage by year)
- **Filtering**: Region and year range selection
- **Report Section**: Summary statistics and actionable recommendations

### Performance Optimizations
- Server-side caching (5-minute TTL)
- Client-side caching (5-minute TTL)
- Parallel API requests
- Debounced filter application (500ms)
- Base64-encoded chart images (no extra HTTP requests)
- Responsive design (mobile, tablet, desktop)

### Technologies
**Backend:**
- FastAPI (Python web framework)
- Pandas (data processing)
- NumPy (numerical computing)
- Matplotlib & Seaborn (visualizations)
- Uvicorn (ASGI server)

**Frontend:**
- Vanilla JavaScript (no framework)
- Chart.js (interactive charts)
- Leaflet.js (interactive maps)
- Google Fonts (Syne, DM Sans)
- CSS Grid (responsive layout)

## API Endpoints

### Health & Summary
- `GET /` - Health check
- `GET /api/summary` - Global summary statistics

### Data Access
- `GET /api/forest-cover?region=&year=` - Forest cover data with optional filters
- `GET /api/trends?region=&start_year=&end_year=` - Trend analysis for regions

### Analysis
- `GET /api/hotspots?top_n=5` - Top N deforestation hotspots
- `GET /api/report` - Comprehensive deforestation report

### Visualizations
- `GET /api/charts/trend-chart` - Forest cover trend line chart
- `GET /api/charts/hotspot-chart` - Top hotspots bar chart
- `GET /api/charts/heatmap` - Annual loss percentage heatmap

## Dataset

The `sample_forest_data.csv` contains 700 rows with the following columns:
- `region` - Forest region (10 regions)
- `country` - Country name
- `year` - Year (2010-2024)
- `forest_cover_pct` - Forest cover percentage (55-90%)
- `annual_loss_ha` - Annual forest loss in hectares
- `annual_loss_pct` - Annual forest loss percentage
- `risk_level` - Risk category (Low/Medium/High/Critical)
- `biodiversity_index` - Biodiversity index (0-10)
- `carbon_stock_mt` - Carbon stock in megatons

## Risk Levels

- **Low**: <0.5% annual loss
- **Medium**: 0.5-1% annual loss
- **High**: 1-2% annual loss
- **Critical**: >2% annual loss

## Regions Covered

1. Amazon
2. Congo Basin
3. Southeast Asia
4. West Africa
5. Borneo
6. Madagascar
7. Mekong
8. Atlantic Forest
9. Central America
10. Daintree
