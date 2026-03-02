import express from 'express';
import Announcement from '../models/Announcement.js';
import { auth, requireRoles } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { module, search, featured, limit } = req.query;
    const query = {};

    if (module && module !== 'all-news-updates') {
      query.module = module;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const max = Number(limit) > 0 ? Number(limit) : 50;
    const items = await Announcement.find(query).sort({ createdAt: -1 }).limit(max);
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch announcements' });
  }
});

router.post('/', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user.id,
    };
    const item = await Announcement.create(payload);
    return res.status(201).json(item);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to create announcement' });
  }
});

router.put('/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const updated = await Announcement.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
    if (!updated) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }
    return res.json(updated);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to update announcement' });
  }
});

router.delete('/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: 'Announcement not found' });
    }
    return res.json({ msg: 'Announcement removed' });
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to delete announcement' });
  }
});

export default router;
