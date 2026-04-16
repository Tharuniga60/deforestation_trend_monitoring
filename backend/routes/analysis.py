from fastapi import APIRouter, Query
from typing import Optional
from typing import List, Dict, Any
from datetime import datetime
from services.data_loader import load_dataset
from services.trend_analysis import analyze_trends, get_summary_stats
from services.hotspot_detector import detect_hotspots
from services.visualizer import generate_trend_chart, generate_hotspot_chart, generate_heatmap

router = APIRouter()

@router.get("/api/trends")
def get_trends(
    region: Optional[str] = Query(None),
    start_year: Optional[int] = Query(None),
    end_year: Optional[int] = Query(None)
) -> List[Dict[str, Any]]:
    """Analyze forest cover trends."""
    df = load_dataset()
    
    if start_year:
        df = df[df["year"] >= start_year]
    if end_year:
        df = df[df["year"] <= end_year]
    
    return analyze_trends(df, region=region)

@router.get("/api/hotspots")
def get_hotspots(top_n: int = Query(5, ge=1, le=10)) -> List[Dict[str, Any]]:
    """Detect deforestation hotspots."""
    df = load_dataset()
    return detect_hotspots(df, top_n=top_n)

@router.get("/api/charts/trend-chart")
def get_trend_chart() -> Dict[str, str]:
    """Get trend chart as base64 PNG."""
    df = load_dataset()
    return {
        "image": generate_trend_chart(df),
        "title": "Forest Cover Trends (2010-2024)"
    }

@router.get("/api/charts/hotspot-chart")
def get_hotspot_chart() -> Dict[str, str]:
    """Get hotspot chart as base64 PNG."""
    df = load_dataset()
    return {
        "image": generate_hotspot_chart(df),
        "title": "Top Deforestation Hotspots"
    }

@router.get("/api/charts/heatmap")
def get_heatmap() -> Dict[str, str]:
    """Get heatmap as base64 PNG."""
    df = load_dataset()
    return {
        "image": generate_heatmap(df),
        "title": "Annual Loss % Heatmap"
    }

@router.get("/api/report")
def get_report() -> Dict[str, Any]:
    """Generate comprehensive deforestation report."""
    df = load_dataset()
    summary = get_summary_stats(df)
    hotspots = detect_hotspots(df, top_n=5)
    
    recommendations = [
        "Increase funding for protected area monitoring in Critical risk regions to prevent ecosystem collapse",
        "Implement satellite-based early warning systems in Amazon and Congo Basin hotspots for real-time deforestation detection",
        "Establish biodiversity corridors connecting fragmented forests to restore ecosystem connectivity and carbon sequestration",
        "Enforce stricter regulations on agricultural expansion and logging in regions showing >2% annual loss rates"
    ]
    
    return {
        "generated_at": datetime.now().isoformat(),
        "summary": summary,
        "hotspots": hotspots,
        "recommendations": recommendations
    }
