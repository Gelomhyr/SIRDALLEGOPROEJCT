import express from 'express';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
import ServiceRequest from '../models/ServiceRequest.js';
import IssueReport from '../models/IssueReport.js';
import ContactMessage from '../models/ContactMessage.js';
import Announcement from '../models/Announcement.js';
import Subscription from '../models/Subscription.js';
import SystemSetting from '../models/SystemSetting.js';
import { auth, requireRoles } from '../middleware/auth.js';

const router = express.Router();

async function getOrCreateSettings() {
  let settings = await SystemSetting.findOne();
  if (!settings) {
    settings = await SystemSetting.create({});
  }
  return settings;
}

router.get('/users', auth, requireRoles('admin', 'superadmin'), async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return res.json(users);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch users' });
  }
});

router.patch('/users/:id/status', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const { status, role, validIdStatus } = req.body;
    const update = {};

    if (status) update.status = status;
    if (role && ['resident', 'admin', 'superadmin'].includes(role)) update.role = role;
    if (validIdStatus && ['pending', 'approved', 'rejected'].includes(validIdStatus)) {
      update.validIdStatus = validIdStatus;
    }
    if (status === 'active') {
      update.validIdStatus = 'approved';
    }
    if (status === 'suspended') {
      update.validIdStatus = 'rejected';
    }

    const user = await User.findByIdAndUpdate(req.params.id, update, { returnDocument: 'after' }).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // When account is archived/suspended, also archive linked resident submissions.
    if (status === 'suspended') {
      await ServiceRequest.updateMany({ user: user._id }, { status: 'rejected' });
      await IssueReport.updateMany({ user: user._id }, { status: 'rejected', adminChecked: true, user: null });
      await ContactMessage.updateMany({ user: user._id }, { status: 'closed', user: null });
      await Subscription.updateMany({ createdBy: user._id }, { status: 'unsubscribed', createdBy: null });
      await Announcement.updateMany({ createdBy: user._id }, { createdBy: null });
    }

    return res.json(user);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to update user' });
  }
});

router.delete('/users/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.role === 'superadmin' && user.username === 'superAdmin123') {
      return res.status(400).json({ msg: 'Protected superadmin account cannot be deleted.' });
    }

    await Promise.all([
      ServiceRequest.deleteMany({ user: user._id }),
      IssueReport.deleteMany({ user: user._id }),
      ContactMessage.deleteMany({ user: user._id }),
      ActivityLog.deleteMany({ user: user._id }),
      Subscription.deleteMany({ createdBy: user._id }),
      Announcement.updateMany({ createdBy: user._id }, { createdBy: null }),
      User.deleteOne({ _id: user._id }),
    ]);

    return res.json({ msg: 'User and linked records deleted' });
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to delete user' });
  }
});

router.get('/activity/me', auth, async (req, res) => {
  try {
    const activities = await ActivityLog.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(50);
    return res.json(activities);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch activity logs' });
  }
});

router.get('/system-settings', auth, requireRoles('admin', 'superadmin'), async (_req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return res.json(settings);
  } catch (_err) {
    return res.status(500).json({ msg: 'Failed to fetch system settings' });
  }
});

router.patch('/system-settings', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const allowed = [
      'autoArchiveReports',
      'requireAnnouncementReview',
      'emailDigest',
      'allowResidentRegistration',
      'maintenanceMode',
      'maintenanceMessage',
      'sessionTimeoutMinutes',
      'lockoutWindowMinutes',
    ];
    const update = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    }

    const settings = await getOrCreateSettings();
    const updated = await SystemSetting.findByIdAndUpdate(
      settings._id,
      { $set: update },
      { returnDocument: 'after' },
    );
    return res.json(updated);
  } catch (_err) {
    return res.status(400).json({ msg: 'Failed to update system settings' });
  }
});

export default router;
