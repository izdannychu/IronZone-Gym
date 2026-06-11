import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';

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
  const current = db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Khong tim thay don hang', 404);
  const next = { ...current, ...req.body };
  db.prepare('UPDATE orders SET payment_status=?, status=?, note=? WHERE id=?').run(next.payment_status, next.status, next.note, req.params.id);
  success(res, db.prepare('SELECT * FROM orders WHERE id=?').get(req.params.id), 'Da cap nhat don hang');
});
export default router;
