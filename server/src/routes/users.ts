import { Router } from 'express';
import { z } from 'zod';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

const UpdateSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .regex(/^[A-Za-zА-Яа-яЁё\s]+$/, 'Name can contain only letters'),
  email: z.string().email('Invalid email address'),
});

router.get('/me', authenticate, (req: AuthRequest, res) => {
  const user = db.users.findById(req.userId!);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  const { passwordHash: _, ...safeUser } = user;
  res.json(safeUser);
});

router.put('/me', authenticate, (req: AuthRequest, res, next) => {
  try {
    const { name, email } = UpdateSchema.parse(req.body);
    const normalEmail = email.toLowerCase().trim();

    const existing = db.users.findByEmail(normalEmail);
    if (existing && existing.id !== req.userId) {
      res.status(409).json({ error: 'Email already in use by another account' });
      return;
    }

    const updated = db.users.update(req.userId!, {
      name: name.trim(),
      email: normalEmail,
    });
    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const { passwordHash: _, ...safeUser } = updated;
    res.json(safeUser);
  } catch (err) {
    next(err);
  }
});

export { router as usersRouter };
