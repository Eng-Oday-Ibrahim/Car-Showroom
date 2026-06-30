import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public readonly message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorHandler(
  err:  Error,
  req:  Request,
  res:  Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void {
  // أخطاء MongoDB - ObjectId غير صالح
  if (err.name === 'CastError') {
    res.status(400).json({ success: false, message: 'معرّف غير صالح' });
    return;
  }

  // أخطاء MongoDB - تكرار unique
  if ((err as NodeJS.ErrnoException).code === '11000') {
    res.status(409).json({ success: false, message: 'هذه البيانات موجودة مسبقاً' });
    return;
  }

  // أخطاء Domain / Application
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ success: false, message: err.message });
    return;
  }

  // أخطاء Domain العادية (throw new Error من الـ entity)
  if (err instanceof Error) {
    const isDomainError = [
      'لا يمكن',
      'يمكن',
      'مطلوب',
      'غير صالح',
      'غير موجود',
    ].some(keyword => err.message.includes(keyword));

    if (isDomainError) {
      res.status(400).json({ success: false, message: err.message });
      return;
    }
  }

  // أخطاء غير متوقعة
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'خطأ داخلي في الخادم' });
}