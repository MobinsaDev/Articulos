# src/service/auth.py
from flask import request, jsonify, make_response
import os

from src.service.jwt_service import create_access_token, decode_token
from src.db.repository.user import UserRepository
from src.db.models.user import User

COOKIE_NAME = "access_token"

def _set_auth_cookie(resp, token: str):
    secure = os.getenv("COOKIE_SECURE", "false").lower() == "true"
    resp.set_cookie(
        COOKIE_NAME,
        token,
        httponly=True,
        secure=secure,
        samesite="Lax",
        max_age=60 * 60 * 24,
        path="/",
    )
    return resp

def register():
    data = request.get_json(silent=True) or {}
    for k in ("name", "secondname", "email", "password"):
        if k not in data or not str(data[k]).strip():
            return jsonify({"error": f"Falta {k}"}), 400

    if UserRepository.get_by_email(data["email"]):
        return jsonify({"error": "Email ya registrado"}), 409

    user = User.create_with_password(
        name=data["name"].strip(),
        secondname=data["secondname"].strip(),
        email=data["email"].strip(),
        password=data["password"]
    )
    user_id = UserRepository.create(user)
    token = create_access_token({"sub": str(user_id), "email": user.email})
    resp = make_response(jsonify({"id": user_id, "name": user.name, "email": user.email}))
    return _set_auth_cookie(resp, token), 201

def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"error": "Email y password son requeridos"}), 400

    user = UserRepository.get_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    token = create_access_token({"sub": str(user.id), "email": user.email})
    resp = make_response(jsonify({"id": user.id, "name": user.name, "email": user.email}))
    return _set_auth_cookie(resp, token), 200

def logout():
    resp = make_response(jsonify({"ok": True}))
    resp.delete_cookie(COOKIE_NAME, path="/")
    return resp, 200

def me():
    token = request.cookies.get(COOKIE_NAME)
    if not token:
        return jsonify({"user": None}), 200
    try:
        data = decode_token(token)
    except Exception:
        return jsonify({"user": None}), 200

    user_id = int(data.get("sub", "0") or 0)
    user = UserRepository.get_by_id(user_id)
    if not user:
        return jsonify({"user": None}), 200
    return jsonify({"user": {"id": user.id, "name": user.name, "email": user.email}}), 200
