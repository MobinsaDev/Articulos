import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCharger, updateCharger } from '../../api/charger'
import style from '../../css/chargers.module.scss'

export default function ChargerEdit() {
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
        const { data } = await getCharger(Number(id))
        setModel(data.data.model)
        setSerie(data.data.serie)
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
      await updateCharger(Number(id), { model, serie, imageFile })
      nav('/chargers')
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Error al guardar cambios')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div>Cargando…</div>

  return (
    <form onSubmit={onSubmit} className={style.formCharger}>
      <h2 >Editar cargador #{id}</h2>
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
