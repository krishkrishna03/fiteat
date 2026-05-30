import { useState } from 'react'
import { motion } from 'framer-motion'
import './App.css'

const benefitCards = [
  {
    title: 'Personalized Plans',
    description: 'AI-assisted customized nutrition plans built for your body, goals, and lifestyle.',
    imageQuery: 'healthy nutrition plan',
  },
  {
    title: 'Expert Coaches',
    description: 'Certified nutrition and fitness experts guide your transformation every step.',
    imageQuery: 'fitness coach coaching',
  },
  {
    title: 'Flexible Diets',
    description: 'Vegetarian, Vegan, Keto, High Protein, Indian and more tailored diet journeys.',
    imageQuery: 'healthy meal variety',
  },
  {
    title: 'Easy Tracking',
    description: 'Track meals, macros, and progress with an intuitive dashboard.',
    imageQuery: 'nutrition tracking app',
  },
  {
    title: 'Sustainable Results',
    description: 'Built to deliver long-term behavioral change, not temporary fixes.',
    imageQuery: 'healthy lifestyle success',
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

const coachCarousel = [...coaches, ...coaches]

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
const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=380x380&data=${encodeURIComponent(appDownloadUrl)}&bgcolor=FFFFFF&color=1E7C31&format=png`

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

function App() {
  const [activeFAQ, setActiveFAQ] = useState(0)
  const [selectedPlan, setSelectedPlan] = useState<'diet' | 'delivery' | 'premium'>('delivery')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] selection:bg-[var(--color-secondary)]/20 selection:text-[var(--color-card)]">
      <div className="mx-auto max-w-[1400px] px-6 py-8 sm:px-8 lg:px-10">
        <div className="mb-8 rounded-[2rem] border border-[#D1FAE5] bg-[var(--color-card)] p-6 shadow-sm shadow-slate-200/30">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--color-secondary)]">Transform</p>
              <p className="text-2xl font-semibold text-[var(--color-text)]">Nutrition that fits your life</p>
            </div>
            <nav className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text)]">
              <a href="#why" className="transition hover:text-[var(--color-primary)]">Why</a>
              <a href="#coaches" className="transition hover:text-[var(--color-primary)]">Coaches</a>
              <a href="#plans" className="transition hover:text-[var(--color-primary)]">Plans</a>
              <a href="#contact" className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-white transition hover:bg-[var(--color-secondary)]">Contact</a>
            </nav>
          </div>
        </div>

        <motion.header
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-[2.5rem] border border-[#D1FAE5] bg-[var(--color-card)] p-8 shadow-glow lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-12"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <video
              className="absolute inset-0 h-full w-full object-cover opacity-30 [mask-image:linear-gradient(180deg,rgba(255,255,255,1),rgba(255,255,255,0.12))]"
              autoPlay
              muted
              loop
              playsInline
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E6F8ED]/80 to-[var(--color-card)]" />
          </div>
          <div className="relative z-10 space-y-8 lg:max-w-xl">
            <span className="inline-flex rounded-full bg-[#DCFCE7] px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Available on Android & iOS
            </span>
            <div className="space-y-6">
              <h1 className="text-5xl font-semibold leading-[0.96] tracking-[-0.045em] text-[var(--color-text)] sm:text-6xl lg:text-7xl">
                Transform Your Body with Personalized Nutrition
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
                Custom diet plans designed by expert coaches based on your goals, lifestyle, food preferences, and health needs.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#plans" className="rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981] px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-[#22C55E]/20 transition hover:-translate-y-0.5">
                Start Your Transformation
              </a>
              <a href="#offering" className="rounded-full border border-[#D1FAE5] bg-[var(--color-card)] px-8 py-4 text-sm font-semibold text-[var(--color-text)] transition hover:bg-[#ECFDF5]">
                View Plans
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[
                { value: '50,000+', label: 'Transformations' },
                { value: '98%', label: 'Satisfaction' },
                { value: '500+', label: 'Coaches' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-3xl border border-[#DCFCE7] bg-[#F8FEF5] p-5 backdrop-blur-xl">
                  <p className="text-3xl font-semibold text-[var(--color-text)]">{stat.value}</p>
                  <p className="mt-2 text-sm text-[var(--color-muted)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 lg:mt-0">
            <img
              className="w-full rounded-[2rem] object-cover shadow-xl shadow-[#22C55E]/10"
              src="image1.jpg"
              alt="Healthy coaching and nutrition"
            />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.18),_transparent_30%)]" />
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#DCFCE7] blur-3xl" />

          <div className="pointer-events-none absolute inset-x-0 bottom-12 flex justify-center lg:bottom-10">
            <div className="hidden rounded-full border border-[#DCFCE7] bg-[#F8FEF5] px-4 py-3 text-sm text-[var(--color-text)] backdrop-blur-xl lg:flex">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--color-primary)]" />
              Scroll for the full Transform experience
            </div>
          </div>
        </motion.header>

        <motion.section
          id="why"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mt-16 grid gap-10"
        >
          <div className="space-y-4">
            <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-secondary)]">Why Thousands Choose Transform</span>
            <h2 className="text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">Why thousands choose Transform</h2>
            <p className="max-w-3xl text-[var(--color-muted)]">An elite nutrition system that merges premium coaching, science-backed meal plans, and flexible diet approaches for lasting results.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {benefitCards.map((card, index) => (
              <motion.div
                key={card.title}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                className="group relative overflow-hidden rounded-[2rem] border border-[#DCFCE7] bg-white/90 p-8 shadow-xl shadow-[#22C55E]/10"
                style={{
                  backgroundImage: `linear-gradient(rgba(255,255,255,0.94), rgba(255,255,255,0.94)), url('https://source.unsplash.com/random/640x480?${encodeURIComponent(card.imageQuery)}&sig=${index}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white/90 opacity-95" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#DCFCE7] text-[#10B981] ring-1 ring-[#DCFCE7]">
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-semibold text-slate-900">{card.title}</h3>
                  <p className="mt-4 text-slate-600">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="coaches"
          className="mt-24 overflow-hidden rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] p-8 shadow-glow backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-secondary)]">Meet Our Transform Coaches</span>
              <h2 className="mt-3 text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">Meet Our Transform Coaches</h2>
            </div>
            <div id="contact" className="rounded-[2rem] border border-[#DCFCE7] bg-[#F8FEF5] p-6 text-[var(--color-text)] shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-[var(--color-secondary)]">Need help now?</p>
              <p className="mt-3 text-2xl font-semibold">9876543210</p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">Call or message us to get matched with the right coach.</p>
            </div>
            <p className="max-w-xl text-slate-600 lg:col-span-2">Discover the coaches who build career-worthy nutrition plans and transform how you eat, recover, and feel.</p>
          </div>

          <div className="relative overflow-hidden pb-4">
            <div className="coach-track flex gap-5 py-4">
              {coachCarousel.map((coach, index) => (
                <motion.article
                  key={`${coach.name}-${index}`}
                  whileHover={{ y: -8 }}
                  className="min-w-[320px] rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] p-6 shadow-xl shadow-[#22C55E]/10 transition duration-300 hover:border-[#10B981]/30"
                >
                  <div className="mb-6 overflow-hidden rounded-[1.75rem] bg-[#F8FEF5]">
                    <img
                      className="h-48 w-full object-cover"
                      src={coach.imagePath}
                      alt={`${coach.name} profile`}
                    />
                  </div>
                  <div className="space-y-3 text-slate-700">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#DCFCE7] text-2xl font-semibold text-[#10B981]">{coach.name.charAt(0)}</div>
                      <div>
                        <p className="text-lg font-semibold text-slate-900">{coach.name}</p>
                        <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{coach.role}</p>
                      </div>
                    </div>
                    <p className="text-slate-700">{coach.experience} experience</p>
                    <p className="text-slate-700">Success Rate <span className="font-semibold text-slate-900">{coach.success}</span></p>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="members"
          className="mt-24 overflow-hidden rounded-[2rem] border border-[#DCFCE7] bg-[#F8FEF5] p-8 shadow-glow backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-6">
              <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-secondary)]">Real Members. Real Results.</span>
              <h2 className="max-w-3xl text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">Members who built lasting health with simple, sustainable coaching.</h2>
              <p className="max-w-2xl text-[var(--color-muted)]">These video stories show the kind of progress our members achieve when they follow plans built around their habits, tastes, and goals.</p>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { value: '98%', label: 'Retention' },
                  { value: '12 wk', label: 'Average plan' },
                  { value: '4.9/5', label: 'Coach rating' },
                ].map((metric) => (
                  <div key={metric.label} className="rounded-[2rem] bg-white p-6 text-center shadow-sm shadow-slate-950/5">
                    <p className="text-3xl font-semibold text-[var(--color-primary)]">{metric.value}</p>
                    <p className="mt-3 text-sm uppercase tracking-[0.24em] text-[var(--color-muted)]">{metric.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {stories.map((story, index) => (
                <motion.div
                  key={story.name}
                  whileHover={{ y: -8 }}
                  className="group overflow-hidden rounded-[2rem] border border-white bg-white p-6 shadow-sm shadow-slate-900/5 transition duration-300 hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-secondary)]">{story.name}</p>
                      <p className="text-base font-semibold text-[var(--color-text)]">{story.duration} · {story.loss} lost</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#DCFCE7]/20 text-lg font-semibold text-[var(--color-primary)]">{index + 1}</div>
                  </div>

                  <div className="mt-5 overflow-hidden rounded-[1.75rem] bg-[#ECFDF5]">
                    {activeVideo === story.video ? (
                      <video className="h-56 w-full object-cover" controls autoPlay src={story.video} />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveVideo(story.video)}
                        className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#ECFDF5] text-left"
                      >
                        <img src={story.poster} alt={`${story.name} story`} className="h-full w-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/10 transition-opacity duration-300 hover:bg-slate-950/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="flex items-center gap-3 rounded-full bg-white/95 px-4 py-2 text-[var(--color-primary)] shadow-lg shadow-slate-950/10">
                            <span className="text-xl">▶</span>
                            <span className="text-sm font-semibold">Play story</span>
                          </div>
                        </div>
                      </button>
                    )}
                  </div>

                  <p className="mt-5 text-sm leading-6 text-[var(--color-text)]">{story.text}</p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full bg-[#DCFCE7]/70 px-3 py-2 text-xs font-semibold text-[var(--color-primary)]">Real coach support</span>
                    <span className="rounded-full bg-[#DCFCE7]/70 px-3 py-2 text-xs font-semibold text-[var(--color-primary)]">Sustainable habits</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          id="offering"
          className="mt-24 rounded-[2rem] border border-[#DCFCE7] bg-[#F8FEF5] p-10 shadow-glow backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-10 space-y-4">
            <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-secondary)]">Everything You Need To Transform</span>
            <h2 className="text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">Everything You Need To Transform</h2>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {offerings.map((item) => (
              <motion.div
                key={item.title}
                whileHover={{ scale: 1.02 }}
                className="rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] p-8 shadow-xl shadow-[#22C55E]/10"
              >
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-[#DCFCE7] text-2xl text-[#10B981]">
                  ✓
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-4 text-slate-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-24 rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] p-10 shadow-glow backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="mb-10 space-y-4">
            <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-secondary)]">Science-Backed Nutrition That Delivers Results</span>
            <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Why Our Product Works</h2>
          </div>
          <div className="overflow-hidden rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] shadow-sm">
            <div className="grid grid-cols-3 gap-0 border-b border-[#DCFCE7] bg-[#F8FEF5] px-6 py-5 text-[var(--color-muted)] md:grid-cols-[1.6fr_1fr_1fr]">
              <div className="font-semibold text-slate-900">Feature</div>
              <div className="font-semibold text-slate-900 text-center">Transform</div>
              <div className="font-semibold text-slate-900 text-center">Generic Plan</div>
            </div>
            {comparisonRows.map((row, index) => (
              <div key={row} className={`grid grid-cols-3 gap-0 px-6 py-5 text-sm ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8FEF5]'} md:grid-cols-[1.6fr_1fr_1fr]`}>
                <div className="font-medium text-[var(--color-text)]">{row}</div>
                <div className="flex items-center justify-center text-[var(--color-primary)]">✓</div>
                <div className="flex items-center justify-center text-slate-400">×</div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="plans"
          className="mt-24 grid gap-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="space-y-4">
            <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-secondary)]">Choose Your Transformation Plan</span>
            <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl">Choose Your Transformation Plan</h2>
          </div>
          <div className="grid gap-6 xl:grid-cols-3">
            {[
              {
                name: 'Diet Plan Only',
                price: '₹999/month',
                features: ['Personalized Diet Plan', 'Weekly Updates', 'Coach Consultation', 'Progress Tracking'],
                key: 'diet' as const,
              },
              {
                name: 'Diet + Food Delivery',
                price: '₹2999/month',
                features: ['Customized Diet Plan', 'Fresh Healthy Meals', 'Daily Delivery', 'Dedicated Coach', 'Weekly Monitoring'],
                key: 'delivery' as const,
              },
              {
                name: 'Premium Transformation',
                price: '₹4999/month',
                features: ['Everything Included', 'Priority Coach', 'Video Consultations', 'Advanced Tracking', 'Exclusive Content'],
                key: 'premium' as const,
              },
            ].map((plan) => (
              <motion.div
                key={plan.name}
                whileHover={{ y: -12 }}
                className={`rounded-[2rem] border ${selectedPlan === plan.key ? 'border-[#22C55E]/60 bg-[#F8FEF5] shadow-glow' : 'border-[#DCFCE7] bg-[var(--color-card)]'} p-8 transition`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{plan.name}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{plan.price}</p>
                  </div>
                  {selectedPlan === plan.key && <span className="rounded-full bg-[#DCFCE7] px-4 py-2 text-sm text-[var(--color-secondary)]">Most popular</span>}
                </div>
                <ul className="mt-8 space-y-3 text-slate-700">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-2xl bg-[#DCFCE7] text-sm text-[#10B981]">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan.key)}
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981] px-6 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5"
                >
                  Select Plan
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-24 rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] p-10 shadow-glow backdrop-blur-xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="space-y-5">
            <span className="text-sm uppercase tracking-[0.28em] text-[var(--color-secondary)]">Frequently Asked Questions</span>
            <h2 className="text-4xl font-semibold text-[var(--color-text)] sm:text-5xl">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={faq.question} className="overflow-hidden rounded-[1.75rem] border border-[#DCFCE7] bg-[var(--color-card)]">
                <button
                  type="button"
                  onClick={() => setActiveFAQ(index === activeFAQ ? -1 : index)}
                  className="flex w-full items-center justify-between gap-6 px-6 py-6 text-left text-lg font-semibold text-slate-900"
                >
                  {faq.question}
                  <span className="text-[var(--color-secondary)]">{activeFAQ === index ? '−' : '+'}</span>
                </button>
                <div className={`${activeFAQ === index ? 'max-h-96 p-6 opacity-100' : 'max-h-0 px-6 opacity-0'} transition-all duration-300 overflow-hidden text-slate-600`}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="mt-24 rounded-[2.5rem] bg-gradient-to-r from-[#22C55E] via-[#10B981] to-[#22C55E] px-8 py-16 text-center text-white shadow-glow"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="text-sm uppercase tracking-[0.28em] text-white/80">Final CTA</p>
          <h2 className="mt-4 text-5xl font-semibold tracking-[-0.05em] sm:text-6xl">Start Your Transformation Today</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">Join Transform now and unlock personalized nutrition, dedicated coaching, and measurable progress with premium support.</p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <a href="#plans" className="rounded-full bg-[var(--color-primary)] px-10 py-4 text-sm font-semibold text-white shadow-xl shadow-[#22C55E]/20 transition hover:-translate-y-0.5">Get Started</a>
          </div>
        </motion.section>

        <footer className="mt-24 grid gap-10 rounded-[2.5rem] border border-[#DCFCE7] bg-[var(--color-card)] p-10 text-[var(--color-muted)] shadow-glow backdrop-blur-xl sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <p className="text-2xl font-semibold text-slate-900">Transform</p>
            <p className="text-sm text-slate-600">Personalized diet plans and meal coaching for premium fitness transformations.</p>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F8FEF5] text-[var(--color-primary)]">I</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F8FEF5] text-[var(--color-primary)]">F</span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F8FEF5] text-[var(--color-primary)]">T</span>
            </div>
          </div>
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[var(--color-secondary)]">Company</p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[var(--color-secondary)]">Programs</p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#">Weight Loss</a></li>
              <li><a href="#">Muscle Gain</a></li>
              <li><a href="#">Diet Plans</a></li>
            </ul>
          </div>
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.24em] text-[var(--color-secondary)]">Support</p>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#">Help Center</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
          <div className="lg:col-span-4">
            <div className="mt-8 rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] p-6 text-[var(--color-text)]">
              <p className="font-semibold">Subscribe for premium updates</p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input className="w-full rounded-3xl border border-[#DCFCE7] bg-[#F8FEF5] px-4 py-3 text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]" placeholder="Email address" type="email" />
                <button className="rounded-3xl bg-[var(--color-primary)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-secondary)]">Subscribe</button>
              </div>
            </div>
          </div>
          <div className="lg:col-span-4 border-t border-[#DCFCE7] pt-6 text-center text-sm text-[var(--color-muted)]">© 2026 Transform. All rights reserved.</div>
        </footer>
      </div>
      <div className="fixed right-4 bottom-4 z-30 w-72 rounded-[2rem] border border-[#DCFCE7] bg-[var(--color-card)] p-4 shadow-2xl shadow-slate-900/10 sm:right-6 sm:bottom-6 sm:w-80">
        <div className="flex flex-col items-center gap-3 rounded-[1.75rem] bg-[#F8FEF5] p-4 text-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-secondary)]">Open app</p>
            <p className="mt-2 text-lg font-semibold text-[var(--color-text)]">Scan to launch</p>
          </div>
          <img className="h-20 w-20 rounded-2xl bg-white p-2 shadow-sm" src={qrCodeUrl} alt="Permanent QR code" />
        </div>
        <a href={appDownloadUrl} className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#22C55E] to-[#10B981] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
          Open the app
        </a>
      </div>
    </div>
  )
}

export default App
