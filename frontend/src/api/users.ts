// frontend/src/api/users.ts
import { api } from './client'

export type User = {
    id?: number
    name: string
    secondname: string
    email: string
    role: 'admin' | 'tech' | 'manager'
    created_at?: string
    updated_at?: string
}

export async function listUsers(params?: { limit?: number; offset?: number }) {
    const q = new URLSearchParams()
    if (params?.limit) q.set('limit', String(params.limit))
    if (params?.offset) q.set('offset', String(params.offset))
    const url = '/api/users' + (q.toString() ? `?${q}` : '')
    const res: any = await api.get(url)
    const payload = res?.data ?? res
    const arr = Array.isArray(payload?.data) ? payload.data
        : Array.isArray(payload) ? payload
            : Array.isArray(payload?.data?.data) ? payload.data.data
                : []
    return arr as User[]
}

export async function getUser(id: number) {
    return api.get<{ ok: true; data: User }>(`/api/users/${id}`)
}

export async function createUser(p: { name: string; secondname: string; email: string; role: User['role']; password: string }) {
    return api.post<{ ok: true; data: { id: number } }>('/api/users', p)
}

export async function updateUser(id: number, p: Partial<{ name: string; secondname: string; email: string; role: User['role']}>) {
    return api.put<{ ok: true; data: User }>(`/api/users/${id}`, p)
}

export async function deleteUser(id: number) {
    return api.delete<{ ok: true }>(`/api/users/${id}`)
}
