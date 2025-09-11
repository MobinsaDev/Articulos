from src.db.connectiondb import db_connection
from typing import List, Optional
from src.db.models.user import User

class UserRepository:
    TABLE = "users"

    @staticmethod
    def create(u: User) -> int:
        conn = db_connection()
        try:
            cur = conn.cursor()
            cur.execute(
                f"INSERT INTO `{UserRepository.TABLE}` (name, secondname, email, password_hash) "
                "VALUES (%s, %s, %s, %s)",
                (u.name, u.secondname, u.email, u.password_hash)
            )
            conn.commit()
            return cur.lastrowid
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def get_by_id(user_id: int) -> Optional[User]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute(
                f"SELECT id, name, secondname, email, password_hash, created_at, updated_at "
                f"FROM `{UserRepository.TABLE}` WHERE id=%s",
                (user_id,)
            )
            row = cur.fetchone()
            if not row:
                return None
            return User(**row)
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def get_by_email(email: str) -> Optional[User]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute(
                f"SELECT id, name, secondname, email, password_hash, created_at, updated_at "
                f"FROM `{UserRepository.TABLE}` WHERE email=%s",
                (email,)
            )
            row = cur.fetchone()
            if not row:
                return None
            return User(**row)
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def list_all(limit: int = 100, offset: int = 0) -> List[User]:
        conn = db_connection()
        cur = conn.cursor(dictionary=True)
        try:
            cur.execute(
                f"SELECT id, name, secondname, email, password_hash, created_at, updated_at "
                f"FROM `{UserRepository.TABLE}` ORDER BY id LIMIT %s OFFSET %s",
                (limit, offset)
            )
            rows = cur.fetchall()
            return [User(**row) for row in rows]
        finally:
            cur.close()
            conn.close()

    @staticmethod
    def update(u: User) -> bool:
        """Actualiza name, secondname, email, password_hash por id."""
        if u.id is None:
            raise ValueError("u.id es requerido para update")
        conn = db_connection()
        try:
            cur = conn.cursor()
            cur.execute(
                f"UPDATE `{UserRepository.TABLE}` "
                f"SET name=%s, secondname=%s, email=%s, password_hash=%s WHERE id=%s",
                (u.name, u.secondname, u.email, u.password_hash, u.id)
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
    def delete(user_id: int) -> bool:
        conn = db_connection()
        try:
            cur = conn.cursor()
            cur.execute(f"DELETE FROM `{UserRepository.TABLE}` WHERE id=%s", (user_id,))
            conn.commit()
            return cur.rowcount > 0
        except Exception as e:
            conn.rollback()
            raise e
        finally:
            cur.close()
            conn.close()
