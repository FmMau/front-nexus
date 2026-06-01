import { create } from 'zustand'

const API_BASE = (window.API_BASE || 'http://localhost:3001') + '/api'

// ── API helper ──────────────────────────────────────────────────────
async function apiFetch(path, opts = {}, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(API_BASE + path, { headers, ...opts })
  const data = await res.json()
  if (!res.ok) throw Object.assign(new Error(data.mensaje || 'Error'), { status: res.status })
  return data
}

export const useStore = create((set, get) => ({
  // ── State ─────────────────────────────────────────────────────────
  token: localStorage.getItem('nx_token') || null,
  usuario: null,
  cuenta: null,
  movimientos: [],
  beneficiarios: [],

  // ── Auth ──────────────────────────────────────────────────────────
  login: async (correo, contraseña) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ correo, contraseña }),
    })
    localStorage.setItem('nx_token', data.token)
    set({ token: data.token })
    await get().loadAppData()
    return data
  },

  register: async (payload) => {
    const data = await apiFetch('/auth/registro', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    localStorage.setItem('nx_token', data.token)
    set({ token: data.token })
    await get().loadAppData()
    return data
  },

  logout: () => {
    localStorage.removeItem('nx_token')
    set({ token: null, usuario: null, cuenta: null, movimientos: [], beneficiarios: [] })
  },

  // ── Data loaders ──────────────────────────────────────────────────
  loadAppData: async () => {
    const { token } = get()
    const data = await apiFetch('/cuenta/dashboard', {}, token)
    set({
      usuario: data.usuario,
      cuenta: data.cuenta,
      movimientos: data.movimientosRecientes || [],
      beneficiarios: data.beneficiarios || [],
    })
    return data
  },

  loadMovimientos: async () => {
    const { token } = get()
    const data = await apiFetch('/movimientos', {}, token)
    set({ movimientos: data.movimientos || [] })
    return data
  },

  loadBeneficiarios: async () => {
    const { token } = get()
    const data = await apiFetch('/beneficiarios', {}, token)
    set({ beneficiarios: data.beneficiarios || [] })
    return data
  },

  loadPerfil: async () => {
    const { token } = get()
    const data = await apiFetch('/cuenta/perfil', {}, token)
    set({ usuario: data.usuario, cuenta: data.cuenta })
    return data
  },

  // ── Actions ───────────────────────────────────────────────────────
  transferir: async (payload) => {
    const { token } = get()
    const data = await apiFetch('/transferencias', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token)
    await get().loadAppData()
    return data
  },

  addBeneficiario: async (payload) => {
    const { token } = get()
    await apiFetch('/beneficiarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token)
    await get().loadBeneficiarios()
  },

  deleteBeneficiario: async (id) => {
    const { token } = get()
    await apiFetch(`/beneficiarios/${id}`, { method: 'DELETE' }, token)
    await get().loadBeneficiarios()
  },

  updatePerfil: async (payload) => {
    const { token } = get()
    await apiFetch('/cuenta/perfil', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token)
    set(s => ({ usuario: { ...s.usuario, ...payload } }))
  },
}))
