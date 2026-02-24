import { Request, Response } from 'express';
import { LoginRequest, LoginResponse } from '../types/index.js';
import { login as loginService, logout as logoutService } from '../services/auth.service.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  const credentials: LoginRequest = req.body;
  const result: LoginResponse = await loginService(credentials);
  res.json(result);
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  const result = logoutService();
  res.json(result);
};
