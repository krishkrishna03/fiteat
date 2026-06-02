const axios = require('axios')
const crypto = require('crypto')

const PHONEPE_BASE_URL = process.env.PHONEPE_BASE_URL || 'https://sandbox.phonepe.com'
const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
const MERCHANT_KEY = process.env.PHONEPE_MERCHANT_KEY

const buildSignature = (payload) => {
  if (!MERCHANT_KEY) {
    throw new Error('PHONEPE_MERCHANT_KEY is not configured')
  }
  const serialized = JSON.stringify(payload)
  return crypto.createHmac('sha256', MERCHANT_KEY).update(serialized).digest('hex')
}

const buildHeaders = (payload) => ({
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-VERIFY': buildSignature(payload),
  'X-MERCHANT-ID': MERCHANT_ID || '',
})

const createCheckoutSession = async ({ transactionId, amount, plan, customer, redirectUrl, callbackUrl }) => {
  if (!MERCHANT_ID || !MERCHANT_KEY) {
    throw new Error(
      'PhonePe is not configured. Set PHONEPE_MERCHANT_ID and PHONEPE_MERCHANT_KEY in backend/.env to enable PhonePe payments.'
    )
  }

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
    transactionAmount: {
      value: amount,
      currency: 'INR',
    },
    redirectUrl,
    callbackUrl,
    merchantOrderId: transactionId,
    description: `${plan} subscription payment`,
    customer: {
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    },
  }

  const response = await axios.post(
    `${PHONEPE_BASE_URL}/apis/hermes/payment/initiate`,
    payload,
    {
      headers: buildHeaders(payload),
      timeout: 20000,
    },
  )

  if (!response.data || !response.data.data || !response.data.data.checkoutUrl) {
    throw new Error(response.data?.message || 'Unable to initiate PhonePe checkout')
  }

  return response.data.data.checkoutUrl
}

const fetchPaymentStatus = async (transactionId) => {
  if (!MERCHANT_ID || !MERCHANT_KEY) {
    console.warn('PhonePe environment variables are missing. Using local pending fallback for payment status.')
    return { data: { state: 'PENDING' } }
  }

  const payload = {
    merchantId: MERCHANT_ID,
    merchantTransactionId: transactionId,
  }

  const response = await axios.post(
    `${PHONEPE_BASE_URL}/apis/hermes/payment/status`,
    payload,
    {
      headers: buildHeaders(payload),
      timeout: 20000,
    },
  )

  return response.data || {}
}

const verifyWebhookSignature = (rawBody, signatureHeader) => {
  if (!process.env.PHONEPE_WEBHOOK_SECRET) {
    throw new Error('PHONEPE_WEBHOOK_SECRET is not configured for webhook verification')
  }

  const expectedSignature = crypto
    .createHmac('sha256', process.env.PHONEPE_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  return expectedSignature === signatureHeader
}

module.exports = {
  createCheckoutSession,
  fetchPaymentStatus,
  verifyWebhookSignature,
}
