const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, authorize } = require('../middleware/auth');

// GET /api/projects — list all open projects (public)
router.get('/', async (req, res) => {
  try {
    const { skill, search, status } = req.query;
    let filter = {};

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'open';
    }

    if (skill) {
      filter.requiredSkills = { $in: [new RegExp(skill, 'i')] };
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const projects = await Project.find(filter)
      .populate('business', 'name businessName averageRating')
      .populate('assignedStudent', 'name')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/my — get logged-in business's projects
router.get('/my', protect, authorize('business'), async (req, res) => {
  try {
    const projects = await Project.find({ business: req.user._id })
      .populate('assignedStudent', 'name email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/assigned — get student's assigned projects
router.get('/assigned', protect, authorize('student'), async (req, res) => {
  try {
    const projects = await Project.find({ assignedStudent: req.user._id })
      .populate('business', 'name businessName')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/:id — single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('business', 'name businessName email averageRating totalReviews')
      .populate('assignedStudent', 'name email averageRating');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/projects — create project (business only)
router.post('/', protect, authorize('business'), async (req, res) => {
  try {
    const { title, description, requiredSkills, budgetMin, budgetMax, deadline } = req.body;
    const project = await Project.create({
      title,
      description,
      requiredSkills,
      budgetMin,
      budgetMax,
      deadline,
      business: req.user._id,
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/projects/:id — update project (owner only)
router.put('/:id', protect, authorize('business'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.business.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, requiredSkills, budgetMin, budgetMax, deadline } = req.body;
    project.title = title || project.title;
    project.description = description || project.description;
    project.requiredSkills = requiredSkills || project.requiredSkills;
    project.budgetMin = budgetMin || project.budgetMin;
    project.budgetMax = budgetMax || project.budgetMax;
    project.deadline = deadline || project.deadline;

    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/projects/:id/complete — mark project as completed
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isBusiness = project.business.toString() === req.user._id.toString();
    const isStudent = project.assignedStudent && project.assignedStudent.toString() === req.user._id.toString();

    if (!isBusiness && !isStudent) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    project.status = 'completed';
    const updated = await project.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/projects/:id — delete project (owner only, only if open)
router.delete('/:id', protect, authorize('business'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (project.business.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (project.status !== 'open') {
      return res.status(400).json({ message: 'Can only delete open projects' });
    }
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
