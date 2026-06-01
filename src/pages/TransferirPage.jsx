import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'
import { fmt } from '../lib/utils'
import { Alert, Button, Field, Input, Modal } from '../components/ui'

export default function TransferirPage() {
  const { cuenta, beneficiarios, loadBeneficiarios, transferir } = useStore()
  const [destino, setDestino] = useState('')
  const [monto, setMonto] = useState('')
  const [concepto, setConcepto] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState(null)

  useEffect(() => { loadBeneficiarios() }, [])

  function selectBen(numeroCuenta) {
    setDestino(numeroCuenta)
    setError('')
  }

  async function handleSubmit() {
    setError('')
    if (!/^\d{10}$/.test(destino)) {
      setError('Ingresa un número de cuenta válido de 10 dígitos.')
      return
    }
    if (!monto || isNaN(monto) || Number(monto) <= 0) {
      setError('Ingresa un monto válido mayor a 0.')
      return
    }
    if (destino === cuenta?.numeroCuenta) {
      setError('No puedes transferir a tu propia cuenta.')
      return
    }
    setLoading(true)
    try {
      const data = await transferir({
        numeroCuentaDestino: destino,
        monto: parseFloat(monto),
        concepto: concepto || 'Transferencia',
      })
      setSuccessData({ destino, monto: parseFloat(monto), concepto, folio: data.folio })
      setDestino(''); setMonto(''); setConcepto('')
    } catch (e) {
      setError(e.message || 'No se pudo completar la transferencia.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-header">
        <h1 className="page-title">Nueva transferencia</h1>
        <p className="page-subtitle">Envía dinero a tus contactos de forma segura</p>
      </div>

      <Alert message={error} type="error" />

      <div className="transfer-layout">
        {/* Left: form */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', marginBottom: '1rem' }}>
            Datos de la transferencia
          </h3>

          <Field label="Cuenta origen">
            <div style={{ padding: '0.7rem 1rem', background: 'var(--input-bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: 14, fontFamily: 'monospace', color: 'var(--cream-dim)' }}>
              {cuenta?.numeroCuenta || '—'}
            </div>
          </Field>

          <Field label="Cuenta destino" hint="(10 dígitos)">
            <Input
              type="text" placeholder="1800000000" maxLength={10} inputMode="numeric"
              value={destino} onChange={e => setDestino(e.target.value.replace(/\D/g, ''))}
            />
          </Field>

          <Field label="Monto a transferir">
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>$</span>
              <Input
                type="number" placeholder="0.00" min="0.01" step="0.01"
                value={monto} onChange={e => setMonto(e.target.value)}
                style={{ paddingLeft: '1.8rem' }}
              />
            </div>
          </Field>

          <Field label="Concepto" hint="(opcional)">
            <Input
              type="text" placeholder="Pago de renta, préstamo..."
              value={concepto} onChange={e => setConcepto(e.target.value)}
            />
          </Field>

          <Button loading={loading} onClick={handleSubmit}>
            Enviar transferencia
          </Button>
        </div>

        {/* Right: beneficiaries */}
        <div className="card">
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--cream)', marginBottom: '0.25rem' }}>
            Mis beneficiarios
          </h3>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: '1rem' }}>
            Selecciona uno para autocompletar
          </p>
          <div className="beneficiary-grid">
            {beneficiarios.length === 0 ? (
              <p style={{ color: 'var(--muted)', fontSize: 13 }}>Sin beneficiarios registrados</p>
            ) : (
              beneficiarios.map(b => (
                <div
                  key={b._id}
                  className={`beneficiary-card${destino === b.numeroCuentaDestino ? ' selected' : ''}`}
                  onClick={() => selectBen(b.numeroCuentaDestino)}
                >
                  <div className="ben-alias">{b.alias}</div>
                  <div className="ben-cuenta">{b.numeroCuentaDestino}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Success modal */}
      <Modal open={!!successData} onClose={() => setSuccessData(null)}>
        <div className="success-overlay">
          <div className="success-icon">
            <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3>Transferencia exitosa</h3>
          <p>Tu dinero ha sido enviado correctamente</p>
          {successData && (
            <div className="success-detail">
              <div className="success-detail-row"><span>Destino</span><span>{successData.destino}</span></div>
              <div className="success-detail-row"><span>Monto</span><span>${fmt(successData.monto)}</span></div>
              {successData.concepto && <div className="success-detail-row"><span>Concepto</span><span>{successData.concepto}</span></div>}
              {successData.folio && <div className="success-detail-row"><span>Folio</span><span>{successData.folio}</span></div>}
            </div>
          )}
          <Button onClick={() => setSuccessData(null)}>Listo</Button>
        </div>
      </Modal>
    </div>
  )
}
