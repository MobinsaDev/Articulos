import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCharger } from '../../api/charger'

export default function ChargerForm() {
    const nav = useNavigate()
    const [model, setModel] = useState('')
    const [serie, setSerie] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await createCharger({ model, serie, imageFile })
            nav('/chargers')
        } catch (e: any) {
            setError(e?.response?.data?.error || 'Error al crear cargador')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4 max-w-md">
            <h2 className="text-lg font-semibold">Nuevo cargador</h2>
            {error && <div className="text-red-600">{error}</div>}
            <label className="block">
                <span>Modelo</span>
                <input className="input" value={model} onChange={e => setModel(e.target.value)} required />
            </label>
            <label className="block">
                <span>Serie</span>
                <input className="input" value={serie} onChange={e => setSerie(e.target.value)} required />
            </label>
            <label className="block">
                <span>Imagen</span>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] ?? null)} />
            </label>
            <button className="btn" disabled={loading}>{loading ? 'Guardando…' : 'Guardar'}</button>
        </form>
    )
}
