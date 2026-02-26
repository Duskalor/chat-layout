import { Request, Response } from 'express';
import { createTodo, getTodosByUser, updateTodo, deleteTodo } from '../services/todo.service.js';
import { Todo } from '../types/index.js';

export const getTodos = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.userId;
  const todos = await getTodosByUser(userId);
  const todosResponse = todos.map((todo: Todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    userId: todo.userId,
  }));
  res.json(todosResponse);
};

export const createNewTodo = async (req: Request, res: Response): Promise<void> => {
  const { title } = req.body;
  const userId = req.user!.userId;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    res.status(400).json({ message: 'Title is required' });
    return;
  }

  const todo = await createTodo(userId, title.trim());
  res.status(201).json({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt.toISOString(),
    updatedAt: todo.updatedAt.toISOString(),
    userId: todo.userId,
  });
};

export const updateExistingTodo = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const { title, completed } = req.body;
  const userId = req.user!.userId;

  try {
    const todo = await updateTodo(id, userId, {
      title: typeof title === 'string' ? title.trim() : undefined,
      completed: typeof completed === 'boolean' ? completed : undefined,
    });

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    res.json({
      id: todo.id,
      title: todo.title,
      completed: todo.completed,
      createdAt: todo.createdAt.toISOString(),
      updatedAt: todo.updatedAt.toISOString(),
      userId: todo.userId,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      res.status(403).json({ message: 'You do not have permission to update this todo' });
      return;
    }
    throw error;
  }
};

export const deleteExistingTodo = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id as string;
  const userId = req.user!.userId;

  try {
    const result = await deleteTodo(id, userId);

    if (!result) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'FORBIDDEN') {
      res.status(403).json({ message: 'You do not have permission to delete this todo' });
      return;
    }
    throw error;
  }
};
