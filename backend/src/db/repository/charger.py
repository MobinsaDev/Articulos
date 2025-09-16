#backend\src\db\repository\charger.py
from src.db.connectiondb import db_connection
from ..models.charger import Charger

class ChargerRepository:
    TABLE = "chargers"

    @staticmethod
    def create_new_charger(c: Charger) -> int:
        conn = db_connection()
        
        cur = conn.cursor()
        
        try:
            sql = (
                f"INSERT INTO {ChargerRepository.TABLE}"
                   "(model, serie, image_url)"
            "VALUES (%s,%s,%s)"
            )
            cur.execute(sql,(c.model,c.serie,c.image_url))
            
            conn.commit()
            return cur.lastrowid  
        except:
            conn.rollback()
        finally:
            cur.close()
            conn.close()
            
    @staticmethod
    def get_by_id(charger_id: int) -> Charger | None:
        conn = db_connection()
        cur = conn.cursor(dictionary = True)
        try:
            cur.execute(
                f"SELECT id, model, serie, image_url, created_at, updated_at "
                f"FROM `{ChargerRepository.TABLE}` WHERE id=%s ",
                (charger_id,)
            )
            row = cur.fetchone()
            
            return Charger(**row) if row else None
        finally:
            cur.close()
            conn.close()
            
    @staticmethod
    def list_all(limit: int = 100, offset: int = 0) -> list[Charger]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute(
                f"SELECT id, model, serie, image_url, created_at, updated_at "
                f"FROM `{ChargerRepository.TABLE}` ORDER BY id DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )
            rows = cur.fetchall()
            return [Charger(**r) for r in rows]
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update(charger_id: int, data: dict) -> bool:
        # data: {model?, serie?, image_url?}
        sets, vals = [], []
        for k in ("model", "serie", "image_url"):
            if k in data:
                sets.append(f"{k}=%s"); vals.append(data[k])
        if not sets:
            return False
        vals.append(charger_id)
        conn = db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                f"UPDATE `{ChargerRepository.TABLE}` SET {', '.join(sets)} WHERE id=%s",
                tuple(vals)
            )
            conn.commit()
            return cur.rowcount > 0
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def delete(charger_id: int) -> bool:
        conn = db_connection()
        cur = conn.cursor()
        try:
            cur.execute(f"DELETE FROM `{ChargerRepository.TABLE}` WHERE id=%s", (charger_id,))
            conn.commit()
            return cur.rowcount > 0
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()