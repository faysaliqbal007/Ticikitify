const mongoose = require('mongoose');

const ticketTierSchema = new mongoose.Schema({
  name: { type: String, default: 'General' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  available: { type: Number, required: true },
  description: { type: String, default: 'General Admission' },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['concerts', 'sports', 'tech', 'cultural', 'theater', 'food', 'other'],
    },
    image: {
      type: String,
      default: '/event-custom.jpg',
    },
    date: {
      type: String,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      default: '10:00',
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
    },
    city: {
      type: String,
      default: 'Dhaka',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
    },
    ticketsRemaining: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'live', 'approved', 'rejected', 'draft', 'scheduled'],
      default: 'pending',
    },
    // Reference to the User who created/owns this event
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Cached organizer display info (so we don't need to join every time)
    organizerInfo: {
      name: { type: String, default: '' },
      description: { type: String, default: 'Event Organizer' },
    },
    ticketTiers: [ticketTierSchema],
    artists: {
      type: Array,
      default: [],
    },
    isSeatBased: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Event', eventSchema);
