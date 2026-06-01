export function AuthScreen({ children }) {
  return (
    <div className="auth-screen">
      {children}
    </div>
  )
}

export function AuthCard({ children, wide = false }) {
  return (
    <div className="auth-card" style={{ maxWidth: wide ? 480 : 420 }}>
      {children}
    </div>
  )
}

export function AuthLogo() {
  return (
    <div className="auth-logo">
      <div className="wordmark">Nexus</div>
      <div className="tagline">Banca digital</div>
    </div>
  )
}
