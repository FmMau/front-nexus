import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { fmt, greeting } from '../lib/utils'
import TransactionItem from '../components/ui/TransactionItem'
import { EmptyState } from '../components/ui'

export default function DashboardPage() {
  const { usuario, cuenta, movimientos, loadAppData } = useStore()
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { loadAppData() }, [])

  function copyCuenta() {
    if (!cuenta?.numeroCuenta) return
    navigator.clipboard.writeText(cuenta.numeroCuenta)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const cargos = movimientos.filter(tx => tx.cuentaOrigen === cuenta?.numeroCuenta)
  const abonos = movimientos.filter(tx => tx.cuentaDestino === cuenta?.numeroCuenta)
  const totalCargos = cargos.reduce((s, t) => s + Number(t.monto), 0)
  const totalAbonos = abonos.reduce((s, t) => s + Number(t.monto), 0)

  const quickActions = [
    {
      label: 'Transferir', page: '/app/transferir',
      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
    },
    {
      label: 'Agregar beneficiario', page: '/app/beneficiarios',
      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
    },
    {
      label: 'Ver movimientos', page: '/app/movimientos',
      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>,
    },
    {
      label: 'Mi perfil', page: '/app/perfil',
      icon: <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    },
  ]

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-header">
        <h1 className="page-title">Panel principal</h1>
        <p className="page-subtitle">{greeting()}, {usuario?.nombre?.split(' ')[0] || ''}!</p>
      </div>

      {/* Balance hero */}
      <div className="balance-hero">
        <div className="balance-label">Saldo disponible</div>
        <div className="balance-amount">
          <span className="currency">$</span>
          <span>{cuenta ? fmt(cuenta.saldo) : '—'}</span>
        </div>
        <div className="balance-account">
          <span>Cuenta</span>
          <span className="account-number">{cuenta?.numeroCuenta || '—'}</span>
          <button className="copy-btn" title="Copiar número de cuenta" onClick={copyCuenta}>
            {copied ? '✓' : (
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Cargos del mes</div>
          <div className="stat-value negative">${fmt(totalCargos)}</div>
          <div className="stat-change">{cargos.length} transacciones</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Abonos del mes</div>
          <div className="stat-value positive">${fmt(totalAbonos)}</div>
          <div className="stat-change">{abonos.length} transacciones</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Beneficiarios</div>
          <div className="stat-value">{useStore.getState().beneficiarios.length}</div>
          <div className="stat-change">Cuentas registradas</div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="quick-actions">
        {quickActions.map(({ label, page, icon }) => (
          <button key={page} className="quick-action" onClick={() => navigate(page)}>
            <div className="quick-action-icon">{icon}</div>
            {label}
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <div className="section-header">
        <h2 className="section-title">Últimos movimientos</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/app/movimientos')}>
          Ver todos
        </button>
      </div>

      <div className="card" style={{ padding: '0.5rem' }}>
        <div className="tx-list">
          {movimientos.length === 0 ? (
            <EmptyState message="Sin movimientos recientes" />
          ) : (
            movimientos.slice(0, 5).map(tx => (
              <TransactionItem key={tx._id} tx={tx} miCuenta={cuenta?.numeroCuenta} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
