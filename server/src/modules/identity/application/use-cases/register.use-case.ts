import bcrypt from 'bcryptjs';
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken';
import { User } from '../../domain/user';
import { UserRepository } from '../../infrastructure/user.repository';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: ReturnType<User['toPublic']>;
}

export class RegisterUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(input: RegisterInput): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await this.userRepo.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Create user
    const user = User.create({
      email: input.email.toLowerCase(),
      password: hashedPassword,
      name: input.name,
    });

    const savedUser = await this.userRepo.create(user);

    // Generate JWT token
    const secret = (process.env['JWT_SECRET'] ?? 'secret') as Secret;
    const options: SignOptions = {
      expiresIn: (process.env['JWT_EXPIRES_IN'] ?? '7d') as SignOptions['expiresIn'],
    };

    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email, role: savedUser.role },
      secret,
      options
    );

    return {
      token,
      user: savedUser.toPublic(),
    };
  }
}
