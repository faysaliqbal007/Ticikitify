const express = require('express');
const router = express.Router();
const SSLCommerzPayment = require('sslcommerz-lts');
const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const User = require('../models/User');
const PromoCode = require('../models/PromoCode');
const { protect, authorize } = require('../middleware/auth');

// SSLCommerz Credentials setup
const store_id = process.env.SSL_STORE_ID || 'testbox';
const store_passwd = process.env.SSL_STORE_PASSWD || 'testbox@123';
const is_live = process.env.SSL_IS_LIVE === 'true' || false;

// ─── POST /api/tickets/init ──────────────────────────────────────────────────
router.post('/init', protect, async (req, res) => {
  try {
    const { eventId, ticketSelection, totalAmount, customerInfo, promoCodeId } = req.body;

    // Validate event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Prepare ticket details for DB
    const ticketsBought = [];
    let calcTotal = 0;
    
    for (const [tierId, rawQty] of Object.entries(ticketSelection)) {
      const quantity = parseInt(rawQty, 10);
      if (!quantity || quantity <= 0) continue;
      
      const tier = event.ticketTiers.find((t) => t.id === tierId || t._id.toString() === tierId);
      if (!tier) return res.status(400).json({ message: 'Invalid ticket tier.' });
      if (tier.available < quantity) return res.status(400).json({ message: `Not enough tickets available for ${tier.name}.` });
      
      ticketsBought.push({
        tierId: tier._id,
        name: tier.name,
        quantity: quantity,
        price: tier.price
      });
      calcTotal += tier.price * quantity;
    }

    let finalAmount = calcTotal;
    let discountAmount = 0;
    
    if (promoCodeId) {
      const dbPromoCode = await PromoCode.findById(promoCodeId);
      if (dbPromoCode && dbPromoCode.isActive) {
         // Verify scope: Protect against cross-organizer theft
         if (!dbPromoCode.isGlobal && dbPromoCode.organizer.toString() !== event.organizer.toString()) {
            return res.status(403).json({ message: 'Promo code is isolated and cannot be used for this event.' });
         }
         
         // Re-verify expiry and limits to prevent delayed checkout exploits
         const endOfDayExpiry = new Date(dbPromoCode.expiryDate);
         endOfDayExpiry.setUTCHours(23, 59, 59, 999);
         const isExpired = endOfDayExpiry < new Date();
         const isLimitReached = dbPromoCode.usageLimit && dbPromoCode.usageLimit > 0 && dbPromoCode.usageCount >= dbPromoCode.usageLimit;
         
         const totalTickets = Object.values(ticketSelection).reduce((a, b) => a + b, 0);
         const isBelowMinimum = dbPromoCode.minimumOrderAmount && dbPromoCode.minimumOrderAmount > 0 && totalTickets < dbPromoCode.minimumOrderAmount;
         
         if (!isExpired && !isLimitReached && !isBelowMinimum) {
             if (dbPromoCode.discountType === 'percentage') {
                discountAmount = calcTotal * (dbPromoCode.discountValue / 100);
             } else if (dbPromoCode.discountType === 'fixed') {
                discountAmount = dbPromoCode.discountValue;
             }
             finalAmount = Math.max(0, calcTotal - discountAmount);
         }
      }
    }

    if (Math.round(finalAmount) !== Math.round(totalAmount)) {
      return res.status(400).json({ message: 'Total amount mismatch after discount.' });
    }

    const tran_id = 'REF' + Date.now() + Math.random().toString(36).substring(7).toUpperCase();

    // Create a pending ticket order
    const pendingOrder = new Ticket({
      customer: req.user._id,
      event: event._id,
      organizer: event.organizer,
      transactionId: tran_id,
      originalAmount: calcTotal,
      discountAmount: discountAmount,
      totalAmount: finalAmount,
      promoCodeUsed: promoCodeId || null,
      status: 'pending',
      tickets: ticketsBought,
      customerInfo: customerInfo || {
         name: req.user.name,
         email: req.user.email,
         phone: req.user.phone
      }
    });

    await pendingOrder.save();

    // Prepare payload for SSLCommerz
    const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
    const serverHost = process.env.SERVER_URL || 'http://localhost:5000';

    const data = {
      total_amount: calcTotal,
      currency: 'BDT',
      tran_id: tran_id,
      success_url: `${serverHost}/api/tickets/success`,
      fail_url: `${serverHost}/api/tickets/fail`,
      cancel_url: `${serverHost}/api/tickets/cancel`,
      ipn_url: `${serverHost}/api/tickets/ipn`,
      shipping_method: 'No',
      product_name: event.title,
      product_category: 'Ticket',
      product_profile: 'general',
      cus_name: req.user.name,
      cus_email: req.user.email,
      cus_add1: 'Dhaka',
      cus_add2: 'Dhaka',
      cus_city: 'Dhaka',
      cus_state: 'Dhaka',
      cus_postcode: '1000',
      cus_country: 'Bangladesh',
      cus_phone: req.user.phone || '01711111111',
      cus_fax: '01711111111',
      ship_name: req.user.name,
      ship_add1: 'Dhaka',
      ship_add2: 'Dhaka',
      ship_city: 'Dhaka',
      ship_state: 'Dhaka',
      ship_postcode: 1000,
      ship_country: 'Bangladesh',
    };

    const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
    sslcz.init(data).then(apiResponse => {
      let GatewayPageURL = apiResponse.GatewayPageURL;
      res.json({ GatewayPageURL });
    }).catch(err => {
      console.error('SSL init error:', err);
      res.status(500).json({ message: 'Could not init SSL payment gateway.' });
    });

  } catch (error) {
    console.error('[POST /tickets/init]', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── POST /api/tickets/success ──────────────────────────────────────────────
router.post('/success', async (req, res) => {
  const { tran_id, val_id } = req.body;
  const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
  try {
     const order = await Ticket.findOne({ transactionId: tran_id });
     if (!order) return res.redirect(`${frontendHost}/payment/fail?reason=not_found`);

     // Strict Gateway Validation (Preventing fake POST requests)
     if (val_id) {
         try {
             const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
             const validation = await sslcz.validate({ val_id: val_id });
             if (validation.status !== 'VALID' && validation.status !== 'VALIDATED') {
                return res.redirect(`${frontendHost}/payment/fail?reason=forgery_detected`);
             }
         } catch(sslError) {
             console.error('SSL Validation Error', sslError);
             return res.redirect(`${frontendHost}/payment/fail?reason=gateway_error`);
         }
     } else {
         return res.redirect(`${frontendHost}/payment/fail?reason=missing_validation`);
     }
     
     if (order.status !== 'success') {
       order.status = 'success';
       await order.save();

       // Atomic Deductions preventing Race-Condition Overbooking
       let totalBought = 0;
       for (const tData of order.tickets) {
          totalBought += tData.quantity;
          await Event.updateOne(
             { _id: order.event, "ticketTiers._id": tData.tierId },
             { $inc: { "ticketTiers.$.available": -tData.quantity } }
          );
       }
       
       // Deduct overall limit safely
       await Event.updateOne(
          { _id: order.event },
          { $inc: { ticketsRemaining: -totalBought } }
       );

       // Increment promo code usage
       if (order.promoCodeUsed) {
         await PromoCode.findByIdAndUpdate(order.promoCodeUsed, { $inc: { usageCount: 1 } });
       }
     }

     res.redirect(`${frontendHost}/payment/success?tran_id=${tran_id}`);
  } catch(e) {
     console.error('[POST /tickets/success]', e);
     res.redirect(`${frontendHost}/payment/fail?reason=error`);
  }
});

// ─── POST /api/tickets/fail ────────────────────────────────────────────────
router.post('/fail', async (req, res) => {
  const { tran_id } = req.body;
  const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
  await Ticket.findOneAndUpdate({ transactionId: tran_id }, { status: 'failed' }).catch(console.error);
  res.redirect(`${frontendHost}/payment/fail?tran_id=${tran_id}&reason=failed`);
});

// ─── POST /api/tickets/cancel ──────────────────────────────────────────────
router.post('/cancel', async (req, res) => {
  const { tran_id } = req.body;
  const frontendHost = process.env.FRONTEND_URL || 'http://localhost:5173';
  await Ticket.findOneAndUpdate({ transactionId: tran_id }, { status: 'canceled' }).catch(console.error);
  res.redirect(`${frontendHost}/payment/fail?tran_id=${tran_id}&reason=canceled`);
});

// ─── POST /api/tickets/ipn ─────────────────────────────────────────────────
router.post('/ipn', async (req, res) => {
  const { tran_id, status } = req.body;
  // This is a web-hook which works in the background (needs validation basically)
  if (status === 'VALID') {
     // do valid logic if needed via server to server
  }
  res.status(200).send('OK');
});


// ─── GET /api/tickets/my-tickets ───────────────────────────────────────────
router.get('/my-tickets', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ customer: req.user._id, status: 'success' })
       .populate('event', 'title image date time venue city category')
       .sort({ createdAt: -1 });
    res.json(tickets);
  } catch(e) {
    console.error('[GET /tickets/my-tickets]', e);
    res.status(500).json({ message: 'Server error' });
  }
});

// ─── GET /api/tickets/organizer-stats ──────────────────────────────────────
router.get('/organizer-stats', protect, authorize('organizer', 'admin'), async (req, res) => {
   try {
      // Find all successful tickets related to the events owned by this organizer
      const tickets = await Ticket.find({ organizer: req.user._id, status: 'success' });
      
      let totalRevenue = 0;
      let totalTicketsSold = 0;

      tickets.forEach(t => {
         totalRevenue += t.totalAmount;
         t.tickets.forEach(tier => {
            totalTicketsSold += tier.quantity;
         });
      });

      // Get count of remaining tickets logic 
      const events = await Event.find({ organizer: req.user._id });
      let totalTicketsRemaining = 0;
      let eventMetrics = [];

      events.forEach(e => {
         totalTicketsRemaining += e.ticketsRemaining;
         let rev = 0;
         let sold = 0;
         const evTix = tickets.filter(t => t.event.toString() === e._id.toString());
         evTix.forEach(t => {
            rev += t.totalAmount;
            t.tickets.forEach(tier => sold += tier.quantity);
         });
         eventMetrics.push({
            id: e._id,
            title: e.title,
            image: e.image,
            date: e.date,
            venue: e.venue,
            status: e.status,
            revenue: rev,
            sold: sold,
            remaining: e.ticketsRemaining
         });
      });

      res.json({
         totalRevenue,
         totalTicketsSold,
         totalTicketsRemaining,
         eventMetrics
      });
   } catch(e) {
      console.error('[GET /tickets/organizer-stats]', e);
      res.status(500).json({ message: 'Server error' });
   }
});

// ─── GET /api/tickets/admin-stats ──────────────────────────────────────────
router.get('/admin-stats', protect, authorize('admin'), async (req, res) => {
   try {
      const tickets = await Ticket.find({ status: 'success' }).populate('organizer', 'name email');
      const events = await Event.find({});

      let totalSales = 0;
      let totalRevenue = 0;
      let organizerMetrics = {};

      tickets.forEach(t => {
         totalRevenue += t.totalAmount;
         let q = 0;
         t.tickets.forEach(tier => q += tier.quantity);
         totalSales += q;

         const orgId = t.organizer._id.toString();
         if (!organizerMetrics[orgId]) {
            organizerMetrics[orgId] = {
               name: t.organizer.name,
               email: t.organizer.email,
               revenue: 0,
               ticketsSold: 0
            };
         }
         organizerMetrics[orgId].revenue += t.totalAmount;
         organizerMetrics[orgId].ticketsSold += q;
      });

      let totalRemainingPlatform = 0;
      let eventMetrics = [];

      events.forEach(e => { 
         totalRemainingPlatform += e.ticketsRemaining; 
         let rev = 0;
         let sold = 0;
         const evTix = tickets.filter(t => t.event.toString() === e._id.toString());
         evTix.forEach(t => {
            rev += t.totalAmount;
            t.tickets.forEach(tier => sold += tier.quantity);
         });
         eventMetrics.push({
            id: e._id,
            title: e.title,
            image: e.image,
            date: e.date,
            venue: e.venue,
            status: e.status,
            organizerName: e.organizerInfo ? e.organizerInfo.name : 'Unknown',
            revenue: rev,
            sold: sold,
            remaining: e.ticketsRemaining
         });
      });

      // Platform Profit Logic: Assuming platform takes 10% of revenue
      const platformProfit = totalRevenue * 0.10;

      res.json({
         totalRevenue,
         totalSales,
         totalRemainingPlatform,
         platformProfit,
         organizerMetrics: Object.values(organizerMetrics),
         eventMetrics
      });
   } catch(e) {
      console.error('[GET /tickets/admin-stats]', e);
      res.status(500).json({ message: 'Server error' });
   }
});

module.exports = router;
