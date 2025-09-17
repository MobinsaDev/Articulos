# backend\src\api\routes.py
from flask import Blueprint, request, jsonify
from werkzeug.exceptions import BadRequest, NotFound
from typing import Optional
from src.utils.media import save_image_bytes, delete_image_by_url  
from src.utils.media import save_image_bytes
from src.db.models.forklift import Forklift as ForkliftModel
from src.db.repository.forklift import ForkliftRepository
from src.db.models.charger import Charger as ChargerModel
from src.db.repository.charger import ChargerRepository
from src.db.models.battery import Battery as BatteryModel
from src.db.repository.battery import BatteryRepository

api_bp = Blueprint("api", __name__, url_prefix="/api")

def _require_fields(data: dict, fields: list[str]) -> None:
    missing = [f for f in fields if not str(data.get(f) or "").strip()]
    if missing:
        raise BadRequest(f"Faltan campos requeridos: {', '.join(missing)}")

def _to_int(val: Optional[str], name: str) -> int:
    try:
        return int(val) if val is not None else None 
    except Exception:
        raise BadRequest(f"El campo '{name}' debe ser entero.")

# ---------- Montacargas ----------
@api_bp.post("/forklifts")
def create_forklift():
    if request.content_type and "multipart/form-data" in request.content_type:
        form = request.form
        _require_fields(form, ["serie", "model", "forklift_type", "ubication", "battery_id", "charger_id"])

        image = request.files.get("image") 
        image_url = None
        if image and image.filename:
            image_url = save_image_bytes(image.read(), "forklifts", image.filename)

        forklift = ForkliftModel(
            id=None,
            serie=form["serie"].strip(),
            model=form["model"].strip(),
            forklift_type=form["forklift_type"].strip(),
            ubication=form["ubication"].strip(),
            battery_id=_to_int(form.get("battery_id"), "battery_id"),
            charger_id=_to_int(form.get("charger_id"), "charger_id"),
            image_url=image_url
        )
    else:
        data = request.get_json(silent=True) or {}
        _require_fields(data, ["serie", "model", "forklift_type", "ubication", "battery_id", "charger_id"])
        forklift = ForkliftModel(
            id=None,
            serie=str(data["serie"]).strip(),
            model=str(data["model"]).strip(),
            forklift_type=str(data["forklift_type"]).strip(),
            ubication=str(data["ubication"]).strip(),
            battery_id=_to_int(str(data["battery_id"]), "battery_id"),
            charger_id=_to_int(str(data["charger_id"]), "charger_id"),
            image_url=str(data.get("image_url") or "").strip() or None
        )

    new_id = ForkliftRepository.create_forklift(forklift)
    created = ForkliftRepository.get_by_id(new_id)
    return jsonify({
        "ok": True,
        "data": created.__dict__ if created else {"id": new_id}
    }), 201

@api_bp.get("/forklifts/<int:forklift_id>")
def get_forklift(forklift_id: int):
    fk = ForkliftRepository.get_by_id(forklift_id)
    if not fk:
        return jsonify({"ok": False, "error": "Forklift no encontrado"}), 404
    return jsonify({"ok": True, "data": fk.__dict__})

@api_bp.get("/forklifts")
def list_forklifts():
    try:
        limit = int(request.args.get("limit", 100))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        raise BadRequest("limit y offset deben ser enteros.")
    rows = ForkliftRepository.show_all_forklifts(limit=limit, offset=offset)
    return jsonify({"ok": True, "data": [r.__dict__ for r in rows]})

def _to_int_or_none(v):
    if v is None or str(v).strip() == "":
        return None
    try:
        return int(v)
    except Exception:
        raise BadRequest("battery_id/charger_id deben ser enteros.")

@api_bp.put("/forklifts/<int:forklift_id>")
@api_bp.patch("/forklifts/<int:forklift_id>")
def update_forklift(forklift_id: int):
    existing = ForkliftRepository.get_by_id(forklift_id)
    if not existing:
        raise NotFound("Montacargas no encontrado")

    payload: dict = {}

    if request.content_type and "multipart/form-data" in request.content_type:
        form = request.form

        if "serie" in form:         payload["serie"] = form["serie"].strip()
        if "model" in form:         payload["model"] = form["model"].strip()
        if "forklift_type" in form: payload["forklift_type"] = form["forklift_type"].strip()
        if "ubication" in form:     payload["ubication"] = form["ubication"].strip()

        if "battery_id" in form:    payload["battery_id"]  = _to_int_or_none(form.get("battery_id"))
        if "charger_id" in form:    payload["charger_id"]  = _to_int_or_none(form.get("charger_id"))

        new_image = request.files.get("image")  # opcional
        if new_image and new_image.filename:
            new_url = save_image_bytes(new_image.read(), "forklifts", new_image.filename)
            payload["image_url"] = new_url
            # borrar la anterior si cambió
            if existing.image_url and existing.image_url != new_url:
                delete_image_by_url(existing.image_url)

    else:
        data = request.get_json(silent=True) or {}
        if "serie" in data:         payload["serie"] = str(data["serie"]).strip()
        if "model" in data:         payload["model"] = str(data["model"]).strip()
        if "forklift_type" in data: payload["forklift_type"] = str(data["forklift_type"]).strip()
        if "ubication" in data:     payload["ubication"] = str(data["ubication"]).strip()

        if "battery_id" in data:    payload["battery_id"] = _to_int_or_none(data.get("battery_id"))
        if "charger_id" in data:    payload["charger_id"] = _to_int_or_none(data.get("charger_id"))

        if "image_url" in data:
            payload["image_url"] = str(data["image_url"]).strip() or None

    ok = ForkliftRepository.update(forklift_id, payload)
    updated = ForkliftRepository.get_by_id(forklift_id) if ok else existing
    return jsonify({"ok": True, "data": updated.__dict__}), 200

@api_bp.delete("/forklifts/<int:forklift_id>")
def delete_forklift(forklift_id: int):
    existing = ForkliftRepository.get_by_id(forklift_id)
    if not existing:
        raise NotFound("Montacargas no encontrado")
    if existing.image_url:
        delete_image_by_url(existing.image_url)
    ok = ForkliftRepository.delete(forklift_id)
    return jsonify({"ok": ok}), 200

# ---------- Cargadores ----------
@api_bp.post("/chargers")
def create_charger():
    if request.content_type and "multipart/form-data" in request.content_type:
        form = request.form
        _require_fields(form, ["model", "serie"])
        image = request.files.get("image")
        image_url = None
        if image and image.filename:
            image_url = save_image_bytes(image.read(), "chargers", image.filename)
        charger = ChargerModel(id=None, model=form["model"].strip(), serie=form["serie"].strip(), image_url=image_url)
    else:
        data = request.get_json(silent=True) or {}
        _require_fields(data, ["model", "serie"])
        charger = ChargerModel(
            id=None,
            model=str(data["model"]).strip(),
            serie=str(data["serie"]).strip(),
            image_url=str(data.get("image_url") or "").strip() or None
        )
    new_id = ChargerRepository.create_new_charger(charger)
    return jsonify({"ok": True, "data": {"id": new_id}}), 201

@api_bp.get("/chargers/<int:charger_id>")
def get_charger(charger_id: int):
    b = ChargerRepository.get_by_id(charger_id)
    if not b:
        raise NotFound("Batería no encontrada")
    return jsonify({"ok": True, "data": b.__dict__}), 200

@api_bp.get("/chargers")
def list_chargers():
    try:
        limit = int(request.args.get("limit", 100))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        raise BadRequest("limit y offset deben ser enteros.")
    rows = ChargerRepository.list_all(limit=limit, offset=offset)
    return jsonify({"ok": True, "data": [r.__dict__ for r in rows]}), 200

@api_bp.put("/chargers/<int:charger_id>")
@api_bp.patch("/chargers/<int:charger_id>")
def update_charger(charger_id: int):
    existing = ChargerRepository.get_by_id(charger_id)
    if not existing:
        raise NotFound("Batería no encontrada")

    payload = {}
    if request.content_type and "multipart/form-data" in request.content_type:
        form = request.form
        if "model" in form: payload["model"] = form["model"].strip()
        if "serie" in form: payload["serie"] = form["serie"].strip()
        new_image = request.files.get("image")
        if new_image and new_image.filename:
            new_url = save_image_bytes(new_image.read(), "charger", new_image.filename) 
            payload["image_url"] = new_url
            # opcional: borrar la anterior
            if existing.image_url and existing.image_url != new_url:
                delete_image_by_url(existing.image_url)
    else:
        data = request.get_json(silent=True) or {}
        if "model" in data: payload["model"] = str(data["model"]).strip()
        if "serie" in data: payload["serie"] = str(data["serie"]).strip()
        if "image_url" in data:
            payload["image_url"] = str(data["image_url"]).strip() or None

    ok = ChargerRepository.update(charger_id, payload)
    updated = ChargerRepository.get_by_id(charger_id) if ok else existing
    return jsonify({"ok": True, "data": updated.__dict__}), 200

@api_bp.delete("/chargers/<int:charger_id>")
def delete_charger(charger_id: int):
    existing = ChargerRepository.get_by_id(charger_id)
    if not existing:
        raise NotFound("Batería no encontrada")
    if existing.image_url:
        delete_image_by_url(existing.image_url)
    ok = ChargerRepository.delete(charger_id)
    return jsonify({"ok": ok}), 200


# ---------- Baterias ----------
@api_bp.post("/batteries")
def create_battery():
    if request.content_type and "multipart/form-data" in request.content_type:
        form = request.form
        _require_fields(form, ["model", "serie"])
        image = request.files.get("image")
        image_url = None
        if image and image.filename:
            image_url = save_image_bytes(image.read(), "batteries", image.filename)
        battery = BatteryModel(id=None, model=form["model"].strip(), serie=form["serie"].strip(), image_url = image_url)
    else:
        data = request.get_json(silent = True) or {}
        _require_fields(data, ["model", "serie"])
        battery = BatteryModel(
            id = None,
            model = str(data["model"]).strip(),
            serie = str(data["serie"]).strip(),
            image_url = str(data.get("image_url") or "").strip() or None
        )
    new_id = BatteryRepository.create_new_battery(battery)
    return jsonify({"ok": True, "data": {"id":new_id}}), 201

@api_bp.get("/batteries/<int:battery_id>")
def get_battery(battery_id: int):
    b = BatteryRepository.get_by_id(battery_id)
    if not b:
        raise NotFound("Batería no encontrada")
    return jsonify({"ok": True, "data": b.__dict__}), 200

@api_bp.get("/batteries")
def list_batteries():
    try:
        limit = int(request.args.get("limit", 100))
        offset = int(request.args.get("offset", 0))
    except ValueError:
        raise BadRequest("limit y offset deben ser enteros.")
    rows = BatteryRepository.list_all(limit=limit, offset=offset)
    return jsonify({"ok": True, "data": [r.__dict__ for r in rows]}), 200

@api_bp.put("/batteries/<int:battery_id>")
@api_bp.patch("/batteries/<int:battery_id>")
def update_battery(battery_id: int):
    existing = BatteryRepository.get_by_id(battery_id)
    if not existing:
        raise NotFound("Batería no encontrada")

    payload = {}
    if request.content_type and "multipart/form-data" in request.content_type:
        form = request.form
        if "model" in form: payload["model"] = form["model"].strip()
        if "serie" in form: payload["serie"] = form["serie"].strip()
        new_image = request.files.get("image")
        if new_image and new_image.filename:
            new_url = save_image_bytes(new_image.read(), "batteries", new_image.filename)
            payload["image_url"] = new_url
            if existing.image_url and existing.image_url != new_url:
                delete_image_by_url(existing.image_url)
    else:
        data = request.get_json(silent=True) or {}
        if "model" in data: payload["model"] = str(data["model"]).strip()
        if "serie" in data: payload["serie"] = str(data["serie"]).strip()
        if "image_url" in data:
            payload["image_url"] = str(data["image_url"]).strip() or None

    ok = BatteryRepository.update(battery_id, payload)
    updated = BatteryRepository.get_by_id(battery_id) if ok else existing
    return jsonify({"ok": True, "data": updated.__dict__}), 200

@api_bp.delete("/batteries/<int:battery_id>")
def delete_battery(battery_id: int):
    existing = BatteryRepository.get_by_id(battery_id)
    if not existing:
        raise NotFound("Batería no encontrada")
    if existing.image_url:
        delete_image_by_url(existing.image_url)
    ok = BatteryRepository.delete(battery_id)
    return jsonify({"ok": ok}), 200
