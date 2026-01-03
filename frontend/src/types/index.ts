export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  owner_id: string;
  status: 'pending' | 'in_progress' | 'done';
  due_date?: string;
  created_at: string;
  updated_at: string;
}

export interface TokenResponse {
  access_token: string;
}
