#backend\src\db\repository\forklift.py
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
            sql = (f"INSERT INTO {ForkliftRepository.TABLE} "
                   "(serie, model, forklift_type, ubication, battery_id, charger_id, image_url) "
                   "VALUES (%s, %s, %s, %s, %s, %s, %s)")
            cur.execute(sql, (
                f.serie,         
                f.model,
                f.forklift_type,
                f.ubication,
                f.battery_id,
                f.charger_id,
                f.image_url
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
    def get_by_id(forklift_id: int) -> Optional[Forklift]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute(
                f"""SELECT id, serie, model, forklift_type, ubication,
                           battery_id, charger_id, image_url, created_at, updated_at
                    FROM {ForkliftRepository.TABLE}
                    WHERE id = %s""",
                (forklift_id,)
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
                f"""SELECT id, serie, model, forklift_type, ubication,
                           battery_id, charger_id, image_url, created_at, updated_at
                    FROM {ForkliftRepository.TABLE}
                    ORDER BY created_at DESC
                    LIMIT %s OFFSET %s""",
                (limit, offset)
            )
            rows = cur.fetchall()
            return [Forklift(**row) for row in rows]
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update(forklift_id: int, payload: dict) -> bool:
        if not payload:
            return True  
        fields = []
        values = []

        for key in ["serie", "model", "forklift_type", "ubication",
                    "battery_id", "charger_id", "image_url"]:
            if key in payload:
                fields.append(f"{key}=%s")
                values.append(payload[key])

        if not fields:
            return True

        conn = db_connection()
        cur = conn.cursor()
        try:
            sql = (
                f"UPDATE {ForkliftRepository.TABLE} "
                f"SET {', '.join(fields)}, updated_at=NOW() "
                f"WHERE id=%s"
            )
            values.append(forklift_id)
            cur.execute(sql, tuple(values))
            conn.commit()
            return cur.rowcount > 0
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def delete(forklift_id: int) -> bool:
        conn = db_connection()
        cur = conn.cursor()
        try:
            cur.execute(f"DELETE FROM `{ForkliftRepository.TABLE}` WHERE id=%s", (forklift_id,))
            conn.commit()
            return cur.rowcount > 0
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()