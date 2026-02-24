import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/errors.js';

export interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
}

export const errorMiddleware = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : 'Internal Server Error';

  const response: ErrorResponse = {
    success: false,
    message,
    statusCode,
  };

  res.status(statusCode).json(response);
};
