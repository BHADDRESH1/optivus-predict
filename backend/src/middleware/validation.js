// Validation middleware for common request validations

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateRequired = (fields, body) => {
  const missing = [];
  for (const field of fields) {
    if (!body[field] || (typeof body[field] === 'string' && body[field].trim() === '')) {
      missing.push(field);
    }
  }
  return missing;
};

export const validateEquipment = (req, res, next) => {
  const required = ['name', 'department', 'location', 'vendor', 'nextServiceDate'];
  const missing = validateRequired(required, req.body);
  
  if (missing.length > 0) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      missing 
    });
  }

  // Validate date format
  if (req.body.nextServiceDate && isNaN(new Date(req.body.nextServiceDate).getTime())) {
    return res.status(400).json({ message: 'Invalid date format for nextServiceDate' });
  }

  next();
};

export const validateTask = (req, res, next) => {
  const required = ['equipmentName', 'technician', 'dueDate'];
  const missing = validateRequired(required, req.body);
  
  if (missing.length > 0) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      missing 
    });
  }

  // Validate date format
  if (req.body.dueDate && isNaN(new Date(req.body.dueDate).getTime())) {
    return res.status(400).json({ message: 'Invalid date format for dueDate' });
  }

  next();
};

export const validateUser = (req, res, next) => {
  const required = ['name', 'email', 'password'];
  const missing = validateRequired(required, req.body);
  
  if (missing.length > 0) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      missing 
    });
  }

  // Validate email format
  if (req.body.email && !validateEmail(req.body.email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Validate password length
  if (req.body.password && req.body.password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  next();
};

export const validateAlert = (req, res, next) => {
  const required = ['equipment', 'issue'];
  const missing = validateRequired(required, req.body);
  
  if (missing.length > 0) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      missing 
    });
  }

  next();
};

