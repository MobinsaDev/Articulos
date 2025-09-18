// frontend/src/pages/users/UserForm.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getUser, updateUser } from '../../api/users'
import style from '../../css/users.module.scss'

export default function UsersEdit() {
    const nav = useNavigate()
    const [name, setName] = useState('')
    const [secondname, setSecondname] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<'tech' | 'manager'>('manager')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        (async () => {
            try {
                const { data } = await getUser(Number(id))
                setName(data.name);
                setSecondname(data.secondname)
                setEmail(data.email)
                setRole(data.role)
            } catch (error: any) {
                setError(error?.response?.data?.error || 'Error al cargar')
            } finally {
                setLoading(false)
            }
        })()
    }, [id])
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await updateUser(Number(id), { name, secondname, email, role })
            nav('/users')
        } catch (e: any) {
            setError(e?.response?.data?.error || 'Error al guardar cambios')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={style.formUsers} onSubmit={onSubmit}>
            <h2>Editar usuario</h2>
            {error && <div>{error}</div>}
            <label>
                <span>Nombre (s)</span>
                <input value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
                <span>Apellidos (s)</span>
                <input value={secondname} onChange={e => setSecondname(e.target.value)} required />
            </label>
            <label>
                <span>Email</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
                <span>Rol</span>
                <select value={role} onChange={e => setRole(e.target.value as any)}>
                    <option value="manager">Gerente</option>
                    <option value="tech">Técnico</option>
                </select>
            </label>
            <button className={style.save} disabled={loading}>
                <span>{loading ? 'Guardando…' : 'Guardar'}</span>
            </button>
        </form>
    )
}
