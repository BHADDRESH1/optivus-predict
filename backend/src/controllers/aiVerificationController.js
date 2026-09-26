import Task from '../models/Task.js';

export const verifyTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const { verificationResult, notes } = req.body;

    const task = await Task.findOne({ id: taskId });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Simulate AI verification
    // In a real implementation, this would call an AI service
    let aiStatus = 'Processing';
    if (verificationResult === 'match') {
      aiStatus = 'Verified';
    } else if (verificationResult === 'mismatch') {
      aiStatus = 'Rejected';
    } else {
      aiStatus = 'Needs Review';
    }

    task.aiStatus = aiStatus;
    if (notes) {
      task.notes = (task.notes || '') + '\nAI Verification: ' + notes;
    }

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .lean();

    res.json({
      task: populated,
      verification: {
        status: aiStatus,
        result: verificationResult,
        notes: notes || ''
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPendingVerifications = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      aiStatus: { $in: ['Processing', 'Needs Review'] }
    })
    .populate('equipmentId', 'id name department')
    .populate('technicianId', 'name email')
    .sort({ createdAt: -1 })
    .lean();

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

