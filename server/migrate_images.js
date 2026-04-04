require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const Event = require('./models/Event');
const { cloudinary } = require('./config/cloudinary');
const path = require('path');
const fs = require('fs');

const migrateImages = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all events that have a local image path starting with "/"
    const events = await Event.find({ image: { $regex: '^/' } });

    if (events.length === 0) {
      console.log('🎉 All events already have Cloudinary URLs (or no local images found)!');
      process.exit(0);
    }

    console.log(`Found ${events.length} events with local images. Uploading to Cloudinary...`);

    for (let event of events) {
      const localImagePath = path.join(__dirname, '../app/public', event.image);

      if (!fs.existsSync(localImagePath)) {
        console.warn(`  Warning: File not found locally - ${localImagePath}`);
        continue;
      }

      console.log(`Uploading ${event.image} to Cloudinary...`);

      try {
        // Upload to Cloudinary securely
        const result = await cloudinary.uploader.upload(localImagePath, {
          folder: 'ticikitify',
          use_filename: true,
          unique_filename: true
        });

        // Update the event with the new URL
        event.image = result.secure_url;
        await event.save();
        console.log(` Success! Updated event "${event.title}" with Cloudinary URL: ${result.secure_url}`);
      } catch (uploadError) {
        console.error(`Failed to upload ${event.image}:`, uploadError.message);
      }
    }

    console.log('\n Migration Complete! All default events are now hosted on Cloudinary.');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

migrateImages();
