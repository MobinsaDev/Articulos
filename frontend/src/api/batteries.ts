// frontend/src/api/battery.ts
import { api } from './client'

export type Battery = {
  id?: number
  model: string
  serie: string
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

export async function createBattery(p: {
  model: string
  serie: string
  imageFile?: File | null
}) {
  const fd = new FormData()
  fd.set('model', p.model)
  fd.set('serie', p.serie)
  if (p.imageFile) fd.set('image', p.imageFile, p.imageFile.name)
  return api.post<{ ok: true; data: { id: number } }>('/api/batteries', fd)
}

export async function listBatteries(params?: { limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))
  const url = '/api/batteries' + (q.toString() ? `?${q}` : '')

  const res: any = await api.get(url)
  // Intenta las tres formas comunes: AxiosResponse, payload, arreglo
  const payload = res?.data ?? res
  const arr = Array.isArray(payload?.data) ? payload.data
    : Array.isArray(payload) ? payload
      : Array.isArray(payload?.data?.data) ? payload.data.data
        : []
  return arr as Battery[]
}

export async function getBattery(id: number) {
  return api.get<{ ok: true; data: Battery }>(`/api/batteries/${id}`)
}

export async function updateBattery(
  id: number,
  p: { model?: string; serie?: string; imageFile?: File | null }
) {
  if (p.imageFile) {
    const fd = new FormData()
    if (p.model !== undefined) fd.set('model', p.model)
    if (p.serie !== undefined) fd.set('serie', p.serie)
    fd.set('image', p.imageFile, p.imageFile.name)
    return api.put<{ ok: true; data: Battery }>(`/api/batteries/${id}`, fd)
  } else {
    const body: any = {}
    if (p.model !== undefined) body.model = p.model
    if (p.serie !== undefined) body.serie = p.serie
    return api.put<{ ok: true; data: Battery }>(`/api/batteries/${id}`, body)
  }
}

export async function deleteBattery(id: number) {
  return api.delete<{ ok: true }>('/api/batteries/' + id)
}
