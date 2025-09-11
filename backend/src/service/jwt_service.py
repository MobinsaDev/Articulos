#src/service/jwt_service.py
import os, time, jwt
from typing import Any, Dict

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret")
JWT_ALG = "HS256"
JWT_TTL = 60 * 60 * 24  # 1 día

def create_access_token(payload: Dict[str, Any], ttl: int = JWT_TTL) -> str:
    now = int(time.time())
    body = {"iat": now, "exp": now + ttl, **payload}
    return jwt.encode(body, JWT_SECRET, algorithm=JWT_ALG)

def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
