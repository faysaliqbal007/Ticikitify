/**
 * seed.js — Run once to create the Admin account in MongoDB
 * Usage: npm run seed   OR   node seed.js
 *
 * This script creates the admin account with credentials from .env
 * Admin accounts CANNOT be created via the registration form.
 */

// Force Google DNS to bypass router DNS that blocks SRV records
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@ticikitify.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.env.ADMIN_NAME || 'System Administrator';

async function seed() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });
    if (existing) {
      console.log(`⚠️  Admin already exists: ${ADMIN_EMAIL}`);
      console.log('   Delete the existing admin from MongoDB Atlas to re-seed.');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const admin = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
      phone: '',
      avatar: '',
      isVerified: true, // Admin is pre-verified — no email needed
    });

    console.log('');
    console.log('✅ Admin account created successfully!');
    console.log('─────────────────────────────────────');
    console.log(`   Email   : ${admin.email}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log(`   Role    : ${admin.role}`);
    console.log(`   ID      : ${admin._id}`);
    console.log('─────────────────────────────────────');
    console.log('');
    console.log('👉 Log in at the admin portal with these credentials.');
    console.log('⚠️  Change the password in .env before going to production!');

    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
}

seed();
