import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listForklifts, deleteForklift, type Forklift } from '../../api/forklift'
import { useAuth } from '../../context/AuthContext';
import style from '../../css/forklifts.module.scss'

export default function ForkliftList() {
  const [rows, setRows] = useState<Forklift[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth();

  console.log(user)
  const load = async () => {
    setLoading(true); setError(null)
    try {
      const items = await listForklifts({ limit: 100, offset: 0 })
      setRows(items ?? [])
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Error al cargar montacargas')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { void load() }, [])

  const onDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('¿Eliminar montacargas?')) return
    await deleteForklift(id)
    await load()
  }

  if (loading) return <div>Cargando…</div>
  if (error) return <div>{error}</div>

  const toImgUrl = (p?: string | null) => p ? new URL(p, window.location.origin).href : ''

  return (
    <div className={style.mainForklift}>
      <section>
        <header>
          <h1>Montacargas</h1>
          <Link className={style.new} to="/forklifts/new">
          <span>Nuevo</span>
          </Link>
        </header>

        <div className={style.tableWrap}>
          <table>
            <thead>
              <tr>
                <th>Serie</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Ubicación</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={7}>Sin datos</td></tr>
              ) : rows.map(fk => (
                <tr key={fk.id}>
                  <td>{fk.serie}</td>
                  <td>{fk.model}</td>
                  <td>{fk.forklift_type}</td>
                  <td>{fk.ubication}</td>
                  <td>
                    {fk.image_url ? <img src={toImgUrl(fk.image_url)} alt="" style={{ width: 56, height: 40, objectFit: 'cover' }} /> : '—'}
                  </td>
                  <td>
                    {(user?.role === 'admin' || user?.role === 'manager') && (
                      <Link to={`/forklifts/${fk.id}`}>Editar</Link>
                    )}
                    {(user?.role === 'admin') && (
                      <button onClick={() => onDelete(fk.id)}>Eliminar</button>
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
