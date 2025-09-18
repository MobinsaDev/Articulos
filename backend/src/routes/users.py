# backend\src\routes\users.py
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, NotFound
from src.api.auth import auth_required
from src.db.models.user import User
from src.db.repository.user import UserRepository

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

@users_bp.get("")
@auth_required
def list_users():
    try:
        limit = int(request.args.get("limit", 100))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        raise BadRequest("limit y offset deben ser enteros")
    rows = UserRepository.list_all(limit=limit, offset=offset)
    return jsonify({"ok": True, "data": [r.__dict__ for r in rows]})

@users_bp.get("/<int:user_id>")
@auth_required
def get_user(user_id: int):
    u = UserRepository.get_by_id(user_id)
    if not u:
        raise NotFound("Usuario no encontrado")
    return jsonify({"ok": True, "data": u.__dict__})

@users_bp.post("")
@auth_required
def create_user():
    data = request.get_json(silent=True) or {}
    for k in ("name", "secondname", "email", "password"):
        if k not in data or not str(data[k]).strip():
            raise BadRequest(f"Falta {k}")

    if UserRepository.get_by_email(data["email"]):
        return jsonify({"error": "Email ya registrado"}), 409

    u = User.create_with_password(
        name=data["name"].strip(),
        secondname=data["secondname"].strip(),
        email=data["email"].strip(),
        password=data["password"]
    )
    new_id = UserRepository.create(u)
    return jsonify({"ok": True, "data": {"id": new_id}}), 201

@users_bp.put("/<int:user_id>")
@auth_required
def update_user(user_id: int):
    existing = UserRepository.get_by_id(user_id)
    if not existing:
        raise NotFound("Usuario no encontrado")
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", existing.name)).strip()
    secondname = str(data.get("secondname", existing.secondname)).strip()
    role = str(data.get("role",existing.role)).strip()
    email = str(data.get("email", existing.email)).strip()
    pwd = data.get("password")

    u = User(
        id=user_id,
        name=name,
        secondname=secondname,
        email=email,
        role=role,
        password_hash=existing.password_hash,
        created_at=existing.created_at,
        updated_at=existing.updated_at,
    )
    if pwd:
        u.set_password(pwd)

    ok = UserRepository.update(u)
    return jsonify({"ok": ok})

@users_bp.delete("/<int:user_id>")
@auth_required
def delete_user(user_id: int):
    ok = UserRepository.delete(user_id)
    return jsonify({"ok": ok})
