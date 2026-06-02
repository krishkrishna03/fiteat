const jwt = require('jsonwebtoken')

// Verify JWT Token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    next()
  } catch (error) {
    console.error('Token verification error:', error)
    return res.status(401).json({ message: 'Invalid token', error: error.message })
  }
}

// Verify Admin
const verifyAdmin = async (req, res, next) => {
  try {
    const User = require('../models/User')
    const user = await User.findById(req.userId)

    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' })
    }

    next()
  } catch (error) {
    console.error('Admin verification error:', error)
    return res.status(500).json({ message: 'Error verifying admin', error: error.message })
  }
}

module.exports = { verifyToken, verifyAdmin }
