#backend\src\db\repository\battery.py
from src.db.connectiondb import db_connection
from ..models.battery import Battery

class BatteryRepository:
    TABLE = "batteries"
    
    @staticmethod
    def create_new_battery(b: Battery):
        conn = db_connection()
        
        cur = conn.cursor()
        
        try:
            sql = (
                f"INSERT INTO {BatteryRepository.TABLE}"
                "(model, serie, image_url)"
                "VALUES(%s,%s,%s)"
            )
            cur.execute(sql,(b.model,b.serie,b.image_url))
            
            conn.commit()
            return cur.lastrowid  
        except:
            conn.rollback()
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def get_by_id(battery_id: int) -> Battery | None:
        conn = db_connection()
        cur = conn.cursor(dictionary = True)
        try:
            cur.execute(
                f"SELECT id, model, serie, image_url, created_at, updated_at "
                f"FROM `{BatteryRepository.TABLE}` WHERE id=%s ",
                (battery_id,)
            )
            row = cur.fetchone()
            
            return Battery(**row) if row else None
        finally:
            cur.close()
            conn.close()
            
    @staticmethod
    def list_all(limit: int = 100, offset: int = 0) -> list[Battery]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute(
                f"SELECT id, model, serie, image_url, created_at, updated_at "
                f"FROM `{BatteryRepository.TABLE}` ORDER BY id DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )
            rows = cur.fetchall()
            return [Battery(**r) for r in rows]
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update(battery_id: int, data: dict) -> bool:
        # data: {model?, serie?, image_url?}
        sets, vals = [], []
        for k in ("model", "serie", "image_url"):
            if k in data:
                sets.append(f"{k}=%s"); vals.append(data[k])
        if not sets:
            return False
        vals.append(battery_id)
        conn = db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                f"UPDATE `{BatteryRepository.TABLE}` SET {', '.join(sets)} WHERE id=%s",
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
    def delete(battery_id: int) -> bool:
        conn = db_connection()
        cur = conn.cursor()
        try:
            cur.execute(f"DELETE FROM `{BatteryRepository.TABLE}` WHERE id=%s", (battery_id,))
            conn.commit()
            return cur.rowcount > 0
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()