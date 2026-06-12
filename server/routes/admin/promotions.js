import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';

const router = Router();
router.get('/', (req, res) => success(res, db.prepare('SELECT * FROM promotions ORDER BY id DESC').all()));
router.post('/', (req, res) => {
  const v = req.body;
  const info = db.prepare('INSERT INTO promotions (code,description,discount_type,discount_value,min_order_amount,start_date,end_date,usage_limit,is_active) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(String(v.code).toUpperCase(), v.description, v.discount_type, v.discount_value, v.min_order_amount || 0, v.start_date, v.end_date, v.usage_limit || 100, v.is_active ?? 1);
  success(res, db.prepare('SELECT * FROM promotions WHERE id=?').get(info.lastInsertRowid), 'Đã tạo mã giảm giá', 201);
});
router.put('/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM promotions WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy mã giảm giá', 404);
  const v = { ...current, ...req.body, code: (req.body.code || current.code).toUpperCase() };
  db.prepare('UPDATE promotions SET code=?,description=?,discount_type=?,discount_value=?,min_order_amount=?,start_date=?,end_date=?,usage_limit=?,is_active=? WHERE id=?')
    .run(v.code, v.description, v.discount_type, v.discount_value, v.min_order_amount, v.start_date, v.end_date, v.usage_limit, v.is_active, req.params.id);
  success(res, db.prepare('SELECT * FROM promotions WHERE id=?').get(req.params.id), 'Đã cập nhật mã giảm giá');
});
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM promotions WHERE id=?').run(req.params.id);
  success(res, null, 'Đã xóa mã giảm giá');
});
export default router;
