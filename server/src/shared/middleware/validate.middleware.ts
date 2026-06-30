import type { Request, Response, NextFunction } from 'express';
import { type ZodSchema, ZodError }             from 'zod';

type RequestField = 'body' | 'query' | 'params';

export function validate(schema: ZodSchema, field: RequestField = 'body') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({ [field]: req[field] });

    if (!result.success) {
      const errors = result.error.issues.map((e) => ({
        field: e.path.map((segment) => String(segment)).join('.'),
        message: e.message,
      }));

      res.status(422).json({
        success: false,
        message: 'Invalid data',
        errors,
      });
      return;
    }

    const validatedValue = (result.data as Record<string, unknown>)[field];
    req[field] = validatedValue as typeof req[typeof field];
    next();
  };
}