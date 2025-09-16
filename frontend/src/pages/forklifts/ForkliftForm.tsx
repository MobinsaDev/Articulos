import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createForklift } from '../../api/forklift'
import { listBatteries, createBattery, type Battery } from '../../api/batteries'
import { listChargers, createCharger, type Charger } from '../../api/charger'

export default function ForkliftForm() {
    const nav = useNavigate()

    const [serie, setSerie] = useState('')
    const [model, setModel] = useState('')
    const [forkliftType, setForkliftType] = useState('')
    const [ubication, setUbication] = useState('')
    const [fkImage, setFkImage] = useState<File | null>(null)

    const [batteries, setBatteries] = useState<Battery[]>([])
    const [chargers, setChargers] = useState<Charger[]>([])
    const [batteryId, setBatteryId] = useState<number | ''>('')
    const [chargerId, setChargerId] = useState<number | ''>('')

    const [inlineBattery, setInlineBattery] = useState(false)
    const [inlineCharger, setInlineCharger] = useState(false)

    const [bModel, setBModel] = useState('')
    const [bSerie, setBSerie] = useState('')
    const [bImage, setBImage] = useState<File | null>(null)

    const [cModel, setCModel] = useState('')
    const [cSerie, setCSerie] = useState('')
    const [cImage, setCImage] = useState<File | null>(null)

    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            try {
                const [bs, cs] = await Promise.all([
                    listBatteries({ limit: 200, offset: 0 }),
                    listChargers({ limit: 200, offset: 0 }),
                ])
                setBatteries(bs ?? [])
                setChargers(cs ?? [])
            } catch (e) {
            }
        })()
    }, [])

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true); setError(null)
        try {
            let finalBatteryId = batteryId
            let finalChargerId = chargerId

            if (inlineBattery) {
                const bRes: any = await createBattery({ model: bModel, serie: bSerie, imageFile: bImage })
                const bPayload = bRes?.data ?? bRes
                finalBatteryId = bPayload?.data?.id ?? bPayload?.id
                if (!finalBatteryId) throw new Error('No se obtuvo battery_id')
            }

            if (inlineCharger) {
                const cRes: any = await createCharger({ model: cModel, serie: cSerie, imageFile: cImage })
                const cPayload = cRes?.data ?? cRes
                finalChargerId = cPayload?.data?.id ?? cPayload?.id
                if (!finalChargerId) throw new Error('No se obtuvo charger_id')
            }

            if (!finalBatteryId || !finalChargerId) {
                throw new Error('Selecciona/crea batería y cargador')
            }

            await createForklift({
                serie, model, forklift_type: forkliftType, ubication,
                battery_id: Number(finalBatteryId),
                charger_id: Number(finalChargerId),
                imageFile: fkImage
            })

            nav('/forklifts')
        } catch (e: any) {
            setError(e?.response?.data?.error || e?.message || 'Error al crear montacargas')
        } finally {
            setSaving(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-6 max-w-3xl">
            <h2 className="text-xl font-semibold">Nuevo Montacargas</h2>
            {error && <div className="text-red-600">{error}</div>}

            <fieldset className="border p-4 rounded">
                <legend className="font-bold">Montacargas</legend>
                <label className="block">
                    <span>Serie</span>
                    <input className="input" value={serie} onChange={e => setSerie(e.target.value)} required />
                </label>
                <label className="block">
                    <span>Modelo</span>
                    <input className="input" value={model} onChange={e => setModel(e.target.value)} required />
                </label>
                <label className="block">
                    <span>Tipo</span>
                    <input className="input" value={forkliftType} onChange={e => setForkliftType(e.target.value)} required />
                </label>
                <label className="block">
                    <span>Ubicación</span>
                    <input className="input" value={ubication} onChange={e => setUbication(e.target.value)} required />
                </label>
                <label className="block">
                    <span>Imagen</span>
                    <input type="file" accept="image/*" onChange={e => setFkImage(e.target.files?.[0] ?? null)} />
                </label>
            </fieldset>

            <fieldset className="border p-4 rounded">
                <legend className="font-bold">Batería</legend>
                <label className="block">
                    <input type="checkbox" checked={inlineBattery} onChange={e => setInlineBattery(e.target.checked)} />
                    <span className="ml-2">Dar de alta una nueva batería aquí</span>
                </label>

                {!inlineBattery ? (
                    <label className="block">
                        <span>Seleccionar batería</span>
                        <select className="input" value={batteryId} onChange={e => setBatteryId(Number(e.target.value))} required>
                            <option value="">— Selecciona —</option>
                            {batteries.map(b => <option key={b.id} value={b.id}>{b.id} • {b.model} • {b.serie}</option>)}
                        </select>
                    </label>
                ) : (
                    <>
                        <label className="block">
                            <span>Modelo</span>
                            <input className="input" value={bModel} onChange={e => setBModel(e.target.value)} required />
                        </label>
                        <label className="block">
                            <span>Serie</span>
                            <input className="input" value={bSerie} onChange={e => setBSerie(e.target.value)} required />
                        </label>
                        <label className="block">
                            <span>Imagen</span>
                            <input type="file" accept="image/*" onChange={e => setBImage(e.target.files?.[0] ?? null)} />
                        </label>
                    </>
                )}
            </fieldset>

            <fieldset className="border p-4 rounded">
                <legend className="font-bold">Cargador</legend>
                <label className="block">
                    <input type="checkbox" checked={inlineCharger} onChange={e => setInlineCharger(e.target.checked)} />
                    <span className="ml-2">Dar de alta un nuevo cargador aquí</span>
                </label>

                {!inlineCharger ? (
                    <label className="block">
                        <span>Seleccionar cargador</span>
                        <select className="input" value={chargerId} onChange={e => setChargerId(Number(e.target.value))} required>
                            <option value="">— Selecciona —</option>
                            {chargers.map(c => <option key={c.id} value={c.id}>{c.id} • {c.model} • {c.serie}</option>)}
                        </select>
                    </label>
                ) : (
                    <>
                        <label className="block">
                            <span>Modelo</span>
                            <input className="input" value={cModel} onChange={e => setCModel(e.target.value)} required />
                        </label>
                        <label className="block">
                            <span>Serie</span>
                            <input className="input" value={cSerie} onChange={e => setCSerie(e.target.value)} required />
                        </label>
                        <label className="block">
                            <span>Imagen</span>
                            <input type="file" accept="image/*" onChange={e => setCImage(e.target.files?.[0] ?? null)} />
                        </label>
                    </>
                )}
            </fieldset>

            <button className="btn" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
        </form>
    )
}
