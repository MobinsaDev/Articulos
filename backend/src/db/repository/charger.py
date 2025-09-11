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
            "VALUES (%s,%s,%s)"),
            cur.execute(sql,(c.model,c.serie,c.image_url))
            
            conn.commit()
            
        except:
            conn.rollback()
        finally:
            cur.close()
            conn.close()
