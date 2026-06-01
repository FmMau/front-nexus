import { useEffect } from 'react'
import { useStore } from '../store/useStore'
import TransactionItem from '../components/ui/TransactionItem'
import { Alert, EmptyState, Spinner } from '../components/ui'

export default function MovimientosPage() {
  const { movimientos, cuenta, loadMovimientos } = useStore()

  useEffect(() => { loadMovimientos() }, [])

  return (
    <div style={{ animation: 'fadeIn .3s ease' }}>
      <div className="page-header">
        <h1 className="page-title">Historial de movimientos</h1>
        <p className="page-subtitle">Todas tus transacciones en orden cronológico</p>
      </div>

      <div className="card" style={{ padding: '0.5rem' }}>
        <div className="tx-list">
          {movimientos.length === 0 ? (
            <EmptyState
              icon={<Spinner light />}
              message="Cargando movimientos..."
            />
          ) : (
            movimientos.map(tx => (
              <TransactionItem key={tx._id} tx={tx} miCuenta={cuenta?.numeroCuenta} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
