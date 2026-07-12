import mongoose from 'mongoose';
import { CarModel } from '../modules/cars/infrastructure/car.model.js';
import type { ICarDocument } from '../modules/cars/infrastructure/car.model.js';

const corruptCarFilter: mongoose.QueryFilter<ICarDocument> = {
  $or: [
    { price: { $exists: false } },
    { price: null },
    { price: '' } as mongoose.QueryFilter<ICarDocument>,
    { kmDriven: { $exists: false } },
    { kmDriven: null },
  ],
};

async function cleanupCorruptCars() {
  try {
    const mongoUri = process.env['MONGODB_URI'] || 'mongodb://root:1234@db:27017/cars?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB');

    // Find cars with invalid or missing price/kmDriven
    const corrupted = await CarModel.find(corruptCarFilter);

    console.log(`Found ${corrupted.length} corrupted cars:`);
    corrupted.forEach(car => {
      console.log(`  - ${car.make} ${car.model} (${car._id}): price=${car.price}, kmDriven=${car.kmDriven}`);
    });

    if (corrupted.length > 0) {
      const result = await CarModel.deleteMany(corruptCarFilter);
      console.log(`\n✓ Deleted ${result.deletedCount} corrupted cars`);
    }

    await mongoose.connection.close();
    console.log('✓ Disconnected from MongoDB');
  } catch (err) {
    console.error('✗ Error:', err);
    process.exit(1);
  }
}

cleanupCorruptCars();
