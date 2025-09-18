// frontend/src/pages/batteries/BatteryList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listBatteries, deleteBattery, type Battery } from '../../api/batteries'
import style from '../../css/batteries.module.scss'
import { useAuth } from '../../context/AuthContext';

export default function BatteryList() {
    const [rows, setRows] = useState<Battery[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth();

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
    if (error) return <div>{error}</div>

    return (

        <div className={style.mainBatteries}>
            <section>
                <header>
                    <h1>Baterías</h1>
                    <Link to="/batteries/new" className=
                        {style.new}>
                        <span>Nuevo</span>
                    </Link>
                </header>

                {loading ? <div>Cargando…</div> : error ? <div>{error}</div> : (
                    <div className={style.tableWrap}>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Modelo</th>
                                    <th>Serie</th>
                                    <th>Imagen</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map(b => (
                                    <tr key={b.id}>
                                        <td>{b.id}</td>
                                        <td>{b.model}</td>
                                        <td>{b.serie}</td>
                                        <td>
                                            {b.image_url ? <img src={b.image_url} alt="" style={{ width: 56, height: 40, objectFit: 'cover' }} /> : '—'}
                                        </td>
                                        <td>
                                            {(user?.role === 'admin' || user?.role === 'manager') && (
                                                <Link to={`/batteries/${b.id}`}>Editar</Link>
                                            )}
                                            {(user?.role === 'admin') && (
                                                <button onClick={() => onDelete(b.id)}>Eliminar</button>
                                            )}

                                        </td>
                                    </tr>
                                ))}
                                {rows.length === 0 && <tr><td colSpan={5}>Sin datos</td></tr>}

                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    )
}
