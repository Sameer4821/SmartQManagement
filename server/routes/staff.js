const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { supabaseAdmin } = require('../supabase');

// POST /api/staff/login - Secure Staff login
router.post('/login', async (req, res) => {
  try {
    const { staff_id, password } = req.body;

    if (!staff_id || !password) {
      return res.status(400).json({ success: false, error: 'Staff ID and password are required' });
    }

    const { data: staffData, error: staffError } = await supabaseAdmin
      .from('staff_accounts')
      .select('*')
      .eq('staff_id', staff_id.trim())
      .single();

    if (staffError || !staffData) {
      return res.status(401).json({ success: false, error: 'Invalid Staff ID or Password' });
    }

    if (!staffData.is_active) {
      return res.status(403).json({ success: false, error: 'Account is deactivated. Contact hospital administrator.' });
    }

    // Verify Password: check bcrypt hash first, fallback to plaintext for initial seed
    let isMatch = false;
    if (staffData.password_hash.startsWith('$2a$') || staffData.password_hash.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, staffData.password_hash);
    } else {
      isMatch = (staffData.password_hash === password);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid Staff ID or Password' });
    }

    // Update last_login_at timestamp
    await supabaseAdmin
      .from('staff_accounts')
      .update({ last_login_at: new Date().toISOString() })
      .eq('staff_id', staff_id.trim());

    // Return safe staff info (exclude password_hash)
    const { password_hash, ...safeStaffData } = staffData;
    res.json({ success: true, data: safeStaffData });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/staff/departments - Get department queue stats
router.get('/departments', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('departments')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      // Fallback query if table is named queue
      const { data: qData, error: qErr } = await supabaseAdmin
        .from('queue_tokens')
        .select('department_name, status, created_at')
        .neq('status', 'completed');
      if (qErr) throw qErr;
      return res.json({ success: true, data: qData });
    }
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/staff/doctors - Get doctor roster & availability
router.get('/doctors', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/staff/consultations - Record clinical consultation notes
router.post('/consultations', async (req, res) => {
  try {
    const { token_id, patient_id, doctor_id, department_id, symptoms, diagnosis, clinical_notes, bp, pulse, temperature, spo2 } = req.body;

    if (!token_id || !diagnosis) {
      return res.status(400).json({ success: false, error: 'token_id and diagnosis are required' });
    }

    const { data, error } = await supabaseAdmin
      .from('consultations')
      .insert([{
        token_id,
        patient_id: patient_id || null,
        doctor_id: doctor_id || null,
        department_id: department_id || null,
        symptoms,
        diagnosis,
        clinical_notes,
        bp,
        pulse,
        temperature,
        spo2,
        status: 'completed',
        completed_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/staff/consultations/:tokenId - Get consultation details for a token
router.get('/consultations/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { data, error } = await supabaseAdmin
      .from('consultations')
      .select('*')
      .eq('token_id', tokenId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
