import { BrowserRouter, Link, NavLink, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LandingPage from './components/LandingPage'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import ProfilePage from './components/ProfilePage'
import AdminDashboard from './components/AdminDashboard'
import CheckoutPage from './components/CheckoutPage'
import CheckoutSuccessPage from './components/CheckoutSuccessPage'
import CheckoutFailedPage from './components/CheckoutFailedPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import './App.css'

const isNativeApp = () => {
  if (typeof window === 'undefined') return false
  const win = window as any
  return !!(win.Capacitor?.isNative || typeof win.cordova !== 'undefined')
}

const Header = () => {
  const auth = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-[#84cc16]/10 bg-[#0f1419]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 py-4 sm:px-8">
        <Link to="/" className="text-2xl font-bold text-white">
          TRANSFORM
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-200">
          <NavLink to="/" className={({ isActive }) => (isActive ? 'text-[#84cc16]' : 'hover:text-[#84cc16]')}>
            Home
          </NavLink>
          {auth.isLoggedIn ? (
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-[#84cc16]' : 'hover:text-[#84cc16]')}>
              Profile
            </NavLink>
          ) : (
            <NavLink to="/login" className={({ isActive }) => (isActive ? 'text-[#84cc16]' : 'hover:text-[#84cc16]')}>
              Login
            </NavLink>
          )}
          {auth.userType === 'admin' && (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'text-[#84cc16]' : 'hover:text-[#84cc16]')}>
              Admin
            </NavLink>
          )}
          {auth.isLoggedIn && (
            <button onClick={auth.logout} className="rounded-full border border-[#84cc16]/40 bg-[#84cc16]/10 px-4 py-2 text-sm text-[#84cc16] transition hover:bg-[#84cc16]/20">
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}

const BottomNav = () => {
  const auth = useAuth()

  const navItem = (isActive: boolean) =>
    `inline-flex h-12 w-12 items-center justify-center rounded-2xl transition ${isActive ? 'bg-[#84cc16]/20 text-[#84cc16]' : 'text-slate-200 hover:text-[#84cc16]'}`

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-[#84cc16]/10 bg-[#0f1419]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-4 py-3 sm:px-8">
        <NavLink to="/" className={({ isActive }) => navItem(isActive)} aria-label="Home">
          <span className="text-xl">🏠</span>
        </NavLink>
        {auth.userType === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => navItem(isActive)} aria-label="Admin">
            <span className="text-xl">🛡️</span>
          </NavLink>
        )}
        {auth.isLoggedIn ? (
          <NavLink to="/profile" className={({ isActive }) => navItem(isActive)} aria-label="Profile">
            <span className="text-xl">👤</span>
          </NavLink>
        ) : (
          <Link to="/login" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#84cc16]/40 bg-[#84cc16]/10 text-[#84cc16] transition hover:bg-[#84cc16]/20" aria-label="Login">
            <span className="text-xl">🔑</span>
          </Link>
        )}
        {auth.isLoggedIn && (
          <button onClick={auth.logout} className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#84cc16]/40 bg-[#84cc16]/10 text-[#84cc16] transition hover:bg-[#84cc16]/20" aria-label="Logout">
            <span className="text-xl">🚪</span>
          </button>
        )}
      </div>
    </footer>
  )
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout"
      element={
        <ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout/success"
      element={
        <ProtectedRoute>
          <CheckoutSuccessPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/checkout/failed"
      element={
        <ProtectedRoute>
          <CheckoutFailedPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute requireAdmin>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route path="*" element={<LandingPage />} />
  </Routes>
)

function App() {
  const native = isNativeApp()

  return (
    <BrowserRouter>
      <AuthProvider>
        {!native && <Header />}
        <main className={native ? 'pb-24' : 'pb-0'}>
          <AppRoutes />
        </main>
        {native && <BottomNav />}
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
