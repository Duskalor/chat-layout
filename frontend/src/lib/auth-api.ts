import { LoginCredentials, AuthResponse } from '../assets/types/auth.type';
import { config } from './config';

const BASE_URL = config.URL;

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        user: data.user,
        token: data.token,
        chats: data.chats || [],
      };
    }

    return {
      success: false,
      user: {} as AuthResponse['user'],
      token: '',
      message: data.message || 'Invalid email or password',
    };
  } catch (error) {
    return {
      success: false,
      user: {} as AuthResponse['user'],
      token: '',
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};
