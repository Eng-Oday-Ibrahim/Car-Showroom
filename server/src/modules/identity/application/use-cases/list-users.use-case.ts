import { UserRepository } from '../../infrastructure/user.repository';
import { User } from '../../domain/user';

interface ListUsersFilters {
  role?: string;
  isActive?: boolean;
}

interface PaginationOptions {
  page: number;
  perPage: number;
}

export class ListUsersUseCase {
  constructor(private readonly userRepo: UserRepository) {}

  async execute(
    filters: ListUsersFilters = {},
    pagination: PaginationOptions = { page: 1, perPage: 20 }
  ): Promise<{ data: User[]; total: number; page: number; perPage: number }> {
    return this.userRepo.list(filters, pagination);
  }
}
