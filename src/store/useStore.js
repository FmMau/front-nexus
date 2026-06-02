import { create } from 'zustand'

const API_BASE = import.meta.env.VITE_API_BASE ? import.meta.env.VITE_API_BASE + '/api' : '/api'

// ── API helper ──────────────────────────────────────────────────────
async function apiFetch(path, opts = {}, token = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(API_BASE + path, { headers, ...opts })
  const data = await res.json()
  if (!res.ok) throw Object.assign(new Error(data.mensaje || data.message || 'Error'), { status: res.status })
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

  // POST /api/auth/login  →  { token }
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

  // POST /api/auth/register  →  { token }
  register: async (payload) => {
    const data = await apiFetch('/auth/register', {
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

  // Carga inicial: saldo + perfil + movimientos recientes + beneficiarios en paralelo
  loadAppData: async () => {
    const { token } = get()
    const [saldoData, perfilData, movsData, bensData] = await Promise.all([
      apiFetch('/cuenta/saldo', {}, token),
      apiFetch('/cuenta/perfil', {}, token),
      apiFetch('/cuenta/movimientos?page=1&limit=5', {}, token),
      apiFetch('/beneficiarios', {}, token),
    ])
    set({
      cuenta:        saldoData.cuenta   || saldoData,
      usuario:       perfilData.cliente || perfilData.usuario || perfilData,
      movimientos:   movsData.movimientos || movsData.data || [],
      beneficiarios: bensData.beneficiarios || bensData.data || [],
    })
  },

  // GET /api/cuenta/movimientos?page=1&limit=20
  loadMovimientos: async (page = 1, limit = 20) => {
    const { token } = get()
    const data = await apiFetch(`/cuenta/movimientos?page=${page}&limit=${limit}`, {}, token)
    set({ movimientos: data.movimientos || data.data || [] })
    return data
  },

  // GET /api/beneficiarios
  loadBeneficiarios: async () => {
    const { token } = get()
    const data = await apiFetch('/beneficiarios', {}, token)
    set({ beneficiarios: data.beneficiarios || data.data || [] })
    return data
  },

  // GET /api/cuenta/perfil
  loadPerfil: async () => {
    const { token } = get()
    const data = await apiFetch('/cuenta/perfil', {}, token)
    set({
      usuario: data.cliente || data.usuario || data,
      cuenta:  data.cuenta  || get().cuenta,
    })
    return data
  },

  // ── Actions ───────────────────────────────────────────────────────

  // POST /api/transferencia  →  body incluye cuentaOrigen de la cuenta del usuario
  transferir: async ({ cuentaDestino, monto, concepto }) => {
    const { token, cuenta } = get()
    const data = await apiFetch('/transferencia', {
      method: 'POST',
      body: JSON.stringify({
        cuentaOrigen:  cuenta.numeroCuenta,
        cuentaDestino,
        monto,
        concepto: concepto || 'Transferencia',
      }),
    }, token)
    // Refrescar saldo y movimientos tras la transferencia
    await get().loadAppData()
    return data
  },

  // POST /api/beneficiarios  →  { numeroCuentaDestino, alias }
  addBeneficiario: async (payload) => {
    const { token } = get()
    await apiFetch('/beneficiarios', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, token)
    await get().loadBeneficiarios()
  },

  // DELETE /api/beneficiarios/:id
  deleteBeneficiario: async (id) => {
    const { token } = get()
    await apiFetch(`/beneficiarios/${id}`, { method: 'DELETE' }, token)
    await get().loadBeneficiarios()
  },

  // PUT /api/cuenta/perfil  →  { nombre, telefono }
  updatePerfil: async (payload) => {
    const { token } = get()
    await apiFetch('/cuenta/perfil', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }, token)
    set(s => ({ usuario: { ...s.usuario, ...payload } }))
  },
}))
