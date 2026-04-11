const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');
const Event = require('../models/Event');
const { protect, authorize } = require('../middleware/auth');

// @route   POST /api/promoCodes
// @desc    Create a new promo code
// @access  Organizer
router.post('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    let { code, discountValue, expiryDate, usageLimit, minimumOrderAmount, isActive, applicableEvents, isGlobal } = req.body;
    
    // Admin only global check
    const globalStatus = req.user.role === 'admin' ? Boolean(isGlobal) : false;
    // Enforce percentage discount type and valid percentage range
    const discountType = 'percentage';
    discountValue = Math.min(Math.max(Number(discountValue) || 1, 1), 100);

    const existingCode = await PromoCode.findOne({ 
        code: code.toUpperCase(), 
        $or: [{ organizer: req.user._id }, { isGlobal: true }] 
    });
    if (existingCode) {
      return res.status(400).json({ message: 'A promo code with this name already exists or clashes with a global code.' });
    }

    const promoCode = new PromoCode({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      expiryDate,
      usageLimit,
      minimumOrderAmount,
      isActive,
      organizer: req.user._id,
      isGlobal: globalStatus,
      applicableEvents: applicableEvents || []
    });

    await promoCode.save();
    res.status(201).json(promoCode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/promoCodes
// @desc    Get promo codes (Organizer sees theirs, Admin sees all)
// @access  Organizer, Admin
router.get('/', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    let query = {};
    // If admin is requesting, they probably want to see all context
    if (req.user.role === 'admin') {
      // Admin sees all
    } else {
      query.organizer = req.user._id;
    }

    const promoCodes = await PromoCode.find(query).populate('applicableEvents', 'title').sort({ createdAt: -1 });
    res.json(promoCodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/promoCodes/:id
// @desc    Update a promo code
// @access  Organizer, Admin
router.put('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    // Ensure the organizer owns it, unless they are an admin
    if (promoCode.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this promo code' });
    }

    const { code, discountValue, expiryDate, usageLimit, minimumOrderAmount, isActive, applicableEvents } = req.body;

    if (code) promoCode.code = code.toUpperCase();
    promoCode.discountType = 'percentage';
    if (discountValue !== undefined) {
       promoCode.discountValue = Math.min(Math.max(Number(discountValue) || 1, 1), 100);
    }
    if (expiryDate) promoCode.expiryDate = expiryDate;
    if (usageLimit !== undefined) promoCode.usageLimit = usageLimit;
    if (minimumOrderAmount !== undefined) promoCode.minimumOrderAmount = minimumOrderAmount;
    if (isActive !== undefined) promoCode.isActive = isActive;
    if (applicableEvents) promoCode.applicableEvents = applicableEvents;

    await promoCode.save();
    res.json(promoCode);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/promoCodes/validate
// @desc    Validate a promo code for checkout
// @access  Public (Any user doing checkout)
router.post('/validate', protect, async (req, res) => {
  try {
    const { code, eventId } = req.body;
    
    if (!code || !eventId) {
      return res.status(400).json({ message: 'Code and Event ID are required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Find the active promo code matching the code string and either the event's organizer or it's global
    const promoCode = await PromoCode.findOne({ 
      code: code.toUpperCase(),
      isActive: true,
      $or: [
         { isGlobal: true },
         { organizer: event.organizer }
      ]
    });

    if (!promoCode) {
      return res.status(404).json({ message: 'Invalid or inactive promo code.' });
    }

    // Check expiry to end of day
    const endOfDayExpiry = new Date(promoCode.expiryDate);
    endOfDayExpiry.setUTCHours(23, 59, 59, 999);
    if (endOfDayExpiry < new Date()) {
      return res.status(400).json({ message: 'This promo code has expired.' });
    }

    // Check usage limits
    if (promoCode.usageLimit && promoCode.usageLimit > 0 && promoCode.usageCount >= promoCode.usageLimit) {
      return res.status(400).json({ message: 'This promo code usage limit has been reached.' });
    }

    // Check if it's strictly attached to specific events
    if (promoCode.applicableEvents && promoCode.applicableEvents.length > 0) {
      const isApplicable = promoCode.applicableEvents.some(evId => evId.toString() === eventId.toString());
      if (!isApplicable) {
        return res.status(400).json({ message: 'This promo code is not applicable for this event.' });
      }
    }

    res.json({
      message: 'Promo code valid',
      promoCodeId: promoCode._id,
      code: promoCode.code,
      discountType: promoCode.discountType,
      discountValue: promoCode.discountValue,
      minimumOrderAmount: promoCode.minimumOrderAmount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/promoCodes/:id
// @desc    Delete a promo code
// @access  Organizer, Admin
router.delete('/:id', protect, authorize('organizer', 'admin'), async (req, res) => {
  try {
    const promoCode = await PromoCode.findById(req.params.id);
    if (!promoCode) {
      return res.status(404).json({ message: 'Promo code not found' });
    }

    // Ensure the organizer owns it, unless they are an admin
    if (promoCode.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this promo code' });
    }

    await PromoCode.findByIdAndDelete(req.params.id);
    res.json({ message: 'Promo code removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
