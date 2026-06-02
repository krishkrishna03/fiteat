import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const RegisterPage = () => {
  const auth = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState('prefer-not-to-say')
  const [location, setLocation] = useState('')
  const [locationLoading, setLocationLoading] = useState(false)
  const [address, setAddress] = useState('')
  const [age, setAge] = useState('')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto-detect location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      setLocationLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            )
            const data = await response.json()
            const city = data.address?.city || data.address?.town || data.address?.county || 'Location detected'
            setLocation(`${city}`)
          } catch (err) {
            setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          } finally {
            setLocationLoading(false)
          }
        },
        () => {
          setLocationLoading(false)
        }
      )
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!location) {
      setError('Unable to detect location. Please enable location access and try again.')
      return
    }

    setLoading(true)
    try {
      await auth.register(name, email, password, confirmPassword, phone, dob, gender, location, address, age, weight, height)
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#13232c] to-[#081018] px-4 py-16 text-slate-100">
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/95 p-10 shadow-2xl shadow-[#84cc16]/10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">Create Your Account</h1>
          <p className="mt-2 text-slate-400">Register and start buying plans, managing your profile, and tracking your transformation.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              type="text"
              required
              className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
            />
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Phone Number</label>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                type="tel"
                required
                className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Date of Birth</label>
              <input
                value={dob}
                onChange={(event) => setDob(event.target.value)}
                type="date"
                required
                className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
              />
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Gender</label>
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value)}
                required
                className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
              >
                <option value="prefer-not-to-say">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Location</label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                type="text"
                placeholder={locationLoading ? 'Detecting location...' : 'City or neighborhood'}
                required
                className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
              />
              <p className="mt-1 text-xs text-slate-500">Auto-detected when possible, or enter your location manually</p>
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Address</label>
              <input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                type="text"
                required
                placeholder="Street, area, or city"
                className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Age</label>
              <input
                value={age}
                onChange={(event) => setAge(event.target.value)}
                type="number"
                min="1"
                required
                className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
              />
            </div>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-300">Weight (kg)</label>
              <input
                value={weight}
                onChange={(event) => setWeight(event.target.value)}
                type="number"
                min="1"
                required
                className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Height (cm)</label>
            <input
              value={height}
              onChange={(event) => setHeight(event.target.value)}
              type="number"
              min="1"
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
              required
              className="w-full rounded-3xl border border-[#84cc16]/20 bg-[#111f26] px-5 py-4 text-sm text-white outline-none transition focus:border-[#84cc16]"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-300">Confirm Password</label>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type="password"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#84cc16] hover:text-[#a3e635]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
