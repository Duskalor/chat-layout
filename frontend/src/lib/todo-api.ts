import { Todo } from '../assets/types/todo.type';
import { config } from './config';

const BASE_URL = config.URL;

const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${BASE_URL}/todos`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return response.json();
};

export const createTodo = async (title: string): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to create todo');
  }

  return response.json();
};

export const updateTodo = async (
  id: string,
  data: { title?: string; completed?: boolean }
): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update todo');
  }

  return response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete todo');
  }
};
