const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentController')
const { verifyToken } = require('../middleware/auth')

router.post('/create', verifyToken, paymentController.createPhonePePayment)
router.post('/create-order', verifyToken, paymentController.createPhonePePayment)
router.post('/webhook', paymentController.handlePhonePeWebhook)
router.get('/status/:transactionId', verifyToken, paymentController.checkPhonePeStatus)

module.exports = router
