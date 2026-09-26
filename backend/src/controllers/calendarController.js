import Task from '../models/Task.js';
import Equipment from '../models/Equipment.js';
import MaintenanceLog from '../models/MaintenanceLog.js';

export const getCalendarEvents = async (req, res, next) => {
  try {
    const { startDate, endDate, type = 'all' } = req.query;
    
    const start = startDate ? new Date(startDate) : new Date();
    const end = endDate ? new Date(endDate) : new Date(new Date().setMonth(new Date().getMonth() + 1));

    const events = [];

    // Get tasks in date range
    if (type === 'all' || type === 'tasks') {
      const tasks = await Task.find({
        dueDate: { $gte: start, $lte: end }
      })
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .lean();

      tasks.forEach(task => {
        events.push({
          id: task._id,
          type: 'task',
          title: task.equipmentName,
          date: task.dueDate,
          status: task.status,
          technician: task.technician,
          equipment: task.equipmentName,
          priority: task.priority,
          description: task.description
        });
      });
    }

    // Get scheduled maintenance
    if (type === 'all' || type === 'maintenance') {
      const maintenance = await MaintenanceLog.find({
        scheduledDate: { $gte: start, $lte: end }
      })
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .lean();

      maintenance.forEach(log => {
        events.push({
          id: log._id,
          type: 'maintenance',
          title: `${log.type} - ${log.equipmentId?.name || 'Unknown'}`,
          date: log.scheduledDate,
          status: log.status,
          technician: log.technician,
          equipment: log.equipmentId?.name,
          description: log.notes
        });
      });
    }

    // Get equipment service dates
    if (type === 'all' || type === 'equipment') {
      const equipment = await Equipment.find({
        nextServiceDate: { $gte: start, $lte: end }
      }).lean();

      equipment.forEach(eq => {
        events.push({
          id: eq._id,
          type: 'equipment',
          title: `Service Due - ${eq.name}`,
          date: eq.nextServiceDate,
          status: eq.status,
          technician: eq.technician,
          equipment: eq.name,
          department: eq.department
        });
      });
    }

    // Sort by date
    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    res.json(events);
  } catch (err) {
    next(err);
  }
};

export const getUpcomingEvents = async (req, res, next) => {
  try {
    const { days = 7 } = req.query;
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + parseInt(days));

    const tasks = await Task.find({
      dueDate: { $gte: start, $lte: end },
      status: { $in: ['Pending', 'Scheduled', 'In Progress'] }
    })
    .populate('equipmentId', 'id name department')
    .populate('technicianId', 'name email')
    .sort({ dueDate: 1 })
    .limit(20)
    .lean();

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

