import mongoose, { Schema, type Document, type Model } from 'mongoose';
import { UserRole, type UserRoleType } from '../domain/user-role';

export interface IUserDocument extends Document {
  email: string;
  password: string;
  name: string;
  role: UserRoleType;
  isActive: boolean;
  favoriteCarIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUserDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Don't include password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: [UserRole.ADMIN, UserRole.USER],
      default: UserRole.USER,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    favoriteCarIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// ── Indexes ──────────────────────────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export const UserModel: Model<IUserDocument> = mongoose.model<IUserDocument>(
  'User',
  userSchema
);
