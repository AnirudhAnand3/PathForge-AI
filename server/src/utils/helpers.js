// Calculate XP needed for a given level
export const xpForLevel = (level) => level * level * 100;

// Get level from total XP
export const levelFromXP = (xp) => Math.floor(1 + Math.sqrt(xp / 100));

// Generate random alphanumeric ID
export const generateId = (length = 8) => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

// Paginate mongoose query
export const paginate = async (model, query, page = 1, limit = 10, sort = { createdAt: -1 }) => {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limit),
    model.countDocuments(query),
  ]);
  return {
    data,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
    },
  };
};

// Sanitize user object for response
export const sanitizeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.otp;
  delete obj.otpExpiry;
  return obj;
};