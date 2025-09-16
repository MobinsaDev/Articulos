// src/api/forklift.ts
import { api } from './client'

export type Forklift = {
  id?: number
  serie: string
  model: string
  forklift_type: string
  ubication: string
  battery_id: number
  charger_id: number
  image_url?: string | null
  created_at?: string
  updated_at?: string
}

// CREATE
export async function createForklift(p: {
  serie: string; model: string; forklift_type: string; ubication: string;
  battery_id: number; charger_id: number; imageFile?: File | null
}) {
  const fd = new FormData()
  fd.set('serie', p.serie)
  fd.set('model', p.model)
  fd.set('forklift_type', p.forklift_type)
  fd.set('ubication', p.ubication)
  fd.set('battery_id', String(p.battery_id))
  fd.set('charger_id', String(p.charger_id))
  if (p.imageFile) fd.set('image', p.imageFile, p.imageFile.name)
  const res: any = await api.post('/api/forklifts', fd)
  return res?.data ?? res
}

// LIST
export async function listForklifts(params?: { limit?: number; offset?: number }) {
  const q = new URLSearchParams()
  if (params?.limit) q.set('limit', String(params.limit))
  if (params?.offset) q.set('offset', String(params.offset))
  const url = '/api/forklifts' + (q.toString() ? `?${q}` : '')
  const res: any = await api.get(url)
  const payload = res?.data ?? res
  const arr = Array.isArray(payload?.data) ? payload.data
    : Array.isArray(payload) ? payload
      : Array.isArray(payload?.data?.data) ? payload.data.data
        : []
  return arr as Forklift[]
}

// DETAIL
export async function getForklift(id: number) {
  return api.get<{ ok: true; data: Forklift }>(`/api/forklifts/${id}`)
}

// UPDATE 
export async function updateForklift(id: number, p: {
  serie?: string; model?: string; forklift_type?: string; ubication?: string;
  battery_id?: number; charger_id?: number; imageFile?: File | null
}) {
  if (p.imageFile) {
    const fd = new FormData()
    if (p.serie !== undefined) fd.set('serie', p.serie)
    if (p.model !== undefined) fd.set('model', p.model)
    if (p.forklift_type !== undefined) fd.set('forklift_type', p.forklift_type)
    if (p.ubication !== undefined) fd.set('ubication', p.ubication)
    if (p.battery_id !== undefined) fd.set('battery_id', String(p.battery_id))
    if (p.charger_id !== undefined) fd.set('charger_id', String(p.charger_id))
    fd.set('image', p.imageFile, p.imageFile.name)
    return api.put<{ ok: true; data: Forklift }>(`/api/forklifts/${id}`, fd)
  } else {
    const body: any = {}
    if (p.serie !== undefined) body.serie = p.serie
    if (p.model !== undefined) body.model = p.model
    if (p.forklift_type !== undefined) body.forklift_type = p.forklift_type
    if (p.ubication !== undefined) body.ubication = p.ubication
    if (p.battery_id !== undefined) body.battery_id = p.battery_id
    if (p.charger_id !== undefined) body.charger_id = p.charger_id
    return api.put<{ ok: true; data: Forklift }>(`/api/forklifts/${id}`, body)
  }
}

// DELETE
export async function deleteForklift(id: number) {
  return api.delete<{ ok: true }>(`/api/forklifts/${id}`)
}
