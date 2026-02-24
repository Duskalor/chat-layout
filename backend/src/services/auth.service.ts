import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config/index.js';
import { LoginRequest, LoginResponse } from '../types/index.js';
import { UnauthorizedError } from '../types/errors.js';
import { findUserByEmail } from './user.service.js';
import { getUserChats } from './chat.service.js';

export const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const user = findUserByEmail(credentials.email);

  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid credentials');
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn } as SignOptions
  );

  const chats = getUserChats(user.id);

  const { password, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword,
    token,
    chats,
  };
};

export const logout = (): { success: boolean; message: string } => {
  return { success: true, message: 'Logged out successfully' };
};
