// src/pages/forklifts/ForkliftEdit.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getForklift, updateForklift } from '../../api/forklift'
import { listBatteries, type Battery } from '../../api/batteries'
import { listChargers, type Charger } from '../../api/charger'
import style from '../../css/forklifts.module.scss'

export default function ForkliftEdit() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [serie, setSerie] = useState('')
  const [model, setModel] = useState('')
  const [forkliftType, setForkliftType] = useState('')
  const [ubication, setUbication] = useState('')

  const [batteryId, setBatteryId] = useState<number | ''>('')
  const [chargerId, setChargerId] = useState<number | ''>('')

  const [fkImage, setFkImage] = useState<File | null>(null)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  const [batteries, setBatteries] = useState<Battery[]>([])
  const [chargers, setChargers] = useState<Charger[]>([])

  const toImgUrl = (p?: string | null) => (p ? new URL(p, window.location.origin).href : '')

  const FORKLIFT_TYPES = ["combustión", "eléctrico"] as const;

  const UBICATIONS = [
    "Mobinsa",
    "Av. Industrias",
    "Sucursal Norte",
    "Sucursal Centro",
    "Sucursal Sur"
  ] as const;

  useEffect(() => {
    (async () => {
      try {
        const [fkBody, bs, cs] = await Promise.all([
          getForklift(Number(id)),
          listBatteries({ limit: 200, offset: 0 }),
          listChargers({ limit: 200, offset: 0 }),
        ])
        const fk = fkBody.data;

        setSerie(fk.serie)
        setModel(fk.model)
        setForkliftType(fk.forklift_type)
        setUbication(fk.ubication)
        setBatteryId(fk.battery_id)
        setChargerId(fk.charger_id)

        setBatteries(bs ?? [])
        setChargers(cs ?? [])
      } catch (e: any) {
        setError(e?.response?.data?.error || 'Error al cargar')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError(null)
    try {
      await updateForklift(Number(id), {
        serie,
        model,
        forklift_type: forkliftType,
        ubication,
        battery_id: Number(batteryId),
        charger_id: Number(chargerId),
        imageFile: fkImage || undefined,
      })
      nav('/forklifts')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Cargando…</div>

  return (
    <div>
      <form onSubmit={onSubmit} className={style.formForklift}>
        <h2>Editar Montacargas #{id}</h2>
        {error && <div>{error}</div>}

        <fieldset>
          <legend>Datos del montacargas</legend>

          <label>
            <span>Serie</span>
            <input value={serie} onChange={e => setSerie(e.target.value)} required />
          </label>

          <label>
            <span>Modelo</span>
            <input value={model} onChange={e => setModel(e.target.value)} required />
          </label>

          <label className="block">
            <span>Tipo</span>
            <select
              value={forkliftType}
              onChange={e => setForkliftType(e.target.value)}
              required
            >
              <option value="">— Selecciona tipo —</option>
              {FORKLIFT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span>Ubicación</span>
            <select
              value={ubication}
              onChange={e => setUbication(e.target.value)}
              required
            >
              <option value="">— Selecciona ubicación —</option>
              {UBICATIONS.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </label>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block">
              <span>Batería</span>
              <select
                value={batteryId}
                onChange={e => setBatteryId(Number(e.target.value))}
                required
              >
                <option value="">— Selecciona —</option>
                {batteries.map(b => (
                  <option key={b.id} value={b.id}>
                    {b.id} • {b.model} • {b.serie}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span>Cargador</span>
              <select
                value={chargerId}
                onChange={e => setChargerId(Number(e.target.value))}
                required
              >
                <option value="">— Selecciona —</option>
                {chargers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} • {c.model} • {c.serie}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <div>
              <span>Imagen actual</span>
              {currentImageUrl ? (
                <img
                  src={toImgUrl(currentImageUrl)}
                  alt="Imagen actual"
                  style={{ width: 160, height: 120, objectFit: 'cover' }}
                />
              ) : (
                <div>— Sin imagen —</div>
              )}
            </div>

            <label>
              <span>Reemplazar imagen (opcional)</span>
              <input
                type="file"
                accept="image/*"
                onChange={e => setFkImage(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
        </fieldset>

        <div className={style.actions}>
          <button
            className={style.save}
            disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            className={style.save}
            type="button"
            onClick={() => nav('/forklifts')}
            disabled={saving}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
