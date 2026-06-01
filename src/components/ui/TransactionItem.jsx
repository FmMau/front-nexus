import { fmt, fmtDate } from '../../lib/utils'

export default function TransactionItem({ tx, miCuenta }) {
  const isAbono = tx.cuentaDestino === miCuenta
  const tipo = isAbono ? 'abono' : 'cargo'
  const signo = isAbono ? '+' : '-'

  const counterpart = isAbono ? tx.cuentaOrigen : tx.cuentaDestino

  return (
    <div className="tx-item">
      <div className={`tx-icon ${tipo}`}>
        {isAbono ? (
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        ) : (
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        )}
      </div>

      <div className="tx-info">
        <div className="tx-concepto">{tx.concepto || (isAbono ? 'Transferencia recibida' : 'Transferencia enviada')}</div>
        <div className="tx-cuenta">{counterpart}</div>
        <span className="tx-badge badge-aprobada">{tx.estado || 'aprobada'}</span>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div className={`tx-amount ${tipo}`}>{signo}${fmt(tx.monto)}</div>
        <div className="tx-fecha">{fmtDate(tx.fecha || tx.createdAt)}</div>
      </div>
    </div>
  )
}
