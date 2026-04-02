const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/email');

// ─── Helper: generate JWT ──────────────────────────────────────────────────────
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// ─── Helper: format user response ─────────────────────────────────────────────
const formatUser = (user, token) => ({
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    avatar: user.avatar || '',
    isVerified: user.isVerified,
    createdAt: user.createdAt,
  },
});

// ─── POST /api/auth/register ───────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide name, email, password, and role.' });
    }
    if (role === 'admin') {
      return res.status(403).json({ message: 'Admin accounts cannot be created via registration.' });
    }
    if (!['customer', 'organizer'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either "customer" or "organizer".' });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      // If email exists but not verified, resend the verification email
      if (!existingUser.isVerified) {
        const token = existingUser.generateVerificationToken();
        await existingUser.save({ validateBeforeSave: false });
        try {
          await sendVerificationEmail(existingUser.email, existingUser.name, token);
        } catch (emailErr) {
          console.error('Email resend failed:', emailErr.message);
        }
        return res.status(409).json({
          message: 'This email is registered but not verified. We\'ve resent the verification email — please check your inbox.',
          requiresVerification: true,
        });
      }
      return res.status(409).json({
        message: `This email is already registered as a ${existingUser.role}. Please use a different email or log in.`,
      });
    }

    // Create user (unverified)
    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role,
      isVerified: false,
    });

    // Generate verification token and save
    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, user.name, verificationToken);
    } catch (emailErr) {
      console.error('Verification email failed to send:', emailErr.message);
      // Don't block registration if email fails — still created the account
    }

    // Return success but no JWT yet — user must verify first
    return res.status(201).json({
      message: `Account created! We've sent a verification email to ${user.email}. Please check your inbox and click the link to activate your account.`,
      requiresVerification: true,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'This email is already registered. Please log in.' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: messages[0] });
    }
    console.error('[POST /register]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ─── GET /api/auth/verify/:token ──────────────────────────────────────────────
// User clicks the link in email — activates their account
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }, // Token not expired
    }).select('+verificationToken +verificationExpires');

    if (!user) {
      return res.status(400).json({
        message: 'Verification link is invalid or has expired. Please register again or request a new link.',
      });
    }

    // Activate account
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Return JWT so user is logged in immediately after verifying
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

// ─── POST /api/auth/resend-verification ───────────────────────────────────────
router.post('/resend-verification', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await User.findOne({ email: email.toLowerCase() }).select('+verificationToken +verificationExpires');
    if (!user) return res.status(404).json({ message: 'No account found with this email.' });
    if (user.isVerified) return res.status(400).json({ message: 'This account is already verified.' });

    const token = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });
    await sendVerificationEmail(user.email, user.name, token);

    res.json({ message: `Verification email resent to ${user.email}.` });
  } catch (err) {
    console.error('[POST /resend-verification]', err);
    res.status(500).json({ message: 'Failed to resend email. Please try again.' });
  }
});

// ─── POST /api/auth/login ──────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and the login role tab type.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Role strict check: Ensure the selected role in the UI matches the actual DB role
    // Admins are exempt to let them log in from any block if needed or specific admin block
    if (user.role !== 'admin' && role !== 'admin') {
      if (user.role !== role) {
         return res.status(401).json({ 
           message: `This email belongs to a ${user.role} account. Please switch to the '${user.role}' tab to log in.` 
         });
      }
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Block login if email not verified (admins are pre-verified via seed)//
    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before logging in. Check your inbox for the verification link.',
        requiresVerification: true,
        email: user.email,
      });
    }

    const token = generateToken(user._id);
    return res.status(200).json(formatUser(user, token));
  } catch (err) {
    console.error('[POST /login]', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});


module.exports = router;
