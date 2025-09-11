from src.db.connectiondb import db_connection
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Battery:
    id: Optional[id]
    model: str
    serie: str
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    