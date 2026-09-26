import Task from '../models/Task.js';
import Equipment from '../models/Equipment.js';

// Generate unique task ID
const generateTaskId = async () => {
  const count = await Task.countDocuments();
  return `TSK-${String(count + 501).padStart(3, '0')}`;
};

export const getTasks = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50, status, technician, equipmentId } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { equipmentName: { $regex: search, $options: 'i' } },
        { technician: { $regex: search, $options: 'i' } },
        { id: { $regex: search, $options: 'i' } }
      ];
    }
    if (status) {
      query.status = status;
    }
    if (technician) {
      query.technician = { $regex: technician, $options: 'i' };
    }
    if (equipmentId) {
      query.equipmentId = equipmentId;
    }

    // If user is a technician, only show their tasks
    if (req.user.role?.toLowerCase() === 'technician') {
      query.technicianId = req.user.sub;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const tasks = await Task.find(query)
      .populate('equipmentId', 'id name department location')
      .populate('technicianId', 'name email')
      .sort({ dueDate: 1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Task.countDocuments(query);

    res.json({
      tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ id: req.params.id })
      .populate('equipmentId', 'id name department location vendor')
      .populate('technicianId', 'name email whatsapp')
      .populate('completedBy', 'name email')
      .lean();
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const {
      equipmentName,
      equipmentId,
      technician,
      technicianId,
      dueDate,
      status,
      priority,
      description,
      maintenanceFrequency
    } = req.body;

    if (!equipmentName || !technician || !dueDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = await generateTaskId();
    const task = await Task.create({
      id,
      equipmentName,
      equipmentId: equipmentId || undefined,
      technician,
      technicianId: technicianId || undefined,
      dueDate: new Date(dueDate),
      status: status || 'Pending',
      priority: priority || 'Medium',
      description: description || '',
    });

    // Update equipment's next service date if provided
    if (equipmentId && maintenanceFrequency) {
      const equipment = await Equipment.findById(equipmentId);
      if (equipment) {
        const nextDate = new Date(dueDate);
        if (maintenanceFrequency === 'Monthly') {
          nextDate.setMonth(nextDate.getMonth() + 1);
        } else if (maintenanceFrequency === 'Quarterly') {
          nextDate.setMonth(nextDate.getMonth() + 3);
        } else if (maintenanceFrequency === 'Bi-Annually') {
          nextDate.setMonth(nextDate.getMonth() + 6);
        } else if (maintenanceFrequency === 'Yearly') {
          nextDate.setFullYear(nextDate.getFullYear() + 1);
        }
        equipment.nextServiceDate = nextDate;
        await equipment.save();
      }
    }

    const populated = await Task.findById(task._id)
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Task ID already exists' });
    }
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const {
      equipmentName,
      technician,
      technicianId,
      dueDate,
      status,
      whatsappStatus,
      aiStatus,
      priority,
      description,
      notes,
      completedAt,
      escalationLevel,
      escalatedTo
    } = req.body;

    if (equipmentName) task.equipmentName = equipmentName;
    if (technician) task.technician = technician;
    if (technicianId) task.technicianId = technicianId;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (status) {
      task.status = status;
      if (status === 'Completed' && !task.completedAt) {
        task.completedAt = new Date();
        task.completedBy = req.user.sub;
      }
    }
    if (whatsappStatus) task.whatsappStatus = whatsappStatus;
    if (aiStatus) task.aiStatus = aiStatus;
    if (priority) task.priority = priority;
    if (description !== undefined) task.description = description;
    if (notes !== undefined) task.notes = notes;
    if (completedAt) task.completedAt = new Date(completedAt);
    if (escalationLevel) {
      task.escalationLevel = escalationLevel;
      task.escalationDate = new Date();
    }
    if (escalatedTo !== undefined) task.escalatedTo = escalatedTo;

    await task.save();

    const populated = await Task.findById(task._id)
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .lean();

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ id: req.params.id });
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Task.deleteOne({ _id: task._id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

