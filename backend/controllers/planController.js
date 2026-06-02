const mongoose = require('mongoose')
const Plan = require('../models/Plan')
const UserPlan = require('../models/UserPlan')
const Payment = require('../models/Payment')
const User = require('../models/User')

// Get All Plans
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find()
    res.json(plans)
  } catch (error) {
    console.error('Get plans error:', error)
    res.status(500).json({ message: 'Error fetching plans', error: error.message })
  }
}

// Get Plan by ID
exports.getPlanById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid plan ID' })
    }

    const plan = await Plan.findById(req.params.id)
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' })
    }
    res.json(plan)
  } catch (error) {
    console.error('Get plan error:', error)
    res.status(500).json({ message: 'Error fetching plan', error: error.message })
  }
}

// Create Plan (Admin only)
exports.createPlan = async (req, res) => {
  try {
    const { name, key, price, period, features, popular, description, durationDays } = req.body

    const plan = new Plan({
      name,
      key,
      price,
      period,
      features,
      popular,
      description,
      durationDays,
    })

    await plan.save()
    res.status(201).json({
      message: 'Plan created successfully',
      plan,
    })
  } catch (error) {
    console.error('Create plan error:', error)
    res.status(500).json({ message: 'Error creating plan', error: error.message })
  }
}

// Update Plan (Admin only)
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' })
    }
    res.json({
      message: 'Plan updated successfully',
      plan,
    })
  } catch (error) {
    console.error('Update plan error:', error)
    res.status(500).json({ message: 'Error updating plan', error: error.message })
  }
}

// Delete Plan (Admin only)
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id)
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' })
    }
    res.json({
      message: 'Plan deleted successfully',
    })
  } catch (error) {
    console.error('Delete plan error:', error)
    res.status(500).json({ message: 'Error deleting plan', error: error.message })
  }
}

// Get User's Active Plans
exports.getUserPlans = async (req, res) => {
  try {
    const userPlans = await UserPlan.find({
      userId: req.userId,
      status: 'active',
    })
      .populate('planId')
      .sort({ createdAt: -1 })

    res.json(userPlans)
  } catch (error) {
    console.error('Get user plans error:', error)
    res.status(500).json({ message: 'Error fetching user plans', error: error.message })
  }
}

// Get User's All Plans (including expired)
exports.getUserAllPlans = async (req, res) => {
  try {
    const userPlans = await UserPlan.find({ userId: req.userId })
      .populate('planId')
      .sort({ createdAt: -1 })

    res.json(userPlans)
  } catch (error) {
    console.error('Get user all plans error:', error)
    res.status(500).json({ message: 'Error fetching user plans', error: error.message })
  }
}
