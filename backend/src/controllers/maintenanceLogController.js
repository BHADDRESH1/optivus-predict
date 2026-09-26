import MaintenanceLog from '../models/MaintenanceLog.js';
import Equipment from '../models/Equipment.js';

export const getMaintenanceLogs = async (req, res, next) => {
  try {
    const { equipmentId, technicianId, type, page = 1, limit = 50 } = req.query;
    const query = {};

    if (equipmentId) {
      query.equipmentId = equipmentId;
    }
    if (technicianId) {
      query.technicianId = technicianId;
    }
    if (type) {
      query.type = type;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const logs = await MaintenanceLog.find(query)
      .populate('equipmentId', 'id name department location')
      .populate('technicianId', 'name email')
      .sort({ completedDate: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await MaintenanceLog.countDocuments(query);

    res.json({
      logs,
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

export const getMaintenanceLogById = async (req, res, next) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id)
      .populate('equipmentId', 'id name department location vendor')
      .populate('technicianId', 'name email whatsapp')
      .lean();
    
    if (!log) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }

    res.json(log);
  } catch (err) {
    next(err);
  }
};

export const createMaintenanceLog = async (req, res, next) => {
  try {
    const {
      equipmentId,
      type,
      technician,
      technicianId,
      status,
      notes,
      cost,
      duration,
      partsReplaced,
      scheduledDate,
      completedDate,
      nextServiceDate
    } = req.body;

    if (!equipmentId || !type || !technician) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const log = await MaintenanceLog.create({
      equipmentId,
      type,
      technician,
      technicianId: technicianId || req.user.sub,
      status: status || 'Completed',
      notes: notes || '',
      cost: cost || undefined,
      duration: duration || undefined,
      partsReplaced: partsReplaced || [],
      scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
      completedDate: completedDate ? new Date(completedDate) : new Date(),
      nextServiceDate: nextServiceDate ? new Date(nextServiceDate) : undefined,
    });

    // Update equipment's next service date if provided
    if (nextServiceDate) {
      const equipment = await Equipment.findById(equipmentId);
      if (equipment) {
        equipment.nextServiceDate = new Date(nextServiceDate);
        await equipment.save();
      }
    }

    const populated = await MaintenanceLog.findById(log._id)
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const updateMaintenanceLog = async (req, res, next) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }

    const {
      type,
      technician,
      technicianId,
      status,
      notes,
      cost,
      duration,
      partsReplaced,
      scheduledDate,
      completedDate,
      nextServiceDate
    } = req.body;

    if (type) log.type = type;
    if (technician) log.technician = technician;
    if (technicianId) log.technicianId = technicianId;
    if (status) log.status = status;
    if (notes !== undefined) log.notes = notes;
    if (cost !== undefined) log.cost = cost;
    if (duration !== undefined) log.duration = duration;
    if (partsReplaced) log.partsReplaced = partsReplaced;
    if (scheduledDate) log.scheduledDate = new Date(scheduledDate);
    if (completedDate) log.completedDate = new Date(completedDate);
    if (nextServiceDate) {
      log.nextServiceDate = new Date(nextServiceDate);
      // Update equipment's next service date
      const equipment = await Equipment.findById(log.equipmentId);
      if (equipment) {
        equipment.nextServiceDate = new Date(nextServiceDate);
        await equipment.save();
      }
    }

    await log.save();

    const populated = await MaintenanceLog.findById(log._id)
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .lean();

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

export const deleteMaintenanceLog = async (req, res, next) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id);
    
    if (!log) {
      return res.status(404).json({ message: 'Maintenance log not found' });
    }

    await MaintenanceLog.deleteOne({ _id: log._id });
    res.json({ message: 'Maintenance log deleted' });
  } catch (err) {
    next(err);
  }
};

