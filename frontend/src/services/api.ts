/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '../utils/axios.js';
import { TokenResponse, Task } from '../types/index.js';

export const login = (data: any) => api.post<TokenResponse>('/auth/login', data);
export const register = (data: any) => api.post<TokenResponse>('/auth/register', data);

export const getTasks = () => api.get<Task[]>('/tasks/');
export const createTask = (data: any) => api.post<Task>('/tasks/', data);
export const updateTask = (id: string, data: any) => api.patch<Task>(`/tasks/${id}`, data);
export const deleteTask = (id: string) => api.delete(`/tasks/${id}`);

export const getAllTasks = () => api.get<Task[]>('/admin/tasks');
