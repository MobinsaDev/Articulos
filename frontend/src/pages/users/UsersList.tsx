// frontend/src/pages/users/UserList.tsx
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listUsers, deleteUser, type User } from '../../api/users'
import style from '../../css/users.module.scss'

export default function UsersList() {
    const [rows, setRows] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = async () => {
        setLoading(true); setError(null)
        try {
            const items = await listUsers({ limit: 100, offset: 0 })
            setRows(items ?? [])
        } catch (e: any) {
            setError(e?.response?.data?.error || 'Error al cargar usuarios')
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => { void load() }, [])

    const onDelete = async (id?: number) => {
        if (!id) return
        if (!confirm('¿Eliminar usuario?')) return
        await deleteUser(id)
        await load()
    }

    if (loading) return <div>Cargando…</div>
    if (error) return <div>{error}</div>

    return (
        <section className={style.mainUsers}>
            <header>
                <h1>Usuarios</h1>
                <Link className={style.new} to="/users/new">
                    <span>Nuevo</span>
                </Link>
            </header>
            <div className={style.tableWrap}>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr><td colSpan={5}>Sin datos</td></tr>
                        ) : rows.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                                <td>
                                    <Link to={`/users/${u.id}`}>Editar</Link>
                                    <button onClick={() => onDelete(u.id)}>
                                        <span>Eliminar</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
