const mongoose = require('mongoose');

const ticketOrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'BDT',
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'canceled'],
      default: 'pending',
    },
    // The specific tickets bought in this transaction
    tickets: [
      {
        tierId: { type: String, required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    customerInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      city: String,
    },
    promoCodeUsed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PromoCode',
      default: null,
    },
    originalAmount: {
      type: Number,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TicketOrder', ticketOrderSchema);
