// src/types/user.ts
export interface User {
  _id: string;
  email: string;
  name: string;
  password?: string;
  createdAt: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}