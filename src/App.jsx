import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useStore } from './store/useStore'

import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import MovimientosPage from './pages/MovimientosPage'
import TransferirPage from './pages/TransferirPage'
import BeneficiariosPage from './pages/BeneficiariosPage'
import PerfilPage from './pages/PerfilPage'

import AppLayout from './components/layout/AppLayout'
import ProtectedRoute from './components/layout/ProtectedRoute'

export default function App() {
  const { token, loadAppData, logout } = useStore()

  // On mount, try to restore session
  useEffect(() => {
    if (token) {
      loadAppData().catch(() => logout())
    }
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected app */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="movimientos" element={<MovimientosPage />} />
          <Route path="transferir" element={<TransferirPage />} />
          <Route path="beneficiarios" element={<BeneficiariosPage />} />
          <Route path="perfil" element={<PerfilPage />} />
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={token ? '/app' : '/login'} replace />} />
      </Routes>
    </BrowserRouter>
  )
}
