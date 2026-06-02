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

const BottomNav = () => {
  const auth = useAuth()

  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full border-t border-[#84cc16]/10 bg-[#0f1419]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-2 px-4 py-3 sm:px-8">
        <NavLink to="/" className={({ isActive }) => `rounded-2xl px-3 py-2 text-sm transition ${isActive ? 'bg-[#84cc16]/20 text-[#84cc16]' : 'text-slate-200 hover:text-[#84cc16]'}`}>
          Home
        </NavLink>
        {auth.userType !== 'admin' && (
          <NavLink to="/profile" className={({ isActive }) => `rounded-2xl px-3 py-2 text-sm transition ${isActive ? 'bg-[#84cc16]/20 text-[#84cc16]' : 'text-slate-200 hover:text-[#84cc16]'}`}>
            Profile
          </NavLink>
        )}
        {auth.userType === 'admin' ? (
          <NavLink to="/admin" className={({ isActive }) => `rounded-2xl px-3 py-2 text-sm transition ${isActive ? 'bg-[#84cc16]/20 text-[#84cc16]' : 'text-slate-200 hover:text-[#84cc16]'}`}>
            Admin
          </NavLink>
        ) : null}
        {auth.isLoggedIn ? (
          <button onClick={auth.logout} className="rounded-2xl border border-[#84cc16]/40 bg-[#84cc16]/10 px-3 py-2 text-sm text-[#84cc16] transition hover:bg-[#84cc16]/20">
            Logout
          </button>
        ) : (
          <Link to="/login" className="rounded-2xl border border-[#84cc16]/40 bg-[#84cc16]/10 px-3 py-2 text-sm text-[#84cc16] transition hover:bg-[#84cc16]/20">
            Login
          </Link>
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
  return (
    <BrowserRouter>
      <AuthProvider>
        <main className="pb-24">
          <AppRoutes />
        </main>
        <BottomNav />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
