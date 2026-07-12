import { User } from '../domain/user';
import { UserModel, type IUserDocument } from './user.model';

interface ListFilters {
  role?: string;
  isActive?: boolean;
}

interface PaginationOptions {
  page: number;
  perPage: number;
}

export class UserRepository {
  async create(user: User): Promise<User> {
    const doc = await UserModel.create({
      email: user.email,
      password: user.password,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
    });
    return User.fromPersistence({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id);
    if (!doc) return null;
    return User.fromPersistence({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');
    if (!doc) return null;
    return User.fromPersistence({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    const updateData: Record<string, unknown> = {};
    
    if (updates.email) updateData.email = updates.email;
    if (updates.name) updateData.name = updates.name;
    if (updates.role) updateData.role = updates.role;
    if (updates.isActive !== undefined) updateData.isActive = updates.isActive;

    const doc = await UserModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!doc) return null;
    return User.fromPersistence({
      id: doc._id.toString(),
      email: doc.email,
      password: doc.password,
      name: doc.name,
      role: doc.role,
      isActive: doc.isActive,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return result !== null;
  }

  async getFavoriteCarIds(userId: string): Promise<string[]> {
    const doc = await UserModel.findById(userId);
    return doc?.favoriteCarIds ?? [];
  }

  async toggleFavoriteCar(userId: string, carId: string): Promise<{ favoriteCarIds: string[]; isFavorite: boolean }> {
    const doc = await UserModel.findById(userId);
    if (!doc) {
      throw new Error('User not found');
    }

    const favoriteCarIds = Array.isArray(doc.favoriteCarIds) ? doc.favoriteCarIds : [];
    const isFavorite = favoriteCarIds.includes(carId);
    const nextIds = isFavorite
      ? favoriteCarIds.filter((id) => id !== carId)
      : [...favoriteCarIds, carId];

    doc.favoriteCarIds = nextIds;
    await doc.save();

    return { favoriteCarIds: nextIds, isFavorite: !isFavorite };
  }

  async list(
    filters: ListFilters = {},
    pagination: PaginationOptions = { page: 1, perPage: 20 }
  ): Promise<{ data: User[]; total: number; page: number; perPage: number }> {
    const query: Record<string, unknown> = {};
    
    if (filters.role) query.role = filters.role;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;

    const skip = (pagination.page - 1) * pagination.perPage;
    const docs = await UserModel.find(query)
      .skip(skip)
      .limit(pagination.perPage)
      .sort({ createdAt: -1 });

    const total = await UserModel.countDocuments(query);

    return {
      data: docs.map((doc) =>
        User.fromPersistence({
          id: doc._id.toString(),
          email: doc.email,
          password: doc.password,
          name: doc.name,
          role: doc.role,
          isActive: doc.isActive,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        })
      ),
      total,
      page: pagination.page,
      perPage: pagination.perPage,
    };
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email: email.toLowerCase() });
    return count > 0;
  }
}
