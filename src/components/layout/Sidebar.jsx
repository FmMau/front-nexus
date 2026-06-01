import { useNavigate, useLocation } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import { initials } from '../../lib/utils'

const NAV_ITEMS = [
  {
    section: 'Principal',
    items: [
      {
        page: '/app', label: 'Panel principal',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
      },
      {
        page: '/app/movimientos', label: 'Movimientos',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>,
      },
    ],
  },
  {
    section: 'Operaciones',
    items: [
      {
        page: '/app/transferir', label: 'Transferir',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M8 7h12M8 12h12M8 17h12M3 7h.01M3 12h.01M3 17h.01"/></svg>,
      },
      {
        page: '/app/beneficiarios', label: 'Beneficiarios',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
      },
    ],
  },
  {
    section: 'Cuenta',
    items: [
      {
        page: '/app/perfil', label: 'Mi perfil',
        icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
      },
    ],
  },
]

export default function Sidebar({ mobileOpen, onMobileClose }) {
  const { usuario, logout } = useStore()
  const navigate = useNavigate()
  const location = useLocation()

  function handleNav(page) {
    navigate(page)
    onMobileClose?.()
  }

  return (
    <nav className={`sidebar${mobileOpen ? ' open' : ''}`} id="sidebar">
      <div className="sidebar-logo">
        <div className="wordmark">Nexus</div>
        <div className="sub">Banca digital</div>
      </div>

      <div className="nav-section">
        {NAV_ITEMS.map(({ section, items }) => (
          <div key={section}>
            <div className="nav-label">{section}</div>
            {items.map(({ page, label, icon }) => (
              <button
                key={page}
                className={`nav-item${location.pathname === page ? ' active' : ''}`}
                onClick={() => handleNav(page)}
              >
                {icon}
                {label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="user-avatar">{initials(usuario?.nombre)}</div>
          <div className="user-info">
            <div className="user-name">{usuario?.nombre || 'Cargando...'}</div>
            <div className="user-role">Cliente</div>
          </div>
          <button
            className="btn-icon"
            title="Cerrar sesión"
            onClick={() => { logout(); navigate('/login') }}
            style={{ width: 28, height: 28, fontSize: 14 }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}
