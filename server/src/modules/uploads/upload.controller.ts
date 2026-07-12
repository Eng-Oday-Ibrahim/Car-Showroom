import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { Router, type Request } from 'express';
import multer from 'multer';

const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const storageRoot = process.env['STORAGE_PATH'] ?? path.resolve(process.cwd(), 'storage');
const carsImageDir = path.join(storageRoot, 'cars');

fs.mkdirSync(carsImageDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, carsImageDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 12,
  },
  fileFilter: (_req, file, cb) => {
    if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
      cb(new Error('Only JPG, PNG, WEBP, and GIF images are allowed'));
      return;
    }

    cb(null, true);
  },
});

function publicUrl(req: Request, filename: string): string {
  return `${req.protocol}://${req.get('host')}/uploads/cars/${filename}`;
}

export function createUploadRouter(): Router {
  const router = Router();

  router.post('/images', upload.array('images', 12), (req, res) => {
    const files = (req.files ?? []) as Express.Multer.File[];
    res.status(201).json({
      success: true,
      data: files.map(file => ({
        filename: file.filename,
        url: publicUrl(req, file.filename),
      })),
    });
  });

  return router;
}

export { storageRoot };
