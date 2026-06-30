import mongoose from 'mongoose';

let isConnected = false;

export async function connectDatabase(uri: string): Promise<void> {
  if (isConnected) return;

  await mongoose.connect(uri, {
    dbName: process.env['DB_NAME'] ?? 'showroom',
  });

  isConnected = true;
  console.log('✅ MongoDB connected');

  mongoose.connection.on('error', err => {
    console.error('❌ MongoDB error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected — retrying...');
    isConnected = false;
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  isConnected = false;
}