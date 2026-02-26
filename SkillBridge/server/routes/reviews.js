const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const User = require('../models/User');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// POST /api/reviews — leave a review
router.post('/', protect, async (req, res) => {
  try {
    const { project, receiver, rating, comment } = req.body;

    const projectDoc = await Project.findById(project);
    if (!projectDoc) return res.status(404).json({ message: 'Project not found' });
    if (projectDoc.status !== 'completed') {
      return res.status(400).json({ message: 'Can only review completed projects' });
    }

    // Check reviewer is part of the project
    const isBusiness = projectDoc.business.toString() === req.user._id.toString();
    const isStudent =
      projectDoc.assignedStudent &&
      projectDoc.assignedStudent.toString() === req.user._id.toString();

    if (!isBusiness && !isStudent) {
      return res.status(403).json({ message: 'You are not part of this project' });
    }

    // Prevent self-review
    if (req.user._id.toString() === receiver) {
      return res.status(400).json({ message: 'Cannot review yourself' });
    }

    const existingReview = await Review.findOne({ project, reviewer: req.user._id });
    if (existingReview) {
      return res.status(400).json({ message: 'You already reviewed this project' });
    }

    const review = await Review.create({
      project,
      reviewer: req.user._id,
      receiver,
      rating,
      comment,
    });

    // Update receiver's average rating
    const allReviews = await Review.find({ receiver });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(receiver, {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: allReviews.length,
    });

    const populated = await review.populate('reviewer', 'name role');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews/user/:userId — get all reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ receiver: req.params.userId })
      .populate('reviewer', 'name role')
      .populate('project', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/reviews/project/:projectId — get reviews for a project
router.get('/project/:projectId', async (req, res) => {
  try {
    const reviews = await Review.find({ project: req.params.projectId })
      .populate('reviewer', 'name role')
      .populate('receiver', 'name role');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
