import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import { listAditaments, deleteCharger, type Charger } from '../../api/charger'
import style from '../../css/aditamets.module.scss'

export default function AditametsList() {
//   const [rows, setRows] = useState<Charger[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true); setError(null)
    try {
    //   const items = await listAditaments({ limit: 100, offset: 0 })
    //   setRows(items ?? [])
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
    // await deleteCharger(id)
    await load()
  }

  if (loading) return <div>Cargando…</div>
  if (error) return <div className="text-red-600">{error}</div>

  const toImgUrl = (p?: string | null) => p ? new URL(p, window.location.origin).href : ''

  return (
    <div className={style.mainAditamets}>
      <section className="space-y-4">
        <header className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Aditamentos</h1>
          <Link to="/aditaments/new" className={style.new}>
          <span>Nuevo</span>
          </Link>
        </header>

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
                <tr><td className="p-3 text-center" colSpan={5}>Sin datos</td></tr>
              {/* {rows.length === 0 ? (
              ) : rows.map(c => ( 
                <tr key={c.id}>
                  <td className="p-2 border">{c.id}</td>
                  <td className="p-2 border">{c.model}</td>
                  <td className="p-2 border">{c.serie}</td>
                  <td className="p-2 border">
                    {c.image_url ? <img src={toImgUrl(c.image_url)} alt="" style={{ width: 56, height: 40, objectFit: 'cover' }} /> : '—'}
                  </td>
                  <td className="p-2 border">
                    <Link to={`/aditaments/${c.id}`} className="underline">Editar</Link>
                    <button onClick={() => onDelete(c.id)} className="ml-2 text-red-600">Eliminar</button>
                  </td>
                </tr>
              ))}*/}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
