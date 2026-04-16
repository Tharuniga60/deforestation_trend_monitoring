from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import subprocess
import sys
from routes import forest_data, analysis

app = FastAPI(title="DeforestWatch API", version="1.0.0")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(forest_data.router)
app.include_router(analysis.router)

@app.on_event("startup")
async def startup_event():
    """Check if data exists, generate if missing."""
    csv_path = Path(__file__).parent / "data" / "sample_forest_data.csv"
    if not csv_path.exists():
        print("Generating sample forest data...")
        generate_script = Path(__file__).parent / "data" / "generate_data.py"
        result = subprocess.run([sys.executable, str(generate_script)], capture_output=True, text=True)
        print(result.stdout)
        if result.returncode != 0:
            print(f"Error generating data: {result.stderr}")

@app.get("/")
def root():
    """Health check endpoint."""
    return {"message": "DeforestWatch API running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
