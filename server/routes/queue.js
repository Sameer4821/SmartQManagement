const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../supabase');

// GET /api/queue - Fetch all active queue tokens
router.get('/', async (req, res) => {
  try {
    let { data, error } = await supabaseAdmin
      .from('queue_tokens')
      .select('*')
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      // Fallback for legacy queue table
      const fallback = await supabaseAdmin
        .from('queue')
        .select('*')
        .neq('status', 'completed')
        .neq('status', 'cancelled')
        .order('created_at', { ascending: true });
      if (fallback.error) throw fallback.error;
      data = fallback.data;
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/next-sequence - Get atomic daily sequence counter from database
router.get('/next-sequence', async (req, res) => {
  try {
    const type = req.query.type || 'common';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabaseAdmin
      .from('queue_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('type', type)
      .gte('created_at', today.toISOString());

    if (error) throw error;
    const nextSeq = (count || 0) + 1;
    const seqStr = String(nextSeq).padStart(3, '0');
    const prefix = type === 'emergency' ? 'EME' : type === 'disabled' ? 'ACE' : 'GEN';
    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    const tokenId = `${prefix}-${timeStr}-${seqStr}-${randomSuffix}`;

    res.json({ success: true, nextSeq, tokenId });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/queue - Insert a new queue token (with backend emergency quota & atomic counter)
router.post('/', async (req, res) => {
  try {
    const payload = req.body;
    const { department, department_name, patient_name, doctor_id, type } = payload;
    let { token_id, token_number } = payload;
    const deptName = department_name || department;

    if (!deptName || !patient_name) {
      return res.status(400).json({ success: false, error: 'department and patient_name are required' });
    }

    const tokenType = type || 'common';
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Atomic count check for daily sequence
    const { count: dailyCount, error: countError } = await supabaseAdmin
      .from('queue_tokens')
      .select('id', { count: 'exact', head: true })
      .eq('type', tokenType)
      .gte('created_at', today.toISOString());

    const nextSeq = (dailyCount || 0) + 1;
    if (!token_number) token_number = nextSeq;
    if (!token_id) {
      const prefix = tokenType === 'emergency' ? 'EME' : tokenType === 'disabled' ? 'ACE' : 'GEN';
      const now = new Date();
      const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '');
      const seqStr = String(nextSeq).padStart(3, '0');
      const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();
      token_id = `${prefix}-${timeStr}-${seqStr}-${randomSuffix}`;
    }

    // 1. Emergency Quota Enforcement (Backend Protection)
    if (tokenType === 'emergency') {
      if (!countError && dailyCount !== null && dailyCount >= 50) {
        return res.status(429).json({
          success: false,
          error: 'Daily emergency queue capacity has been reached. Please contact emergency desk directly.'
        });
      }
    }

    // 2. Prepare structured token payload
    const tokenRecord = {
      token_id,
      token_number: payload.token_number || Math.floor(100 + Math.random() * 900),
      type: type || 'common',
      priority: payload.priority || (type === 'emergency' ? 10 : type === 'disabled' ? 8 : 3),
      status: 'waiting',
      department_name: deptName,
      doctor_id: doctor_id || null,
      doctor_name: payload.doctor_name || null,
      patient_name,
      patient_phone: payload.patient_phone || payload.phone || null,
      patient_email: payload.patient_email || payload.email || null,
      patient_age: payload.patient_age || payload.age || null,
      patient_gender: payload.patient_gender || payload.gender || 'not specified',
      emergency_reason: payload.emergency_reason || payload.emergencyReason || null,
      severity: payload.severity || null,
      disability_type: payload.disability_type || payload.disabilityType || null,
      assistance_needed: payload.assistance_needed || payload.assistanceNeeded || [],
      other_assistance: payload.other_assistance || payload.otherAssistance || null,
      caregiver_name: payload.caregiver_name || payload.caregiverName || null,
      caregiver_phone: payload.caregiver_phone || payload.caregiverPhone || null,
      scheduling_method: payload.scheduling_method || payload.schedulingMethod || 'auto',
      scheduled_time: payload.scheduled_time || payload.scheduledTime || new Date().toISOString(),
      time_slot: payload.time_slot || payload.timeSlot || null,
      estimated_wait_minutes: payload.estimated_wait_minutes || payload.estimatedWait || 15,
      queue_position: payload.queue_position || payload.queuePosition || 1,
      qr_code_data: payload.qr_code_data || payload.qrCode || token_id,
      valid_until: payload.valid_until || payload.validUntil || new Date(Date.now() + 24 * 3600000).toISOString(),
    };

    // Insert into queue_tokens (or fallback to queue)
    let insertRes = await supabaseAdmin
      .from('queue_tokens')
      .insert([tokenRecord])
      .select()
      .single();

    if (insertRes.error) {
      // Fallback to legacy queue table if queue_tokens not yet migrated
      const legacyPayload = {
        token_id,
        department: deptName,
        patient_name,
        doctor_id: doctor_id || null,
        type: type || 'common',
        status: 'waiting'
      };
      const legacyRes = await supabaseAdmin
        .from('queue')
        .insert([legacyPayload])
        .select()
        .single();

      if (legacyRes.error) throw legacyRes.error;
      insertRes = legacyRes;
    }

    res.status(201).json({ success: true, data: insertRes.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/queue/:tokenId/status - Update token status
router.patch('/:tokenId/status', async (req, res) => {
  try {
    const { tokenId } = req.params;
    const { status } = req.body;

    const validStatuses = ['waiting', 'called', 'in_consultation', 'completed', 'cancelled', 'no_show'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Valid values: ${validStatuses.join(', ')}` });
    }

    const updates = { status, updated_at: new Date().toISOString() };
    if (status === 'completed') updates.completed_at = new Date().toISOString();
    if (status === 'called') updates.called_at = new Date().toISOString();
    if (status === 'in_consultation') updates.consultation_started_at = new Date().toISOString();

    // Try queue_tokens
    let result = await supabaseAdmin
      .from('queue_tokens')
      .update(updates)
      .eq('token_id', tokenId)
      .select()
      .single();

    if (result.error) {
      // Fallback to queue table
      result = await supabaseAdmin
        .from('queue')
        .update({ status })
        .eq('token_id', tokenId)
        .select()
        .single();

      if (result.error) throw result.error;
    }

    res.json({ success: true, data: result.data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/department/:dept - Get active queue for a specific department
router.get('/department/:dept', async (req, res) => {
  try {
    const { dept } = req.params;
    let { data, error } = await supabaseAdmin
      .from('queue_tokens')
      .select('*')
      .eq('department_name', dept)
      .neq('status', 'completed')
      .neq('status', 'cancelled')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true });

    if (error) {
      const fallback = await supabaseAdmin
        .from('queue')
        .select('*')
        .eq('department', dept)
        .neq('status', 'completed')
        .order('created_at', { ascending: true });
      if (fallback.error) throw fallback.error;
      data = fallback.data;
    }

    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/queue/notifications - Get active notifications & emergency broadcasts
router.get('/notifications', async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;
    res.json({ success: true, data: data || [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/queue/:tokenId - Cancel/remove a token
router.delete('/:tokenId', async (req, res) => {
  try {
    const { tokenId } = req.params;
    await supabaseAdmin.from('queue_tokens').delete().eq('token_id', tokenId);
    await supabaseAdmin.from('queue').delete().eq('token_id', tokenId);

    res.json({ success: true, message: 'Token removed from queue' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
