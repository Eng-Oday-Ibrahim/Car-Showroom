import { UserRepository } from '../infrastructure/user.repository';
import { RegisterUseCase, type RegisterInput, type AuthResponse } from './use-cases/register.use-case';
import { LoginUseCase, type LoginInput } from './use-cases/login.use-case';
import { UpdateUserUseCase, type UpdateUserInput } from './use-cases/update-user.use-case';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case';
import { GetUserUseCase } from './use-cases/get-user.use-case';
import { ListUsersUseCase } from './use-cases/list-users.use-case';
import { ForgotPasswordUseCase } from './use-cases/forgot-password.use-case';
import { ResetPasswordUseCase } from './use-cases/reset-password.use-case';

export type { RegisterInput, AuthResponse, LoginInput, UpdateUserInput };

export class IdentityService {
  private readonly registerUseCase:      RegisterUseCase;
  private readonly loginUseCase:         LoginUseCase;
  private readonly updateUserUseCase:    UpdateUserUseCase;
  private readonly deleteUserUseCase:    DeleteUserUseCase;
  private readonly getUserUseCase:       GetUserUseCase;
  private readonly listUsersUseCase:     ListUsersUseCase;
  private readonly forgotPasswordUseCase: ForgotPasswordUseCase;
  private readonly resetPasswordUseCase:  ResetPasswordUseCase;

  constructor(private readonly userRepo: UserRepository) {
    this.registerUseCase      = new RegisterUseCase(userRepo);
    this.loginUseCase         = new LoginUseCase(userRepo);
    this.updateUserUseCase    = new UpdateUserUseCase(userRepo);
    this.deleteUserUseCase    = new DeleteUserUseCase(userRepo);
    this.getUserUseCase       = new GetUserUseCase(userRepo);
    this.listUsersUseCase     = new ListUsersUseCase(userRepo);
    this.forgotPasswordUseCase = new ForgotPasswordUseCase(userRepo);
    this.resetPasswordUseCase  = new ResetPasswordUseCase(userRepo);
  }

  register      = (...args: Parameters<RegisterUseCase['execute']>)      => this.registerUseCase.execute(...args);
  login         = (...args: Parameters<LoginUseCase['execute']>)         => this.loginUseCase.execute(...args);
  updateUser    = (...args: Parameters<UpdateUserUseCase['execute']>)    => this.updateUserUseCase.execute(...args);
  deleteUser    = (...args: Parameters<DeleteUserUseCase['execute']>)    => this.deleteUserUseCase.execute(...args);
  getUser       = (...args: Parameters<GetUserUseCase['execute']>)       => this.getUserUseCase.execute(...args);
  listUsers     = (...args: Parameters<ListUsersUseCase['execute']>)     => this.listUsersUseCase.execute(...args);
  forgotPassword = (email: string)                => this.forgotPasswordUseCase.execute(email);
  resetPassword  = (token: string, pwd: string)   => this.resetPasswordUseCase.execute(token, pwd);

  getFavoriteCarIds = (userId: string) => this.userRepo.getFavoriteCarIds(userId);
  toggleFavoriteCar = (userId: string, carId: string) => this.userRepo.toggleFavoriteCar(userId, carId);

  findByEmail = (email: string) => this.userRepo.findByEmail(email);
}
