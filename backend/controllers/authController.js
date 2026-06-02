const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, dob, location, address, age, weight, height, gender = 'prefer-not-to-say' } = req.body

    // Validation
    if (!name || !email || !password || !confirmPassword || !phone || !dob || !location || !address || !age || !weight || !height) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' })
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
      dob,
      location,
      address,
      age,
      weight,
      height,
      gender,
    })

    await user.save()

    const token = generateToken(user._id)

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        subscriptionStatus: user.subscriptionStatus,
        expiryDate: user.expiryDate,
        activePlan: user.activePlan,
        dob: user.dob,
        location: user.location,
        address: user.address,
        age: user.age,
        weight: user.weight,
        height: user.height,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Error registering user', error: error.message })
  }
}

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Compare passwords
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        subscriptionStatus: user.subscriptionStatus,
        expiryDate: user.expiryDate,
        activePlan: user.activePlan,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        subscriptionStatus: user.subscriptionStatus,
        expiryDate: user.expiryDate,
        activePlan: user.activePlan,
        dob: user.dob,
        location: user.location,
        address: user.address,
        age: user.age,
        weight: user.weight,
        height: user.height,
        goal: user.goal,
        gender: user.gender,
        dietaryPreferences: user.dietaryPreferences,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(500).json({ message: 'Error fetching user', error: error.message })
  }
}

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, goal, age, gender, dietaryPreferences } = req.body

    const updateData = {
      name,
      phone,
      goal,
      age,
      dietaryPreferences,
      updatedAt: Date.now(),
    }

    if (gender !== undefined) {
      updateData.gender = gender
    }

    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    res.json({
      message: 'Profile updated successfully',
      user,
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Error updating profile', error: error.message })
  }
}

// Admin Login (same as regular login but checks isAdmin flag)
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    const user = await User.findOne({ email })
    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    const token = generateToken(user._id)

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ message: 'Error logging in', error: error.message })
  }
}
