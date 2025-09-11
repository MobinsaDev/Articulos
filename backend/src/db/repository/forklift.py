from src.db.connectiondb import db_connection
from dataclasses import dataclass
from typing import List, Optional
from datetime import datetime
from ..models.forklift import Forklift

class ForkliftRepository:
    TABLE = "forklift_register"
    
    @staticmethod
    def create_forklift(f: Forklift) -> int:
        conn = db_connection()
        
        cur = conn.cursor()
        try:
            sql = (f"INSERT INTO {ForkliftRepository.TABLE}"
                   "(serie, model, forklift_type, ubication, battery_id, charger_id, image_url)"
                    "VALUES (%s,%s,%s,%s,%s)")
            cur.execute(sql,(
                f.model,f.forklift_type,f.ubication,f.battery_id,f.charger_id,f.image_url
                             ))
                        
            conn.commit()
            return cur.lastrowid
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()
    
    @staticmethod
    def show_forklift_by_id(forklift_id: int) -> Optional[Forklift]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        
        try:
            cur.execute(
                f"SELECT serie, model, forklift_type, ubication, battery_id, charger_id, created_at "
                f"FROM {ForkliftRepository.TABLE} WHERE id=%s",
                (forklift_id)
            )
            row = cur.fetchone()
            
            if not row:
                return None
            return Forklift(**row)
        finally:
            cur.close()
            conn.close()
    
    @staticmethod
    def show_all_forklifts(limit: int = 100, offset: int = 0) -> List[Forklift]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        
        try:
            cur.execute(
                    f"""SELECT model, forklift_type, ubication, battery_id, charger_id, created_at 
                    FROM {ForkliftRepository.TABLE} WHERE id=%s
                    ORDER BY created_at
                        LIMIT %s OFFSET %s""",
                    (limit, offset)
                )
            rows = cur.fetchall()
            return[ Forklift(**row) for row in rows ]
        finally:
            cur.close()
            conn.close()