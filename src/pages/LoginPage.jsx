import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { AuthScreen, AuthCard, AuthLogo } from '../components/layout/AuthLayout'
import { Alert, Button, Field, Input } from '../components/ui'

export default function LoginPage() {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useStore(s => s.login)
  const navigate = useNavigate()

  async function handleSubmit() {
    setError('')
    if (!correo || !contraseña) {
      setError('Por favor completa todos los campos.')
      return
    }
    setLoading(true)
    try {
      await login(correo, contraseña)
      navigate('/app')
    } catch (e) {
      setError(e.message || 'Credenciales incorrectas.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen>
      <AuthCard>
        <AuthLogo />
        <h2 className="auth-title">Bienvenido de regreso</h2>
        <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

        <Alert message={error} type="error" />

        <Field label="Correo electrónico">
          <Input
            type="email" placeholder="tu@correo.com" autoComplete="email"
            value={correo} onChange={e => setCorreo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </Field>

        <Field label="Contraseña">
          <Input
            type="password" placeholder="••••••••" autoComplete="current-password"
            value={contraseña} onChange={e => setContraseña(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
        </Field>

        <Button loading={loading} onClick={handleSubmit}>
          Iniciar sesión
        </Button>

        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <button className="link-btn" onClick={() => navigate('/register')}>
            Crear cuenta
          </button>
        </div>
      </AuthCard>
    </AuthScreen>
  )
}
