// frontend/src/pages/batteries/BatteryEdit.tsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getBattery, updateBattery } from '../../api/batteries'
import style from '../../css/batteries.module.scss'

export default function BatteryEdit() {
  const { id } = useParams<{ id: string }>()
  const nav = useNavigate()
  const [model, setModel] = useState('')
  const [serie, setSerie] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const res: any = await getBattery(Number(id))
        const payload = res?.data ?? res
        const b = payload?.data ?? payload
        setModel(b.model)
        setSerie(b.serie)
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
      await updateBattery(Number(id), { model, serie, imageFile })
      nav('/batteries')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Cargando…</div>

  return (
    <form className={style.formBattery} onSubmit={onSubmit}>
      <h2>Editar batería #{id} {model} {serie}</h2>
      {error && <div>{error}</div>}

      <label>
        <span>Modelo</span>
        <input value={model} onChange={e => setModel(e.target.value)} required />
      </label>
      <label>
        <span>Serie</span>
        <input value={serie} onChange={e => setSerie(e.target.value)} required />
      </label>
      <label>
        <span>Reemplazar imagen (opcional)</span>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
      </label>

      <button className={style.save} disabled={saving}>
        <span>{saving ? 'Guardando…' : 'Guardar'}</span>
      </button>
    </form>
  )
}
