import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import API from '../api/api'
import { useAuth } from '../context/AuthContext'

type Gender = 'Male' | 'Female' | 'Other'
type FitnessGoal = 'Weight Loss' | 'Weight Gain' | 'Muscle Gain' | 'Fat Loss' | 'General Fitness'
type PaymentMethod = 'UPI' | 'Credit Card' | 'Debit Card' | 'Net Banking' | 'Wallets'

interface CheckoutForm {
  fullName: string
  email: string
  mobile: string
  age: string
  gender: Gender | ''
  goal: FitnessGoal | ''
}

type CheckoutPlan = {
  key: 'basic' | 'premium'
  name: string
  price: number
  period: string
  features: string[]
  description: string
}

const checkoutPlans: CheckoutPlan[] = [
  {
    key: 'basic',
    name: 'Basic Plan',
    price: 999,
    period: '/month',
    features: ['Customized Diet Plan', 'Weekly Updates'],
    description: 'Essential nutrition support with weekly updates and diet guidance.',
  },
  {
    key: 'premium',
    name: 'Premium Plan',
    price: 2999,
    period: '/month',
    features: ['Customized Diet Plan', 'Nutrition Coach Support', 'Weekly Progress Tracking'],
    description: 'Premium support with coach attention, weekly tracking and advanced progress reports.',
  },
]

const savingsMap: Record<string, number> = {
  TRANSFORM100: 100,
  WELCOME10: 100,
}

const paymentMethods: PaymentMethod[] = ['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Wallets']

const fitnessGoals: FitnessGoal[] = ['Weight Loss', 'Weight Gain', 'Muscle Gain', 'Fat Loss', 'General Fitness']

const floatingIcons = ['🥗', '🥑', '🍋', '⚡', '🛡️']

const CheckoutPage = () => {
  const auth = useAuth()
  const [searchParams] = useSearchParams()
  const selectedPlanKey = (searchParams.get('plan') as 'basic' | 'premium') || 'premium'
  const checkoutPlan = checkoutPlans.find((plan) => plan.key === selectedPlanKey) ?? checkoutPlans[1]
  const [form, setForm] = useState<CheckoutForm>({
    fullName: auth.user?.name || '',
    email: auth.user?.email || '',
    mobile: '',
    age: '',
    gender: '',
    goal: '',
  })
  const [coupon, setCoupon] = useState('TRANSFORM100')
  const [discount, setDiscount] = useState(100)
  const [couponStatus, setCouponStatus] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({ type: 'success', message: 'Coupon applied — save ₹100 today!' })
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>('UPI')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const subtotal = checkoutPlan.price
  const platformFee = 0
  const total = useMemo(() => Math.max(subtotal + platformFee - discount, 0), [subtotal, platformFee, discount])
  const savings = discount > 0 ? discount : 0

  const isFormFilled =
    form.fullName.trim().length > 1 &&
    form.email.trim().length > 5 &&
    form.mobile.trim().length >= 10 &&
    form.age.trim().length > 0 &&
    form.gender !== '' &&
    form.goal !== ''

  const handleFormChange = (field: keyof CheckoutForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setError('')
  }

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase()
    if (!code) {
      setCouponStatus({ type: 'error', message: 'Please enter a coupon code.' })
      return
    }

    if (savingsMap[code] != null) {
      setDiscount(savingsMap[code])
      setCouponStatus({ type: 'success', message: `Coupon applied — saved ₹${savingsMap[code]}!` })
      setSuccessMessage('Your order summary has been updated.')
      return
    }

    setCouponStatus({ type: 'error', message: 'Coupon not recognized. Try TRANSFORM100 or WELCOME10.' })
  }

  const handleCheckout = async () => {
    if (!isFormFilled) {
      setError('Please complete all required fields to continue.')
      return
    }

    setLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const response = await API.post('/payment/create', {
        plan: checkoutPlan.key,
        amount: subtotal,
        couponCode: coupon.trim().toUpperCase(),
        paymentMethod: selectedPayment,
        userDetails: form,
      })

      const payload = response.data
      const checkoutUrl = payload.checkoutUrl

      if (!checkoutUrl) {
        setError('Failed to initiate PhonePe checkout. Please try again.')
        setLoading(false)
        return
      }

      window.location.href = checkoutUrl
    } catch (requestError: unknown) {
      const message = requestError instanceof Error ? requestError.message : 'Unable to connect to payment gateway.'
      setError(message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100">
      <div className="relative overflow-hidden px-6 pb-24 pt-8 sm:px-10 lg:px-14">
        <div className="pointer-events-none absolute -right-24 top-10 hidden h-40 w-40 rounded-full bg-[#22C55E]/10 blur-3xl lg:block" />
        <div className="pointer-events-none absolute left-8 top-[20rem] h-36 w-36 rounded-full bg-[#84cc16]/10 blur-3xl" />
        <div className="mx-auto flex max-w-[1400px] flex-col gap-8">
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.4em] text-[#22C55E]">Transform Checkout</p>
                <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Secure your premium meal plan.</h1>
                <p className="mt-3 max-w-2xl text-slate-400">A premium fitness experience with custom nutrition, live coaching, and instant activation.</p>
              </div>
              <div className="rounded-[2rem] border border-[#22C55E]/20 bg-[#111827]/90 px-6 py-4 text-sm text-slate-300 shadow-xl shadow-[#22C55E]/10">
                <p className="font-semibold text-white">Payment mode</p>
                <p className="mt-2 text-slate-400">Fast, secure checkout with PhonePe and trusted payment rails.</p>
              </div>
            </div>
          </motion.header>

          <div className="grid gap-8 xl:grid-cols-[0.9fr_0.55fr]">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-8"
            >
              <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="inline-flex rounded-full bg-[#22C55E]/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#22C55E]">
                      Selected Plan
                    </div>
                    <h2 className="mt-6 text-3xl font-semibold text-white">{checkoutPlan.name}</h2>
                    <p className="mt-3 text-lg text-slate-400">A premium meal plan designed for fast results without sacrificing lifestyle.</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-[#22C55E]/20 bg-[#111827]/90 px-6 py-5 text-right">
                    <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Monthly cost</p>
                    <p className="mt-4 text-4xl font-semibold text-white">₹{checkoutPlan.price}</p>
                    <p className="text-sm text-slate-400">{checkoutPlan.period}</p>
                  </div>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {checkoutPlan.features.map((feature) => (
                    <div key={feature} className="rounded-3xl border border-white/10 bg-[#0f172a]/90 px-5 py-4 text-sm text-slate-300 shadow-sm">
                      <span className="text-[#22C55E]">✓</span> {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl"
                >
                  <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-[#22C55E]">User Details</p>
                      <h3 className="text-2xl font-semibold text-white">Personalize your plan</h3>
                    </div>
                    <div className="rounded-full bg-[#84cc16]/10 px-3 py-2 text-sm text-[#84cc16]">Step 1 of 3</div>
                  </div>
                  <div className="rounded-3xl bg-[#111827]/90 p-4 text-sm text-slate-300">
                    <p className="font-semibold text-slate-100">Purchase rule</p>
                    <p className="mt-2">Only one plan may be purchased per 30-day period. Please complete your current subscription before selecting a new plan.</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Full Name</span>
                      <input
                        value={form.fullName}
                        onChange={(event) => handleFormChange('fullName', event.target.value)}
                        placeholder="Your name"
                        className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-slate-100 outline-none transition focus:border-[#22C55E]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Email Address</span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(event) => handleFormChange('email', event.target.value)}
                        placeholder="you@example.com"
                        className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-slate-100 outline-none transition focus:border-[#22C55E]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Mobile Number</span>
                      <input
                        type="tel"
                        value={form.mobile}
                        onChange={(event) => handleFormChange('mobile', event.target.value)}
                        placeholder="9876543210"
                        className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-slate-100 outline-none transition focus:border-[#22C55E]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Age</span>
                      <input
                        type="number"
                        value={form.age}
                        onChange={(event) => handleFormChange('age', event.target.value)}
                        placeholder="28"
                        className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-slate-100 outline-none transition focus:border-[#22C55E]"
                      />
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Gender</span>
                      <select
                        value={form.gender}
                        onChange={(event) => handleFormChange('gender', event.target.value)}
                        className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-slate-100 outline-none transition focus:border-[#22C55E]"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </label>
                    <label className="space-y-2 text-sm text-slate-300">
                      <span>Fitness Goal</span>
                      <select
                        value={form.goal}
                        onChange={(event) => handleFormChange('goal', event.target.value)}
                        className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-slate-100 outline-none transition focus:border-[#22C55E]"
                      >
                        <option value="">Choose goal</option>
                        {fitnessGoals.map((goalOption) => (
                          <option key={goalOption} value={goalOption}>
                            {goalOption}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl"
                >
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.24em] text-[#22C55E]">Order Summary</p>
                      <h3 className="text-2xl font-semibold text-white">Your monthly investment</h3>
                    </div>
                    <div className="rounded-full bg-[#84cc16]/10 px-4 py-2 text-sm text-[#84cc16]">Save ₹{savings}</div>
                  </div>

                  <div className="space-y-4 rounded-[1.75rem] bg-[#0F172A]/95 p-6 shadow-inner shadow-black/10">
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Subtotal</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-400">
                      <span>Platform Fee</span>
                      <span>₹{platformFee}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-[#22C55E]">
                      <span>Discount</span>
                      <span>-₹{discount}</span>
                    </div>
                    <div className="mt-4 rounded-3xl border border-[#22C55E]/15 bg-[#111827]/95 px-5 py-4">
                      <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-slate-400">
                        <span>Total</span>
                        <span className="text-xl font-semibold text-white">₹{total}</span>
                      </div>
                      <p className="mt-3 text-sm text-slate-500">Instant activation when payment completes.</p>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3 rounded-[1.75rem] border border-white/10 bg-[#0F172A]/90 p-5">
                    <p className="text-sm uppercase tracking-[0.24em] text-[#22C55E]">Coupon</p>
                    <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                      <input
                        value={coupon}
                        onChange={(event) => setCoupon(event.target.value)}
                        placeholder="Enter Coupon Code"
                        className="w-full rounded-3xl border border-white/10 bg-[#111827] px-4 py-3 text-slate-100 outline-none transition focus:border-[#22C55E]"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="rounded-3xl bg-gradient-to-r from-[#22C55E] to-[#84cc16] px-6 py-3 text-sm font-semibold text-[#0f172a] transition hover:brightness-110"
                      >
                        Apply
                      </button>
                    </div>
                    <p className={`text-sm ${couponStatus.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {couponStatus.message}
                    </p>
                    <p className="text-sm text-slate-500">Try TRANSFORM100 or WELCOME10 for instant savings.</p>
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl"
              >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[#22C55E]">Secure Payment</p>
                    <h3 className="text-2xl font-semibold text-white">Choose your preferred checkout option</h3>
                  </div>
                  <div className="inline-flex items-center gap-3 rounded-full bg-[#111827]/80 px-4 py-2 text-sm text-slate-300">
                    <img src="https://seeklogo.com/images/P/phonepe-logo-2E18D0D26E-seeklogo.com.png" alt="PhonePe" className="h-6 w-auto" />
                    <span>Powered by PhonePe</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {paymentMethods.map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setSelectedPayment(method)}
                      className={`rounded-3xl border px-5 py-4 text-left transition ${selectedPayment === method ? 'border-[#22C55E] bg-[#111827]' : 'border-white/10 bg-[#0f172a] hover:border-[#84cc16]/40'}`}
                    >
                      <p className="text-base font-semibold text-white">{method}</p>
                      <p className="mt-2 text-sm text-slate-400">Fast, secure, instant checkout.</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 grid gap-4 rounded-[1.75rem] border border-[#22C55E]/15 bg-[#0f172a]/85 p-6 text-sm text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#22C55E]/15 px-3 py-2 text-[#22C55E]">🔒</span>
                    <span>100% Secure Payments</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#22C55E]/15 px-3 py-2 text-[#22C55E]">🛡</span>
                    <span>PCI-DSS Compliant</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#22C55E]/15 px-3 py-2 text-[#22C55E]">⚡</span>
                    <span>Instant Activation</span>
                  </div>
                </div>
              </motion.div>
            </motion.section>

            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="space-y-6"
            >
              <div className="sticky top-8 rounded-[2rem] border border-white/10 bg-[#111827]/90 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.24em] text-[#22C55E]">Review & pay</p>
                    <h3 className="text-2xl font-semibold text-white">Fast checkout</h3>
                  </div>
                  <div className="rounded-full bg-[#84cc16]/10 px-4 py-2 text-sm text-[#22C55E]">Secure</div>
                </div>

                <div className="mt-7 space-y-4 rounded-[1.75rem] bg-[#0F172A]/90 p-5 text-sm text-slate-300">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                  </div>
                  <div className="flex justify-between text-[#22C55E]">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                  <div className="border-t border-white/10 pt-4 text-white">
                    <div className="flex items-center justify-between text-sm uppercase tracking-[0.2em] text-slate-400">
                      <span>Total Amount</span>
                      <span className="text-xl font-semibold">₹{total}</span>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-[#111827] p-4 text-sm text-[#84cc16]">
                    Savings unlocked: ₹{savings} with our exclusive offer.
                  </div>
                </div>

                {error ? <p className="mt-4 rounded-3xl bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p> : null}
                {successMessage ? <p className="mt-4 rounded-3xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{successMessage}</p> : null}

                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={loading}
                  className="mt-6 w-full rounded-3xl bg-gradient-to-r from-[#22C55E] to-[#84cc16] px-6 py-4 text-lg font-semibold text-[#0f172a] shadow-2xl shadow-[#22C55E]/30 transition hover:scale-[1.01] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Processing payment…' : `Pay ₹${total} Securely`}
                </button>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-[#111827]/90 p-8 shadow-2xl shadow-black/20 backdrop-blur-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-[#22C55E]">Dashboard preview</p>
                <h3 className="mt-4 text-2xl font-semibold text-white">What happens next</h3>
                <ul className="mt-6 space-y-4 text-sm text-slate-300">
                  <li className="flex items-start gap-3"><span className="mt-1 text-[#22C55E]">•</span> Current Plan starts immediately after checkout.</li>
                  <li className="flex items-start gap-3"><span className="mt-1 text-[#22C55E]">•</span> Your personalized diet plan is prepared within 24 hours.</li>
                  <li className="flex items-start gap-3"><span className="mt-1 text-[#22C55E]">•</span> A coach call is scheduled automatically.</li>
                  <li className="flex items-start gap-3"><span className="mt-1 text-[#22C55E]">•</span> Your calorie target and meals load on the dashboard.</li>
                </ul>
              </div>
            </motion.aside>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {floatingIcons.map((icon, index) => (
              <motion.div
                key={icon}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.05 }}
                className="rounded-[2rem] border border-white/10 bg-[#111827]/80 px-6 py-8 text-center shadow-xl shadow-black/20"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#84cc16]/10 text-3xl">{icon}</div>
                <p className="text-sm text-slate-300">Healthy food, smart tracking, and premium support in one app.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
