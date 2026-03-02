import express from 'express';
import IssueReport from '../models/IssueReport.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth, optionalAuth, requireRoles } from '../middleware/auth.js';
import { makeReference } from '../utils/reference.js';

const router = express.Router();

router.post('/', optionalAuth, async (req, res) => {
  try {
    const referenceNo = makeReference('RPT');
    const payload = {
      ...req.body,
      referenceNo,
      user: req.user?.id || null,
    };

    const report = await IssueReport.create(payload);

    if (req.user?.id) {
      await ActivityLog.create({
        user: req.user.id,
        type: 'issue-report',
        title: `Submitted issue report: ${report.category}`,
        referenceNo,
      });
    }

    return res.status(201).json(report);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to submit report' });
  }
});

router.get('/', auth, requireRoles('admin', 'superadmin'), async (_req, res) => {
  try {
    const reports = await IssueReport.find().sort({ createdAt: -1 });
    return res.json(reports);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch reports' });
  }
});

router.patch('/:id/status', auth, requireRoles('admin', 'superadmin'), async (req, res) => {
  try {
    const { status, adminChecked } = req.body;

    if (req.user.role === 'admin' && status && status !== 'in-review') {
      return res.status(403).json({ msg: 'Admin can only move reports to in-review' });
    }

    const update = {};
    if (status) update.status = status;
    if (typeof adminChecked === 'boolean') update.adminChecked = adminChecked;

    const report = await IssueReport.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' });
    if (!report) {
      return res.status(404).json({ msg: 'Report not found' });
    }

    return res.json(report);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to update report' });
  }
});

export default router;
