import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';

const router = Router();
router.get('/', (req, res) => success(res, db.prepare('SELECT * FROM equipment ORDER BY id DESC').all()));
router.post('/', (req, res) => {
  const v = req.body;
  const info = db.prepare('INSERT INTO equipment (name,category,brand,serial_number,purchased_at,purchase_price,condition,location,image_url) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(v.name, v.category, v.brand, v.serial_number, v.purchased_at, v.purchase_price, v.condition || 'good', v.location, v.image_url);
  success(res, db.prepare('SELECT * FROM equipment WHERE id=?').get(info.lastInsertRowid), 'Đã thêm thiết bị', 201);
});
router.put('/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM equipment WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy thiết bị', 404);
  const v = { ...current, ...req.body };
  db.prepare('UPDATE equipment SET name=?,category=?,brand=?,serial_number=?,purchased_at=?,purchase_price=?,condition=?,location=?,image_url=? WHERE id=?')
    .run(v.name, v.category, v.brand, v.serial_number, v.purchased_at, v.purchase_price, v.condition, v.location, v.image_url, req.params.id);
  success(res, db.prepare('SELECT * FROM equipment WHERE id=?').get(req.params.id), 'Đã cập nhật thiết bị');
});
router.delete('/:id', (req, res) => {
  db.prepare("UPDATE equipment SET condition='retired' WHERE id=?").run(req.params.id);
  success(res, null, 'Đã ngừng sử dụng thiết bị');
});
export default router;
