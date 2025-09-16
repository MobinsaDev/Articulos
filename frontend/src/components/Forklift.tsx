// src/features/forklifts/ForkliftForm.tsx
import { useState } from "react";
import { useAuth } from '../context/AuthContext'
import { useNavigate } from "react-router-dom";

export default function ForkliftForm() {
    const nav = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [forklift, setForklift] = useState({
        serie: "",
        model: "",
        forklift_type: "",
        ubication: "",
        image: null as File | null,
    });

    const [battery, setBattery] = useState({
        model: "",
        serie: "",
        image: null as File | null,
    });

    const [charger, setCharger] = useState({
        model: "",
        serie: "",
        image: null as File | null,
    });

    const handleChange =
        (setState: any) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const { name, value, files } = e.target as any;
                setState((prev: any) => ({
                    ...prev,
                    [name]: files ? files[0] : value,
                }));
            };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const fdB = new FormData();
            fdB.append("model", battery.model);
            fdB.append("serie", battery.serie);
            if (battery.image) fdB.append("image", battery.image);
            const { data: bRes } = await client.post("/api/batteries", fdB, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const battery_id = bRes.data.id;

            const fdC = new FormData();
            fdC.append("model", charger.model);
            fdC.append("serie", charger.serie);
            if (charger.image) fdC.append("image", charger.image);
            const { data: cRes } = await client.post("/api/chargers", fdC, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const charger_id = cRes.data.id;

            const fdF = new FormData();
            fdF.append("serie", forklift.serie);
            fdF.append("model", forklift.model);
            fdF.append("forklift_type", forklift.forklift_type);
            fdF.append("ubication", forklift.ubication);
            fdF.append("battery_id", battery_id);
            fdF.append("charger_id", charger_id);
            if (forklift.image) fdF.append("image", forklift.image);

            await client.post("/api/forklifts", fdF, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            nav("/forklifts"); 
        } catch (err: any) {
            setError(err?.response?.data?.error || "Error al registrar montacargas");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold">Nuevo Montacargas</h2>
            {error && <div className="p-2 bg-red-100 text-red-700">{error}</div>}

            {/* Forklift */}
            <fieldset className="border p-4 rounded">
                <legend className="font-bold">Montacargas</legend>
                <input
                    name="serie"
                    placeholder="Serie"
                    value={forklift.serie}
                    onChange={handleChange(setForklift)}
                    required
                />
                <input
                    name="model"
                    placeholder="Modelo"
                    value={forklift.model}
                    onChange={handleChange(setForklift)}
                    required
                />
                <input
                    name="forklift_type"
                    placeholder="Tipo"
                    value={forklift.forklift_type}
                    onChange={handleChange(setForklift)}
                    required
                />
                <input
                    name="ubication"
                    placeholder="Ubicación"
                    value={forklift.ubication}
                    onChange={handleChange(setForklift)}
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange(setForklift)}
                />
            </fieldset>

            {/* Battery */}
            <fieldset className="border p-4 rounded">
                <legend className="font-bold">Batería</legend>
                <input
                    name="model"
                    placeholder="Modelo"
                    value={battery.model}
                    onChange={handleChange(setBattery)}
                    required
                />
                <input
                    name="serie"
                    placeholder="Serie"
                    value={battery.serie}
                    onChange={handleChange(setBattery)}
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange(setBattery)}
                />
            </fieldset>

            {/* Charger */}
            <fieldset className="border p-4 rounded">
                <legend className="font-bold">Cargador</legend>
                <input
                    name="model"
                    placeholder="Modelo"
                    value={charger.model}
                    onChange={handleChange(setCharger)}
                    required
                />
                <input
                    name="serie"
                    placeholder="Serie"
                    value={charger.serie}
                    onChange={handleChange(setCharger)}
                    required
                />
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange(setCharger)}
                />
            </fieldset>

            <button disabled={loading} className="btn">
                {loading ? "Guardando…" : "Guardar"}
            </button>
        </form>
    );
}
