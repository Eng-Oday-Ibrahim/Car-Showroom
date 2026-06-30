import { UserRole, type UserRoleType } from './user-role';
import type { UserProps } from './user.types';

export class User {
  readonly #id: string | null;
  readonly #email: string;
  readonly #password: string; // hashed
  readonly #name: string;
  readonly #role: UserRoleType;
  readonly #isActive: boolean;
  readonly #createdAt: Date;
  readonly #updatedAt: Date;

  private constructor(props: UserProps) {
    this.#id = props.id ?? null;
    this.#email = props.email;
    this.#password = props.password;
    this.#name = props.name;
    this.#role = props.role ?? UserRole.USER;
    this.#isActive = props.isActive ?? true;
    this.#createdAt = props.createdAt ?? new Date();
    this.#updatedAt = props.updatedAt ?? new Date();
  }

  static create(props: Omit<UserProps, 'id' | 'createdAt' | 'updatedAt'>): User {
    return new User({
      ...props,
      id: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: UserProps): User {
    return new User(props);
  }

  get id(): string | null {
    return this.#id;
  }

  get email(): string {
    return this.#email;
  }

  get password(): string {
    return this.#password;
  }

  get name(): string {
    return this.#name;
  }

  get role(): UserRoleType {
    return this.#role;
  }

  get isActive(): boolean {
    return this.#isActive;
  }

  get createdAt(): Date {
    return this.#createdAt;
  }

  get updatedAt(): Date {
    return this.#updatedAt;
  }

  isAdmin(): boolean {
    return this.#role === UserRole.ADMIN;
  }

  toObject() {
    return {
      id: this.#id,
      email: this.#email,
      name: this.#name,
      role: this.#role,
      isActive: this.#isActive,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt,
    };
  }

  toPublic() {
    return {
      id: this.#id,
      email: this.#email,
      name: this.#name,
      role: this.#role,
      isActive: this.#isActive,
    };
  }
}
