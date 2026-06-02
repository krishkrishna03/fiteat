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
          {auth.userType !== 'admin' && (
            <NavLink to="/profile" className={({ isActive }) => (isActive ? 'text-[#84cc16]' : 'hover:text-[#84cc16]')}>
              Profile
            </NavLink>
          )}
          {auth.userType === 'admin' ? (
            <NavLink to="/admin" className={({ isActive }) => (isActive ? 'text-[#84cc16]' : 'hover:text-[#84cc16]')}>
              Admin
            </NavLink>
          ) : null}
          {auth.isLoggedIn ? (
            <>
              <span className="hidden rounded-full border border-[#84cc16]/40 bg-[#84cc16]/10 px-4 py-2 text-sm text-[#84cc16] md:inline-flex">
                Hi, {auth.user?.name?.split(' ')[0] || 'Member'}
              </span>
              <button
                onClick={auth.logout}
                className="rounded-full border border-[#84cc16]/40 bg-[#84cc16]/10 px-5 py-2 text-sm text-[#84cc16] transition hover:bg-[#84cc16]/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full border border-[#84cc16]/40 bg-[#84cc16]/10 px-5 py-2 text-sm text-[#84cc16] transition hover:bg-[#84cc16]/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full border border-transparent bg-[#84cc16] px-5 py-2 text-sm font-semibold text-[#0f1419] transition hover:bg-[#a3e635]"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
