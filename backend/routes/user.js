const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const planController = require('../controllers/planController')
const paymentController = require('../controllers/paymentController')
const { verifyToken } = require('../middleware/auth')

router.get('/profile', verifyToken, authController.getCurrentUser)
router.put('/profile', verifyToken, authController.updateProfile)
router.get('/plans', verifyToken, planController.getUserAllPlans)
router.get('/payments', verifyToken, paymentController.getUserPaymentHistory)

module.exports = router
