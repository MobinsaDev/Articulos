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
        except:
            conn.rollback()
        finally:
            cur.close()
            conn.close()
