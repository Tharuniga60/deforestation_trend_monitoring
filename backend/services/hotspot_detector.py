import pandas as pd
from typing import List, Dict, Any

# Hardcoded coordinates for each region
REGION_COORDINATES = {
    "Amazon": {"lat": -3.47, "lon": -62.22},
    "Congo Basin": {"lat": -0.79, "lon": 23.66},
    "Southeast Asia": {"lat": 14.06, "lon": 108.28},
    "West Africa": {"lat": 7.95, "lon": -1.02},
    "Borneo": {"lat": 0.96, "lon": 114.55},
    "Madagascar": {"lat": -18.77, "lon": 46.87},
    "Mekong": {"lat": 15.87, "lon": 100.99},
    "Atlantic Forest": {"lat": -15.78, "lon": -47.93},
    "Central America": {"lat": 12.77, "lon": -85.60},
    "Daintree": {"lat": -16.17, "lon": 145.42}
}

def detect_hotspots(df: pd.DataFrame, top_n: int = 5) -> List[Dict[str, Any]]:
    """
    Detect deforestation hotspots using latest year data.
    Score = annual_loss_pct*0.4 + risk_encoded*0.3 + (1-biodiversity_index/10)*0.3
    """
    latest_year = df["year"].max()
    latest_data = df[df["year"] == latest_year]
    
    # Encode risk levels
    risk_encoding = {"Low": 0, "Medium": 0.33, "High": 0.66, "Critical": 1.0}
    
    # Calculate score per region
    region_scores = []
    for region in latest_data["region"].unique():
        region_data = latest_data[latest_data["region"] == region]
        
        avg_loss_pct = region_data["annual_loss_pct"].mean()
        avg_risk = region_data["risk_level"].map(risk_encoding).mean()
        avg_biodiversity = region_data["biodiversity_index"].mean()
        
        score = (avg_loss_pct * 0.4 + 
                 avg_risk * 0.3 + 
                 (1 - avg_biodiversity / 10.0) * 0.3)
        
        coords = REGION_COORDINATES.get(region, {"lat": 0, "lon": 0})
        
        region_scores.append({
            "region": region,
            "score": float(score),
            "avg_annual_loss_pct": float(avg_loss_pct),
            "avg_annual_loss_ha": float(region_data["annual_loss_ha"].mean()),
            "critical_regions": int(len(region_data[region_data["risk_level"] == "Critical"])),
            "avg_risk_level": region_data["risk_level"].mode()[0] if len(region_data) > 0 else "Unknown",
            "avg_biodiversity_index": float(avg_biodiversity),
            "latitude": float(coords["lat"]),
            "longitude": float(coords["lon"])
        })
    
    # Sort by score and return top N
    region_scores.sort(key=lambda x: x["score"], reverse=True)
    return region_scores[:top_n]
