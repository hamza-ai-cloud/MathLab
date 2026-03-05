export interface User {
  id: string;
  email: string;
  createdAt?: Date;
}

export interface MathProblem {
  id: string;
  userId: string;
  problem: string;
  solution?: Solution;
  createdAt: Date;
}

export interface Solution {
  steps: SolutionStep[];
  answer: string;
  summary: string;
}

export interface SolutionStep {
  description: string;
  math: string;
  explanation: string;
}

export interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'premium';
  createdAt: Date;
  expiresAt?: Date;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
