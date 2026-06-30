import { UserRepository } from '../../infrastructure/user.repository';

export class DeleteUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<void> {
    const deleted = await this.userRepo.delete(userId);
    if (!deleted) {
      throw new Error('User not found');
    }
  }
}
