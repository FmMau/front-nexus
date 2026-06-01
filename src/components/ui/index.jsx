import { useState } from 'react'

/* ── Alert ─────────────────────────────────────────────────────────── */
const ICONS = {
  error: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  success: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  info: (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
}

export function Alert({ message, type = 'error' }) {
  if (!message) return null
  return (
    <div className={`alert alert-${type}`} style={{ animation: 'fadeIn .3s ease' }}>
      {ICONS[type]}
      <span>{message}</span>
    </div>
  )
}

/* ── Spinner ────────────────────────────────────────────────────────── */
export function Spinner({ light = false }) {
  return <span className={`spinner${light ? ' spinner-light' : ''}`} />
}

/* ── Button ─────────────────────────────────────────────────────────── */
export function Button({
  children, variant = 'primary', size, loading = false,
  className = '', style, ...props
}) {
  const classes = ['btn', `btn-${variant}`, size ? `btn-${size}` : '', className]
    .filter(Boolean).join(' ')
  return (
    <button className={classes} style={style} disabled={loading || props.disabled} {...props}>
      {loading ? <Spinner light={variant === 'primary'} /> : children}
    </button>
  )
}

/* ── Field ──────────────────────────────────────────────────────────── */
export function Field({ label, hint, children, style }) {
  return (
    <div className="field" style={style}>
      {label && <label>{label}{hint && <span style={{ color: 'var(--muted)', fontSize: '11px' }}> {hint}</span>}</label>}
      {children}
    </div>
  )
}

export function Input({ style, ...props }) {
  return <input style={style} {...props} />
}

/* ── Divider ─────────────────────────────────────────────────────────── */
export function Divider() {
  return <div className="divider" />
}

/* ── Chip ───────────────────────────────────────────────────────────── */
export function Chip({ children, variant = 'gold' }) {
  return <span className={`chip chip-${variant}`}>{children}</span>
}

/* ── Modal ──────────────────────────────────────────────────────────── */
export function Modal({ open, onClose, title, subtitle, children, maxWidth = 440 }) {
  if (!open) return null
  return (
    <div
      className="modal-overlay"
      onClick={e => e.target === e.currentTarget && onClose?.()}
    >
      <div className="modal" style={{ maxWidth }}>
        {title && <h3 className="modal-title">{title}</h3>}
        {subtitle && <p className="modal-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

/* ── Empty state ─────────────────────────────────────────────────────── */
export function EmptyState({ icon, message, action }) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <p>{message}</p>
      {action}
    </div>
  )
}
