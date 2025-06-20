export interface UserBase {
  id: string;
  name?: string;
  email: string;
  password?: string;
  role?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Admin extends UserBase {
  // 管理员特有字段（如有）
}
export interface Teacher extends UserBase {
  // 教师特有字段（如有）
}
export interface Guest extends UserBase {
  // 学生特有字段（如有）
} 