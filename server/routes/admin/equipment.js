import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { databaseMessage, nullableText, numberValue, oneOf, requireText } from './utils.js';

const router = Router();
const conditions = ['new', 'good', 'fair', 'poor', 'retired'];
router.get('/', (req, res) => success(res, db.prepare('SELECT * FROM equipment ORDER BY id DESC').all()));
router.post('/', (req, res) => {
  try {
    const v = req.body;
    const info = db.prepare('INSERT INTO equipment (name,category,brand,serial_number,purchased_at,purchase_price,condition,location,image_url) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(
        requireText(v.name, 'tên thiết bị'),
        nullableText(v.category),
        nullableText(v.brand),
        nullableText(v.serial_number),
        nullableText(v.purchased_at),
        numberValue(v.purchase_price ?? 0, 'Giá mua'),
        oneOf(v.condition || 'good', conditions, 'Tình trạng'),
        nullableText(v.location),
        nullableText(v.image_url),
      );
    success(res, db.prepare('SELECT * FROM equipment WHERE id=?').get(info.lastInsertRowid), 'Đã thêm thiết bị', 201);
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.put('/:id', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM equipment WHERE id=?').get(req.params.id);
    if (!current) return error(res, 'Không tìm thấy thiết bị', 404);
    const v = { ...current, ...req.body };
    db.prepare('UPDATE equipment SET name=?,category=?,brand=?,serial_number=?,purchased_at=?,purchase_price=?,condition=?,location=?,image_url=? WHERE id=?')
      .run(
        requireText(v.name, 'tên thiết bị'),
        nullableText(v.category),
        nullableText(v.brand),
        nullableText(v.serial_number),
        nullableText(v.purchased_at),
        numberValue(v.purchase_price ?? 0, 'Giá mua'),
        oneOf(v.condition, conditions, 'Tình trạng'),
        nullableText(v.location),
        nullableText(v.image_url),
        req.params.id,
      );
    success(res, db.prepare('SELECT * FROM equipment WHERE id=?').get(req.params.id), 'Đã cập nhật thiết bị');
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.delete('/:id', (req, res) => {
  const current = db.prepare('SELECT id FROM equipment WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy thiết bị', 404);
  db.prepare("UPDATE equipment SET condition='retired' WHERE id=?").run(req.params.id);
  success(res, { id: current.id, condition: 'retired' }, 'Đã ngừng sử dụng thiết bị');
});
export default router;
