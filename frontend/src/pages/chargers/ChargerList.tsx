import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listChargers, deleteCharger, type Charger } from '../../api/charger'
import style from '../../css/chargers.module.scss'
import { useAuth } from '../../context/AuthContext';

export default function ChargerList() {
  const [rows, setRows] = useState<Charger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth();

  const load = async () => {
    setLoading(true); setError(null)
    try {
      const items = await listChargers({ limit: 100, offset: 0 })
      setRows(items ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Error al cargar cargadores')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { void load() }, [])

  const onDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('¿Eliminar cargador?')) return
    await deleteCharger(id)
    await load()
  }

  if (loading) return <div>Cargando…</div>
  if (error) return <div>{error}</div>

  const toImgUrl = (p?: string | null) => p ? new URL(p, window.location.origin).href : ''

  return (
    <div className={style.mainChargers}>
      <section>
        <header>
          <h1>Cargadores</h1>
          <Link to="/chargers/new" className={style.new}>
            <span>Nuevo</span>
          </Link>
        </header>

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
              {rows.length === 0 ? (
                <tr><td colSpan={5}>Sin datos</td></tr>
              ) : rows.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.model}</td>
                  <td>{c.serie}</td>
                  <td>
                    {c.image_url ? <img src={toImgUrl(c.image_url)} alt="" style={{ width: 56, height: 40, objectFit: 'cover' }} /> : '—'}
                  </td>
                  <td>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <Link to={`/chargers/${c.id}`}>Editar</Link>
                    )}
                    {(user?.role === 'admin') && (
                      <button onClick={() => onDelete(c.id)}>Eliminar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
