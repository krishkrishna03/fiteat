const User = require('../models/User')
const Payment = require('../models/Payment')
const UserPlan = require('../models/UserPlan')
const Plan = require('../models/Plan')

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false })
      .select('-password')
      .populate('activePlans')
      .sort({ createdAt: -1 })

    res.json(users)
  } catch (error) {
    console.error('Get all users error:', error)
    res.status(500).json({ message: 'Error fetching users', error: error.message })
  }
}

// Get User Details with Plans
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select('-password')
      .populate('activePlans')
      .populate('paymentHistory')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const userPlans = await UserPlan.find({ userId: req.params.userId })
      .populate('planId')
      .sort({ createdAt: -1 })

    const payments = await Payment.find({ userId: req.params.userId })
      .populate('planId')
      .sort({ paymentDate: -1 })

    res.json({
      user,
      plans: userPlans,
      payments,
    })
  } catch (error) {
    console.error('Get user details error:', error)
    res.status(500).json({ message: 'Error fetching user details', error: error.message })
  }
}

// Get All Payments
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

// Get Dashboard Statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await User.countDocuments({ isAdmin: false })

    // Active subscriptions
    const activeSubscriptions = await UserPlan.countDocuments({ status: 'active' })

    // Total revenue
    const revenueData = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ])
    const totalRevenue = revenueData[0]?.total || 0

    // Total transactions
    const totalTransactions = await Payment.countDocuments({ status: 'completed' })

    // Revenue by plan
    const revenueByPlan = await Payment.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$planId',
          count: { $sum: 1 },
          revenue: { $sum: '$amount' },
        },
      },
      { $lookup: { from: 'plans', localField: '_id', foreignField: '_id', as: 'planDetails' } },
      { $unwind: { path: '$planDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          count: 1,
          revenue: 1,
          planName: '$planDetails.name',
        },
      },
    ])

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const newUsersLastMonth = await User.countDocuments({
      isAdmin: false,
      createdAt: { $gte: thirtyDaysAgo },
    })

    // Top plans
    const topPlans = await UserPlan.aggregate([
      {
        $group: {
          _id: '$planId',
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'plans', localField: '_id', foreignField: '_id', as: 'planDetails' } },
      { $unwind: '$planDetails' },
    ])

    // Recent transactions
    const recentTransactions = await Payment.find({ status: 'completed' })
      .populate('userId', 'name email')
      .populate('planId', 'name price')
      .sort({ paymentDate: -1 })
      .limit(10)

    res.json({
      stats: {
        totalUsers,
        activeSubscriptions,
        totalRevenue,
        totalTransactions,
        newUsersLastMonth,
      },
      revenueByPlan,
      topPlans,
      recentTransactions,
    })
  } catch (error) {
    console.error('Get dashboard stats error:', error)
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message })
  }
}

// Get User Analytics
exports.getUserAnalytics = async (req, res) => {
  try {
    // Users by goal
    const usersByGoal = await User.aggregate([
      { $match: { isAdmin: false } },
      { $group: { _id: '$goal', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // Active vs inactive users
    const activeUsers = await UserPlan.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$userId' } },
      { $count: 'total' },
    ])

    // Plans purchased
    const plansPurchased = await UserPlan.aggregate([
      { $group: { _id: '$planName', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])

    // User retention (returning customers)
    const returningCustomers = await Payment.aggregate([
      {
        $group: {
          _id: '$userId',
          transactionCount: { $sum: 1 },
        },
      },
      { $match: { transactionCount: { $gt: 1 } } },
      { $count: 'total' },
    ])

    res.json({
      usersByGoal,
      activeUsers: activeUsers[0]?.total || 0,
      plansPurchased,
      returningCustomers: returningCustomers[0]?.total || 0,
    })
  } catch (error) {
    console.error('Get user analytics error:', error)
    res.status(500).json({ message: 'Error fetching user analytics', error: error.message })
  }
}

// Delete User (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Delete associated plans and payments
    await UserPlan.deleteMany({ userId: req.params.userId })
    await Payment.deleteMany({ userId: req.params.userId })

    res.json({
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Delete user error:', error)
    res.status(500).json({ message: 'Error deleting user', error: error.message })
  }
}
