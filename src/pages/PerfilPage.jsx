import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { initials, fmtDate } from '../lib/utils'
import { Alert, Button, Field, Input, Chip } from '../components/ui'

function FieldDisplay({ label, value }) {
  return (
    <div className="field-display">
      <div className="label">{label}</div>
      <div className="value">{value || '—'}</div>
    </div>
  )
}

export default function PerfilPage() {
  const { usuario, cuenta, loadPerfil, updatePerfil } = useStore()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ nombre: '', telefono: '' })
  const [alert, setAlert] = useState({ msg: '', type: 'success' })
  const [loading, setLoading] = useState(false)

  useEffect(() => { loadPerfil() }, [])
  useEffect(() => {
    if (usuario) setForm({ nombre: usuario.nombre || '', telefono: usuario.telefono || '' })
  }, [usuario])

  async function handleSave() {
    if (!form.nombre.trim()) {
      setAlert({ msg: 'El nombre no puede estar vacío.', type: 'error' })
      return
    }
    setLoading(true)
    try {
      await updatePerfil({ nombre: form.nombre, telefono: form.telefono })
      setEditing(false)
      setAlert({ msg: 'Perfil actualizado correctamente.', type: 'success' })
    } catch (e) {
      setAlert({ msg: e.message || 'No se pudo actualizar el perfil.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-header">
        <h1 className="page-title">Mi perfil</h1>
        <p className="page-subtitle">Tu información personal y datos de cuenta</p>
      </div>

      {alert.msg && <Alert message={alert.msg} type={alert.type} />}

      <div className="profile-grid">
        {/* Left card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="profile-avatar-large">{initials(usuario?.nombre)}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--cream)' }}>
            {usuario?.nombre || '—'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', margin: '4px 0 1rem' }}>Cliente Nexus</div>
          <Chip>{cuenta?.numeroCuenta || '—'}</Chip>
        </div>

        {/* Right card */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '1rem', color: 'var(--cream)' }}>
            Información personal
          </h3>

          {!editing ? (
            <>
              <FieldDisplay label="Nombre completo" value={usuario?.nombre} />
              <FieldDisplay label="Correo electrónico" value={usuario?.correo} />
              <FieldDisplay label="Teléfono" value={usuario?.telefono || 'No registrado'} />
              <FieldDisplay label="CURP" value={usuario?.curp || 'No registrado'} />
              <FieldDisplay label="Fecha de registro" value={usuario?.fechaRegistro ? fmtDate(usuario.fechaRegistro) : '—'} />
              <Button variant="ghost" style={{ marginTop: '0.5rem' }} onClick={() => setEditing(true)}>
                Editar información
              </Button>
            </>
          ) : (
            <>
              <Field label="Nombre completo">
                <Input type="text" value={form.nombre}
                  onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))} />
              </Field>
              <Field label="Teléfono">
                <Input type="tel" value={form.telefono}
                  onChange={e => setForm(f => ({ ...f, telefono: e.target.value }))} />
              </Field>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Button loading={loading} onClick={handleSave} style={{ flex: 1 }}>
                  Guardar cambios
                </Button>
                <Button variant="ghost" onClick={() => setEditing(false)}>Cancelar</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
