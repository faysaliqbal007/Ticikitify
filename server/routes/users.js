const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { parser, deleteFromCloudinary } = require('../config/cloudinary');

// ─── GET /api/users/me ─────────────────────────────────────────────────────────
// Get the currently logged-in user's profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('[GET /users/me]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});
// ─── GET /api/users/all ────────────────────────────────────────────────────────
// Admin only: Get a list of all users and organizers
router.get('/all', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error('[GET /users/all]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});
// ─── PUT /api/users/me ─────────────────────────────────────────────────────────
// Update the logged-in user's profile (name, phone, avatar)
// Email and role are NOT changeable via this endpoint
router.put('/me', protect, parser.single('image'), async (req, res) => {
  try {
    const { name, phone } = req.body;
    let avatar = req.body.avatar;

    if (req.file && req.file.path) {
      avatar = req.file.path;
      const currentUser = await User.findById(req.user._id);
      if (currentUser && currentUser.avatar) {
        await deleteFromCloudinary(currentUser.avatar);
      }
    }

    // Build update object with only the allowed fields
    const updates = {};
    if (name !== undefined) {
      if (name.trim().length < 2) {
        return res.status(400).json({ message: 'Name must be at least 2 characters.' });
      }
      updates.name = name.trim();
    }
    if (phone !== undefined) updates.phone = phone.trim();
    if (avatar !== undefined) updates.avatar = avatar; // base64 or URL

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided for update.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      role: updatedUser.role,
      avatar: updatedUser.avatar || '',
      createdAt: updatedUser.createdAt,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('[PUT /users/me]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// ─── PUT /api/users/me/password ───────────────────────────────────────────────
// Change password (requires current password for security)
router.put('/me/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters.' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.password = newPassword; // pre-save hook will hash it
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    console.error('[PUT /users/me/password]', err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
