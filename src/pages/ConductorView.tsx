import { useState } from 'react'
import api from '../api'

const ConductorView = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await api.post('/login/', {
        username: email,
        password: password,
      })

      const accessToken = response.data.access_token
      setToken(accessToken)
      console.log('Token recibido:', accessToken)
    } catch (err) {
      setError('Error al iniciar sesión. Verifica tus credenciales.')
    }
  }

  return (
    <div style={{ padding: '10px' }}>
      <h3>Vista del Conductor</h3>

      {!token ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ display: 'block', marginBottom: '10px', width: '100%' }}
          />
          <button type="submit">Iniciar sesión</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      ) : (
        <div>
          <p>Sesión iniciada correctamente ✅</p>
          <p><b>Token:</b> {token.slice(0, 30)}...</p>
        </div>
      )}
    </div>
  )
}

export default ConductorView
