# backend\src\api\auth.py
from functools import wraps
from flask import request, jsonify, g
from src.service.jwt_service import decode_token
from src.db.repository.user import UserRepository

COOKIE_NAME = "access_token"

def auth_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        token = request.cookies.get(COOKIE_NAME)
        if not token:
            return jsonify({"error": "No autorizado"}), 401
        try:
            data = decode_token(token)
            user = UserRepository.get_by_id(int(data.get("sub", "0") or 0))
            if not user:
                return jsonify({"error": "No autorizado"}), 401
            g.current_user = user
        except Exception:
            return jsonify({"error": "No autorizado"}), 401
        return fn(*args, **kwargs)
    return wrapper
