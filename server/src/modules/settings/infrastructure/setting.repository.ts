import { SettingModel } from './setting.model';

export class SettingRepository {
  /**
   * Get a setting value by key.
   * Returns null if not found.
   */
  async get(key: string): Promise<string | null> {
    const doc = await SettingModel.findOne({ key });
    return doc?.value ?? null;
  }

  /**
   * Set a setting value (upsert).
   */
  async set(key: string, value: string): Promise<void> {
    await SettingModel.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
  }

  /**
   * Get multiple settings at once.
   */
  async getMany(keys: string[]): Promise<Record<string, string>> {
    const docs = await SettingModel.find({ key: { $in: keys } });
    return docs.reduce((acc, doc) => {
      acc[doc.key] = doc.value;
      return acc;
    }, {} as Record<string, string>);
  }
}
