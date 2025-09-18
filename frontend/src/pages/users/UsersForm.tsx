// frontend/src/pages/users/UserForm.tsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../../api/users'
import style from '../../css/users.module.scss'

export default function UsersForm() {
    const nav = useNavigate()
    const [name, setName] = useState('')
    const [secondname, setSecondname] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState<'admin' | 'tech' | 'manager'>('manager')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true); setError(null)
        try {
            await createUser({ name, secondname, email, role, password })
            console.log( name, secondname, email, role)
            nav('/users')
        } catch (e: any) {
            setError(e?.response?.data?.error || 'Error al crear usuario')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form className={style.formUsers} onSubmit={onSubmit}>
            <h2>Nuevo usuario</h2>
            {error && <div>{error}</div>}
            <label>
                <span>Nombre (s)</span>
                <input value={name} onChange={e => setName(e.target.value)} required />
            </label>
            <label>
                <span>Apellido (s)</span>
                <input value={secondname} onChange={e => setSecondname(e.target.value)} required />
            </label>
            <label>
                <span>Email</span>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </label>
            <label>
                <span>Rol</span>
                <select value={role} onChange={e => setRole(e.target.value as any)}>
                    <option value="admin">admin</option>
                    <option value="tech">tech</option>
                    <option value="manager">manager</option>
                </select>
            </label>
            <label>
                <span>Password</span>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </label>
            <button className={style.save} disabled={loading}>
                <span>{loading ? 'Guardando…' : 'Guardar'}</span>
            </button>
        </form>
    )
}
