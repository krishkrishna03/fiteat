import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import API from '../api/api'

interface SuccessState {
  planName?: string
  amountPaid?: number
  expiryDate?: string
  paymentMethod?: string
}

const CheckoutSuccessPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const transactionId = searchParams.get('transactionId')
  const state = (location.state ?? {}) as SuccessState
  const [planName, setPlanName] = useState(state.planName || 'Premium Diet Plan')
  const [amountPaid, setAmountPaid] = useState(state.amountPaid ?? 899)
  const [paymentMethod, setPaymentMethod] = useState(state.paymentMethod || 'UPI')
  const [expiryDate, setExpiryDate] = useState(
    state.expiryDate ? new Date(state.expiryDate).toLocaleDateString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()
  )
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'SUCCESS' | 'FAILED' | 'UNKNOWN'>(state.planName ? 'SUCCESS' : 'UNKNOWN')
  const [isChecking, setIsChecking] = useState(false)
  const [fetchError, setFetchError] = useState('')

  const fetchPaymentStatus = async () => {
    if (!transactionId) return
    setIsChecking(true)
    setFetchError('')

    try {
      const response = await API.get(`/payment/status/${transactionId}`)
      const paymentData = response.data.payment ?? response.data
      const rawStatus = String(paymentData.paymentStatus || paymentData.status || '').toUpperCase()
      const normalizedStatus = ['SUCCESS', 'COMPLETED', 'TRANSACTION_SUCCESS'].includes(rawStatus)
        ? 'SUCCESS'
        : ['FAILED', 'ERROR', 'DECLINED', 'CANCELLED'].includes(rawStatus)
        ? 'FAILED'
        : 'PENDING'

      setPaymentStatus(normalizedStatus)
      setPlanName(paymentData.plan || paymentData.planName || planName)
      setAmountPaid(paymentData.amount ?? amountPaid)
      setPaymentMethod('PhonePe')
      if (paymentData.expiryDate) {
        setExpiryDate(new Date(paymentData.expiryDate).toLocaleDateString())
      }

      if (normalizedStatus === 'FAILED') {
        setFetchError('Payment failed. Please retry or contact support if the issue persists.')
      }
    } catch (error: unknown) {
      setPaymentStatus('UNKNOWN')
      setFetchError('Unable to verify payment status right now. Please refresh this page after a moment.')
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    if (transactionId && paymentStatus !== 'SUCCESS') {
      fetchPaymentStatus()
    }
  }, [transactionId, paymentStatus])

  const handleDownloadInvoice = () => {
    const invoice = `Invoice for ${planName}\nAmount Paid: ₹${amountPaid}\nPayment Method: ${paymentMethod}\nSubscription valid until: ${expiryDate}`
    const blob = new Blob([invoice], { type: 'text/plain;charset=utf-8' })
    const anchor = document.createElement('a')
    anchor.href = URL.createObjectURL(blob)
    anchor.download = `Transform-Invoice-${Date.now()}.txt`
    anchor.click()
    URL.revokeObjectURL(anchor.href)
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col items-center justify-center px-6 py-12 sm:px-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="w-full rounded-[3rem] border border-white/10 bg-white/5 p-10 shadow-2xl shadow-black/30 backdrop-blur-xl"
        >
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center gap-6">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#22C55E]/10 text-5xl text-[#22C55E] shadow-xl shadow-[#22C55E]/20">
              {paymentStatus === 'SUCCESS' ? '✓' : paymentStatus === 'FAILED' ? '✕' : '⏳'}
            </div>
            <h1 className="text-4xl font-semibold text-white">
              {paymentStatus === 'SUCCESS'
                ? '🎉 Payment Successful'
                : paymentStatus === 'FAILED'
                ? '⚠️ Payment Failed'
                : '⏳ Payment verification in progress'}
            </h1>
            <p className="max-w-2xl text-lg text-slate-400">
              {paymentStatus === 'SUCCESS'
                ? 'Welcome to Transform. Your customized meal plan is now being prepared and your subscription is active.'
                : paymentStatus === 'FAILED'
                ? 'Your payment did not complete. Please retry the checkout or contact support if needed.'
                : 'We are verifying your PhonePe transaction. This may take a few seconds, then your plan will activate automatically.'}
            </p>
            {fetchError ? (
              <p className="text-sm text-rose-300">{fetchError}</p>
            ) : null}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[2rem] border border-white/10 bg-[#0F172A]/90 p-6 text-left shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Plan</p>
                <p className="mt-3 text-xl font-semibold text-white">{planName}</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-[#0F172A]/90 p-6 text-left shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Amount Paid</p>
                <p className="mt-3 text-xl font-semibold text-white">₹{amountPaid}</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-[#0F172A]/90 p-6 text-left shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Expires</p>
                <p className="mt-3 text-xl font-semibold text-white">{expiryDate}</p>
              </div>
              <div className="rounded-[2rem] border border-white/10 bg-[#0F172A]/90 p-6 text-left shadow-lg shadow-black/10">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Payment</p>
                <p className="mt-3 text-xl font-semibold text-white">{paymentMethod}</p>
              </div>
            </div>

            <div className="mt-10 grid gap-6 rounded-[2rem] bg-[#111827]/90 p-8 shadow-2xl shadow-black/20 sm:grid-cols-2">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.24em] text-[#22C55E]">Dashboard Preview</p>
                <h2 className="text-2xl font-semibold text-white">Your transformation hub is ready.</h2>
                <p className="text-slate-400">
                  Check your plan status, upcoming coach call, calorie target, and today’s meals as soon as you land on the dashboard.
                </p>
              </div>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="rounded-[1.75rem] bg-[#0F172A]/90 p-4">
                  <p className="text-slate-400">Current Plan</p>
                  <p className="mt-2 font-semibold text-white">Preparing Your Personalized Diet Plan</p>
                </div>
                <div className="rounded-[1.75rem] bg-[#0F172A]/90 p-4">
                  <p className="text-slate-400">Next Coach Call</p>
                  <p className="mt-2 font-semibold text-white">Scheduled within 24 hours</p>
                </div>
                <div className="rounded-[1.75rem] bg-[#0F172A]/90 p-4">
                  <p className="text-slate-400">Calories Target</p>
                  <p className="mt-2 font-semibold text-white">2,100 kcal</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              {(paymentStatus === 'PENDING' || paymentStatus === 'UNKNOWN') && transactionId ? (
                <button
                  type="button"
                  onClick={fetchPaymentStatus}
                  disabled={isChecking}
                  className="min-w-[200px] rounded-full bg-[#111827] px-8 py-4 text-sm font-semibold text-white transition hover:bg-[#1f2937] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isChecking ? 'Refreshing status...' : 'Refresh payment status'}
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="min-w-[200px] rounded-full bg-gradient-to-r from-[#22C55E] to-[#84cc16] px-8 py-4 text-sm font-semibold text-[#0f172a] transition hover:shadow-xl"
              >
                Go To Dashboard
              </button>
              {paymentStatus === 'SUCCESS' ? (
                <button
                  type="button"
                  onClick={handleDownloadInvoice}
                  className="min-w-[200px] rounded-full border border-white/10 bg-[#111827] px-8 py-4 text-sm font-semibold text-white transition hover:border-[#22C55E]"
                >
                  Download Invoice
                </button>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CheckoutSuccessPage
