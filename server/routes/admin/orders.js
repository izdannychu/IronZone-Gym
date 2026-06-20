import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { nullableText, oneOf } from './utils.js';

const router = Router();
router.get('/', (req, res) => {
  const params = [];
  let where = 'WHERE 1=1';
  if (req.query.status) {
    where += ' AND o.status=?';
    params.push(req.query.status);
  }
  if (req.query.from) {
    where += ' AND date(o.ordered_at) >= date(?)';
    params.push(req.query.from);
  }
  if (req.query.to) {
    where += ' AND date(o.ordered_at) <= date(?)';
    params.push(req.query.to);
  }
  const rows = db.prepare(`SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON u.id=o.user_id ${where} ORDER BY o.ordered_at DESC`).all(...params);
  success(res, rows);
});
router.put('/:id', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
    if (!current) return error(res, 'Không tìm thấy đơn hàng', 404);
    const next = { ...current, ...req.body };
    const paymentStatus = oneOf(next.payment_status, ['pending', 'paid', 'failed', 'refunded'], 'Trạng thái thanh toán');
    const status = oneOf(next.status, ['pending', 'confirmed', 'cancelled'], 'Trạng thái đơn hàng');
    db.prepare('UPDATE orders SET payment_status=?, status=?, note=? WHERE id=?')
      .run(paymentStatus, status, nullableText(next.note), req.params.id);
    if (status === 'cancelled') {
      db.prepare("UPDATE memberships SET status='cancelled' WHERE order_id=? AND status IN ('active','pending')").run(req.params.id);
    }
    success(res, db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id), 'Đã cập nhật đơn hàng');
  } catch (err) {
    error(res, err.message, 422);
  }
});
router.delete('/:id', (req, res) => {
  const current = db.prepare('SELECT id, status FROM orders WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy đơn hàng', 404);
  const cancelOrder = db.transaction(() => {
    db.prepare("UPDATE orders SET status='cancelled' WHERE id=?").run(req.params.id);
    db.prepare("UPDATE memberships SET status='cancelled' WHERE order_id=? AND status IN ('active','pending')").run(req.params.id);
  });
  cancelOrder();
  success(res, { id: current.id, status: 'cancelled' }, 'Đã hủy đơn hàng');
});
export default router;
