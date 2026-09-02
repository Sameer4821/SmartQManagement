const express = require('express');
const router = express.Router();
const { supabase } = require('../supabase');

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/auth/signup - Sign up new user
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      return res.status(400).json({ success: false, error: 'Please provide a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          name: (name || '').trim(),
          phone: (phone || '').trim(),
          createdAt: new Date().toISOString()
        }
      }
    });

    if (error) {
      if (error.message.includes('already') || error.message.includes('registered')) {
        return res.status(409).json({ success: false, error: 'This email is already registered. Please sign in instead.' });
      }
      return res.status(400).json({ success: false, error: error.message });
    }

    const isConfirmed = Boolean(data.user?.email_confirmed_at);
    res.status(201).json({
      success: true,
      requiresVerification: !isConfirmed,
      data: { user: data.user, session: data.session }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/verify-otp - Verify email confirmation code
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, token, type } = req.body;

    if (!email || !token) {
      return res.status(400).json({ success: false, error: 'Email and verification code are required' });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: token.trim(),
      type: type || 'signup'
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.json({ success: true, data: { user: data.user, session: data.session } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/resend-otp - Resend confirmation code
router.post('/resend-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim()
    });

    if (error) {
      return res.status(400).json({ success: false, error: error.message });
    }

    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/signin - Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      if (error.message.toLowerCase().includes('email not confirmed') || error.message.toLowerCase().includes('unconfirmed')) {
        return res.status(403).json({
          success: false,
          requiresVerification: true,
          error: 'Email not verified. Please enter the verification code sent to your email.'
        });
      }
      return res.status(401).json({ success: false, error: error.message });
    }

    if (data?.user && !data.user.email_confirmed_at && !data.session) {
      return res.status(403).json({
        success: false,
        requiresVerification: true,
        error: 'Email not verified. Please enter the verification code sent to your email.'
      });
    }

    res.json({ success: true, data: { user: data.user, session: data.session } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/signout - Sign out
router.post('/signout', async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
