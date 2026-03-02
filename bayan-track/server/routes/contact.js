import express from 'express';
import Department from '../models/Department.js';
import ContactMessage from '../models/ContactMessage.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth, optionalAuth, requireRoles } from '../middleware/auth.js';
import { makeReference } from '../utils/reference.js';

const router = express.Router();

router.get('/departments', async (_req, res) => {
  try {
    const departments = await Department.find({ active: true }).sort({ name: 1 });
    return res.json(departments);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch departments' });
  }
});

router.post('/departments', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const dept = await Department.create(req.body);
    return res.status(201).json(dept);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to create department' });
  }
});

router.put('/departments/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) {
      return res.status(404).json({ msg: 'Department not found' });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to update department' });
  }
});

router.delete('/departments/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const deleted = await Department.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Department not found' });
    }
    return res.json({ msg: 'Department removed' });
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to delete department' });
  }
});

router.post('/messages', optionalAuth, async (req, res) => {
  try {
    const referenceNo = makeReference('MSG');
    const message = await ContactMessage.create({
      ...req.body,
      referenceNo,
      user: req.user?.id || null,
    });

    if (req.user?.id) {
      await ActivityLog.create({
        user: req.user.id,
        type: 'contact-message',
        title: `Sent message to ${message.department}`,
        referenceNo,
      });
    }

    return res.status(201).json(message);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to send message' });
  }
});

router.get('/messages', auth, requireRoles('admin', 'superadmin'), async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    return res.json(messages);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch messages' });
  }
});

router.patch('/messages/:id/status', auth, requireRoles('admin', 'superadmin'), async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ['new', 'read', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    const updated = await ContactMessage.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' });
    if (!updated) {
      return res.status(404).json({ msg: 'Message not found' });
    }

    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to update message status' });
  }
});

export default router;
