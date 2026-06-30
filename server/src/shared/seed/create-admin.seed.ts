import bcrypt from 'bcryptjs';
import { UserModel } from '../../modules/identity/infrastructure/user.model';
import { UserRole } from '../../modules/identity/domain/user-role';

export async function seedAdminUser(): Promise<void> {
  const email = process.env['INITIAL_ADMIN_EMAIL'] ?? 'admin@husseinghulam.com';
  const password = process.env['INITIAL_ADMIN_PASSWORD'] ?? 'Admin123!';

  const existing = await UserModel.findOne({ email });
  if (existing) {
    if (existing.role !== UserRole.ADMIN) {
      existing.role = UserRole.ADMIN;
      await existing.save();
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await UserModel.create({
    email,
    password: hashedPassword,
    name: 'System Admin',
    role: UserRole.ADMIN,
    isActive: true,
  });
}
