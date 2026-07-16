import jwt from 'jsonwebtoken';
import { Router, type Request, type Response, type NextFunction } from 'express';
import { IdentityService } from '../application/identity.service';
import { UserRole } from '../domain/user-role';
import { validate } from '../../../shared/middleware/validate.middleware';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  listUsersSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from './identity.dto';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

// Middleware to verify JWT and attach user to request
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env['JWT_SECRET'] ?? 'secret') as any;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// Middleware to check if user is admin
export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== UserRole.ADMIN) {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

export function createIdentityRouter(identityService: IdentityService): Router {
  const router = Router();

  const serializeUsers = (result: {
    data: Array<{ toPublic(): unknown }>;
    total: number;
    page: number;
    perPage: number;
  }) => ({
    ...result,
    data: result.data.map(user => user.toPublic()),
  });

  /**
   * POST /auth/register
   * Register a new user
   */
  router.post('/register', validate(registerSchema, 'body'), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await identityService.register(req.body);
      res.status(201).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  });

  /**
   * POST /auth/login
   * Login user
   */
  router.post('/login', validate(loginSchema, 'body'), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await identityService.login(req.body);
      res.json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /auth/me
   * Get current user profile
   */
  router.get('/me', verifyToken, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      const user = await identityService.getUser(req.user.userId);
      res.json({ success: true, data: user.toPublic() });
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /auth/me/favorites
   * Get the current user's saved car IDs
   */
  router.get('/me/favorites', verifyToken, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const favoriteCarIds = await identityService.getFavoriteCarIds(req.user.userId);
      res.json({ success: true, data: { favoriteCarIds } });
    } catch (err) {
      next(err);
    }
  });

  /**
   * PATCH /auth/favorites/:carId
   * Toggle a car as saved/unsaved for the current user
   */
  router.patch('/favorites/:carId', verifyToken, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const carId = Array.isArray(req.params.carId) ? req.params.carId[0] : req.params.carId;
      const result = await identityService.toggleFavoriteCar(req.user.userId, carId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  });

  /**
   * ── ADMIN ROUTES ──────────────────────────────────────
   */

  /**
   * GET /auth/users
   * List all users (admin only)
   */
  router.get('/users', verifyToken, requireAdmin, validate(listUsersSchema, 'query'), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const query = req.query as any;
      const result = await identityService.listUsers(
        { role: query.role, isActive: query.isActive },
        { page: query.page, perPage: query.perPage }
      );
      res.json({ success: true, ...serializeUsers(result) });
    } catch (err) {
      next(err);
    }
  });

  /**
   * GET /auth/users/:id
   * Get user by ID (admin only)
   */
  router.get('/users/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await identityService.getUser(userId);
      res.json({ success: true, data: user.toPublic() });
    } catch (err) {
      next(err);
    }
  });

  /**
   * PUT /auth/users/:id
   * Update user (admin only)
   */
  router.put('/users/:id', verifyToken, requireAdmin, validate(updateUserSchema, 'body'), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const user = await identityService.updateUser({
        id: userId,
        ...req.body,
      });
      res.json({ success: true, data: user.toPublic() });
    } catch (err) {
      next(err);
    }
  });

  /**
   * DELETE /auth/users/:id
   * Delete user (admin only)
   */
  router.delete('/users/:id', verifyToken, requireAdmin, async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await identityService.deleteUser(userId);
      res.json({ success: true, message: 'User deleted' });
    } catch (err) {
      next(err);
    }
  });

  /**
   * POST /auth/forgot-password
   * Request a password reset email.
   */
  router.post('/forgot-password', validate(forgotPasswordSchema, 'body'), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Always return 200 regardless of whether the email exists (prevents enumeration)
      await identityService.forgotPassword(req.body.email);
      res.json({ success: true, message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (err) {
      next(err);
    }
  });

  /**
   * POST /auth/reset-password
   * Reset password using a token from the reset email.
   */
  router.post('/reset-password', validate(resetPasswordSchema, 'body'), async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await identityService.resetPassword(req.body.token, req.body.password);
      res.json({ success: true, message: 'Password reset successfully.' });
    } catch (err: any) {
      if (err?.message === 'INVALID_TOKEN') {
        return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });
      }
      next(err);
    }
  });

  return router;
}
