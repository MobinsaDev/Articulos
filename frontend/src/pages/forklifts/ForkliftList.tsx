import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listForklifts, deleteForklift, type Forklift } from '../../api/forklift'
import { useAuth } from '../../context/AuthContext';

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
  if (error) return <div className="text-red-600">{error}</div>

  const toImgUrl = (p?: string | null) => p ? new URL(p, window.location.origin).href : ''

  return (
    <section className="space-y-4">
      <header className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Montacargas</h1>
        <Link to="/forklifts/new" className="btn">Nuevo</Link>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full border bg-white">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Serie</th>
              <th className="p-2 border">Modelo</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Ubicación</th>
              <th className="p-2 border">Imagen</th>
              <th className="p-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td className="p-3 text-center" colSpan={7}>Sin datos</td></tr>
            ) : rows.map(fk => (
              <tr key={fk.id}>
                <td className="p-2 border">{fk.id}</td>
                <td className="p-2 border">{fk.serie}</td>
                <td className="p-2 border">{fk.model}</td>
                <td className="p-2 border">{fk.forklift_type}</td>
                <td className="p-2 border">{fk.ubication}</td>
                <td className="p-2 border">
                  {fk.image_url ? <img src={toImgUrl(fk.image_url)} alt="" style={{ width: 56, height: 40, objectFit: 'cover' }} /> : '—'}
                </td>
                <td className="p-2 border">
                  {(user?.role === 'admin' || user?.role === 'manager') && (
                    <Link to={`/forklifts/${fk.id}`} className="underline">Editar</Link>
                  )}
                  {(user?.role === 'admin') && (
                    <button onClick={() => onDelete(fk.id)} className="ml-2 text-red-600">Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
