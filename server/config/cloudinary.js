const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ticikitify',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp']
  }
});

const parser = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // Exactly 10 Megabytes in bytes
});


const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl || !imageUrl.includes('cloudinary.com')) return;
  try {
    const parts = imageUrl.split('/');
    const filename = parts.pop().split('.')[0];
    const folder = parts.pop();
    const publicId = `${folder}/${filename}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error('Cloudinary deletion error:', err);
  }
};

module.exports = { cloudinary, parser, deleteFromCloudinary };
