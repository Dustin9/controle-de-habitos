import axios, { AxiosResponse } from 'axios';
import { getAuthToken } from './auth';
import { BackendHabit, HabitCategory, HabitFrequency } from '@/types/habit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HABITS_ENDPOINT = import.meta.env.VITE_HABITS_ENDPOINT;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface CreateHabitData {
  name: string;      // Nome
  description: string; // Descrição
  goal?: number;      // Meta (optional for "Todo dia")
  category: HabitCategory;
  frequency: HabitFrequency;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface UpdateProgressData {
  completed: boolean;
  date?: string;
  frequency?: number;
}

// Create a new habit
export const createHabit = async (habitData: CreateHabitData): Promise<BackendHabit> => {
  try {
    const response = await api.post<ApiResponse<BackendHabit>>(HABITS_ENDPOINT, habitData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating habit:', error);
    throw error;
  }
};

// Get all habits
export const getHabits = async (): Promise<BackendHabit[]> => {
  try {
    const response = await api.get<BackendHabit[]>(HABITS_ENDPOINT);
    console.log('API Response:', response);
    console.log('Habits data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching habits:', error);
    throw error;
  }
};

// Update habit progress
export const updateHabitProgress = async (habitId: string, data: UpdateProgressData): Promise<BackendHabit> => {
  try {
    console.log('Updating habit progress:', { habitId, data });
    const response = await api.put(`${HABITS_ENDPOINT}/${habitId}/progress`, data);
    console.log('Update progress response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating habit progress:', error);
    throw error;
  }
};

// Delete a habit
export const deleteHabit = async (habitId: string): Promise<void> => {
  try {
    await api.delete(`${HABITS_ENDPOINT}/${habitId}`);
  } catch (error) {
    console.error('Error deleting habit:', error);
    throw error;
  }
}; 