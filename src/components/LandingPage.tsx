import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const benefitCards = [
  {
    title: 'AI-Powered Plans',
    description: 'Machine learning creates meal plans perfectly tailored to your goals, preferences, and lifestyle.',
    icon: '🎯',
  },
  {
    title: 'Certified Nutrition Experts',
    description: 'Registered dietitians and sports nutritionists guide every step of your transformation.',
    icon: '👨‍⚕️',
  },
  {
    title: 'Real Food, Real Results',
    description: 'No bland meals. Enjoy delicious Indian, Mediterranean, Keto, and plant-based options.',
    icon: '🍽️',
  },
  {
    title: 'Daily Progress Tracking',
    description: 'Real-time macro tracking, meal logging, and performance metrics at your fingertips.',
    icon: '📊',
  },
  {
    title: '100% Safe & Sustainable',
    description: 'Science-backed nutrition designed for lasting health, not crash diets.',
    icon: '🛡️',
  },
]

const coaches = [
  { name: 'Aarav', role: 'Nutrition Specialist', experience: '8 yrs', success: '94%', imagePath: '/coaches/aarav.svg' },
  { name: 'Mira', role: 'Performance Diet Coach', experience: '7 yrs', success: '91%', imagePath: '/coaches/mira.svg' },
  { name: 'Riya', role: 'Holistic Wellness Coach', experience: '10 yrs', success: '96%', imagePath: '/coaches/riya.svg' },
  { name: 'Karan', role: 'Body Composition Coach', experience: '6 yrs', success: '93%', imagePath: '/coaches/karan.svg' },
  { name: 'Anya', role: 'Plant-Based Expert', experience: '5 yrs', success: '92%', imagePath: '/coaches/anya.svg' },
  { name: 'Dev', role: 'Sports Nutritionist', experience: '9 yrs', success: '95%', imagePath: '/coaches/dev.svg' },
]

const stories = [
  {
    name: 'Sneha',
    loss: '10kg',
    duration: '12 weeks',
    text: 'Finally a plan that understands my love for Indian food and my busy schedule.',
    poster: '/members/sneha-poster.svg',
    video: '/member-sneha.mp4',
  },
  {
    name: 'Rohan',
    loss: '8kg',
    duration: '10 weeks',
    text: 'The coaches made every meal easy to follow with simple, tasty recipes.',
    poster: '/members/rohan-poster.svg',
    video: '/member-rohan.mp4',
  },
  {
    name: 'Tara',
    loss: '6kg',
    duration: '8 weeks',
    text: 'The app reminders and weekly updates kept me consistent until I reached my goal.',
    poster: '/members/tara-poster.svg',
    video: '/member-tara.mp4',
  },
]

const offerings = [
  { title: 'Customized Diet Plans', description: 'Personalized meal workflows tailored to your metabolic profile and preferences.' },
  { title: 'Weight Loss Plans', description: 'Scientifically designed fat reduction nutrition for steady progress.' },
  { title: 'Muscle Gain Plans', description: 'Protein-first meal programs for lean muscle growth and recovery.' },
  { title: 'PCOS Nutrition Plans', description: 'Hormone-friendly plans built for women with PCOS management goals.' },
  { title: 'Diabetic Friendly Plans', description: 'Balanced glycemic meals for blood sugar control and energy stability.' },
  { title: 'Athletic Nutrition', description: 'Performance foods and recovery support for active lifestyles.' },
]

const comparisonRows = [
  'Personalized Nutrition',
  'Coach Support',
  'Weekly Updates',
  'Progress Tracking',
  'Indian Food Options',
  'Goal-Based Planning',
]

const appDownloadUrl = 'https://yourapp.com'
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=380x380&data=${encodeURIComponent(appDownloadUrl)}&bgcolor=1F2937&color=84cc16&format=png`

const faqItems = [
  {
    question: 'How are meal plans customized?',
    answer: 'Our team combines your goals, food preferences, medical requirements, and coach guidance to create a plan that fits your life.',
  },
  {
    question: 'Can vegetarians join?',
    answer: 'Absolutely. We tailor plans for vegetarian, vegan, and plant-forward lifestyles with premium nutrition variety.',
  },
  {
    question: 'How often are plans updated?',
    answer: 'Plans are reviewed weekly and adjusted based on your progress and feedback.',
  },
  {
    question: 'Is coach support included?',
    answer: 'Yes. Every plan includes coach support through chat and regular check-ins.',
  },
  {
    question: 'Can I switch plans?',
    answer: 'You can switch or upgrade plans anytime to match your changing goals.',
  },
]

const plans = [
  {
    name: 'Diet Plan Only',
    price: '₹999',
    period: '/month',
    features: ['Personalized Diet Plan', 'Weekly Updates', 'Coach Consultation', 'Progress Tracking'],
    popular: false,
  },
  {
    name: 'Diet + Food Delivery',
    price: '₹2999',
    period: '/month',
    features: ['Customized Diet Plan', 'Fresh Healthy Meals', 'Daily Delivery', 'Dedicated Coach', 'Weekly Monitoring'],
    popular: true,
  },
  {
    name: 'Premium Transformation',
    price: '₹4999',
    period: '/month',
    features: ['Everything Included', 'Priority Coach', 'Video Consultations', 'Advanced Tracking', 'Exclusive Content'],
    popular: false,
  },
]

type NativeWindow = Window & { Capacitor?: unknown; cordova?: unknown }

const LandingPage = () => {
  const isNativeApp = typeof window !== 'undefined' && ((window as NativeWindow).Capacitor !== undefined || (window as NativeWindow).cordova !== undefined)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f1419] via-[#1a2428] to-[#0d1e1a] text-slate-100">
      <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-8 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 rounded-[3rem] border border-[#84cc16]/30 bg-gradient-to-br from-[#1a2428] to-[#0f1419] p-12 shadow-2xl"
        >
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="space-y-8">
              <span className="inline-flex rounded-full bg-[#84cc16]/20 px-4 py-2 text-sm font-bold uppercase tracking-wider text-[#84cc16]">
                ⚡ Transform Your Body
              </span>
              <div className="space-y-4">
                <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl">
                  Transform Body With<br />
                  <span className="text-[#84cc16]">Customized Meal Plans</span>
                </h1>
                <p className="text-lg leading-8 text-slate-400">
                  Science-backed nutrition plans designed by expert coaches. Personalized for your goals, lifestyle, and food preferences.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/login"
                  className="rounded-full bg-gradient-to-r from-[#84cc16] to-[#a3e635] px-8 py-4 text-base font-bold text-[#0f1419] shadow-xl shadow-[#84cc16]/30 transition hover:shadow-2xl hover:-translate-y-1"
                >
                  Get Started Now
                </Link>
                <a
                  href="#plans"
                  className="rounded-full border-2 border-[#84cc16]/40 bg-transparent px-8 py-4 text-base font-bold text-[#84cc16] transition hover:border-[#84cc16]/80 hover:bg-[#84cc16]/5"
                >
                  View Plans
                </a>
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#84cc16]/40 shadow-2xl">
              <img
                loading="lazy"
                className="h-full w-full object-cover"
                src="https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Healthy meal"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419]/40 to-transparent" />
            </div>
          </div>
        </motion.section>

        <section className="mb-20 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">
              Why <span className="text-[#84cc16]">Transform</span> Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">
              The science of personalized nutrition meets practical lifestyle changes.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            {benefitCards.map((card) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -8 }}
                className="rounded-2xl border border-[#84cc16]/30 bg-[#1a2428]/50 p-6 backdrop-blur hover:border-[#84cc16]/60 transition-all hover:shadow-xl"
              >
                <div className="mb-4 text-4xl">{card.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                <p className="text-slate-400 text-sm leading-6">{card.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Coaches Section */}
        <motion.section
          id="coaches"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-20 rounded-3xl border border-[#84cc16]/30 bg-[#1a2428]/50 p-12 backdrop-blur"
        >
          <div className="mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Meet Your Expert Coaches</h2>
            <p className="max-w-2xl text-slate-400">Certified nutrition experts and sports nutritionists dedicated to your transformation</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coaches.map((coach) => (
              <motion.article
                key={coach.name}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="rounded-2xl border border-[#84cc16]/30 bg-[#0f1419] p-6 shadow-lg hover:border-[#84cc16]/60 transition-all"
              >
                <div className="mb-4 overflow-hidden rounded-2xl bg-[#1a2428]">
                  <img loading="lazy" className="h-40 w-full object-cover" src={coach.imagePath} alt={coach.name} />
                </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-lg font-bold text-white">{coach.name}</p>
                      <p className="text-sm text-[#84cc16]">{coach.role}</p>
                    </div>
                    <div className="pt-2 space-y-1 border-t border-[#84cc16]/20">
                      <p className="text-sm text-slate-400">{coach.experience} experience</p>
                      <p className="text-sm text-slate-400">Success Rate <span className="text-[#84cc16] font-bold">{coach.success}</span></p>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
        </motion.section>

        {/* Members Stories Section */}
        <motion.section
          id="members"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="mb-20"
        >
          <div className="mb-16 text-center space-y-4">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#84cc16]/20 px-5 py-2 border border-[#84cc16]/30">
              <span className="inline-block h-2 w-2 rounded-full bg-[#84cc16]" />
              <span className="text-sm font-bold uppercase tracking-wide text-[#84cc16]">Real Members. Real Results.</span>
            </div>
            <h2 className="text-4xl font-bold text-white sm:text-5xl lg:text-6xl">Transformation Stories That Inspire</h2>
            <p className="mx-auto max-w-2xl text-lg text-slate-400">Watch how our members achieved lasting results with personalized coaching and sustainable habits</p>
          </div>

          <div className="mb-10 flex flex-wrap justify-center gap-6">
            {[
              { value: '10,000+', label: 'Success Stories', icon: '⭐' },
              { value: '98%', label: 'Member Retention', icon: '📈' },
              { value: '4.9/5', label: 'Average Rating', icon: '🏆' },
            ].map((metric) => (
              <motion.div key={metric.label} whileHover={{ scale: 1.05, y: -5 }} className="flex items-center gap-4 rounded-2xl bg-[#1a2428]/50 border border-[#84cc16]/20 px-6 py-4 hover:border-[#84cc16]/50 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#84cc16]/20 text-xl">{metric.icon}</div>
                <div>
                  <p className="text-2xl font-bold text-[#84cc16]">{metric.value}</p>
                  <p className="text-sm text-slate-400">{metric.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {stories.map((story, index) => (
              <motion.div key={story.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.15 }} whileHover={{ y: -10 }} className="group relative overflow-hidden rounded-3xl bg-[#1a2428] border border-[#84cc16]/30 shadow-xl hover:border-[#84cc16]/60 transition-all">
                <div className="relative overflow-hidden">
                  <button type="button" className="relative h-64 w-full overflow-hidden">
                    <img loading="lazy" src={story.poster} alt={story.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1419]/60 via-[#0f1419]/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#84cc16]/90 shadow-2xl"><span className="ml-1 text-2xl text-[#0f1419]">▶</span></div>
                    </div>
                  </button>
                  <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-[#0f1419]/90 px-3 py-1.5 backdrop-blur-sm border border-[#84cc16]/20">
                    <span className="text-xs font-bold text-[#84cc16]">{story.loss}</span>
                    <span className="text-xs text-slate-400">lost</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg font-bold text-white">{story.name}</p>
                      <p className="text-sm text-slate-400">{story.duration} program</p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#84cc16]/20 border border-[#84cc16]/30 text-sm font-bold text-[#84cc16]">{index + 1}</div>
                  </div>
                  <p className="mb-4 text-sm leading-relaxed text-slate-400">"{story.text}"</p>
                  <div className="flex gap-2">
                    <span className="rounded-full bg-[#84cc16]/20 border border-[#84cc16]/30 px-3 py-1 text-xs font-medium text-[#84cc16]">Verified</span>
                    <span className="rounded-full bg-blue-500/20 border border-blue-500/30 px-3 py-1 text-xs font-medium text-blue-400">Real Results</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Offerings Section (Everything You Need To Transform) */}
        <motion.section id="offering" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="mb-20 rounded-3xl border border-[#84cc16]/30 bg-[#1a2428]/50 p-12 backdrop-blur">
          <div className="mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Everything You Need To Transform</h2>
            <p className="max-w-2xl text-slate-400">Comprehensive nutrition solutions for every goal and lifestyle</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offerings.map((item) => (
              <motion.div key={item.title} whileHover={{ scale: 1.05 }} className="rounded-2xl border border-[#84cc16]/30 bg-[#0f1419] p-8 hover:border-[#84cc16]/60 transition-all">
                <div className="mb-4 text-4xl">✓</div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-6">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Comparison Section (Why Transform Works) */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="mb-20 rounded-3xl border border-[#84cc16]/30 bg-[#1a2428]/50 p-12 backdrop-blur">
          <div className="mb-10 space-y-4">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Why Transform Works</h2>
            <p className="text-slate-400">Science-backed nutrition that delivers real results</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-[#84cc16]/30">
            <div className="grid grid-cols-3 gap-0 border-b border-[#84cc16]/30 bg-[#0f1419] px-6 py-5 md:grid-cols-[1.6fr_1fr_1fr]">
              <div className="font-bold text-white">Feature</div>
              <div className="font-bold text-[#84cc16] text-center">Transform</div>
              <div className="font-bold text-slate-500 text-center">Generic Plan</div>
            </div>
            {comparisonRows.map((row, index) => (
              <div key={row} className={`grid grid-cols-3 gap-0 px-6 py-5 ${index % 2 === 0 ? 'bg-[#1a2428]/30' : 'bg-[#0f1419]'} md:grid-cols-[1.6fr_1fr_1fr]`}>
                <div className="font-medium text-white">{row}</div>
                <div className="flex items-center justify-center text-[#84cc16]">✓</div>
                <div className="flex items-center justify-center text-slate-600">×</div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="mb-20 rounded-3xl border border-[#84cc16]/30 bg-[#1a2428]/50 p-12 backdrop-blur">
          <div className="mb-10 space-y-4">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <motion.div key={faq.question} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: index * 0.05 }} className="overflow-hidden rounded-2xl border border-[#84cc16]/30 bg-[#0f1419]">
                <button type="button" className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left font-bold text-white hover:text-[#84cc16] transition">
                  {faq.question}
                  <span className="text-[#84cc16]">+</span>
                </button>
                <div className="max-h-0 px-6 opacity-0 transition-all duration-300 overflow-hidden text-slate-400"><p>{faq.answer}</p></div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7 }} className="mb-20 rounded-3xl bg-gradient-to-r from-[#84cc16] to-[#a3e635] px-8 py-20 text-center text-[#0f1419] shadow-2xl shadow-[#84cc16]/30">
          <h2 className="text-4xl font-bold sm:text-5xl mb-4">Start Your Transformation Today</h2>
          <p className="mx-auto max-w-2xl text-lg mb-8 opacity-90">Join thousands of members who've already transformed their bodies and built lasting health habits.</p>
          <Link to="/login" className="rounded-full bg-[#0f1419] px-10 py-4 text-lg font-bold text-[#84cc16] hover:text-white transition hover:bg-[#1a2428]">Get Started Now</Link>
        </motion.section>

        {/* Footer */}
        <footer className="rounded-3xl border border-[#84cc16]/30 bg-[#1a2428]/50 p-10 backdrop-blur">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#84cc16] text-sm font-bold text-[#0f1419]">🌿</div>
                <p className="text-xl font-bold text-white">TRANSFORM</p>
              </div>
              <p className="text-sm text-slate-400">Personalized meal plans for real transformations.</p>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold uppercase text-[#84cc16]">Company</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-[#84cc16] transition">About Us</a></li>
                <li><a href="#" className="hover:text-[#84cc16] transition">Careers</a></li>
                <li><a href="#" className="hover:text-[#84cc16] transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold uppercase text-[#84cc16]">Programs</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-[#84cc16] transition">Weight Loss</a></li>
                <li><a href="#" className="hover:text-[#84cc16] transition">Muscle Gain</a></li>
                <li><a href="#" className="hover:text-[#84cc16] transition">Diet Plans</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-sm font-bold uppercase text-[#84cc16]">Support</p>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-[#84cc16] transition">Help Center</a></li>
                <li><a href="#" className="hover:text-[#84cc16] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#84cc16] transition">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#84cc16]/20 pt-8 text-center text-sm text-slate-500">© 2026 Transform. All rights reserved.</div>
        </footer>

        {/* Floating QR Widget */}
        {!isNativeApp && (
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="fixed right-4 bottom-4 z-30 w-48 rounded-2xl border border-[#84cc16]/40 bg-[#1a2428]/95 p-3 shadow-2xl backdrop-blur-xl sm:right-6 sm:bottom-6">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-[#0f1419]/80 p-3 text-center border border-[#84cc16]/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#84cc16]">Open app</p>
              <p className="text-sm font-bold text-white">Scan to launch</p>
              <img className="h-16 w-16 rounded-lg bg-white p-1 shadow-lg" src={qrCodeUrl} alt="QR code" />
            </div>
            <a href={appDownloadUrl} className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#84cc16] to-[#a3e635] px-3 py-2 text-xs font-bold text-[#0f1419] transition hover:shadow-xl">Open the app</a>
          </motion.div>
        )}

        <section id="plans" className="mb-20">
          <div className="mb-12 text-center space-y-4">
            <h2 className="text-4xl font-bold text-white sm:text-5xl">Choose Your Plan</h2>
            <p className="mx-auto max-w-2xl text-slate-400">Select the perfect plan to start your transformation.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -12 }}
                className={`relative rounded-3xl border ${plan.popular ? 'border-[#84cc16]/60 bg-[#84cc16]/10' : 'border-[#84cc16]/30 bg-[#1a2428]/50'} p-8 backdrop-blur`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#84cc16] px-4 py-1 text-xs font-bold text-[#0f1419]">MOST POPULAR</span>
                  </div>
                )}
                <div className="mb-8">
                  <p className="text-xl font-bold text-white">{plan.name}</p>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-[#84cc16]">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                </div>
                <ul className="mb-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="text-[#84cc16] mt-1">✓</span>
                      <span className="text-slate-400">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/login"
                  className="w-full rounded-full border-2 border-[#84cc16]/40 bg-transparent px-6 py-4 text-sm font-bold text-[#84cc16] transition hover:border-[#84cc16]/80"
                >
                  Login to Buy
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default LandingPage
