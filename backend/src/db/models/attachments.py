#backend\src\db\models\battery.py
from src.db.connectiondb import db_connection
from dataclasses import dataclass
from typing import Optional
from datetime import datetime


@dataclass
class Attachment:
    id: Optional[id]
    model: str
    serie: str
    family: str
    subfamily: str
    image_url: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    