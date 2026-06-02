const express = require('express')
const router = express.Router()
const planController = require('../controllers/planController')
const paymentController = require('../controllers/paymentController')
const { verifyToken, verifyAdmin } = require('../middleware/auth')

router.get('/', planController.getAllPlans)
router.post('/purchase', verifyToken, paymentController.purchasePlan)
router.get('/my', verifyToken, planController.getUserAllPlans)
router.get('/my/active', verifyToken, planController.getUserPlans)
router.get('/my/payments', verifyToken, paymentController.getUserPaymentHistory)

router.get('/:id', planController.getPlanById)
router.post('/', verifyToken, verifyAdmin, planController.createPlan)
router.put('/:id', verifyToken, verifyAdmin, planController.updatePlan)
router.delete('/:id', verifyToken, verifyAdmin, planController.deletePlan)

module.exports = router
