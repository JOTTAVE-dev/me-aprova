from datetime import date
import os
from pathlib import Path
from pydantic_settings import BaseSettings


BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_STORAGE_ROOT = Path("/tmp") if os.environ.get("VERCEL") else Path(os.environ.get("LOCALAPPDATA", BASE_DIR / "storage"))
STORAGE_DIR = DEFAULT_STORAGE_ROOT / "AGENTE_FCC_TI"


class Settings(BaseSettings):
    app_name: str = "AGENTE FCC TI"
    database_url: str = f"sqlite:///{STORAGE_DIR / 'agente_fcc_ti.db'}"
    exam_date: date = date(2026, 8, 9)
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]


settings = Settings()
