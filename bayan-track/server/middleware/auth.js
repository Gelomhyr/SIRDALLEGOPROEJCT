import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secrettoken';

export const auth = async (req, res, next) => {
  const headerToken = req.header('x-auth-token');
  const bearerToken = req.header('authorization')?.startsWith('Bearer ')
    ? req.header('authorization').replace('Bearer ', '')
    : null;

  const token = headerToken || bearerToken;

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('role');

    if (!user) {
      return res.status(401).json({ msg: 'Invalid token user' });
    }

    req.user = {
      id: decoded.user.id,
      role: user.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is not valid' });
  }
};

export const requireRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ msg: 'Unauthorized' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ msg: 'Forbidden' });
  }

  next();
};

export const optionalAuth = async (req, _res, next) => {
  const headerToken = req.header('x-auth-token');
  const bearerToken = req.header('authorization')?.startsWith('Bearer ')
    ? req.header('authorization').replace('Bearer ', '')
    : null;
  const token = headerToken || bearerToken;

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.user.id).select('role');
    if (user) {
      req.user = {
        id: decoded.user.id,
        role: user.role,
      };
    }
  } catch (_err) {
    // ignore invalid optional token
  }

  next();
};
