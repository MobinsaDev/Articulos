#src/db/models/user.py
from src.db.connectiondb import db_connection
from dataclasses import dataclass
from typing import Optional
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


@dataclass
class User:
    id: Optional[int]
    name: str
    secondname: str
    email: str
    password_hash: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    @staticmethod
    def create_with_password(name: str, secondname:str, email: str, password: str) -> "User":
        pwd_hash = generate_password_hash(password)
        return User(id=None, name=name, secondname=secondname, email=email, password_hash=pwd_hash)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)