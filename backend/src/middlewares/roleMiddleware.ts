import { Request, Response, NextFunction } from 'express';

// This middleware takes in an array of allowed roles
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    
    // Check if req.user exists (set by our protect authMiddleware) and if their role is in the allowed array
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // 403 Forbidden status
      next(new Error(`User role '${req.user?.role || 'Unknown'}' is not authorized to perform this action.`));
      return;
    }
    
    // If they have the right role, let them proceed
    next();
  };
};