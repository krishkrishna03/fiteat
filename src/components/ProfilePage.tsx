import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import API from '../api/api'

interface Plan {
  _id: string
  name: string
  price: number
  period: string
  features: string[]
  key: string
  popular?: boolean
  description?: string
}

interface UserPlan {
  _id: string
  planName: string
  planPrice: number
  status: string
  startDate: string
  endDate: string
  paymentId: string
}

interface Payment {
  _id: string
  amount: number
  currency: string
  transactionId: string
  status: string
  paymentDate: string
  planId: { name: string }
}

const ProfilePage = () => {
  const auth = useAuth()
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([])
  const [userPlans, setUserPlans] = useState<UserPlan[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [checkoutStep, setCheckoutStep] = useState<'review' | 'payment' | null>(null)
  const [paymentTimestamp, setPaymentTimestamp] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [plansResponse, userPlansResponse, paymentsResponse] = await Promise.all([
          API.get('/plans'),
          API.get('/plans/my'),
          API.get('/plans/my/payments'),
        ])
        setAvailablePlans(Array.isArray(plansResponse.data) ? plansResponse.data : [])
        setUserPlans(Array.isArray(userPlansResponse.data) ? userPlansResponse.data : [])
        setPayments(Array.isArray(paymentsResponse.data) ? paymentsResponse.data : [])
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unable to load profile data.'
        setError(message)
        setUserPlans([])
        setPayments([])
        setAvailablePlans([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const initiatePurchase = (plan: Plan) => {
    setError('')
    setSuccess('')
    setSelectedPlan(plan)
    setCheckoutStep('review')
    setPaymentTimestamp(new Date().toISOString())
  }

  const proceedToPayment = () => {
    setCheckoutStep('payment')
    setPaymentTimestamp(new Date().toISOString())
  }

  const confirmPurchase = async () => {
    if (!selectedPlan) return

    setError('')
    setSuccess('')
    setLoading(true)

    const payload = {
      plan: selectedPlan.key,
      amount: selectedPlan.price,
    }

    const routeCandidates = ['/payment/create', '/payments/create', '/payments/create-order', '/payment/create-order']
    let response:
      | {
          data: {
            checkoutUrl?: string
          }
        }
      | null = null

    const isAxiosError = (error: unknown): error is { response?: { status?: number } } =>
      typeof error === 'object' && error !== null && 'response' in error

    try {
      for (const route of routeCandidates) {
        try {
          response = await API.post(route, payload)
          break
        } catch (innerError: unknown) {
          const status = isAxiosError(innerError) ? innerError.response?.status : undefined
          if (status !== 404) {
            throw innerError
          }
        }
      }

      if (!response) {
        throw new Error('Payment route not found. Please ensure the backend is running.')
      }

      const { checkoutUrl } = response.data

      if (!checkoutUrl) {
        setError('Unable to initialize PhonePe checkout. Please try again.')
        setLoading(false)
        return
      }

      window.location.href = checkoutUrl
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to complete purchase.'
      setError(message)
      setLoading(false)
    }
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#14272e] to-[#0b1115] text-slate-100 px-4 py-10">
      <div className="mx-auto max-w-[1200px] space-y-8">
        <div className="rounded-[2rem] border border-[#84cc16]/20 bg-[#131d23]/80 p-8 shadow-2xl shadow-[#84cc16]/10 backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#84cc16]">My Profile</p>
              <h1 className="mt-4 text-4xl font-bold text-white">Welcome back, {auth.user?.name}</h1>
              <p className="mt-2 max-w-2xl text-slate-400">Manage your account, view active plans, and purchase new subscriptions.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="rounded-3xl bg-[#0f1419] p-6 shadow-xl shadow-[#84cc16]/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">👤</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Account</p>
                    <p className="text-sm font-semibold text-white">{auth.user?.name || 'User'}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">Email: {auth.user?.email}</p>
                <p className="mt-2 text-xs text-slate-400">Role: {auth.userType === 'admin' ? 'Admin' : 'Member'}</p>
              </div>

              <div className="rounded-3xl bg-[#0f1419] p-6 shadow-xl shadow-[#84cc16]/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">📱</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Contact</p>
                    <p className="text-sm font-semibold text-white">{auth.user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">Location: {auth.user?.location || 'N/A'}</p>
                <p className="mt-2 text-xs text-slate-400">Address: {auth.user?.address || 'N/A'}</p>
              </div>

              <div className="rounded-3xl bg-[#0f1419] p-6 shadow-xl shadow-[#84cc16]/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">⚕️</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Health</p>
                    <p className="text-sm font-semibold text-white">{auth.user?.age ?? 'N/A'} yrs</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">Gender: {auth.user?.gender || 'N/A'}</p>
                <p className="mt-2 text-xs text-slate-400">DOB: {auth.user?.dob || 'N/A'}</p>
              </div>

              <div className="rounded-3xl bg-[#0f1419] p-6 shadow-xl shadow-[#84cc16]/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">⚖️</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Weight</p>
                    <p className="text-sm font-semibold text-white">{auth.user?.weight ?? 'N/A'} kg</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">Recorded weight</p>
              </div>

              <div className="rounded-3xl bg-[#0f1419] p-6 shadow-xl shadow-[#84cc16]/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">📏</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Height</p>
                    <p className="text-sm font-semibold text-white">{auth.user?.height ?? 'N/A'} cm</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">Recorded height</p>
              </div>

              <div className="rounded-3xl bg-[#0f1419] p-6 shadow-xl shadow-[#84cc16]/10">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-[#84cc16]/20 p-3 text-xl">🎯</div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-[#84cc16]">Member Since</p>
                    <p className="text-sm font-semibold text-white">{auth.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-slate-400">Join date</p>
              </div>
            </div>
          </div>
        </div>

        {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        {success && <div className="rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{success}</div>}

        {selectedPlan && checkoutStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-4xl overflow-y-auto max-h-[90vh] rounded-[2rem] border border-[#84cc16]/20 bg-[#131d23]/95 p-6 sm:p-8 shadow-2xl shadow-[#84cc16]/30">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#84cc16]">Checkout Review</p>
                  <h2 className="mt-4 text-3xl font-semibold text-white">
                    {checkoutStep === 'review' ? 'Verify your plan details' : 'Choose payment option'}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-slate-400">
                    Please review the selected plan before payment. Confirm the plan, check the amount, and then choose your preferred payment method.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan(null)
                    setCheckoutStep(null)
                  }}
                  className="rounded-full border border-slate-700 bg-[#111f26] px-4 py-2 text-sm text-slate-300 transition hover:border-white hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-[#111f26] p-6">
                  <div className="rounded-3xl border border-[#84cc16]/10 bg-[#141f25] p-6">
                    <p className="text-sm uppercase tracking-[0.24em] text-[#84cc16]">Review before paying</p>
                    <h3 className="mt-4 text-2xl font-semibold text-white">{selectedPlan.name}</h3>
                    <p className="mt-2 text-slate-400">{selectedPlan.description}</p>
                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-3xl bg-[#0f1419] p-4">
                        <p className="text-sm text-slate-400">Price</p>
                        <p className="mt-2 text-xl font-semibold text-white">₹{selectedPlan.price} {selectedPlan.period}</p>
                      </div>
                      <div className="rounded-3xl bg-[#0f1419] p-4">
                        <p className="text-sm text-slate-400">Selected On</p>
                        <p className="mt-2 text-xl font-semibold text-white">{new Date(paymentTimestamp).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-6 rounded-3xl bg-[#0f1419] p-4">
                      <p className="text-sm text-slate-400">Checklist</p>
                      <ul className="mt-3 space-y-2 text-sm text-slate-300">
                        <li>• Verify the plan name and price</li>
                        <li>• Confirm your selected plan duration</li>
                        <li>• Keep your transaction reference for support</li>
                        <li>• Do not close this tab until PhonePe finishes</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl bg-[#111f26] p-6">
                  {checkoutStep === 'review' ? (
                    <>
                      <div className="rounded-3xl border border-[#84cc16]/10 bg-[#141f25] p-6">
                        <p className="text-sm text-slate-400">Step 1</p>
                        <h3 className="mt-3 text-xl font-semibold text-white">Confirm your plan</h3>
                        <p className="mt-2 text-sm text-slate-400">Review the plan details and make sure the amount is correct before moving to payment.</p>
                      </div>
                      <button
                        type="button"
                        onClick={proceedToPayment}
                        className="mt-6 w-full rounded-full bg-gradient-to-r from-[#84cc16] to-[#a3e635] px-4 py-3 text-sm font-semibold text-[#0f1419] transition hover:shadow-lg"
                      >
                        Continue to payment
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="rounded-3xl border border-[#84cc16]/10 bg-[#141f25] p-6">
                        <p className="text-sm text-slate-400">Step 2</p>
                        <h3 className="mt-3 text-xl font-semibold text-white">Complete the checkout</h3>
                        <p className="mt-2 text-sm text-slate-400">You will be redirected securely to PhonePe. Please complete the payment there and then return to your profile.</p>
                      </div>

                      <div className="mt-6 rounded-3xl border border-[#84cc16]/10 bg-[#0f1419] p-5 text-center">
                        <p className="text-sm text-slate-400">Amount to pay</p>
                        <p className="mt-2 text-2xl font-semibold text-white">₹{selectedPlan.price}</p>
                        <p className="mt-4 text-sm text-slate-400">PhonePe will handle the secure transaction. Your plan activates after successful payment verification.</p>
                      </div>

                      <button
                        type="button"
                        disabled={loading}
                        onClick={confirmPurchase}
                        className="mt-6 w-full rounded-full bg-gradient-to-r from-[#84cc16] to-[#a3e635] px-4 py-3 text-sm font-semibold text-[#0f1419] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {loading ? 'Redirecting to PhonePe...' : 'Pay with PhonePe'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.95fr]">
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 shadow-xl shadow-[#84cc16]/5">
              <h2 className="text-2xl font-semibold text-white">Your Personal Info</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#141f25] p-5">
                  <p className="text-sm text-slate-400">Name</p>
                  <p className="mt-2 text-lg font-semibold text-white">{auth.user?.name}</p>
                </div>
                <div className="rounded-3xl bg-[#141f25] p-5">
                  <p className="text-sm text-slate-400">Email</p>
                  <p className="mt-2 text-lg font-semibold text-white">{auth.user?.email}</p>
                </div>
                <div className="rounded-3xl bg-[#141f25] p-5">
                  <p className="text-sm text-slate-400">Member Since</p>
                  <p className="mt-2 text-lg font-semibold text-white">{auth.user?.createdAt ? new Date(auth.user.createdAt).toLocaleDateString() : '-'}</p>
                </div>
                <div className="rounded-3xl bg-[#141f25] p-5">
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="mt-2 text-lg font-semibold text-white">{auth.userType === 'admin' ? 'Admin' : 'Member'}</p>
                </div>
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 shadow-xl shadow-[#84cc16]/5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-2xl font-semibold text-white">Active & Past Plans</h2>
                <span className="rounded-full bg-[#84cc16]/10 px-4 py-2 text-sm text-[#84cc16]">{userPlans.length} plans</span>
              </div>
              <div className="mt-6 space-y-4">
                {userPlans.length === 0 ? (
                  <p className="text-sm text-slate-400">You haven’t purchased any plans yet.</p>
                ) : (
                  userPlans.map((plan) => (
                    <div key={plan._id} className="rounded-3xl bg-[#141f25] p-5">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-white">{plan.planName}</p>
                          <p className="mt-1 text-sm text-slate-400">Status: {plan.status}</p>
                        </div>
                        <div className="text-right text-sm text-slate-400">
                          <p>Start: {new Date(plan.startDate).toLocaleDateString()}</p>
                          <p>End: {new Date(plan.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 shadow-xl shadow-[#84cc16]/5">
              <h2 className="text-2xl font-semibold text-white">Payment History</h2>
              <div className="mt-6 space-y-3">
                {payments.length === 0 ? (
                  <p className="text-sm text-slate-400">No payments recorded yet.</p>
                ) : (
                  payments.map((payment) => (
                    <div key={payment._id} className="rounded-3xl bg-[#141f25] p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-white">{payment.planId?.name || 'Plan purchase'}</p>
                          <p className="text-sm text-slate-400">Transaction #{payment.transactionId}</p>
                        </div>
                        <div className="text-right text-white">
                          <p className="font-semibold">₹{payment.amount}</p>
                          <p className="text-sm text-slate-400">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          <aside className="space-y-6">
            <div className="rounded-[2rem] border border-[#84cc16]/20 bg-[#0f1419]/90 p-8 shadow-xl shadow-[#84cc16]/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-2xl font-semibold text-white">Available Plans</h2>
                <span className="rounded-full bg-[#84cc16]/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#84cc16]">
                  1 plan allowed every 30 days
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-400">Users may purchase only one plan within a 30-day period. Complete your current plan before buying another.</p>
              <div className="mt-6 space-y-4">
                {isLoading ? (
                  <p className="text-sm text-slate-400">Loading plans...</p>
                ) : availablePlans.length === 0 ? (
                  <p className="text-sm text-slate-400">No plans available at the moment.</p>
                ) : (
                  availablePlans.map((plan) => (
                    <div key={plan._id} className="rounded-3xl border border-[#84cc16]/10 bg-[#141f25] p-5">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-white">{plan.name}</p>
                          <p className="mt-1 text-sm text-slate-400">₹{plan.price} {plan.period}</p>
                        </div>
                        <button
                          type="button"
                          disabled={loading}
                          onClick={() => initiatePurchase(plan)}
                          className="rounded-full bg-gradient-to-r from-[#84cc16] to-[#a3e635] px-4 py-2 text-sm font-semibold text-[#0f1419] transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          Buy Now
                        </button>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-400">{plan.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
                        {plan.features && plan.features.map((feature) => (
                          <span key={feature} className="rounded-full border border-[#84cc16]/20 px-3 py-1">{feature}</span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
