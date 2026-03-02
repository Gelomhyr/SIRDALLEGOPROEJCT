import express from 'express';
import Official from '../models/Official.js';
import { auth, requireRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const officials = await Official.find({ active: true }).sort({ level: 1, rankOrder: 1, createdAt: 1 });
    return res.json(officials);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch officials' });
  }
});

router.post('/', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const official = await Official.create(req.body);
    return res.status(201).json(official);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to create official' });
  }
});

router.put('/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const official = await Official.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!official) return res.status(404).json({ msg: 'Official not found' });
    return res.json(official);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to update official' });
  }
});

router.delete('/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const official = await Official.findByIdAndDelete(req.params.id);
    if (!official) return res.status(404).json({ msg: 'Official not found' });
    return res.json({ msg: 'Official removed' });
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to delete official' });
  }
});

export default router;
