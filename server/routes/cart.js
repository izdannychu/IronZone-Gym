import { Router } from 'express';
import { body } from 'express-validator';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { success, error } from '../utils/response.js';
import { parsePlan } from './helpers.js';

const router = Router();
router.use(auth);

const getCart = (userId) => {
  const items = db.prepare(`
    SELECT c.*, p.name, p.duration_days, p.price, p.description, p.features, p.is_featured
    FROM cart_items c JOIN plans p ON p.id = c.plan_id WHERE c.user_id = ? ORDER BY c.added_at DESC
  `).all(userId).map((item) => ({ ...item, plan: parsePlan(item), line_total: Number(item.price) * item.quantity }));
  return { items, subtotal: items.reduce((sum, item) => sum + item.line_total, 0) };
};

router.get('/', (req, res) => success(res, getCart(req.user.id)));
router.post('/', [body('plan_id').isInt().withMessage('plan_id khong hop le'), body('quantity').optional().isInt({ min: 1 }).withMessage('So luong khong hop le')], validate, (req, res) => {
  const plan = db.prepare('SELECT id FROM plans WHERE id=? AND is_active=1').get(req.body.plan_id);
  if (!plan) return error(res, 'Goi tap khong ton tai', 404);
  db.prepare(`
    INSERT INTO cart_items (user_id, plan_id, quantity) VALUES (?, ?, ?)
    ON CONFLICT(user_id, plan_id) DO UPDATE SET quantity = quantity + excluded.quantity
  `).run(req.user.id, req.body.plan_id, req.body.quantity || 1);
  success(res, getCart(req.user.id), 'Da them vao gio hang', 201);
});
router.put('/:id', [body('quantity').isInt({ min: 1 }).withMessage('So luong khong hop le')], validate, (req, res) => {
  db.prepare('UPDATE cart_items SET quantity=? WHERE id=? AND user_id=?').run(req.body.quantity, req.params.id, req.user.id);
  success(res, getCart(req.user.id), 'Da cap nhat gio hang');
});
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE id=? AND user_id=?').run(req.params.id, req.user.id);
  success(res, getCart(req.user.id), 'Da xoa san pham');
});
router.delete('/', (req, res) => {
  db.prepare('DELETE FROM cart_items WHERE user_id=?').run(req.user.id);
  success(res, getCart(req.user.id), 'Da xoa gio hang');
});

export default router;
