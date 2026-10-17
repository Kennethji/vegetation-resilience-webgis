from csv import DictReader
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = PROJECT_ROOT / "public" / "data"

CLIMATE_NAME_BY_CODE = {
    "1": "Tropical",
    "2": "Arid",
    "3": "Temperate",
    "4": "Continental",
    "5": "Polar",
}

app = FastAPI(
    title="Vegetation Resilience WebGIS API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "vegetation-resilience-webgis-api",
    }


@app.get("/api/yearly-ac1")
def get_yearly_ac1(
    climate_code: Literal["all", "1", "2", "3", "4", "5"] = "all",
):
    if climate_code == "all":
        return read_global_yearly_ac1()

    climate_name = CLIMATE_NAME_BY_CODE[climate_code]
    return read_climate_yearly_ac1(climate_name)


def read_global_yearly_ac1():
    csv_path = DATA_DIR / "global_yearly.csv"

    if not csv_path.exists():
        raise HTTPException(
            status_code=404,
            detail="global_yearly.csv not found",
        )

    records = []

    with csv_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = DictReader(file)

        for row in reader:
            year = to_int(row.get("year"))
            value = to_float(row.get("ar1"))

            if year is None or value is None:
                continue

            records.append({
                "year": year,
                "value": value,
                "climateCode": "all",
                "climateLabel": "全球",
            })

    return records


def read_climate_yearly_ac1(climate_name: str):
    csv_path = DATA_DIR / "climate_analysis_data.csv"

    if not csv_path.exists():
        raise HTTPException(
            status_code=404,
            detail="climate_analysis_data.csv not found",
        )

    records = []

    with csv_path.open("r", encoding="utf-8-sig", newline="") as file:
        reader = DictReader(file)

        for row in reader:
            zone = row.get("climate_zone") or row.get("zone")

            if zone != climate_name:
                continue

            year = to_int(row.get("year"))
            value = to_float(row.get("ar1"))

            if year is None or value is None:
                continue

            records.append({
                "year": year,
                "value": value,
                "climateLabel": climate_name,
            })

    return records


def to_int(value: str | None):
    if value is None or value.strip() == "":
        return None

    try:
        return int(float(value))
    except ValueError:
        return None


def to_float(value: str | None):
    if value is None or value.strip() == "":
        return None

    try:
        return float(value)
    except ValueError:
        return None