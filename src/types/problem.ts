export interface Problem {
  id: string;
  displayId: number;
  difficulty: string;
  isPublished: boolean;
  isTrim: boolean;
  timeLimit: number;
  memoryLimit: number;
  userId?: string | null;
  createdAt: string;
  updatedAt: string;
} 