import mongoose, { Schema, type Document, type Model } from 'mongoose';

export interface ISettingDocument extends Document {
  key: string;
  value: string;
  updatedAt: Date;
}

const settingSchema = new Schema<ISettingDocument>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'settings',
  }
);

export const SettingModel: Model<ISettingDocument> = mongoose.model<ISettingDocument>(
  'Setting',
  settingSchema
);
