// src/api/charger.ts
import { api } from './client'

export type Charger = {
  id?: number
  model: string
  serie: string
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export async function createCharger(p: {
  model: string; serie: string; imageFile?: File | null
}) {
  const fd = new FormData()
  fd.set('model', p.model)
  fd.set('serie', p.serie)
  if (p.imageFile) fd.set('image', p.imageFile, p.imageFile.name)
  return api.post('/api/chargers', fd)
}

export async function listChargers(params?: { limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))
  const url = '/api/chargers' + (q.toString() ? `?${q}` : '')
  const res: any = await api.get(url)
  const payload = res?.data ?? res
  const arr = Array.isArray(payload?.data) ? payload.data
          : Array.isArray(payload) ? payload
          : Array.isArray(payload?.data?.data) ? payload.data.data
          : []
  return arr as Charger[]
}

export async function getCharger(id: number) {
  return api.get<{ ok: true; data: Charger }>(`/api/chargers/${id}`)
}

export async function updateCharger(id: number, p: {
  model?: string; serie?: string; imageFile?: File | null
}) {
  const fd = new FormData()
  if (p.model !== undefined) fd.set('model', p.model)
  if (p.serie !== undefined) fd.set('serie', p.serie)
  if (p.imageFile) fd.set('image', p.imageFile, p.imageFile.name)
  return api.patch<{ ok: true; data: Charger }>(`/api/chargers/${id}`, fd)
}

export async function deleteCharger(id: number) {
  return api.delete<{ ok: true }>(`/api/chargers/${id}`)
}
