const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  items: [
    {
      name: {
        type: String,
        required: true
      },
      qty: {
        type: Number,
        required: true,
        min: 1
      },
      price: {
        type: Number,
        required: true,
        min: 0
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  
  address: {
    type: String,
    required: true
  },

  deliveryTime: {
    type: String, // 例如 "06:30"
    required: true
  },

  note: {
    type: String
  },

  status: {
    type: String,
    enum: ['準備中', '已出貨'],
    default: '準備中'
  }
  
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)