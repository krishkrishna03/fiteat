const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const { verifyToken } = require('../middleware/auth')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/admin-login', authController.adminLogin)
router.get('/me', verifyToken, authController.getCurrentUser)
router.put('/me', verifyToken, authController.updateProfile)

module.exports = router
