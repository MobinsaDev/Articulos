import os
import mysql.connector
from dotenv import load_dotenv

load_dotenv()

def db_connection_no_db():
    """Conexión al servidor MySQL sin seleccionar database (para CREATE DATABASE)."""
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "127.0.0.1"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PWD", ""),
        port=int(os.getenv("DB_PORT", "3307")),
        autocommit=True,
    )

def db_connection():

    return mysql.connector.connect(
        host= os.getenv("DB_HOST", "localhost"),
        user= os.getenv("DB_USER", "root"),
        password= os.getenv("DB_PWD", ""),
        port= int(os.getenv("DB_PORT")),
        database= os.getenv("DB_NAME"),
        autocommit=False,
        )