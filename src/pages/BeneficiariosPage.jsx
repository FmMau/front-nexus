import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { initials } from '../lib/utils'
import { Alert, Button, Field, Input, Modal } from '../components/ui'

export default function BeneficiariosPage() {
  const { beneficiarios, loadBeneficiarios, addBeneficiario, deleteBeneficiario } = useStore()
  const [alert, setAlert] = useState({ msg: '', type: 'error' })
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({ cuenta: '', alias: '' })
  const [addError, setAddError] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null) // { id, alias }
  const [deleteLoading, setDeleteLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { loadBeneficiarios() }, [])

  async function handleAdd() {
    setAddError('')
    if (!/^\d{10}$/.test(addForm.cuenta)) {
      setAddError('Ingresa un número de cuenta válido de 10 dígitos.')
      return
    }
    if (!addForm.alias.trim()) {
      setAddError('El alias es obligatorio.')
      return
    }
    setAddLoading(true)
    try {
      await addBeneficiario({ numeroCuentaDestino: addForm.cuenta, alias: addForm.alias })
      setShowAdd(false)
      setAddForm({ cuenta: '', alias: '' })
      setAlert({ msg: 'Beneficiario agregado correctamente.', type: 'success' })
    } catch (e) {
      setAddError(e.message || 'No se pudo agregar el beneficiario.')
    } finally {
      setAddLoading(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      await deleteBeneficiario(deleteTarget.id)
      setDeleteTarget(null)
      setAlert({ msg: 'Beneficiario eliminado.', type: 'info' })
    } catch (e) {
      setAlert({ msg: e.message || 'No se pudo eliminar.', type: 'error' })
      setDeleteTarget(null)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Beneficiarios</h1>
          <p className="page-subtitle">Gestiona tus cuentas de terceros registradas</p>
        </div>
        <Button variant="ghost" onClick={() => setShowAdd(true)}>
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Agregar
        </Button>
      </div>

      {alert.msg && <Alert message={alert.msg} type={alert.type} />}

      <div className="beneficiary-grid" style={{ gap: '1rem' }}>
        {beneficiarios.length === 0 ? (
          <div className="card" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem' }}>
            <div style={{ color: 'var(--muted)', marginBottom: '1rem' }}>
              <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 14 }}>No tienes beneficiarios registrados</p>
            <Button variant="ghost" style={{ marginTop: '1rem' }} onClick={() => setShowAdd(true)}>
              Agregar el primero
            </Button>
          </div>
        ) : (
          beneficiarios.map(b => (
            <div key={b._id} className="card card-sm" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="user-avatar" style={{ flexShrink: 0 }}>{initials(b.alias)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--cream)' }}>{b.alias}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'monospace' }}>{b.numeroCuentaDestino}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button className="btn-icon" title="Transferir a este beneficiario"
                  onClick={() => navigate('/app/transferir', { state: { cuenta: b.numeroCuentaDestino } })}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
                <button className="btn-icon" title="Eliminar beneficiario"
                  style={{ color: 'var(--danger)' }}
                  onClick={() => setDeleteTarget({ id: b._id, alias: b.alias })}>
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)}
        title="Agregar beneficiario" subtitle="Registra una cuenta de tercero con un alias">
        {addError && <Alert message={addError} type="error" />}
        <Field label="Número de cuenta" hint="(10 dígitos)">
          <Input type="text" placeholder="1800000000" maxLength={10} inputMode="numeric"
            value={addForm.cuenta}
            onChange={e => setAddForm(f => ({ ...f, cuenta: e.target.value.replace(/\D/g, '') }))} />
        </Field>
        <Field label="Alias">
          <Input type="text" placeholder="Mamá, Compañero de trabajo..."
            value={addForm.alias}
            onChange={e => setAddForm(f => ({ ...f, alias: e.target.value }))} />
        </Field>
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</Button>
          <Button loading={addLoading} onClick={handleAdd}>Agregar</Button>
        </div>
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        title="Eliminar beneficiario"
        subtitle={`¿Eliminar a "${deleteTarget?.alias}"? Esta acción no se puede deshacer.`}
        maxWidth={360}>
        <div className="modal-actions">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
          <Button variant="danger" loading={deleteLoading} onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>
    </div>
  )
}
