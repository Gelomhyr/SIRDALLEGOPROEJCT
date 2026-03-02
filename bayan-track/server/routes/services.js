import express from 'express';
import ServiceRequest from '../models/ServiceRequest.js';
import ServiceCatalog from '../models/ServiceCatalog.js';
import ActivityLog from '../models/ActivityLog.js';
import { auth, requireRoles } from '../middleware/auth.js';
import { makeReference } from '../utils/reference.js';

const router = express.Router();

const SERVICE_CATALOG = [
  {
    code: 'barangay-clearance',
    title: 'Barangay Clearance',
    desc: 'Official document certifying good moral character and residency.',
    usage: 'Employment, Bank Accounts',
    requirements: ['Valid ID', 'Recent Cedula'],
    time: '15 Mins',
  },
  {
    code: 'certificate-of-indigency',
    title: 'Certificate of Indigency',
    desc: 'Certification of financial status for assistance programs.',
    usage: 'Medical Assistance, Scholarships',
    requirements: ['Valid ID', 'Purok Leader Endorsement'],
    time: '15 Mins',
  },
  {
    code: 'barangay-id',
    title: 'Barangay ID',
    desc: 'Identification card for verified barangay residents.',
    usage: 'Barangay Transactions, Identity Verification',
    requirements: ['Valid ID', 'Proof of Residency', '2x2 Photo'],
    time: '20 Mins',
  },
];

async function seedCatalogIfNeeded() {
  const count = await ServiceCatalog.countDocuments();
  if (count === 0) {
    await ServiceCatalog.insertMany(
      SERVICE_CATALOG.map((item, idx) => ({
        ...item,
        active: true,
        sortOrder: idx + 1,
      })),
    );
  }
}

router.get('/catalog', (_req, res) => {
  return seedCatalogIfNeeded()
    .then(async () => {
      const rows = await ServiceCatalog.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
      return res.json(rows);
    })
    .catch(() => res.status(500).json({ msg: 'Failed to fetch service catalog' }));
});

router.get('/catalog/all', auth, requireRoles('admin', 'superadmin'), async (_req, res) => {
  try {
    await seedCatalogIfNeeded();
    const rows = await ServiceCatalog.find().sort({ sortOrder: 1, createdAt: 1 });
    return res.json(rows);
  } catch (_err) {
    return res.status(500).json({ msg: 'Failed to fetch service catalog' });
  }
});

router.post('/catalog', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const payload = {
      ...req.body,
      code: String(req.body.code || '').trim().toLowerCase(),
    };
    if (!payload.code || !payload.title) {
      return res.status(400).json({ msg: 'Service code and title are required.' });
    }
    const created = await ServiceCatalog.create(payload);
    return res.status(201).json(created);
  } catch (_err) {
    return res.status(400).json({ msg: 'Failed to create service catalog item' });
  }
});

router.put('/catalog/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const updated = await ServiceCatalog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' },
    );
    if (!updated) return res.status(404).json({ msg: 'Service catalog item not found' });
    return res.json(updated);
  } catch (_err) {
    return res.status(400).json({ msg: 'Failed to update service catalog item' });
  }
});

router.patch('/catalog/:id/archive', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const { active } = req.body;
    const updated = await ServiceCatalog.findByIdAndUpdate(
      req.params.id,
      { active: Boolean(active) },
      { returnDocument: 'after' },
    );
    if (!updated) return res.status(404).json({ msg: 'Service catalog item not found' });
    return res.json(updated);
  } catch (_err) {
    return res.status(400).json({ msg: 'Failed to archive service catalog item' });
  }
});

router.delete('/catalog/:id', auth, requireRoles('superadmin'), async (req, res) => {
  try {
    const deleted = await ServiceCatalog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Service catalog item not found' });
    return res.json({ msg: 'Service catalog item removed' });
  } catch (_err) {
    return res.status(400).json({ msg: 'Failed to delete service catalog item' });
  }
});

router.post('/requests', auth, async (req, res) => {
  try {
    const referenceNo = makeReference('SVC');
    const request = await ServiceRequest.create({
      ...req.body,
      user: req.user.id,
      referenceNo,
      history: [{ status: 'pending', by: req.user.id, note: 'Request submitted' }],
    });

    await ActivityLog.create({
      user: req.user.id,
      type: 'service-request',
      title: `Submitted ${request.serviceType}`,
      referenceNo,
    });

    return res.status(201).json(request);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to submit service request' });
  }
});

router.get('/requests/me', auth, async (req, res) => {
  try {
    const items = await ServiceRequest.find({ user: req.user.id }).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch your requests' });
  }
});

router.get('/requests/track/:referenceNo', auth, async (req, res) => {
  try {
    const item = await ServiceRequest.findOne({ referenceNo: req.params.referenceNo });
    if (!item) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    if (req.user.role === 'resident' && item.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Forbidden' });
    }

    return res.json(item);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to track request' });
  }
});

router.get('/requests', auth, requireRoles('admin', 'superadmin'), async (_req, res) => {
  try {
    const items = await ServiceRequest.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to fetch requests' });
  }
});

router.patch('/requests/:id/status', auth, requireRoles('admin', 'superadmin'), async (req, res) => {
  try {
    const { status, note } = req.body;

    if (req.user.role === 'admin' && status && !['in-review'].includes(status)) {
      return res.status(403).json({ msg: 'Admin can only set status to in-review' });
    }

    const item = await ServiceRequest.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ msg: 'Request not found' });
    }

    if (status) {
      item.status = status;
      item.history.push({ status, by: req.user.id, note: note || '' });
    }

    await item.save();

    await ActivityLog.create({
      user: item.user,
      type: 'service-request',
      title: `Service request updated to ${item.status}`,
      referenceNo: item.referenceNo,
      metadata: { byRole: req.user.role },
    });

    return res.json(item);
  } catch (err) {
    return res.status(400).json({ msg: 'Failed to update request status' });
  }
});

export default router;
