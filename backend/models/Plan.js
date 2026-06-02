const mongoose = require('mongoose')

const planSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      enum: ['basic', 'premium'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    period: {
      type: String,
      default: '/month',
    },
    features: [
      {
        type: String,
      },
    ],
    popular: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: '',
    },
    durationDays: {
      type: Number,
      default: 30,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Plan', planSchema)
