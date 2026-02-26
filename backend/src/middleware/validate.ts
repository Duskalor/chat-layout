import { Request, Response, NextFunction } from 'express';
import { parse } from 'valibot';
import { ValidationError } from '../types/errors.js';
import { GenericSchema } from 'valibot';

export const validate = <T extends GenericSchema>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      parse(schema, req.body);
      next();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Validation failed';
      throw new ValidationError(message);
    }
  };
};

import { object, pipe, string, minLength, email, optional } from 'valibot';

export const loginSchema = pipe(
  object({
    email: pipe(string(), email('Invalid email format')),
    password: pipe(string(), minLength(1, 'Password is required')),
  })
);

export const messageSchema = object({
  id: optional(string()),
  chatId: pipe(string(), minLength(1, 'chatId is required')),
  senderId: string(),
  text: pipe(string(), minLength(1, 'Text is required')),
});
