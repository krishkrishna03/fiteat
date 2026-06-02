import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

const CheckoutFailedPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1200px] items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="w-full rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-rose-500/10 text-5xl text-rose-400 shadow-xl shadow-rose-500/20">
              ✕
            </div>
            <h1 className="text-4xl font-semibold text-white">Payment Failed</h1>
            <p className="max-w-2xl text-lg text-slate-400">
              We were unable to complete the payment. Please try again, or return to the plans page to choose the best subscription for your goals.
            </p>
            <div className="grid gap-4 sm:grid-cols-2 w-full max-w-md">
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="rounded-full bg-gradient-to-r from-[#22C55E] to-[#84cc16] px-8 py-4 text-sm font-semibold text-[#0f172a] transition hover:shadow-xl"
              >
                Try Again
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="rounded-full border border-white/10 bg-[#111827] px-8 py-4 text-sm font-semibold text-white transition hover:border-[#22C55E]"
              >
                Return to Plans
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutFailedPage
