const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')
const authRoutes = require('./routes/auth')
const planRoutes = require('./routes/plans')
const userRoutes = require('./routes/user')
const adminRoutes = require('./routes/admin')
const paymentRoutes = require('./routes/payment')
const User = require('./models/User')
const Plan = require('./models/Plan')

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
app.use(cors())
app.use(
  express.json({
    verify: (req, res, buf) => {
      if (req.path === '/api/payment/webhook') {
        req.rawBody = buf.toString()
      }
    },
  }),
)
app.use(express.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/plans', planRoutes)
app.use('/api/user', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/payment', paymentRoutes)
app.use('/api/payments', paymentRoutes)
console.log('Mounted payment routes on /api/payment and /api/payments')

const distPath = path.join(__dirname, '..', 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next()
    }
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  console.warn('Frontend dist folder not found. Build the frontend with `npm run build` before starting the server.')
}

app.get('/', (req, res) => {
  res.send({ message: 'FitEat backend is running' })
})

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB connected')
    await ensureAdminUser()
    await seedDefaultPlans()
  } catch (error) {
    console.error('Database connection error:', error)
    process.exit(1)
  }
}

const ensureAdminUser = async () => {
  try {
    const existingAdmin = await User.findOne({ isAdmin: true })
    console.log('Checking for admin user:', existingAdmin ? 'found' : 'not found')
    if (!existingAdmin) {
      const admin = new User({
        name: 'Admin',
        email: 'admin@fittransform.com',
        password: 'Admin@123',
        gender: 'prefer-not-to-say',
        isAdmin: true,
      })
      const savedAdmin = await admin.save()
      console.log('Default admin user created - Email: admin@fittransform.com / Password: Admin@123')
      console.log('Admin user ID:', savedAdmin._id)
    } else {
      console.log('Admin user already exists')
    }
  } catch (error) {
    console.error('Error creating default admin user:', error)
  }
}

const seedDefaultPlans = async () => {
  try {
    const existing = await Plan.countDocuments()
    if (existing === 0) {
      const plans = [
        {
          name: 'Basic Plan',
          key: 'basic',
          price: 999,
          period: '/month',
          durationDays: 30,
          popular: false,
          features: ['Customized Diet Plan', 'Weekly Updates'],
          description: 'A strong nutrition foundation with weekly coaching and plan updates.',
        },
        {
          name: 'Premium Plan',
          key: 'premium',
          price: 2999,
          period: '/month',
          durationDays: 30,
          popular: true,
          features: ['Customized Diet Plan', 'Nutrition Coach Support', 'Weekly Progress Tracking'],
          description: 'Premium transformation support with dedicated coach attention and progress accountability.',
        },
      ]
      await Plan.insertMany(plans)
      console.log('Default plans seeded')
    }
  } catch (error) {
    console.error('Error seeding default plans:', error)
  }
}

const BASE_PORT = parseInt(process.env.PORT, 10) || 5000
const MAX_PORT = BASE_PORT + 5
let currentPort = BASE_PORT

const startServer = (port) => {
  const server = app.listen(port, () => {
    process.env.FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${port}`
    process.env.BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${port}`
    console.log(`Server listening on port ${port}`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (port < MAX_PORT) {
        const nextPort = port + 1
        console.warn(`Port ${port} is already in use. Trying port ${nextPort}...`)
        startServer(nextPort)
        return
      }
      console.error(`Port ${port} is already in use. Please stop the process using this port or set a different PORT.`)
    } else {
      console.error('Failed to start server:', err)
    }
    process.exit(1)
  })
}

connectDatabase().then(() => {
  startServer(currentPort)
})