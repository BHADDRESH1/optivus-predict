import Equipment from '../models/Equipment.js';
import Task from '../models/Task.js';
import Alert from '../models/Alert.js';
import MaintenanceLog from '../models/MaintenanceLog.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const role = req.user.role?.toLowerCase();
    
    // Total equipment count
    const totalEquipment = await Equipment.countDocuments();
    
    // Equipment by status
    const equipmentByStatus = await Equipment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Total tasks
    const totalTasks = await Task.countDocuments();
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Active alerts
    const activeAlerts = await Alert.countDocuments({ status: 'Active' });
    const criticalAlerts = await Alert.countDocuments({ status: 'Active', priority: 'Critical' });

    // Completed tasks this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const completedThisMonth = await Task.countDocuments({
      status: 'Completed',
      completedAt: { $gte: startOfMonth }
    });

    // Overdue tasks
    const now = new Date();
    const overdueTasks = await Task.countDocuments({
      status: { $in: ['Pending', 'Scheduled', 'In Progress'] },
      dueDate: { $lt: now }
    });

    // Active technicians
    const activeTechnicians = await User.countDocuments({ 
      role: { $regex: /technician/i },
      status: 'Active'
    });

    // System compliance (percentage of tasks completed on time)
    const totalCompletedTasks = await Task.countDocuments({ status: 'Completed' });
    const onTimeTasks = await Task.countDocuments({
      status: 'Completed',
      $expr: { $lte: ['$completedAt', '$dueDate'] }
    });
    const complianceScore = totalCompletedTasks > 0 
      ? ((onTimeTasks / totalCompletedTasks) * 100).toFixed(1)
      : 100;

    // Role-based stats
    let stats = {};
    if (role === 'admin' || role === 'hospital head') {
      stats = {
        totalEquipment,
        systemCompliance: `${complianceScore}%`,
        avgDowntime: '4.2h',
        criticalAlerts
      };
    } else if (role === 'supervisor') {
      stats = {
        pendingReviews: await Task.countDocuments({ aiStatus: 'Needs Review' }),
        techniciansActive: activeTechnicians,
        escalations: await Alert.countDocuments({ level: 'Supervisor', status: 'Active' }),
        weeklyCompletion: complianceScore
      };
    } else if (role === 'technician') {
      const myTasks = await Task.countDocuments({ technicianId: req.user.sub });
      const myPendingTasks = await Task.countDocuments({ 
        technicianId: req.user.sub,
        status: { $in: ['Pending', 'Scheduled', 'In Progress'] }
      });
      const myCompletedToday = await Task.countDocuments({
        technicianId: req.user.sub,
        status: 'Completed',
        completedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      });
      
      stats = {
        myPendingTasks,
        completedToday: myCompletedToday,
        onTimeScore: '98%'
      };
    }

    res.json({
      totalEquipment,
      totalTasks,
      activeAlerts,
      overdueTasks,
      completedThisMonth,
      activeTechnicians,
      complianceScore: parseFloat(complianceScore),
      equipmentByStatus,
      tasksByStatus,
      roleBasedStats: stats
    });
  } catch (err) {
    next(err);
  }
};

export const getComplianceReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(new Date().setMonth(new Date().getMonth() - 6));
    const end = endDate ? new Date(endDate) : new Date();

    const completedTasks = await Task.find({
      status: 'Completed',
      completedAt: { $gte: start, $lte: end }
    }).lean();

    const onTime = completedTasks.filter(task => 
      task.completedAt && task.dueDate && task.completedAt <= task.dueDate
    ).length;

    const complianceScore = completedTasks.length > 0 
      ? ((onTime / completedTasks.length) * 100).toFixed(2)
      : 100;

    res.json({
      period: { start, end },
      totalTasks: completedTasks.length,
      onTimeTasks: onTime,
      lateTasks: completedTasks.length - onTime,
      complianceScore: parseFloat(complianceScore)
    });
  } catch (err) {
    next(err);
  }
};

export const getEquipmentReport = async (req, res, next) => {
  try {
    const equipment = await Equipment.find().lean();
    const tasks = await Task.find().lean();
    const logs = await MaintenanceLog.find().lean();

    const equipmentWithStats = equipment.map(eq => {
      const eqTasks = tasks.filter(t => 
        t.equipmentId && String(t.equipmentId) === String(eq._id)
      );
      const eqLogs = logs.filter(l => 
        l.equipmentId && String(l.equipmentId) === String(eq._id)
      );

      return {
        ...eq,
        totalTasks: eqTasks.length,
        completedTasks: eqTasks.filter(t => t.status === 'Completed').length,
        maintenanceCount: eqLogs.length,
        lastMaintenance: eqLogs.length > 0 
          ? eqLogs.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate))[0].completedDate
          : null
      };
    });

    res.json(equipmentWithStats);
  } catch (err) {
    next(err);
  }
};

export const getTaskReport = async (req, res, next) => {
  try {
    const { startDate, endDate, technicianId, status } = req.query;
    const query = {};

    if (startDate || endDate) {
      query.dueDate = {};
      if (startDate) query.dueDate.$gte = new Date(startDate);
      if (endDate) query.dueDate.$lte = new Date(endDate);
    }
    if (technicianId) query.technicianId = technicianId;
    if (status) query.status = status;

    const tasks = await Task.find(query)
      .populate('equipmentId', 'id name department')
      .populate('technicianId', 'name email')
      .sort({ dueDate: 1 })
      .lean();

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

