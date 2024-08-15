import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user';

interface CustomRequest extends Request {
  user?: any;
}

export const protect = async (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log(`Token: ${token}`); // Debugging line

  const authHeader = req.headers['authorization'];
  console.log('Authorization Header:', authHeader);
  
  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = await User.findById(decoded.id);
    console.log(`User ID: ${req.user?._id}`);  // Debugging line
    console.log(`User Role: ${req.user?.role}`);  // Debugging line
    next();
  } catch (error) {
    console.error('JWT verification error:', error); // Debugging line
    res.status(401).json({ message: 'Not authorized' });
  }
};

export default protect;