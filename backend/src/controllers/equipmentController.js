import Equipment from '../models/Equipment.js';

// Generate unique equipment ID
const generateEquipmentId = async () => {
  const count = await Equipment.countDocuments();
  return `EQ-${String(count + 1001).padStart(4, '0')}`;
};

export const getEquipment = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 50, department, status } = req.query;
    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (department) {
      query.department = department;
    }
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const equipment = await Equipment.find(query)
      .populate('assignedTechnician', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Equipment.countDocuments(query);

    res.json({
      equipment,
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

export const getEquipmentById = async (req, res, next) => {
  try {
    const equipment = await Equipment.findOne({ id: req.params.id })
      .populate('assignedTechnician', 'name email')
      .lean();
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    res.json(equipment);
  } catch (err) {
    next(err);
  }
};

export const createEquipment = async (req, res, next) => {
  try {
    const {
      name,
      department,
      location,
      vendor,
      nextServiceDate,
      status,
      technician,
      model,
      serial,
      purchaseDate,
      purchaseCost,
      warrantyExpiry,
      lifeExpectancy,
      maintenanceFrequency,
      amcExpiry,
      assignedTechnician
    } = req.body;

    if (!name || !department || !location || !vendor || !nextServiceDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = await generateEquipmentId();
    const equipment = await Equipment.create({
      id,
      name,
      department,
      location,
      vendor,
      nextServiceDate: new Date(nextServiceDate),
      status: status || 'Pending',
      technician: technician || '',
      model: model || '',
      serial: serial || '',
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
      purchaseCost: purchaseCost || '',
      warrantyExpiry: warrantyExpiry ? new Date(warrantyExpiry) : undefined,
      lifeExpectancy: lifeExpectancy || '',
      maintenanceFrequency: maintenanceFrequency || 'Quarterly',
      amcExpiry: amcExpiry ? new Date(amcExpiry) : undefined,
      assignedTechnician: assignedTechnician || undefined,
    });

    const populated = await Equipment.findById(equipment._id)
      .populate('assignedTechnician', 'name email')
      .lean();

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Equipment ID already exists' });
    }
    next(err);
  }
};

export const updateEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findOne({ id: req.params.id });
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    const {
      name,
      department,
      location,
      vendor,
      nextServiceDate,
      status,
      technician,
      model,
      serial,
      purchaseDate,
      purchaseCost,
      warrantyExpiry,
      lifeExpectancy,
      maintenanceFrequency,
      amcExpiry,
      assignedTechnician
    } = req.body;

    if (name) equipment.name = name;
    if (department) equipment.department = department;
    if (location) equipment.location = location;
    if (vendor) equipment.vendor = vendor;
    if (nextServiceDate) equipment.nextServiceDate = new Date(nextServiceDate);
    if (status) equipment.status = status;
    if (technician !== undefined) equipment.technician = technician;
    if (model !== undefined) equipment.model = model;
    if (serial !== undefined) equipment.serial = serial;
    if (purchaseDate) equipment.purchaseDate = new Date(purchaseDate);
    if (purchaseCost !== undefined) equipment.purchaseCost = purchaseCost;
    if (warrantyExpiry) equipment.warrantyExpiry = new Date(warrantyExpiry);
    if (lifeExpectancy !== undefined) equipment.lifeExpectancy = lifeExpectancy;
    if (maintenanceFrequency) equipment.maintenanceFrequency = maintenanceFrequency;
    if (amcExpiry) equipment.amcExpiry = new Date(amcExpiry);
    if (assignedTechnician !== undefined) equipment.assignedTechnician = assignedTechnician;

    await equipment.save();

    const populated = await Equipment.findById(equipment._id)
      .populate('assignedTechnician', 'name email')
      .lean();

    res.json(populated);
  } catch (err) {
    next(err);
  }
};

export const deleteEquipment = async (req, res, next) => {
  try {
    const equipment = await Equipment.findOne({ id: req.params.id });
    
    if (!equipment) {
      return res.status(404).json({ message: 'Equipment not found' });
    }

    await Equipment.deleteOne({ _id: equipment._id });
    res.json({ message: 'Equipment deleted' });
  } catch (err) {
    next(err);
  }
};

