import { Router } from 'express';
import { randomUUID } from 'crypto';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(db.products.findAll());
});

router.get('/:id', (req, res) => {
  const product = db.products.findById(req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json(product);
});

router.patch('/:id/reserve', authenticate, (req: AuthRequest, res, next) => {
  try {
    const product = db.products.findById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    if (product.quantity <= 0) {
      res.status(409).json({ error: 'Product is out of stock' });
      return;
    }

    const alreadyReserved = db.orders
      .findByUserId(req.userId!)
      .some(o => o.product.id === req.params.id && o.status === 'active');
    if (alreadyReserved) {
      res.status(409).json({ error: 'You already have an active reservation for this product' });
      return;
    }

    const updated = db.products.update(req.params.id, {
      quantity: product.quantity - 1,
    })!;

    const order = db.orders.create({
      id: randomUUID(),
      userId: req.userId!,
      product: updated,
      status: 'active',
      reservedAt: new Date().toISOString(),
    });

    res.json({ product: updated, order });
  } catch (err) {
    next(err);
  }
});

export { router as productsRouter };
