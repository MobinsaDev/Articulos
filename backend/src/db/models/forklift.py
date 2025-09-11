from src.db.connectiondb import db_connection
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Forklift:
    id: Optional[id]
    serie: str
    model: str
    forklift_type: str
    ubication: str
    battery_id: int
    charger_id: int
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    