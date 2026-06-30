import { User } from '../../domain/user';
import { UserRepository } from '../../infrastructure/user.repository';

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  isActive?: boolean;
  role?: string;
}

export class UpdateUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: UpdateUserInput): Promise<User> {
    const user = await this.userRepo.findById(input.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Check email uniqueness if changing email
    if (input.email && input.email !== user.email) {
      const emailExists = await this.userRepo.emailExists(input.email);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }

    const updatedUser = await this.userRepo.update(input.id, {
      ...user,
      email: input.email ?? user.email,
      name: input.name ?? user.name,
      isActive: input.isActive !== undefined ? input.isActive : user.isActive,
      role: (input.role as any) ?? user.role,
    });

    if (!updatedUser) {
      throw new Error('Failed to update user');
    }

    return updatedUser;
  }
}
