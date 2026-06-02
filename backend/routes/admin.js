const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

router.use(verifyToken)
router.use(verifyAdmin)

router.get('/users', adminController.getAllUsers)
router.get('/users/:userId', adminController.getUserDetails)
router.get('/payments', adminController.getAllPayments)
router.get('/stats', adminController.getDashboardStats)
router.get('/analytics', adminController.getUserAnalytics)
router.delete('/users/:userId', adminController.deleteUser)

module.exports = router
