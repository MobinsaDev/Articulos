# src/routes/auth.py
from flask import Blueprint
from src.service import auth as auth_service

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

@auth_bp.post("/register")
def register():
    return auth_service.register()

@auth_bp.post("/login")
def login():
    return auth_service.login()

@auth_bp.post("/logout")
def logout():
    return auth_service.logout()

@auth_bp.get("/me")
def me():
    return auth_service.me()
