#backend\src\service\auth.py
import os
from flask import request, jsonify, make_response
from src.service.jwt_service import create_token, decode_token
from src.db.repository.user import UserRepository

ACCESS_COOKIE = "access_token"
REFRESH_COOKIE = "refresh_token"

ACCESS_TTL  = int(os.getenv("ACCESS_TOKEN_TTL", "900"))
REFRESH_TTL = int(os.getenv("REFRESH_TOKEN_TTL", "1209600"))
SAMESITE = os.getenv("COOKIE_SAMESITE", "Lax")
SECURE   = os.getenv("COOKIE_SECURE", "false").lower() == "true"

def _set_cookie(resp, name: str, token: str, max_age: int):
    resp.set_cookie(
        name, token,
        httponly=True,
        secure=SECURE,
        samesite=SAMESITE,
        max_age=max_age,
        path="/",
    )
    return resp

def _issue_tokens_response(body):
    # espera body con {id, name, email}
    token_payload = {"sub": str(body["id"]), "email": body["email"]}
    access  = create_token(token_payload, ACCESS_TTL)
    refresh = create_token(token_payload, REFRESH_TTL)
    resp = make_response(jsonify(body))
    _set_cookie(resp, ACCESS_COOKIE, access, ACCESS_TTL)
    _set_cookie(resp, REFRESH_COOKIE, refresh, REFRESH_TTL)
    return resp

def register():
    data = request.get_json(silent=True) or {}
    for k in ("name","secondname","email","password"):
        if not str(data.get(k) or "").strip():
            return jsonify({"error": f"Falta {k}"}), 400
    if UserRepository.get_by_email(data["email"]):
        return jsonify({"error":"Email ya registrado"}), 409
    u = UserRepository.create(user)
    user = UserRepository.get_by_email(data["email"])
    return _issue_tokens_response({"id": user.id, "name": user.name, "email": user.email}), 201

def login():
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip()
    password = data.get("password") or ""
    if not email or not password:
        return jsonify({"error":"Email y password son requeridos"}), 400
    user = UserRepository.get_by_email(email)
    if not user or not user.check_password(password):
        return jsonify({"error":"Credenciales inválidas"}), 401
    return _issue_tokens_response({"id": user.id, "name": user.name, "email": user.email}), 200

def roles_required(*allowed_roles: str):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            user = getattr(g, "current_user", None)
            if not user or user.role not in allowed_roles:
                return jsonify({"error": "Prohibido"}), 403
            return fn(*args, **kwargs)
        return wrapper
    return deco
    
def refresh():
    rt = request.cookies.get(REFRESH_COOKIE)
    if not rt:
        return jsonify({"error":"No refresh token"}), 401
    try:
        data = decode_token(rt)
    except Exception:
        return jsonify({"error":"Refresh inválido"}), 401

    # (Opcional) validar en DB/redis que el refresh no esté revocado y que no superó idle/absolute
    user = UserRepository.get_by_id(int(data["sub"]))
    if not user:
        return jsonify({"error":"Usuario no encontrado"}), 401

    # emitir sólo nuevo access (puedes rotar refresh si quieres “session sliding”)
    access = create_token({"sub": str(user.id), "email": user.email}, ACCESS_TTL)
    resp = make_response(jsonify({"ok": True}))
    _set_cookie(resp, ACCESS_COOKIE, access, ACCESS_TTL)
    return resp, 200

def logout():
    resp = make_response(jsonify({"ok": True}))
    resp.delete_cookie(ACCESS_COOKIE, path="/")
    resp.delete_cookie(REFRESH_COOKIE, path="/")
    return resp, 200

def me():
    token =  request.cookies.get(ACCESS_COOKIE)
    
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
    return jsonify({"user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role}}), 200