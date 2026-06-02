const Payment = require('../models/Payment')
const UserPlan = require('../models/UserPlan')
const Plan = require('../models/Plan')
const User = require('../models/User')
const phonepeService = require('../services/phonepeService')

const normalizePlanKey = (value) => String(value || '').trim().toLowerCase()

const resolvePlan = async (planParam) => {
  const normalized = normalizePlanKey(planParam)
  let plan = await Plan.findOne({ key: normalized })
  if (!plan) {
    plan = await Plan.findOne({ name: new RegExp(`^${planParam}$`, 'i') })
  }
  return plan
}

const activateSubscription = async (payment, userPlan, plan) => {
  const now = new Date()
  const expiryDate = new Date(now)
  expiryDate.setDate(expiryDate.getDate() + (plan.durationDays || 30))

  await Payment.findByIdAndUpdate(payment._id, {
    paymentStatus: 'SUCCESS',
    paymentDate: now,
    webhookData: { ...payment.webhookData, activatedAt: now },
  })

  await UserPlan.findByIdAndUpdate(payment.userPlanId, {
    status: 'active',
    startDate: now,
    endDate: expiryDate,
    updatedAt: now,
  })

  await User.findByIdAndUpdate(payment.userId, {
    activePlan: plan.name,
    subscriptionStatus: 'ACTIVE',
    expiryDate,
    $addToSet: { activePlans: payment.userPlanId, paymentHistory: payment._id },
    updatedAt: now,
  })
}

const hasPurchasedWithinLast30Days = async (userId) => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setDate(oneMonthAgo.getDate() - 30)

  return UserPlan.exists({
    userId,
    createdAt: { $gte: oneMonthAgo },
    status: { $in: ['pending', 'active'] },
  })
}

// Purchase Plan
exports.purchasePlan = async (req, res) => {
  try {
    const { planId, paymentMethod } = req.body

    // Validate plan exists
    const plan = await Plan.findById(planId)
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' })
    }

    // Check if user already has active plan of same type
    const existingPlan = await UserPlan.findOne({
      userId: req.userId,
      planId: planId,
      status: 'active',
    })

    if (existingPlan) {
      return res.status(400).json({ message: 'You already have an active subscription to this plan' })
    }

    // Prevent more than one plan purchase within 30 days
    const hasRecentPurchase = await hasPurchasedWithinLast30Days(req.userId)
    if (hasRecentPurchase) {
      return res.status(400).json({
        message: 'You can only purchase one plan within a 30-day period. Please complete your current plan before buying another.',
      })
    }

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + (plan.durationDays || 30))

    // Create user plan first so we can correctly associate it with payment
    // Plan remains pending until payment verification completes
    const userPlan = new UserPlan({
      userId: req.userId,
      planId: planId,
      planName: plan.name,
      planPrice: plan.price,
      startDate,
      endDate,
      status: 'pending',
    })

    await userPlan.save()

    // Create payment record with a link back to the user plan
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const payment = new Payment({
      userId: req.userId,
      userPlanId: userPlan._id,
      planId: planId,
      amount: plan.price,
      transactionId,
      paymentMethod,
      status: 'pending', // pending until the gateway confirms
      description: `Purchase of ${plan.name}`,
    })

    await payment.save()

    // Link the payment back to the user plan (do not activate yet)
    userPlan.paymentId = payment._id
    await userPlan.save()

    // Return pending payment info to the client so it can show QR and poll for confirmation
    res.status(201).json({
      message: 'Payment initiated',
      userPlan,
      payment,
    })
  } catch (error) {
    console.error('Purchase plan error:', error)
    res.status(500).json({ message: 'Error purchasing plan', error: error.message })
  }
}

// Create PhonePe payment session and pending Payment + UserPlan
exports.createPhonePePayment = async (req, res) => {
  try {
    const { plan, amount, planId } = req.body
    const requestedPlan = plan || planId

    if (!requestedPlan || !amount) {
      return res.status(400).json({ message: 'Plan and amount are required.' })
    }

    const selectedPlan = await resolvePlan(requestedPlan)
    if (!selectedPlan) {
      return res.status(404).json({ message: 'Selected plan not found.' })
    }

    const expectedAmount = Number(selectedPlan.price)
    if (Number(amount) !== expectedAmount) {
      return res.status(400).json({ message: 'The amount does not match the selected plan price.' })
    }

    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'Authenticated user not found.' })
    }

    const hasRecentPurchase = await hasPurchasedWithinLast30Days(req.userId)
    if (hasRecentPurchase) {
      return res.status(400).json({
        message: 'You can only purchase one plan within a 30-day period. Please complete your current plan before buying another.',
      })
    }

    const transactionId = `TXN_${Date.now()}`
    const startDate = new Date()
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + (selectedPlan.durationDays || 30))

    const userPlan = new UserPlan({
      userId: req.userId,
      planId: selectedPlan._id,
      planName: selectedPlan.name,
      planPrice: expectedAmount,
      startDate,
      endDate,
      status: 'pending',
    })
    await userPlan.save()

    const payment = new Payment({
      userId: req.userId,
      userPlanId: userPlan._id,
      planId: selectedPlan._id,
      plan: selectedPlan.name,
      amount: expectedAmount,
      transactionId,
      paymentStatus: 'PENDING',
      description: `PhonePe checkout for ${selectedPlan.name}`,
      webhookData: {
        customer: {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
      },
    })
    await payment.save()

    userPlan.paymentId = payment._id
    await userPlan.save()

    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success?transactionId=${transactionId}`
    const callbackUrl = `${process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`}/api/payment/webhook`
    const checkoutUrl = await phonepeService.createCheckoutSession({
      transactionId,
      amount: expectedAmount,
      plan: selectedPlan.name,
      customer: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
      redirectUrl,
      callbackUrl,
    })

    payment.phonePeCheckoutUrl = checkoutUrl
    await payment.save()

    res.status(201).json({
      message: 'PhonePe checkout created',
      checkoutUrl,
      transactionId,
      paymentId: payment._id,
      amount: payment.amount,
      plan: payment.plan,
    })
  } catch (error) {
    console.error('Create PhonePe payment error:', error)
    res.status(500).json({ message: error.message || 'Error creating PhonePe payment' })
  }
}

exports.handlePhonePeWebhook = async (req, res) => {
  try {
    const signature =
      req.headers['x-phonepe-signature'] || req.headers['x-verify'] || req.headers['x-phonepe-verify'] || req.headers['x-signature']
    const rawBody = req.rawBody || JSON.stringify(req.body)

    if (!signature || !phonepeService.verifyWebhookSignature(rawBody, signature)) {
      return res.status(400).json({ message: 'Invalid PhonePe webhook signature' })
    }

    const event = req.body
    const payload = event.data || event
    const transactionId = payload.merchantTransactionId || payload.transactionId || event.transactionId
    const state = String(payload.state || payload.status || event.status || '').toUpperCase()

    if (!transactionId) {
      return res.status(400).json({ message: 'Webhook is missing transactionId' })
    }

    const payment = await Payment.findOne({ transactionId })
    if (!payment) {
      return res.status(404).json({ message: 'Payment record not found' })
    }

    payment.webhookData = { ...payment.webhookData, webhookEvent: event }
    await payment.save()

    const planRecord = await Plan.findById(payment.planId)

    if (['COMPLETED', 'SUCCESS', 'TRANSACTION_SUCCESS'].includes(state)) {
      await activateSubscription(payment, await UserPlan.findById(payment.userPlanId), planRecord || { name: payment.plan, durationDays: 30 })
      return res.json({ message: 'Payment verified and subscription activated' })
    }

    if (['FAILED', 'ERROR', 'DECLINED', 'CANCELLED'].includes(state)) {
      await Payment.findByIdAndUpdate(payment._id, { paymentStatus: 'FAILED', webhookData: payment.webhookData })
      return res.json({ message: 'Payment failed through PhonePe webhook' })
    }

    res.json({ message: 'Webhook received', state })
  } catch (error) {
    console.error('PhonePe webhook error:', error)
    res.status(500).json({ message: error.message || 'Error processing PhonePe webhook' })
  }
}

exports.checkPhonePeStatus = async (req, res) => {
  try {
    const { transactionId } = req.params
    if (!transactionId) {
      return res.status(400).json({ message: 'transactionId is required' })
    }

    const payment = await Payment.findOne({ transactionId })
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    if (payment.paymentStatus === 'SUCCESS') {
      return res.json(payment)
    }

    const statusResponse = await phonepeService.fetchPaymentStatus(transactionId)
    const state = String(statusResponse?.data?.state || statusResponse?.state || statusResponse?.status || '').toUpperCase()

    if (['COMPLETED', 'SUCCESS', 'TRANSACTION_SUCCESS'].includes(state)) {
      const planRecord = await Plan.findById(payment.planId)
      await activateSubscription(payment, await UserPlan.findById(payment.userPlanId), planRecord || { name: payment.plan, durationDays: 30 })
      const updated = await Payment.findById(payment._id)
      return res.json(updated)
    }

    if (['FAILED', 'ERROR', 'DECLINED', 'CANCELLED'].includes(state)) {
      await Payment.findByIdAndUpdate(payment._id, { paymentStatus: 'FAILED' })
      return res.status(402).json({ message: 'Payment failed', payment })
    }

    res.json({ message: 'Payment pending', payment })
  } catch (error) {
    console.error('Check PhonePe status error:', error)
    res.status(500).json({ message: error.message || 'Error checking PhonePe payment status' })
  }
}

// Verify Payment (polling endpoint)
exports.verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.body
    if (!transactionId) {
      return res.status(400).json({ message: 'transactionId is required' })
    }

    const payment = await Payment.findOne({ transactionId })
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' })
    }

    // If already completed, return success
    if (payment.status === 'completed') {
      const userPlan = await UserPlan.findById(payment.userPlanId)
      return res.json({ status: 'completed', payment, userPlan })
    }

    // TODO: Call NAZA payment gateway API here to verify the transaction using
    // process.env.NAZA_API_KEY and the gateway's verification endpoint.
    // For now we simulate verification: to mark as completed, an external
    // system would call a webhook or NAZA would return success when polled.

    // Simulate: if payment has existed for >2 seconds assume completed (dev only)
    const ageMs = Date.now() - new Date(payment.createdAt).getTime()
    if (ageMs > 2000) {
      payment.status = 'completed'
      await payment.save()

      // Activate the user plan and attach payment to user's records
      await UserPlan.findByIdAndUpdate(payment.userPlanId, { status: 'active' })
      await User.findByIdAndUpdate(payment.userId, {
        $push: { activePlans: payment.userPlanId, paymentHistory: payment._id },
      })

      const userPlan = await UserPlan.findById(payment.userPlanId)
      return res.json({ status: 'completed', payment, userPlan })
    }

    return res.json({ status: 'pending', payment })
  } catch (error) {
    console.error('Verify payment error:', error)
    res.status(500).json({ message: 'Error verifying payment', error: error.message })
  }
}

// Cancel Plan
exports.cancelPlan = async (req, res) => {
  try {
    const { userPlanId } = req.body

    const userPlan = await UserPlan.findByIdAndUpdate(
      userPlanId,
      {
        status: 'cancelled',
        updatedAt: Date.now(),
      },
      { new: true }
    )

    if (!userPlan) {
      return res.status(404).json({ message: 'User plan not found' })
    }

    // Remove from active plans
    await User.findByIdAndUpdate(req.userId, {
      $pull: { activePlans: userPlanId },
    })

    res.json({
      message: 'Plan cancelled successfully',
      userPlan,
    })
  } catch (error) {
    console.error('Cancel plan error:', error)
    res.status(500).json({ message: 'Error cancelling plan', error: error.message })
  }
}

// Get User's Payment History
exports.getUserPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.userId })
      .populate('planId')
      .sort({ paymentDate: -1 })

    res.json(payments)
  } catch (error) {
    console.error('Get payment history error:', error)
    res.status(500).json({ message: 'Error fetching payment history', error: error.message })
  }
}

// Get All Payments (Admin only)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'name email')
      .populate('planId', 'name price')
      .sort({ paymentDate: -1 })

    res.json(payments)
  } catch (error) {
    console.error('Get all payments error:', error)
    res.status(500).json({ message: 'Error fetching payments', error: error.message })
  }
}

// Get Payment Statistics (Admin only)
exports.getPaymentStats = async (req, res) => {
  try {
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])

    const transactionCount = await Payment.countDocuments({ status: 'completed' })

    const revenueByPlan = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$planId',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $lookup: { from: 'plans', localField: '_id', foreignField: '_id', as: 'plan' } },
      { $unwind: '$plan' },
    ])

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      transactionCount,
      revenueByPlan,
    })
  } catch (error) {
    console.error('Get payment stats error:', error)
    res.status(500).json({ message: 'Error fetching payment stats', error: error.message })
  }
}
