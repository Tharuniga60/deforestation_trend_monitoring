# DeforestWatch API

A FastAPI-based backend for monitoring and analyzing global deforestation trends.

## Project Structure

```
deforest-watch/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt         # Python dependencies
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
└── README.md
```

## Setup

1. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

2. Generate sample data:
```bash
python backend/data/generate_data.py
```

3. Run the FastAPI server:
```bash
python backend/main.py
```

The API will be available at `http://localhost:8000`

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
