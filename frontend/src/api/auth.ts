import { api } from './client'
import type { ApiErr, MeResponse, User } from '../types/types'

export async function authRegister(p: { name: string; secondname: string; email: string; password: string }) {
  return api.post<{ id: number; name: string; email: string }>('/api/auth/register', p)
}

export async function authLogin(p: { email: string; password: string }) {
  return api.post<{ id: number; name: string; email: string }>('/api/auth/login', p)
}

export async function authLogout() {
  return api.post<{ ok: true }>('/api/auth/logout')
}

export async function authMe() {
  return api.get<MeResponse>('/api/auth/me')
}
