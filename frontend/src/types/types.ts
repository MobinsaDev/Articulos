export type Role = 'admin' | 'manager' | 'tech';

export interface User {
  id: number
  name: string
  secondname: string
  email: string
  role: Role
  created_at?: string
  updated_at?: string
}

export interface MeResponse {
  ok: true;
  user: { id: number; name: string; email: string; role: string } | null
}

export interface ApiOk<T> { ok: true; data: T }
export interface ApiErr { ok?: false; error: string }

export interface Forklift {
  id: number
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

export interface Charger {
  id: number
  model: string
  serie: string
  image_url?: string | null
}

export interface Battery {
  id: number
  model: string
  serie: string
  image_url?: string | null
}
