// frontend/src/pages/batteries/BatteryList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBatteries, deleteBattery, type Battery } from '../../api/batteries'

export default function BatteryList() {
    const [rows, setRows] = useState<Battery[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        (async () => {
            setLoading(true); setError(null)
            try {
                const items = await listBatteries({ limit: 100, offset: 0 })
                setRows(items ?? [])
            } catch (e: any) {
                setError(e?.response?.data?.error || 'Error al cargar baterías')
            } finally {
                setLoading(false)
            }
        })()
    }, [])


    const onDelete = async (id?: number) => {
        if (!id) return
        if (!confirm('¿Eliminar batería?')) return
        await deleteBattery(id)

        const items = await listBatteries({ limit: 100, offset: 0 })
        setRows(items ?? [])
    }
    if (loading) return <div>Cargando…</div>
    if (error) return <div className="text-red-600">{error}</div>

    return (
        <section className="space-y-4">
            <header className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Baterías</h1>
                <Link to="/batteries/new" className="btn">Nueva</Link>
            </header>

            {loading ? <div>Cargando…</div> : error ? <div className="text-red-600">{error}</div> : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border bg-white">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Modelo</th>
                                <th className="p-2 border">Serie</th>
                                <th className="p-2 border">Imagen</th>
                                <th className="p-2 border">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(b => (
                                <tr key={b.id}>
                                    <td className="p-2 border">{b.id}</td>
                                    <td className="p-2 border">{b.model}</td>
                                    <td className="p-2 border">{b.serie}</td>
                                    <td className="p-2 border">
                                        {b.image_url ? <img src={b.image_url} alt="" style={{ width: 56, height: 40, objectFit: 'cover' }} /> : '—'}
                                    </td>
                                    <td className="p-2 border">
                                        <Link to={`/batteries/${b.id}`} className="underline">Editar</Link>
                                        <button onClick={() => onDelete(b.id)} className="ml-2 text-red-600">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 && <tr><td className="p-3 text-center" colSpan={5}>Sin datos</td></tr>}

                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
