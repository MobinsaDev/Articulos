#backend\src\service\jwt_service.py
import os, time, jwt
from typing import Dict, Any

SECRET = os.getenv("JWT_SECRET", "dev-secret")
ALGO = "HS256"

def create_token(payload: Dict[str, Any], ttl_seconds: int) -> str:
    now = int(time.time())
    body = {
        "iat": now,
        "nbf": now,
        "exp": now + ttl_seconds,
        **payload,
    }
    return jwt.encode(body, SECRET, algorithm=ALGO)

def decode_token(token: str) -> Dict[str, Any]:
    return jwt.decode(token, SECRET, algorithms=[ALGO])
