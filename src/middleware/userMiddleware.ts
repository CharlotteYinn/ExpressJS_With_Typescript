import { Request, Response, NextFunction } from 'express';

export const isUser = (req: Request, res: Response, next: NextFunction) => {
  console.log(`User role in isUser: ${req.user?.role}`); // Debugging line
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. User only.' });
  }
};

export default isUser;