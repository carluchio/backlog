import { useState } from 'react'

export default function AuthForm({ onSignIn, onSignUp }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: authError } = isLogin
      ? await onSignIn(email, password)
      : await onSignUp(email, password)
    if (authError) setError(authError.message)
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    background: 'var(--color-bg-raised)',
    border: '1px solid var(--color-border-default)',
    borderRadius: '8px',
    color: 'var(--color-text-primary)',
    fontSize: 'var(--text-base)',
    outline: 'none',
    transition: `border-color var(--dur-fast)`,
  }

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--color-bg-app)',
    }}>
      <div style={{ width: '100%', maxWidth: '360px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '28px',
            height: '3px',
            background: 'var(--color-accent)',
            borderRadius: '2px',
            margin: '0 auto 20px',
          }} />
          <h1 style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            color: 'var(--color-text-primary)',
            lineHeight: 1.1,
          }}>
            Backlog
          </h1>
          <p style={{
            marginTop: '10px',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            letterSpacing: '0.01em',
          }}>
            Capture. Prioritize. Execute.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--color-bg-raised)',
          borderRadius: '8px',
          padding: '3px',
          marginBottom: '20px',
        }}>
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(null) }}
            style={{
              flex: 1,
              padding: '9px 8px',
              borderRadius: '6px',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              background: isLogin ? 'var(--color-bg-elevated)' : 'transparent',
              color: isLogin ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: `background var(--dur-fast), color var(--dur-fast)`,
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(null) }}
            style={{
              flex: 1,
              padding: '9px 8px',
              borderRadius: '6px',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              background: !isLogin ? 'var(--color-bg-elevated)' : 'transparent',
              color: !isLogin ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              border: 'none',
              cursor: 'pointer',
              transition: `background var(--dur-fast), color var(--dur-fast)`,
            }}
          >
            Create account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border-default)'}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--color-border-default)'}
          />

          {error && (
            <p style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-danger)',
              padding: '0 2px',
            }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              height: '48px',
              marginTop: '6px',
              background: 'var(--color-accent)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: 'var(--text-base)',
              fontWeight: 600,
              cursor: loading ? 'default' : 'pointer',
              opacity: loading ? 0.55 : 1,
              transition: `opacity var(--dur-fast)`,
              letterSpacing: '-0.01em',
            }}
          >
            {loading ? 'Signing in…' : isLogin ? 'Sign in' : 'Create account'}
          </button>
        </form>

      </div>
    </div>
  )
}
