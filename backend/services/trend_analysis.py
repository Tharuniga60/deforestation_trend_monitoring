import pandas as pd
import numpy as np
from typing import List, Dict, Optional, Any
import time

# Cache for expensive computations
_trends_cache = {"data": None, "timestamp": None}
_summary_cache = {"data": None, "timestamp": None}

def _is_cache_valid(cache_dict):
    """Check if cache is valid (less than 5 minutes old)"""
    if cache_dict["timestamp"] is None:
        return False
    return time.time() - cache_dict["timestamp"] < 300  # 5 minutes

def analyze_trends(df: pd.DataFrame, region: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Analyze trends for forest cover.
    Returns year-over-year change, 3-year rolling average loss, and trend direction.
    """
    # Check cache
    if _trends_cache["data"] is not None and _is_cache_valid(_trends_cache):
        if _trends_cache["data"].get("region") == region:
            return _trends_cache["data"].get("results", [])

    if region:
        df = df[df["region"] == region].copy()

    results = []

    for reg in df["region"].unique():
        reg_data = df[df["region"] == reg].sort_values("year")

        if len(reg_data) < 2:
            continue

        # Year-over-year forest cover change
        reg_data = reg_data.copy()
        reg_data["cover_yoy_change"] = reg_data["forest_cover_pct"].diff()

        # 3-year rolling average of annual loss percentage
        rolling_loss = reg_data["annual_loss_pct"].rolling(window=3, min_periods=1).mean()
        reg_data["loss_3yr_avg"] = rolling_loss

        # Calculate trend using linear regression on years
        years_numeric = (reg_data["year"] - reg_data["year"].min()).values
        covers = reg_data["forest_cover_pct"].values
        if len(years_numeric) > 1:
            slope = np.polyfit(years_numeric, covers, 1)[0]
            if slope > 0.1:
                trend = "Improving"
            elif slope < -0.1:
                trend = "Worsening"
            else:
                trend = "Stable"
        else:
            trend = "Stable"

        results.append({
            "region": reg,
            "data": reg_data[["year", "forest_cover_pct", "annual_loss_pct", "annual_loss_ha", "biodiversity_index", "carbon_stock_mt", "cover_yoy_change", "loss_3yr_avg"]].to_dict("records"),
            "trend": trend,
            "slope": float(slope) if len(years_numeric) > 1 else 0.0
        })

    # Update cache
    _trends_cache["data"] = {"region": region, "results": results}
    _trends_cache["timestamp"] = time.time()

    return results

def get_summary_stats(df: pd.DataFrame) -> Dict[str, Any]:
    """Get global summary statistics from the latest year."""
    # Check cache
    if _summary_cache["data"] is not None and _is_cache_valid(_summary_cache):
        return _summary_cache["data"]

    latest_year = df["year"].max()
    latest_data = df[df["year"] == latest_year]

    avg_forest_cover = latest_data["forest_cover_pct"].mean()
    total_annual_loss_ha = latest_data["annual_loss_ha"].sum()

    critical_high = len(latest_data[latest_data["risk_level"].isin(["Critical", "High"])])

    # Determine global trend
    all_trends = analyze_trends(df)
    trend_counts = {"Improving": 0, "Stable": 0, "Worsening": 0}
    for t in all_trends:
        trend_counts[t["trend"]] += 1

    if trend_counts["Worsening"] > trend_counts["Improving"]:
        global_trend = "Worsening"
    elif trend_counts["Improving"] > trend_counts["Worsening"]:
        global_trend = "Improving"
    else:
        global_trend = "Stable"

    summary = {
        "latest_year": int(latest_year),
        "avg_forest_cover_pct": float(avg_forest_cover),
        "total_annual_loss_ha": float(total_annual_loss_ha),
        "critical_high_risk_regions": int(critical_high),
        "global_trend": global_trend,
        "regions_analyzed": len(df["region"].unique()),
        "countries_analyzed": len(df["country"].unique())
    }

    # Update cache
    _summary_cache["data"] = summary
    _summary_cache["timestamp"] = time.time()

    return summary
