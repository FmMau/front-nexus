import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { AuthScreen, AuthCard, AuthLogo } from '../components/layout/AuthLayout'
import { Alert, Button, Field, Input, Divider } from '../components/ui'

export default function RegisterPage() {
  const [form, setForm] = useState({ nombre: '', telefono: '', correo: '', contraseña: '', curp: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const register = useStore(s => s.register)
  const navigate = useNavigate()

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  async function handleSubmit() {
    setError('')
    if (!form.nombre || !form.correo || !form.contraseña) {
      setError('Nombre, correo y contraseña son obligatorios.')
      return
    }
    if (form.contraseña.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.')
      return
    }
    setLoading(true)
    try {
      await register(form)
      navigate('/app')
    } catch (e) {
      setError(e.message || 'No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthScreen>
      <AuthCard wide>
        <AuthLogo />
        <h2 className="auth-title">Crear cuenta</h2>
        <p className="auth-subtitle">Completa el formulario para registrarte</p>

        <Alert message={error} type="error" />

        <div className="field-row">
          <Field label="Nombre completo">
            <Input type="text" placeholder="Juan Pérez" value={form.nombre} onChange={set('nombre')} />
          </Field>
          <Field label="Teléfono">
            <Input type="tel" placeholder="5551234567" value={form.telefono} onChange={set('telefono')} />
          </Field>
        </div>

        <Field label="Correo electrónico">
          <Input type="email" placeholder="tu@correo.com" value={form.correo} onChange={set('correo')} />
        </Field>

        <Field label="Contraseña">
          <Input type="password" placeholder="Mínimo 8 caracteres" value={form.contraseña} onChange={set('contraseña')} />
        </Field>

        <Field label="CURP" hint="(opcional)">
          <Input
            type="text" placeholder="XXXX000000XXXXXX00"
            value={form.curp} onChange={set('curp')}
            style={{ textTransform: 'uppercase' }}
          />
        </Field>

        <Button loading={loading} onClick={handleSubmit}>
          Crear mi cuenta
        </Button>

        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <button className="link-btn" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
        </div>
      </AuthCard>
    </AuthScreen>
  )
}
