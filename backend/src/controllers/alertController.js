import Alert from '../models/Alert.js';
import Task from '../models/Task.js';
import Equipment from '../models/Equipment.js';

// Generate unique alert ID
const generateAlertId = async () => {
  const count = await Alert.countDocuments();
  return `ALT-${String(count + 1).padStart(3, '0')}`;
};

export const getAlerts = async (req, res, next) => {
  try {
    const { status, level, priority, equipmentId } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      // Default to active alerts
      query.status = 'Active';
    }
    if (level) {
      query.level = level;
    }
    if (priority) {
      query.priority = priority;
    }
    if (equipmentId) {
      query.equipmentId = equipmentId;
    }

    const alerts = await Alert.find(query)
      .populate('equipmentId', 'id name department location')
      .populate('escalatedToId', 'name email whatsapp')
      .populate('resolvedBy', 'name email')
      .populate('taskId', 'id equipmentName status')
      .sort({ priority: -1, daysOverdue: -1, createdAt: -1 })
      .lean();

    res.json(alerts);
  } catch (err) {
    next(err);
  }
};

export const getAlertById = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({ id: req.params.id })
      .populate('equipmentId', 'id name department location vendor')
      .populate('escalatedToId', 'name email whatsapp')
      .populate('resolvedBy', 'name email')
      .populate('taskId', 'id equipmentName status')
      .lean();
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    res.json(alert);
  } catch (err) {
    next(err);
  }
};

export const createAlert = async (req, res, next) => {
  try {
    const {
      equipment,
      equipmentId,
      issue,
      daysOverdue,
      level,
      escalatedTo,
      escalatedToId,
      priority,
      taskId
    } = req.body;

    if (!equipment || !issue) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = await generateAlertId();
    const alert = await Alert.create({
      id,
      equipment,
      equipmentId: equipmentId || undefined,
      issue,
      daysOverdue: daysOverdue || 0,
      level: level || 'Technician',
      escalatedTo: escalatedTo || '',
      escalatedToId: escalatedToId || undefined,
      priority: priority || 'High',
      taskId: taskId || undefined,
    });

    const populated = await Alert.findById(alert._id)
      .populate('equipmentId', 'id name department')
      .populate('escalatedToId', 'name email')
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Alert ID already exists' });
    }
    next(err);
  }
};

export const updateAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({ id: req.params.id });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    const {
      equipment,
      issue,
      daysOverdue,
      level,
      escalatedTo,
      escalatedToId,
      status,
      priority,
      resolutionNotes
    } = req.body;

    if (equipment) alert.equipment = equipment;
    if (issue) alert.issue = issue;
    if (daysOverdue !== undefined) alert.daysOverdue = daysOverdue;
    if (level) alert.level = level;
    if (escalatedTo !== undefined) alert.escalatedTo = escalatedTo;
    if (escalatedToId !== undefined) alert.escalatedToId = escalatedToId;
    if (status) {
      alert.status = status;
      if (status === 'Resolved' && !alert.resolvedAt) {
        alert.resolvedAt = new Date();
        alert.resolvedBy = req.user.sub;
      }
    }
    if (priority) alert.priority = priority;
    if (resolutionNotes !== undefined) alert.resolutionNotes = resolutionNotes;

    await alert.save();

    const populated = await Alert.findById(alert._id)
      .populate('equipmentId', 'id name department')
      .populate('escalatedToId', 'name email')
      .lean();

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

export const deleteAlert = async (req, res, next) => {
  try {
    const alert = await Alert.findOne({ id: req.params.id });
    
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    await Alert.deleteOne({ _id: alert._id });
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    next(err);
  }
};

// Auto-create alerts for overdue tasks
export const checkOverdueTasks = async (req, res, next) => {
  try {
    const now = new Date();
    const overdueTasks = await Task.find({
      status: { $in: ['Pending', 'Scheduled', 'In Progress'] },
      dueDate: { $lt: now }
    }).populate('equipmentId').lean();

    const createdAlerts = [];
    for (const task of overdueTasks) {
      const daysOverdue = Math.floor((now - new Date(task.dueDate)) / (1000 * 60 * 60 * 24));
      
      // Check if alert already exists for this task
      const existingAlert = await Alert.findOne({ taskId: task._id, status: 'Active' });
      if (existingAlert) {
        // Update days overdue
        existingAlert.daysOverdue = daysOverdue;
        await existingAlert.save();
        continue;
      }

      // Determine escalation level based on days overdue
      let level = 'Technician';
      if (daysOverdue >= 72) level = 'Management';
      else if (daysOverdue >= 48) level = 'Vendor';
      else if (daysOverdue >= 24) level = 'Supervisor';

      const alertId = await generateAlertId();
      const alert = await Alert.create({
        id: alertId,
        equipment: task.equipmentName,
        equipmentId: task.equipmentId?._id,
        issue: `Preventive Maintenance Overdue - ${daysOverdue} days`,
        daysOverdue,
        level,
        escalatedTo: task.technician,
        escalatedToId: task.technicianId,
        priority: daysOverdue >= 72 ? 'Critical' : daysOverdue >= 48 ? 'High' : 'Medium',
        taskId: task._id,
      });

      createdAlerts.push(alert);
    }

    res.json({ 
      message: `Checked ${overdueTasks.length} tasks, created/updated ${createdAlerts.length} alerts`,
      alerts: createdAlerts
    });
  } catch (err) {
    next(err);
  }
};

