import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginPage = () => {
  const auth = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await auth.login(email, password)
    } catch (err: any) {
      console.error('[LoginPage] login error', err)
      setError(err?.response?.data?.message || err?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#13232c] to-[#081018] px-4 py-16 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/95 p-10 shadow-2xl shadow-[#84cc16]/10">
        <div className="mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Login</h1>
            <p className="mt-2 text-slate-400">Sign in with your email and password. Admins will be redirected to the dashboard automatically.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              title="Email"
              required
              className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              title="Password"
              required
              className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
            />
          </div>
          {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
          <button
            disabled={loading}
            type="submit"
            className="w-full rounded-3xl bg-gradient-to-r from-[#84cc16] to-[#a3e635] px-6 py-4 text-base font-bold text-[#0f1419] transition hover:shadow-xl"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          New to Transform?{' '}
          <Link to="/register" className="font-semibold text-[#84cc16] hover:text-[#a3e635]">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
