import { UserRepository } from '../../infrastructure/user.repository';
import { User } from '../../domain/user';

export class GetUserUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }
}
