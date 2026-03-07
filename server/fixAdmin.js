require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Find the admin user and set isVerified to true
    const result = await User.updateOne(
      { email: 'admin@ticikitify.com' },
      { $set: { isVerified: true } }
    );
    
    if (result.matchedCount > 0) {
      console.log('✅ Admin account is now verified and can log in without email verification.');
    } else {
      console.log('❌ Admin account not found.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    process.exit(0);
  }
};

fixAdmin();
