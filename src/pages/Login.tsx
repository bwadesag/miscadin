import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Connexion réussie')
      navigate('/')
    } catch (error: any) {
      toast.error(error.message || 'Erreur de connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gold-400">Connexion</h1>
        <form onSubmit={handleSubmit} className="card p-8">
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gold-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input-field"
              placeholder="votre@email.com"
            />
          </div>
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gold-200">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mb-4 disabled:opacity-50"
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
          <p className="text-center text-gold-400">
            Pas encore de compte ?{' '}
            <Link to="/register" className="text-gold-500 hover:text-gold-400 hover:underline">
              Créer un compte
            </Link>
          </p>
          <div className="mt-6 p-4 bg-dark-200 rounded-lg text-sm text-gold-400 border border-gold-600/20">
            <p className="font-semibold mb-2 text-gold-300">Comptes de démonstration :</p>
            <p>Admin: admin@miscadin.com / admin123</p>
            <p>User: user@example.com / user123</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login

