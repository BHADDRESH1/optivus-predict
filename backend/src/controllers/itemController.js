import Item from '../models/Item.js';

export const createItem = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const item = await Item.create({ name, description, owner: req.user.sub || req.user._id });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const getItems = async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));
    const search = req.query.search || '';
    const filter = search ? { $text: { $search: search } } : {};
    const total = await Item.countDocuments(filter);
    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
    res.json({ total, page, limit, items });
  } catch (err) {
    next(err);
  }
};

export const getItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    // only admin or owner
    if (req.user.role !== 'admin' && String(item.owner) !== String(req.user.sub || req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    item.name = req.body.name ?? item.name;
    item.description = req.body.description ?? item.description;
    await item.save();
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    if (req.user.role !== 'admin' && String(item.owner) !== String(req.user.sub || req.user._id)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Item.deleteOne({ _id: item._id });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};
