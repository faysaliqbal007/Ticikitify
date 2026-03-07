require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const dns = require('dns');

// Override DNS for resolving MongoDB Atlas issues locally
dns.setServers(['8.8.8.8', '8.8.4.4']);

const sampleEvents = [
  {
    title: 'Dhaka Rock Fest 2026',
    description: 'The biggest rock festival in Dhaka featuring top bands including Artcell, Nemesis, and Warfaze.',
    category: 'concerts',
    image: '/event-concert.jpg',
    date: '2026-05-15',
    time: '18:00',
    venue: 'Army Stadium',
    city: 'Dhaka',
    price: 1500,
    originalPrice: 2000,
    ticketsRemaining: 5000,
    isFeatured: true,
    isTrending: true,
    status: 'live',
    ticketTiers: [
      { name: 'General', price: 1500, quantity: 4000, available: 4000, description: 'General Access' },
      { name: 'VIP', price: 5000, quantity: 1000, available: 1000, description: 'VIP Area Access' }
    ]
  },
  {
    title: 'BD vs IND T20 Series',
    description: 'Witness the thrilling cricket match between Bangladesh and India in the T20 Series.',
    category: 'sports',
    image: '/event-cricket.jpg',
    date: '2026-06-22',
    time: '14:30',
    venue: 'Sher-e-Bangla National Cricket Stadium',
    city: 'Dhaka',
    price: 800,
    originalPrice: 1000,
    ticketsRemaining: 15000,
    isFeatured: true,
    isTrending: true,
    status: 'live',
    ticketTiers: [
      { name: 'Gallery', price: 800, quantity: 10000, available: 10000, description: 'Standard Gallery Seat' },
      { name: 'Club House', price: 2500, quantity: 5000, available: 5000, description: 'Premium Club House Seat' }
    ]
  },
  {
    title: 'Pohela Boishakh Mela',
    description: 'Celebrate the Bengali New Year with traditional food, music, and colorful festivities.',
    category: 'cultural',
    image: '/event-cultural.jpg',
    date: '2026-04-14',
    time: '08:00',
    venue: 'Ramna Park',
    city: 'Dhaka',
    price: 0,
    ticketsRemaining: 10000,
    isFeatured: false,
    isTrending: true,
    status: 'live',
    ticketTiers: [
      { name: 'Free Entry', price: 0, quantity: 10000, available: 10000, description: 'Free Entry' }
    ]
  },
  {
    title: 'Dhaka Food Fiesta',
    description: 'Explore a paradise of local and international cuisines from over 100 vendors.',
    category: 'food',
    image: '/event-food.jpg',
    date: '2026-07-10',
    time: '11:00',
    venue: 'International Convention City Bashundhara (ICCB)',
    city: 'Dhaka',
    price: 500,
    ticketsRemaining: 3000,
    isFeatured: true,
    isTrending: false,
    status: 'live',
    ticketTiers: [
      { name: 'Entry Ticket', price: 500, quantity: 3000, available: 3000, description: 'Entry and welcome drink' }
    ]
  },
  {
    title: 'National Tech Summit 2026',
    description: 'Join developers, startups, and tech giants to explore the future of AI and Web3.',
    category: 'tech',
    image: '/event-tech.jpg',
    date: '2026-08-05',
    time: '09:00',
    venue: 'BICC',
    city: 'Dhaka',
    price: 2500,
    ticketsRemaining: 1500,
    isFeatured: false,
    isTrending: false,
    status: 'live',
    ticketTiers: [
      { name: 'Standard Ticket', price: 2500, quantity: 1500, available: 1500, description: 'Full Summit Access' }
    ]
  },
  {
    title: 'Shakespeare in Dhaka',
    description: 'A spectacular theatrical performance of Hamlet adapted with a local Bengali twist.',
    category: 'theater',
    image: '/event-theater.jpg',
    date: '2026-09-12',
    time: '19:00',
    venue: 'Bangladesh Shilpakala Academy',
    city: 'Dhaka',
    price: 1000,
    ticketsRemaining: 800,
    isFeatured: true,
    isTrending: false,
    status: 'live',
    ticketTiers: [
      { name: 'Seat', price: 1000, quantity: 800, available: 800, description: 'Standard Seat' }
    ]
  }
];

const seedAdditionalEvents = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    // Make sure we have the admin user to attach these events to
    const adminUser = await User.findOne({ email: 'admin@ticikitify.com' });
    if (!adminUser) {
      console.log('Admin user not found. Please run seed.js first.');
      process.exit(1);
    }

    // Attach organizer info to events
    const eventsToInsert = sampleEvents.map(event => ({
      ...event,
      organizer: adminUser._id,
      organizerInfo: {
        name: adminUser.name,
        description: 'Official Ticikitify Admin'
      }
    }));

    await Event.insertMany(eventsToInsert);
    console.log('✅ Successfully added 6 beautifully crafted mock events to MongoDB!');

  } catch (error) {
    console.error('Error seeding events:', error);
  } finally {
    process.exit(0);
  }
};

seedAdditionalEvents();
