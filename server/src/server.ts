import { createApp }        from './app';
import { connectDatabase }  from './shared/database/mongoose';
import { seedAdminUser }    from './shared/seed/create-admin.seed';

const PORT    = Number(process.env['PORT'] ?? 5000);
const DB_URI  = process.env['MONGODB_URI'] ?? 'mongodb://localhost:27017';

async function bootstrap(): Promise<void> {
  try {
    await connectDatabase(DB_URI);
    await seedAdminUser();

    const app = await createApp();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

bootstrap();