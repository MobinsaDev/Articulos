from werkzeug.security import generate_password_hash
from src.db.connectiondb import db_connection, db_connection_no_db
from dotenv import load_dotenv
import os

load_dotenv()

def init_db():
    try:
        db_name = os.getenv("DB_NAME", "mobinsaexternos")

        conn = db_connection_no_db()
        cur = conn.cursor()
        cur.execute(
            f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
            "DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
        )
        cur.close(); conn.close()

        conn = db_connection()
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS `users` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `name` VARCHAR(255) UNIQUE NOT NULL,
                `secondname` VARCHAR(255) NOT NULL,
                `email` VARCHAR(255) UNIQUE NOT NULL,
                `password_hash` VARCHAR(255) NOT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        admin_name = "admin"
        admin_email = "desarrollo@mobinsa.com"
        admin_pwd = generate_password_hash("SiS2511")
        
        cur.execute(
            """
            INSERT IGNORE INTO `users` (name, email, password_hash)
            VALUES (%s, %s, %s)
            """,
        (admin_name,admin_email,admin_pwd)) 
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS `forklift_register` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `model` VARCHAR(255) UNIQUE NOT NULL,
                `serie` VARCHAR(255) UNIQUE NOT NULL,
                `forklift_type` VARCHAR(255) UNIQUE NOT NULL,
                `ubication` VARCHAR(255) UNIQUE NOT NULL,
                `battery_id` VARCHAR(255) UNIQUE NOT NULL,
                `charger_id` VARCHAR(255) NOT NULL,
                `image_url` VARCHAR(512) NOT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS `batteries` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `model` VARCHAR(255) UNIQUE NOT NULL,
                `serie` VARCHAR(255) UNIQUE NOT NULL,
                `image_url` VARCHAR(512) NOT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        cur.execute("""
            CREATE TABLE IF NOT EXISTS `chargers` (
                `id` INT PRIMARY KEY AUTO_INCREMENT,
                `model` VARCHAR(255) UNIQUE NOT NULL,
                `serie` VARCHAR(255) UNIQUE NOT NULL,
                `image_url` VARCHAR(512) NOT NULL,
                `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        """)
        
        conn.commit()
    except Exception as e:
        raise e
    finally:
        cur.close()
        conn.close()