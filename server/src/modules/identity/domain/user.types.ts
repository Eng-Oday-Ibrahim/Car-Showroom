import type { UserRoleType } from './user-role';

export interface UserProps {
  id?: string | null;
  email: string;
  password: string;
  name: string;
  role?: UserRoleType;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
