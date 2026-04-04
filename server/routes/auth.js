// ───────────────────────────────────────────────────────────────────────────────
//  FILE: auth.js (or routes/auth.js)
//  PURPOSE: Handles all authentication-related endpoints:
//           • Registration (with email verification)
//           • Email verification
//           • Resend verification email
//           • Login (with role validation)
// ───────────────────────────────────────────────────────────────────────────────

const express = require('express');
const router = express.Router();           // Create modular router instance
const jwt = require('jsonwebtoken');        // For creating/verifying JSON Web Tokens
const User = require('../models/User');     // Mongoose User model
const { sendVerificationEmail } = require('../utils/email'); // Email sending utility

// ─── Helper function: Creates a signed JWT containing only user ID ─────────────
const generateToken = (userId) => {
  // Payload contains only minimal data → better security & smaller token
  return jwt.sign(
    { id: userId },                        // what we actually put inside the token
    process.env.JWT_SECRET,                // must be strong & kept secret
    {
      expiresIn: process.env.JWT_EXPIRE || '7d'   // fallback to 7 days
    }
  );
};

// ─── Helper function: Standardizes user object shape sent to frontend ──────────
const formatUser = (user, token) => ({
  token,                                   // JWT for authentication
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',               // optional field → default empty string
    role: user.role,                       // 'customer', 'organizer', 'admin'
    avatar: user.avatar || '',             // optional profile picture URL
    isVerified: user.isVerified,           // very important security flag
    createdAt: user.createdAt,             // account creation timestamp
  }
});

// ─── POST /api/auth/register ───────────────────────────────────────────────────
// Creates new unverified user + sends verification email
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Basic input validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: 'Please provide name, email, password, and role.'
      });
    }

    // Prevent anyone from registering as admin through public form
    if (role === 'admin') {
      return res.status(403).json({
        message: 'Admin accounts cannot be created via registration.'
      });
    }

    // Only two roles allowed for self-registration
    if (!['customer', 'organizer'].includes(role)) {
      return res.status(400).json({
        message: 'Role must be either "customer" or "organizer".'
      });
    }

    // ─── Email already exists check ─────────────────────────────────────────
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()      // normalize email
    }).select('+verificationToken +verificationExpires +isVerified');

    if (existingUser) {
      return res.status(409).json({
        message: `This email is already registered. Please use a different email or log in.`,
      });
    }

    // ─── Create new user (still unverified) ─────────────────────────────────
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),     // normalize on creation too
      password,                              // should be hashed by pre-save hook
      phone: phone || '',
      role,
      isVerified: false,                     // explicit → very important
    });

    // Generate short-lived verification token
    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false }); // skip validators this time

    // Attempt to send verification email (non-blocking failure)
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailErr) {
      console.error('Verification email failed to send:', emailErr.message);
      // Registration still succeeds — user can request resend later
    }

    // 201 + instructions (no token yet — must verify first)
    return res.status(201).json({
      message: `Account created! We've sent a verification email to ${user.email}. Please check your inbox and click the link to activate your account.`,
      requiresVerification: true,
      email: user.email,
    });
  } catch (err) {
    // Handle MongoDB duplicate key error (email unique index)
    if (err.code === 11000) {
      return res.status(409).json({
        message: 'This email is already registered. Please log in.'
      });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: messages[0] });
    }

    console.error('[POST /register]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── GET /api/auth/verify/:token ───────────────────────────────────────────────
// Endpoint user visits from email link → activates account + logs in
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with valid, non-expired token
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() },
    })
    // We need these secret fields
    .select('+verificationToken +verificationExpires');

    if (!user) {
      return res.status(400).json({
        message: 'Verification link is invalid or has expired. Please register again or request a new link.'
      });
    }

    // ─── Activate account ───────────────────────────────────────────────────
    user.isVerified = true;
    user.verificationToken = undefined;     // clear token
    user.verificationExpires = undefined;   // clear expiry
    await user.save({ validateBeforeSave: false });

    // Immediately log user in after successful verification
    const jwtToken = generateToken(user._id);

    return res.status(200).json({
      message: 'Email verified successfully! You are now logged in.',
      ...formatUser(user, jwtToken),
    });
  } catch (err) {
    console.error('[GET /verify/:token]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── POST /api/auth/resend-verification ────────────────────────────────────────
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Find user (include secret fields)
    const user = await User.findOne({
      email: email.toLowerCase()
    }).select('+verificationToken +verificationExpires +isVerified');

    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account is already verified.' });
    }

    const now = Date.now();
    const expiresAt = user.verificationExpires ? new Date(user.verificationExpires).getTime() : 0;
    
    if (expiresAt > now) {
      const remainingMinutes = Math.ceil((expiresAt - now) / 1000 / 60);
      return res.status(429).json({ message: `Please wait ${remainingMinutes} minute(s) before requesting a new link.` });
    }

    // Generate fresh token
    const token = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send email
    await sendVerificationEmail(user.email, user.name, token);

    res.json({
      message: `Verification email resent to ${user.email}.`
    });
  } catch (err) {
    console.error('[POST /resend-verification]', err);
    res.status(500).json({ message: 'Failed to resend email. Please try again.' });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // All three fields are required
    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'Please provide email, password, and the login role tab type.'
      });
    }

    // Find user + include password field
    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // ─── Role consistency check (prevents tab confusion) ─────────────────────
    // Admins are allowed to log in from any role tab (convenience)
    if (user.role !== 'admin' && role !== 'admin') {
      if (user.role !== role) {
        return res.status(401).json({
          message: `This email belongs to a ${user.role} account. Please switch to the '${user.role}' tab to log in.`
        });
      }
    }

    // Compare provided password with hashed one
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Prevent login until email is verified (except admins – usually seeded)
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        requiresVerification: true,
        email: user.email,
      });
    }

    // ─── Success ─────────────────────────────────────────────────────────────
    const token = generateToken(user._id);
    return res.status(200).json(formatUser(user, token));
  } catch (err) {
    console.error('[POST /login]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;