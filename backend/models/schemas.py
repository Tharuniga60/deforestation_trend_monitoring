from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime


class ForestDataPoint(BaseModel):
    region: str
    country: str
    year: int
    forest_cover_pct: float
    annual_loss_ha: float
    annual_loss_pct: float
    risk_level: str
    biodiversity_index: float
    carbon_stock_mt: float


class TrendDataPoint(BaseModel):
    year: int
    forest_cover_pct: float
    annual_loss_pct: float


class TrendResponse(BaseModel):
    region: str
    trend_direction: str  # "Improving", "Stable", "Worsening"
    avg_loss_pct: float
    rolling_avg: float
    data_points: List[TrendDataPoint]


class HotspotRegion(BaseModel):
    region: str
    country: str
    lat: float
    lon: float
    risk_score: float
    risk_level: str
    forest_cover_pct: float
    annual_loss_ha: float


class SummaryStats(BaseModel):
    total_forest_cover_pct: float
    total_annual_loss_ha: float
    critical_regions_count: int
    high_regions_count: int
    global_trend: str


class ChartResponse(BaseModel):
    image: str  # base64 encoded PNG
    title: str


class ReportResponse(BaseModel):
    generated_at: str
    summary: SummaryStats
    hotspots: List[HotspotRegion]
    recommendations: List[str]
