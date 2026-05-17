import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction): void => {
  // If the status code is 200 but an error fired, default to 500 (Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    message: err.message,
    // Hide the stack trace in production for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};