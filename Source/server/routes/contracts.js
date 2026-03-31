const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Contract = require('../models/Contract');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

// ─── Multer Setup ─────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'application/zip',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Unsupported file type. Allowed: PDF, DOC, DOCX, JPG, PNG, ZIP'));
  },
});

// ─── All routes protected ─────────────────────────────────────────────────────
router.use(protect);

// @route   GET /api/contracts
// @desc    Get all contracts for logged-in user
router.get('/', async (req, res) => {
  try {
    const { status, q } = req.query;
    const filter = {
      $or: [{ user: req.user._id }, { freelancer: req.user._id }],
    };
    if (status && status !== 'all') filter.status = status;
    if (q) filter.title = { $regex: q, $options: 'i' };

    const contracts = await Contract.find(filter).sort({ updatedAt: -1 }).populate('freelancer', 'email role');
    res.json({ contracts });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   POST /api/contracts
// @desc    Create a new contract
router.post('/', async (req, res) => {
  try {
    const {
      title, content, partyA, partyB,
      startDate, endDate, value, currency, tags, status, freelancerEmail, milestones
    } = req.body;

    let freelancerId = null;
    if (freelancerEmail) {
      const user = await User.findOne({ email: freelancerEmail.toLowerCase().trim() });
      if (!user) {
        return res.status(400).json({ message: 'No registered user found with that email.' });
      }
      if (user.role !== 'freelancer') {
        return res.status(400).json({ message: 'The user with that email is not a freelancer.' });
      }
      freelancerId = user._id;
    }

    const contract = await Contract.create({
      user: req.user._id,
      title,
      content: content || '',
      partyA: partyA || {},
      partyB: partyB || {},
      startDate: startDate || null,
      endDate: endDate || null,
      value: value || 0,
      currency: currency || 'USD',
      tags: tags || [],
      status: status || 'draft',
      freelancerEmail: freelancerEmail ? freelancerEmail.toLowerCase().trim() : '',
      freelancer: freelancerId,
      milestones: milestones || [],
    });

    res.status(201).json({ message: 'Contract created!', contract });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: msgs.join(', ') });
    }
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   GET /api/contracts/:id
// @desc    Get single contract
router.get('/:id', async (req, res) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { freelancer: req.user._id }],
    }).populate('freelancer', 'email role');
    if (!contract) return res.status(404).json({ message: 'Contract not found or not authorized.' });
    res.json({ contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   PUT /api/contracts/:id
// @desc    Update a contract
router.put('/:id', async (req, res) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, user: req.user._id });
    if (!contract) return res.status(404).json({ message: 'Contract not found.' });
    if (contract.status === 'submitted') {
      return res.status(400).json({ message: 'Submitted contracts cannot be edited.' });
    }

    const allowedFields = [
      'title', 'content', 'partyA', 'partyB',
      'startDate', 'endDate', 'value', 'currency', 'tags', 'status', 'milestones',
    ];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) contract[field] = req.body[field];
    });

    if (req.body.freelancerEmail !== undefined) {
      contract.freelancerEmail = req.body.freelancerEmail;
      if (contract.freelancerEmail) {
        const user = await User.findOne({ email: contract.freelancerEmail.toLowerCase().trim() });
        if (!user) return res.status(400).json({ message: 'No registered user found with that email.' });
        if (user.role !== 'freelancer') return res.status(400).json({ message: 'User is not a freelancer.' });
        contract.freelancer = user._id;
      } else {
        contract.freelancer = null;
      }
    }

    // Prevent re-reverting a submitted contract
    if (req.body.status === 'submitted') {
      return res.status(400).json({ message: 'Use the submit endpoint to submit a contract.' });
    }

    await contract.save();
    res.json({ message: 'Contract updated!', contract });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const msgs = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: msgs.join(', ') });
    }
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   POST /api/contracts/:id/request-approval
// @desc    Client sends approval request to the freelancer
router.post('/:id/request-approval', async (req, res) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, user: req.user._id });
    if (!contract) return res.status(404).json({ message: 'Contract not found.' });
    if (!contract.freelancerEmail) return res.status(400).json({ message: 'Freelancer email is required before requesting approval.' });
    if (!contract.freelancer) return res.status(400).json({ message: 'Valid freelancer must be matched before requesting approval.' });
    
    contract.status = 'pending_approval';
    await contract.save();
    
    res.json({ message: 'Approval request sent!', contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   POST /api/contracts/:id/respond
// @desc    Freelancer approves or rejects the contract
router.post('/:id/respond', async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const contract = await Contract.findOne({ _id: req.params.id, freelancer: req.user._id });
    if (!contract) return res.status(404).json({ message: 'Contract not found.' });
    if (contract.status !== 'pending_approval') {
      return res.status(400).json({ message: 'Contract is not pending approval.' });
    }

    if (action === 'approve') {
      contract.status = 'active';
    } else if (action === 'reject') {
      contract.status = 'rejected';
    } else {
      return res.status(400).json({ message: 'Invalid action.' });
    }

    await contract.save();
    res.json({ message: `Contract ${action}d successfully.`, contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   POST /api/contracts/:id/submit
// @desc    Submit contract with optional work file upload
router.post('/:id/submit', upload.single('workFile'), async (req, res) => {
  try {
    const contract = await Contract.findOne({
      _id: req.params.id,
      $or: [{ user: req.user._id }, { freelancer: req.user._id }],
    });
    if (!contract) return res.status(404).json({ message: 'Contract not found.' });
    if (contract.status === 'submitted') {
      return res.status(400).json({ message: 'Contract already submitted.' });
    }
    if (contract.status !== 'active') {
      return res.status(400).json({ message: 'Contract must be active before submission.' });
    }

    contract.status = 'submitted';

    if (req.file) {
      contract.submittedFile = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };
    }

    await contract.save();
    res.json({ message: 'Contract submitted successfully!', contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   POST /api/contracts/:id/approve-work
// @desc    Client approves the submitted contract
router.post('/:id/approve-work', async (req, res) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, user: req.user._id });
    if (!contract) return res.status(404).json({ message: 'Contract not found.' });
    if (contract.status !== 'submitted') {
      return res.status(400).json({ message: 'Contract is not in submitted state.' });
    }
    
    contract.status = 'completed';
    await contract.save();
    res.json({ message: 'Contract work approved and completed successfully!', contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   POST /api/contracts/:id/milestones/:milestoneId/submit
// @desc    Freelancer submits work file for a milestone
router.post('/:id/milestones/:milestoneId/submit', upload.single('workFile'), async (req, res) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, freelancer: req.user._id });
    if (!contract) return res.status(404).json({ message: 'Contract not found or not authorized.' });
    if (contract.status !== 'active') return res.status(400).json({ message: 'Contract is not active.' });
    
    const milestone = contract.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found.' });
    if (milestone.status === 'submitted' || milestone.status === 'approved' || milestone.status === 'paid') {
      return res.status(400).json({ message: 'Milestone is already submitted or approved.' });
    }
    
    milestone.status = 'submitted';
    
    if (req.file) {
      milestone.submittedFile = {
        originalName: req.file.originalname,
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date(),
      };
    }
    
    await contract.save();
    res.json({ message: 'Milestone work submitted!', contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   POST /api/contracts/:id/milestones/:milestoneId/approve
// @desc    Client approves milestone
router.post('/:id/milestones/:milestoneId/approve', async (req, res) => {
  try {
    const contract = await Contract.findOne({ _id: req.params.id, user: req.user._id });
    if (!contract) return res.status(404).json({ message: 'Contract not found or not authorized.' });
    
    const milestone = contract.milestones.id(req.params.milestoneId);
    if (!milestone) return res.status(404).json({ message: 'Milestone not found.' });
    if (milestone.status !== 'submitted') {
      return res.status(400).json({ message: 'Milestone is not in submitted state.' });
    }
    
    milestone.status = 'approved';
    await contract.save();
    res.json({ message: 'Milestone approved!', contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

// @route   DELETE /api/contracts/:id
// @desc    Delete a contract
router.delete('/:id', async (req, res) => {
  try {
    const contract = await Contract.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!contract) return res.status(404).json({ message: 'Contract not found.' });
    res.json({ message: 'Contract deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
