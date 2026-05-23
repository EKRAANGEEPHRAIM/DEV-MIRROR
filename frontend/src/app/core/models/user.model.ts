import { Post } from './post.model';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  github?: string;
  website?: string;
  skills: string[];
  posts?: Post[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}