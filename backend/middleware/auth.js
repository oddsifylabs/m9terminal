/**
 * Authentication middleware
 * For now, basic implementation. Can add JWT later.
 */

module.exports = (req, res, next) => {
  // In development, allow all requests
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  // In production, check for API key or JWT
  const token = req.headers['x-api-key'] || req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
};
