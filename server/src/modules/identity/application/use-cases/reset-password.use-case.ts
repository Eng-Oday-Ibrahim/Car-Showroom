import crypto    from 'crypto';
import bcrypt    from 'bcryptjs';
import { UserRepository } from '../../infrastructure/user.repository';

export class ResetPasswordUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(rawToken: string, newPassword: string): Promise<void> {
    if (!rawToken || !newPassword) {
      throw new Error('Token and new password are required');
    }

    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash the raw token to compare with the stored hash
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await this.userRepo.findByResetToken(tokenHash);
    if (!user || !user.id) {
      throw new Error('INVALID_TOKEN');
    }

    // Hash the new password and clear the reset token
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepo.updatePasswordAndClearToken(user.id, hashedPassword);
  }
}
