import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import io
import base64
from typing import Optional

# Set dark style for all charts
plt.style.use('dark_background')

def _fig_to_base64(fig) -> str:
    """Convert matplotlib figure to base64 PNG string."""
    buffer = io.BytesIO()
    fig.savefig(buffer, format='png', bbox_inches='tight', facecolor='#0d2b1a', edgecolor='none')
    buffer.seek(0)
    image_base64 = base64.b64encode(buffer.read()).decode()
    plt.close(fig)
    return image_base64

def generate_trend_chart(df: pd.DataFrame) -> str:
    """Generate lineplot of forest cover per region over time."""
    fig, ax = plt.subplots(figsize=(14, 7), facecolor='#0d2b1a')
    
    # Use green palette
    palette = sns.color_palette("Greens", n_colors=len(df["region"].unique()))
    
    sns.lineplot(
        data=df,
        x="year",
        y="forest_cover_pct",
        hue="region",
        palette=palette,
        marker='o',
        linewidth=2.5,
        markersize=4,
        ax=ax
    )
    
    ax.set_xlabel("Year", fontsize=12, color='white')
    ax.set_ylabel("Forest Cover (%)", fontsize=12, color='white')
    ax.set_title("Forest Cover Trends by Region (2010-2024)", fontsize=14, color='white', pad=20)
    ax.set_facecolor('#0d2b1a')
    ax.grid(True, alpha=0.2, color='green')
    ax.legend(loc='best', framealpha=0.9)
    
    for spine in ax.spines.values():
        spine.set_color('green')
    
    return _fig_to_base64(fig)

def generate_hotspot_chart(df: pd.DataFrame) -> str:
    """Generate horizontal barplot of top regions by annual loss in hectares."""
    latest_year = df["year"].max()
    latest_data = df[df["year"] == latest_year]
    
    region_loss = latest_data.groupby("region")["annual_loss_ha"].mean().sort_values(ascending=True).tail(10)
    region_risk = latest_data.groupby("region")["risk_level"].apply(lambda x: x.mode()[0] if len(x) > 0 else "Low")
    
    # Color mapping
    color_map = {"Low": "#2ecc71", "Medium": "#f39c12", "High": "#e74c3c", "Critical": "#8b0000"}
    colors = [color_map.get(region_risk[region], "#2ecc71") for region in region_loss.index]
    
    fig, ax = plt.subplots(figsize=(12, 7), facecolor='#0d2b1a')
    ax.barh(region_loss.index, region_loss.values, color=colors, edgecolor='white', linewidth=1.5)
    
    ax.set_xlabel("Annual Loss (hectares)", fontsize=12, color='white')
    ax.set_title("Top 10 Deforestation Hotspots by Annual Loss", fontsize=14, color='white', pad=20)
    ax.set_facecolor('#0d2b1a')
    ax.grid(True, alpha=0.2, axis='x', color='green')
    
    for spine in ax.spines.values():
        spine.set_color('green')
    
    return _fig_to_base64(fig)

def generate_heatmap(df: pd.DataFrame) -> str:
    """Generate heatmap of annual loss percentage by region and year."""
    pivot_data = df.pivot_table(
        values="annual_loss_pct",
        index="region",
        columns="year",
        aggfunc="mean"
    )
    
    fig, ax = plt.subplots(figsize=(16, 8), facecolor='#0d2b1a')
    sns.heatmap(
        pivot_data,
        cmap='YlOrRd',
        cbar_kws={'label': 'Annual Loss %'},
        ax=ax,
        linewidths=0.5,
        linecolor='#0d2b1a'
    )
    
    ax.set_xlabel("Year", fontsize=12, color='white')
    ax.set_ylabel("Region", fontsize=12, color='white')
    ax.set_title("Annual Forest Loss % Heatmap by Region and Year", fontsize=14, color='white', pad=20)
    ax.set_facecolor('#0d2b1a')
    
    return _fig_to_base64(fig)
