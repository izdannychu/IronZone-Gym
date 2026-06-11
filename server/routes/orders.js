import { Router } from 'express';
import { body } from 'express-validator';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { success, error } from '../utils/response.js';
import { validatePromotion } from './helpers.js';

const router = Router();
router.use(auth);

router.post('/', [
  body('payment_method').isIn(['cash', 'bank_transfer', 'momo', 'zalopay', 'vnpay']).withMessage('Phuong thuc thanh toan khong hop le')
], validate, (req, res) => {
  const items = db.prepare('SELECT c.*, p.name, p.price, p.duration_days FROM cart_items c JOIN plans p ON p.id=c.plan_id WHERE c.user_id=?').all(req.user.id);
  if (!items.length) return error(res, 'Gio hang dang trong', 400);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  let promotion = null;
  let discount = 0;
  if (req.body.promotion_code) {
    promotion = db.prepare('SELECT * FROM promotions WHERE code=?').get(req.body.promotion_code.toUpperCase());
    const promoResult = validatePromotion(promotion, subtotal);
    if (!promoResult.valid) return error(res, promoResult.message, 400);
    discount = promoResult.discount_amount;
  }
  const total = subtotal - discount;
  const tx = db.transaction(() => {
    const order = db.prepare('INSERT INTO orders (user_id,promotion_id,subtotal,discount_amount,total_amount,payment_method,payment_status,status,note) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(req.user.id, promotion?.id || null, subtotal, discount, total, req.body.payment_method, req.body.payment_method === 'cash' ? 'pending' : 'paid', 'confirmed', req.body.note || null);
    const orderId = order.lastInsertRowid;
    const today = new Date();
    const start = today.toISOString().slice(0, 10);
    const insertItem = db.prepare('INSERT INTO order_items (order_id,plan_id,quantity,unit_price) VALUES (?,?,?,?)');
    const insertMembership = db.prepare('INSERT INTO memberships (user_id,plan_id,order_id,start_date,end_date,status) VALUES (?,?,?,?,?,?)');
    const insertNotification = db.prepare('INSERT INTO notifications (user_id,title,message,type) VALUES (?,?,?,?)');
    items.forEach((item) => {
      insertItem.run(orderId, item.plan_id, item.quantity, item.price);
      for (let i = 0; i < item.quantity; i += 1) {
        const end = new Date(today);
        end.setDate(today.getDate() + item.duration_days);
        insertMembership.run(req.user.id, item.plan_id, orderId, start, end.toISOString().slice(0, 10), 'active');
      }
      insertNotification.run(req.user.id, 'Dang ky thanh cong', `Goi ${item.name} da duoc kich hoat.`, 'success');
    });
    if (promotion) db.prepare('UPDATE promotions SET used_count = used_count + 1 WHERE id=?').run(promotion.id);
    db.prepare('DELETE FROM cart_items WHERE user_id=?').run(req.user.id);
    return orderId;
  });
  const orderId = tx();
  const order = db.prepare('SELECT * FROM orders WHERE id=?').get(orderId);
  const memberships = db.prepare('SELECT m.*, p.name plan_name FROM memberships m JOIN plans p ON p.id=m.plan_id WHERE m.order_id=?').all(orderId);
  success(res, { order, memberships }, 'Tao don hang thanh cong', 201);
});

router.get('/my', (req, res) => {
  const rows = db.prepare('SELECT * FROM orders WHERE user_id=? ORDER BY ordered_at DESC').all(req.user.id);
  success(res, rows);
});

router.get('/:id', (req, res) => {
  const order = db.prepare('SELECT * FROM orders WHERE id=? AND user_id=?').get(req.params.id, req.user.id);
  if (!order) return error(res, 'Khong tim thay don hang', 404);
  const items = db.prepare('SELECT oi.*, p.name FROM order_items oi JOIN plans p ON p.id=oi.plan_id WHERE oi.order_id=?').all(order.id);
  success(res, { ...order, items });
});

export default router;
