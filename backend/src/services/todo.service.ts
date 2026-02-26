import { prisma } from '../config/prisma.js';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export const createTodo = async (userId: string, title: string): Promise<Todo> => {
  const todo = await prisma.todo.create({
    data: {
      title,
      userId,
    },
  });

  return {
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    userId: todo.userId,
  };
};

export const getTodosByUser = async (userId: string): Promise<Todo[]> => {
  const todos = await prisma.todo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return todos.map((todo) => ({
    id: todo.id,
    title: todo.title,
    completed: todo.completed,
    createdAt: todo.createdAt,
    updatedAt: todo.updatedAt,
    userId: todo.userId,
  }));
};

export const updateTodo = async (
  todoId: string,
  userId: string,
  data: { title?: string; completed?: boolean }
): Promise<Todo | null> => {
  const existingTodo = await prisma.todo.findUnique({
    where: { id: todoId },
  });

  if (!existingTodo) {
    return null;
  }

  if (existingTodo.userId !== userId) {
    throw new Error('FORBIDDEN');
  }

  const updatedTodo = await prisma.todo.update({
    where: { id: todoId },
    data,
  });

  return {
    id: updatedTodo.id,
    title: updatedTodo.title,
    completed: updatedTodo.completed,
    createdAt: updatedTodo.createdAt,
    updatedAt: updatedTodo.updatedAt,
    userId: updatedTodo.userId,
  };
};

export const deleteTodo = async (todoId: string, userId: string): Promise<boolean> => {
  const existingTodo = await prisma.todo.findUnique({
    where: { id: todoId },
  });

  if (!existingTodo) {
    return false;
  }

  if (existingTodo.userId !== userId) {
    throw new Error('FORBIDDEN');
  }

  await prisma.todo.delete({
    where: { id: todoId },
  });

  return true;
};
