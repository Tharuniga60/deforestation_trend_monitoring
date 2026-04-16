import numpy as np
import pandas as pd
from pathlib import Path

# Set seed for reproducibility
np.random.seed(42)

# Define regions and countries - extended to reach ~700 combinations
regions_countries = {
    'Amazon': ['Brazil', 'Peru', 'Colombia', 'Venezuela', 'Bolivia', 'Ecuador', 'Guyana', 'Suriname'],
    'Congo Basin': ['DRC', 'Congo', 'Cameroon', 'CAR', 'Gabon', 'Equatorial Guinea'],
    'Southeast Asia': ['Indonesia', 'Malaysia', 'Thailand', 'Vietnam', 'Myanmar', 'Philippines', 'Cambodia'],
    'West Africa': ['Côte d\'Ivoire', 'Ghana', 'Nigeria', 'Senegal', 'Benin', 'Togo', 'Liberia'],
    'Borneo': ['Indonesia (Borneo)', 'Malaysia (Borneo)', 'Brunei'],
    'Madagascar': ['Madagascar', 'Mauritius', 'Comoros', 'Seychelles'],
    'Mekong': ['Cambodia', 'Laos', 'Thailand (Mekong)', 'Vietnam (Mekong)'],
    'Atlantic Forest': ['Brazil (Atlantic)', 'Paraguay', 'Argentina', 'Uruguay'],
    'Central America': ['Costa Rica', 'Panama', 'Honduras', 'Guatemala', 'Belize', 'Nicaragua', 'El Salvador'],
    'Daintree': ['Australia', 'Papua New Guinea', 'Solomon Islands']
}

years = np.arange(2010, 2025)  # 2010-2024 (15 years)

# Build all possible combinations
data = []
for region, countries in regions_countries.items():
    for country in countries:
        for year in years:
            data.append({'region': region, 'country': country, 'year': year})

# Shuffle and take exactly 700
np.random.shuffle(data)
data = data[:700]

df = pd.DataFrame(data)

# Pre-generate random values for each region-country pair
unique_pairs = df[['region', 'country']].drop_duplicates()
pair_stats = {}
for _, row in unique_pairs.iterrows():
    key = (row['region'], row['country'])
    pair_stats[key] = {
        'initial_cover': np.random.uniform(55, 90),
        'annual_decline': np.random.uniform(0.3, 1.5),
        'area_ha': np.random.uniform(100000, 5000000)
    }

# Pre-generate noise values for each row
noise_values = np.random.normal(0, 0.3, len(df))
loss_pct_values = np.abs(np.random.normal(0.5, 0.8, len(df))).clip(0, 5)
biodiversity_noise = np.random.normal(0, 0.5, len(df))
carbon_noise = np.random.normal(0, 20, len(df))

# Calculate forest_cover_pct (starts 55-90%, declines yearly with noise)
df['forest_cover_pct'] = df.apply(
    lambda row: max(5, min(100,
        pair_stats[(row['region'], row['country'])]['initial_cover'] -
        (row['year'] - 2010) * pair_stats[(row['region'], row['country'])]['annual_decline'] +
        noise_values[row.name]
    )),
    axis=1
)

# Annual loss percentage
df['annual_loss_pct'] = loss_pct_values

# Annual loss in hectares
df['annual_loss_ha'] = df.apply(
    lambda row: pair_stats[(row['region'], row['country'])]['area_ha'] * (row['annual_loss_pct'] / 100),
    axis=1
)

# Risk level: <0.5%=Low, 0.5-1%=Medium, 1-2%=High, >2%=Critical
def get_risk_level(pct):
    if pct < 0.5:
        return 'Low'
    elif pct < 1.0:
        return 'Medium'
    elif pct < 2.0:
        return 'High'
    else:
        return 'Critical'

df['risk_level'] = df['annual_loss_pct'].apply(get_risk_level)

# Biodiversity index (0-10, negatively correlated with loss)
df['biodiversity_index'] = (
    10 * (1 - df['annual_loss_pct'] / 5) + biodiversity_noise
).clip(0, 10)

# Carbon stock in megatons (correlates with forest cover)
df['carbon_stock_mt'] = (
    (df['forest_cover_pct'] / 100 * 300) + carbon_noise
).clip(0, None)

# Ensure output directory exists and save CSV
output_dir = Path(__file__).parent
output_dir.mkdir(parents=True, exist_ok=True)
output_path = output_dir / 'sample_forest_data.csv'
df.to_csv(output_path, index=False)

print(f"Data generated successfully!")
print(f"Total rows: {len(df)}")
