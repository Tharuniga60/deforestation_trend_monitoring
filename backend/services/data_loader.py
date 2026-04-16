import pandas as pd
from pathlib import Path
from typing import List, Optional

_cache = {"df": None}

def load_dataset() -> pd.DataFrame:
    """Load and cache the forest data CSV."""
    if _cache["df"] is not None:
        return _cache["df"]
    
    csv_path = Path(__file__).parent.parent / "data" / "sample_forest_data.csv"
    df = pd.read_csv(csv_path)
    _cache["df"] = df
    return df

def get_regions() -> List[str]:
    """Get list of unique regions."""
    df = load_dataset()
    return sorted(df["region"].unique().tolist())

def get_years() -> List[int]:
    """Get list of unique years."""
    df = load_dataset()
    return sorted(df["year"].unique().tolist())
