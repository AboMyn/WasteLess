import { Router } from 'express';
import { db } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import type { AuthRequest } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, (req: AuthRequest, res) => {
  res.json(db.orders.findByUserId(req.userId!));
});

router.delete('/:id', authenticate, (req: AuthRequest, res) => {
  const order = db.orders.findById(req.params.id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  if (order.userId !== req.userId) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  // Restore product quantity when order is cancelled
  const product = db.products.findById(order.product.id);
  if (product) {
    db.products.update(product.id, { quantity: product.quantity + 1 });
  }

  db.orders.delete(order.id);
  res.status(204).end();
});

export { router as ordersRouter };
