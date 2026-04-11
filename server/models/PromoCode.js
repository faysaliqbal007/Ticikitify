const mongoose = require('mongoose');

const promoCodeSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    uppercase: true,
    trim: true
  },
  discountType: { 
    type: String, 
    enum: ['percentage', 'fixed'], 
    required: true 
  },
  discountValue: { 
    type: Number, 
    required: true 
  },
  expiryDate: { 
    type: Date, 
    required: true 
  },
  usageLimit: { 
    type: Number, 
    default: 0 // 0 means unlimited
  },
  usageCount: { 
    type: Number, 
    default: 0 
  },
  minimumOrderAmount: { 
    type: Number,
    default: 0
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  isGlobal: {
    type: Boolean,
    default: false
  },
  // Allows the code to be scoped strictly to specific events (optional)
  applicableEvents: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Event' 
  }]
}, { timestamps: true });

// Compound index to ensure that an organizer doesn't create multiple identical codes
promoCodeSchema.index({ code: 1, organizer: 1 }, { unique: true });

module.exports = mongoose.model('PromoCode', promoCodeSchema);
