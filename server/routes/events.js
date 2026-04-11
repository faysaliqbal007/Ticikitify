const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');
const { parser, deleteFromCloudinary } = require('../config/cloudinary');

// ─── Helper: format event for frontend ────────────────────────────────────────
const formatEvent = (event) => ({
  id: event._id.toString(),
  title: event.title,
  description: event.description,
  shortDescription: event.description,
  fullDescription: event.description,
  category: event.category,
  image: event.image,
  date: event.date,
  time: event.time,
  venue: event.venue,
  city: event.city,
  price: event.price,
  originalPrice: event.originalPrice,
  ticketsRemaining: event.ticketsRemaining,
  isFeatured: event.isFeatured,
  isTrending: event.isTrending,
  status: event.status,
  isSeatBased: event.isSeatBased || false,
  organizer: {
    id: event.organizer?._id?.toString() || event.organizer?.toString() || '',
    name: event.organizer?.name || event.organizerInfo?.name || 'Organizer',
    logo: event.organizer?.avatar || '',
    description: event.organizerInfo?.description || 'Event Organizer',
    eventsCount: 0,
    rating: 5.0,
  },
  ticketTiers: event.ticketTiers.map((t) => ({
    id: t._id?.toString() || 'general',
    name: t.name,
    price: t.price,
    quantity: t.quantity,
    available: t.available,
    description: t.description,
  })),
  artists: event.artists || [],
});

// ─── GET /api/events ───────────────────────────────────────────────────────────
// Public: get all live/approved events
// Organizer sees their own; Admin sees all
router.get('/', async (req, res) => {
  try {
    const { status, organizer } = req.query;
    const filter = {};

    if (organizer) filter.organizer = organizer;
    if (status) filter.status = status;
    // Public users only see live/approved events
    else if (!organizer) filter.status = { $in: ['live', 'approved'] };

    const events = await Event.find(filter).populate('organizer', 'name avatar').sort({ createdAt: -1 }).limit(500);
    res.json(events.map(formatEvent));
  } catch (err) {
    console.error('[GET /events]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── GET /api/events/all ──────────────────────────────────────────────────────
// Admin only: see ALL events regardless of status
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const events = await Event.find({}).populate('organizer', 'name avatar').sort({ createdAt: -1 }).limit(500);
    res.json(events.map(formatEvent));
  } catch (err) {
    console.error('[GET /events/all]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── GET /api/events/my ───────────────────────────────────────────────────────
// Organizer: get their own events
router.get('/my', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { organizer: req.user._id };
    const events = await Event.find(filter).populate('organizer', 'name avatar').sort({ createdAt: -1 }).limit(500);
    res.json(events.map(formatEvent));
  } catch (err) {
    console.error('[GET /events/my]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── GET /api/events/:id ──────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name avatar');
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(formatEvent(event));
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Event not found.' });
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── POST /api/events ─────────────────────────────────────────────────────────
// Organizer: creates with 'pending' status; Admin: creates with 'live' status
router.post('/', protect, authorize('organizer', 'admin'), parser.single('image'), async (req, res) => {
  try {
    const { title, description, category, date, time, venue, city, price } = req.body;
    let image = req.body.image;
    if (req.file && req.file.path) {
      image = req.file.path;
    }

    let ticketTiers = req.body.ticketTiers;
    if (typeof ticketTiers === 'string') {
      try { ticketTiers = JSON.parse(ticketTiers); } catch(e) {}
    }

    if (!title || !description || !category || !date || !venue || !price) {
      if (req.file && req.file.path) {
        await deleteFromCloudinary(req.file.path).catch(console.error);
      }
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Build final tiers and compute total remaining
    const finalTiers = (ticketTiers && Array.isArray(ticketTiers)) ? ticketTiers.map(t => ({
      name: t.name || 'General',
      price: parseFloat(t.price) || parseFloat(price),
      quantity: parseInt(t.quantity, 10) || 0,
      available: parseInt(t.quantity, 10) || 0,
      description: t.description || 'General Admission',
    })) : [{
      name: 'General',
      price: parseFloat(price),
      quantity: 0,
      available: 0,
      description: 'General Admission',
    }];
    
    const totalTickets = finalTiers.reduce((sum, t) => sum + t.quantity, 0);
    const status = req.user.role === 'admin' ? 'live' : 'pending';

    const event = await Event.create({
      title,
      description,
      category,
      image: image || '/event-custom.jpg',
      date,
      time: time || '10:00',
      venue,
      city: city || 'Dhaka',
      price,
      ticketsRemaining: totalTickets,
      organizer: req.user._id,
      organizerInfo: {
        name: req.user.name,
        description: 'Event Organizer',
      },
      ticketTiers: finalTiers,
      isFeatured: false,
      isTrending: false,
      status,
    });

    res.status(201).json(formatEvent(event));
  } catch (err) {
    if (req.file && req.file.path) {
      await deleteFromCloudinary(req.file.path).catch(console.error);
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('[POST /events]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── PUT /api/events/:id ──────────────────────────────────────────────────────
// Update event: organizer (own events only) or admin (any event)
router.put('/:id', protect, authorize('organizer', 'admin'), parser.single('image'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    // Organizer can only edit their own events
    if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only edit your own events.' });
    }

    const { title, description, category, date, time, venue, city, price } = req.body;
    let image = req.body.image;
    if (req.file && req.file.path) {
      image = req.file.path;
      if (event.image && event.image !== '/event-custom.jpg') {
        await deleteFromCloudinary(event.image);
      }
    }
    
    let ticketTiers = req.body.ticketTiers;
    if (typeof ticketTiers === 'string') {
      try { ticketTiers = JSON.parse(ticketTiers); } catch(e) {}
    }

    const updates = {
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(image && { image }),
      ...(date && { date }),
      ...(time && { time }),
      ...(venue && { venue }),
      ...(city && { city }),
      ...(price !== undefined && { price }),
    };

    // If ticket tiers are being updated, calculate remaining correctly  
    if (ticketTiers && Array.isArray(ticketTiers)) {
      // Import Ticket model to check already-sold count
      const Ticket = require('../models/Ticket');
      const soldOrders = await Ticket.find({ event: event._id, status: 'success' });
      
      // Build a map of how many were sold per tier name (since tier _ids change on edit)
      const soldByName = {};
      soldOrders.forEach(order => {
        order.tickets.forEach(t => {
          soldByName[t.name] = (soldByName[t.name] || 0) + t.quantity;
        });
      });

      let newTotalRemaining = 0;
      const safeTiers = ticketTiers.map(tier => {
        const newQty = parseInt(tier.quantity, 10) || 0;
        const alreadySold = soldByName[tier.name] || 0;
        // available = new total quantity - already sold (but never below 0)
        const available = Math.max(0, newQty - alreadySold);
        newTotalRemaining += available;
        return {
          name: tier.name,
          price: parseFloat(tier.price) || 0,
          quantity: newQty,
          available: available,
          description: tier.description || 'General Admission',
        };
      });

      updates.ticketTiers = safeTiers;
      updates.ticketsRemaining = newTotalRemaining;
    }

    const updated = await Event.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
    res.json(formatEvent(updated));
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Event not found.' });
    console.error('[PUT /events/:id]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── PUT /api/events/:id/status ───────────────────────────────────────────────
// Admin only: approve, reject, set live, etc.
router.put('/:id/status', protect, authorize('admin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'live', 'approved', 'rejected', 'draft'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${allowed.join(', ')}` });
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(formatEvent(event));
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Event not found.' });
    console.error('[PUT /events/:id/status]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── PUT /api/events/:id/trending ─────────────────────────────────────────────
// Admin only: toggle trending
router.put('/:id/trending', protect, authorize('admin'), async (req, res) => {
  try {
    const { isTrending } = req.body;
    
    // Check max trending limit
    if (isTrending) {
      const trendingCount = await Event.countDocuments({ isTrending: true });
      if (trendingCount >= 4) {
        return res.status(400).json({ message: 'Maximum of 4 events can be trending at once.' });
      }
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { $set: { isTrending } },
      { new: true }
    );
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json(formatEvent(event));
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Event not found.' });
    console.error('[PUT /events/:id/trending]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── DELETE /api/events/:id ───────────────────────────────────────────────────
// Organizer (own) or Admin (any)
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });

    if (req.user.role === 'organizer' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own events.' });
    }

    if (event.image && event.image !== '/event-custom.jpg') {
      await deleteFromCloudinary(event.image);
    }
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully.' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(404).json({ message: 'Event not found.' });
    console.error('[DELETE /events/:id]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
