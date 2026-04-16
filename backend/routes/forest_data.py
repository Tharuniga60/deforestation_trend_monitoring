from fastapi import APIRouter, Query
from typing import Optional
from typing import List, Dict, Any
import pandas as pd
from services.data_loader import load_dataset

router = APIRouter()

@router.get("/api/forest-cover")
def get_forest_cover(
    region: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
) -> Dict[str, Any]:
    """Get forest cover data with optional filters."""
    df = load_dataset()
    
    if region:
        df = df[df["region"] == region]
    if year:
        df = df[df["year"] == year]
    
    return {"count": len(df), "data": df.to_dict("records")}

@router.get("/api/summary")
def get_summary() -> Dict[str, Any]:
    """Get summary statistics."""
    from services.trend_analysis import get_summary_stats
    df = load_dataset()
    return get_summary_stats(df)
