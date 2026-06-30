import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { UserRepository } from '../../infrastructure/user.repository';

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: any;
}

export class LoginUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: LoginInput): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('User account is inactive');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const secret = (process.env['JWT_SECRET'] ?? 'secret') as Secret;
    const options: SignOptions = {
      expiresIn: (process.env['JWT_EXPIRES_IN'] ?? '7d') as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      secret,
      options
    );

    return {
      token,
      user: user.toPublic(),
    };
  }
}
