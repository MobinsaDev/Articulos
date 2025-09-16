from src.db.connectiondb import db_connection
from ..models.attachments import Attachment

class AttachmentRepository:
    TABLE = "attachments"
    
    @staticmethod
    def create_new_attachment(a: Attachment) -> int:
        
        conn = db_connection()
        cur = conn.cursor()
        
        try: 
            sql = (
                f"INSERT INTO {AttachmentRepository.TABLE}"
                "model, serie, family, subfamily, image_url"
                "VALUES (%s,%s,%s,%s,%s)"
            )
            cur.execute(sql, a.model, a.serie, a.family, a.subfamily, a.image_url)
        except:
            conn.rollback()
        finally:
            cur.close()
            conn.close()
            
    @staticmethod
    def get_by_id(attachment_id: int) -> Attachment | None:
        conn = db_connection()
        cur = conn.cursor(dictionary = True)
        try:
            cur.execute(
                f"SELECT id, model, serie, family, subfamily, image_url, created_at, updated_at "
                f"FROM `{AttachmentRepository.TABLE}` WHERE id=%s ",
                (attachment_id,)
            )
            row = cur.fetchone()
            
            return Attachment(**row) if row else None
        finally:
            cur.close()
            conn.close()
             
    @staticmethod
    def list_all(limit: int = 100, offset: int = 0) -> list[Attachment]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute(
                f"SELECT id, model, serie, family, subfamily, image_url, created_at, updated_at "
                f"FROM `{AttachmentRepository.TABLE}` ORDER BY id DESC LIMIT %s OFFSET %s",
                (limit, offset)
            )
            rows = cur.fetchall()
            return [Attachment(**r) for r in rows]
        finally:
            cur.close()
            conn.close()
            
    @staticmethod
    def update(attachment_id: int, data: dict) -> bool:
        sets, vals = [], []
        for k in ("model", "serie", "family", "subfamily", "image_url"):
            if k in data:
                sets.append(f"{k}=%s"); vals.append(data[k])
        if not sets:
            return False
        vals.append(attachment_id)
        conn = db_connection()
        cur = conn.cursor()
        try:
            cur.execute(
                f"UPDATE `{AttachmentRepository.TABLE}` SET {', '.join(sets)} WHERE id=%s",
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
    def delete(attachment_id: int) -> bool:
        conn = db_connection()
        cur = conn.cursor()
        try:
            cur.execute(f"DELETE FROM `{AttachmentRepository.TABLE}` WHERE id=%s", (attachment_id,))
            conn.commit()
            return cur.rowcount > 0
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()