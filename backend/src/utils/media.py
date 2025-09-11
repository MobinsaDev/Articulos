# src/utils/media.py
from pathlib import Path
import os, secrets, re
from typing import Literal, Optional

Subdir = Literal["forklifts", "chargers", "batteries"]

MEDIA_ROOT = Path(os.getenv("MEDIA_ROOT", "static/uploads")).resolve()
MEDIA_URL  = os.getenv("MEDIA_URL", "/static/uploads")

_ALLOWED_SUBDIRS: set[str] = {"forklifts", "chargers", "batteries"}
_ALLOWED_EXTS: set[str] = {".jpg", ".jpeg", ".png", ".webp", ".gif"}

_fname_re = re.compile(r"[^A-Za-z0-9._-]+")

def _safe_ext(filename_hint: Optional[str]) -> str:
    if not filename_hint:
        return ".bin"
    ext = os.path.splitext(filename_hint)[1].lower()
    return ext if ext in _ALLOWED_EXTS else ".bin"

def _rand_name(ext: str) -> str:
    return f"{secrets.token_hex(8)}{ext}"

def save_image_bytes(content: bytes, subdir: Subdir, filename_hint: Optional[str] = None) -> str:
    """Guarda `content` en /static/uploads/<subdir>/ y devuelve la URL relativa (MEDIA_URL/...)."""
    if subdir not in _ALLOWED_SUBDIRS:
        raise ValueError("Subdirectorio no permitido")

    ext = _safe_ext(filename_hint)
    fname = _rand_name(ext)

    target_dir = (MEDIA_ROOT / subdir)
    target_dir.mkdir(parents=True, exist_ok=True)

    path = target_dir / fname
    with open(path, "wb") as f:
        f.write(content)

    return f"{MEDIA_URL}/{subdir}/{fname}"

def delete_image_by_url(image_url: str) -> bool:
    """
    Borra un archivo por su URL relativa (MEDIA_URL/...). Devuelve True si lo borró.
    Evita traversal y elimina solo dentro de MEDIA_ROOT.
    """
    if not image_url or not image_url.startswith(MEDIA_URL + "/"):
        return False
    rel = image_url[len(MEDIA_URL) + 1 :] 
    rel = rel.replace("\\", "/").lstrip("/")
    if rel.startswith("../"):
        return False

    path = (MEDIA_ROOT / rel).resolve()
    try:
        if not str(path).startswith(str(MEDIA_ROOT)):
            return False
        if path.is_file():
            path.unlink()
            return True
    except Exception:
        return False
    return False
