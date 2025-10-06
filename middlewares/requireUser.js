import jwt from 'jsonwebtoken';
import User from '../models/usersModel.js';

// Middleware to require authentication and attach user to req
export default async function requireUser(req, res, next) {
  let token;
  if (req.cookies && req.cookies.Authorization && req.cookies.Authorization.startsWith('Bearer ')) {
    token = req.cookies.Authorization.replace('Bearer ', '');
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.replace('Bearer ', '');
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
}
