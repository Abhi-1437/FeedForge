import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../services/api'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await register({ name, email, password })
      const token = response.data.token

      if (token) {
        localStorage.setItem('token', token)
        window.dispatchEvent(new Event('authChange'))
        navigate('/login')
      } else {
        setError('Registration failed: no token returned')
      }
    } catch (err) {
      setError(err.response?.data?.msg || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-10 shadow-[0_60px_120px_-65px_rgba(59,130,246,0.45)] backdrop-blur-xl">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#8B5CF6]">Create your account</p>
        <h1 className="text-4xl font-semibold text-white">Register for FeedForge</h1>
        <p className="text-slate-400">Securely sign up to manage feeds, browse articles, and use AI summaries.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block text-sm text-slate-300">
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#0F172A] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#0F172A] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
        </label>

        <label className="block text-sm text-slate-300">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-3 w-full rounded-3xl border border-white/10 bg-[#0F172A] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
        </label>

        {error && <div className="rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-3xl bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-slate-100 font-semibold hover:text-white">
          Login
        </Link>
      </p>
    </div>
  )
}
