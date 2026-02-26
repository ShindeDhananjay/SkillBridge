const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// POST /api/bids — submit a bid (student only)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { project, amount, timeline, coverMessage } = req.body;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ message: 'Project not found' });
    if (projectDoc.status !== 'open') {
      return res.status(400).json({ message: 'Project is not accepting bids' });
    }

    const existingBid = await Bid.findOne({ project, student: req.user._id });
    if (existingBid) {
      return res.status(400).json({ message: 'You have already bid on this project' });
    }

    const bid = await Bid.create({
      project,
      student: req.user._id,
      amount,
      timeline,
      coverMessage,
    });

    const populatedBid = await bid.populate('student', 'name email university skills averageRating');
    res.status(201).json(populatedBid);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/bids/project/:projectId — get all bids for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const bids = await Bid.find({ project: req.params.projectId })
      .populate('student', 'name email university skills averageRating totalReviews')
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/bids/my — get logged-in student's bids
router.get('/my', protect, authorize('student'), async (req, res) => {
  try {
    const bids = await Bid.find({ student: req.user._id })
      .populate({
        path: 'project',
        populate: { path: 'business', select: 'name businessName' },
      })
      .sort({ createdAt: -1 });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/bids/:id/accept — accept a bid (business only)
router.put('/:id/accept', protect, authorize('business'), async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('project');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    if (bid.project.business.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (bid.project.status !== 'open') {
      return res.status(400).json({ message: 'Project is not accepting bids' });
    }

    // Accept this bid
    bid.status = 'accepted';
    await bid.save();

    // Reject all other bids
    await Bid.updateMany(
      { project: bid.project._id, _id: { $ne: bid._id } },
      { status: 'rejected' }
    );

    // Update project status
    const project = await Project.findById(bid.project._id);
    project.status = 'in-progress';
    project.assignedStudent = bid.student;
    project.acceptedBid = bid._id;
    await project.save();

    res.json({ message: 'Bid accepted successfully', bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/bids/:id/reject — reject a bid (business only)
router.put('/:id/reject', protect, authorize('business'), async (req, res) => {
  try {
    const bid = await Bid.findById(req.params.id).populate('project');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });

    if (bid.project.business.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    bid.status = 'rejected';
    await bid.save();

    res.json({ message: 'Bid rejected', bid });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
