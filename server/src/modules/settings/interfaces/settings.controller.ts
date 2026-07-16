import { Router, type Response, type NextFunction } from 'express';
import { SettingsService } from '../application/settings.service';
import { verifyToken, requireAdmin, type AuthRequest } from '../../identity/interfaces/identity.controller';
import { z } from 'zod';

const updateDubicarsSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export function createSettingsRouter(settingsService: SettingsService): Router {
  const router = Router();

  /**
   * GET /api/settings/dubicars
   * Get current DubiCars credentials (admin only).
   * Returns masked password.
   */
  router.get('/dubicars', verifyToken, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const creds = await settingsService.getDubicarsCredentials();
      res.json({
        success: true,
        data: {
          email:    creds.email,
          // Mask the password — only show first 2 chars + stars
          password: creds.password
            ? creds.password.slice(0, 2) + '*'.repeat(Math.max(0, creds.password.length - 2))
            : '',
        },
      });
    } catch (err) {
      next(err);
    }
  });

  /**
   * PUT /api/settings/dubicars
   * Update DubiCars credentials (admin only).
   */
  router.put('/dubicars', verifyToken, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const parsed = updateDubicarsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: parsed.error.issues.map(e => ({
            field: e.path.map(String).join('.'),
            message: e.message,
          })),
        });
      }

      await settingsService.updateDubicarsCredentials(parsed.data.email, parsed.data.password);
      res.json({ success: true, message: 'DubiCars credentials updated successfully' });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
