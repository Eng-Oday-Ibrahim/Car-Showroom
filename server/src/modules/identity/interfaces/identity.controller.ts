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
      res.json({ success: true, ...result });
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

  return router;
}
