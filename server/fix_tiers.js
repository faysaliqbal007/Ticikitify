require('dotenv').config();
const mongoose = require('mongoose');
const Event = require('./models/Event');
const dns = require('dns');

// Override DNS for resolving MongoDB Atlas issues locally
dns.setServers(['8.8.8.8', '8.8.4.4']);

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const events = await Event.find({});
    for (const event of events) {
      if (event.ticketTiers && event.ticketTiers.length > 0) {
        event.ticketTiers = event.ticketTiers.filter(t => t.name.toLowerCase() === 'general');
        if (event.ticketTiers.length === 0) {
          event.ticketTiers = [{ name: 'General', price: event.price, quantity: event.ticketsRemaining, available: event.ticketsRemaining, description: 'General Access' }];
        }
        await event.save();
      }
    }
    console.log('Fixed tiers. Only general option remains.');
    process.exit(0);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
})();
