import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { parsePlan } from '../helpers.js';
import { databaseMessage, integerFlag, nullableText, numberValue, requireText } from './utils.js';

const router = Router();

router.get('/', (req, res) => {
  success(res, db.prepare('SELECT * FROM plans ORDER BY id DESC').all().map(parsePlan));
});

router.post('/', (req, res) => {
  try {
    const features = (Array.isArray(req.body.features) ? req.body.features : String(req.body.features || '').split('\n'))
      .map((item) => item.trim()).filter(Boolean);
    const info = db.prepare('INSERT INTO plans (name,duration_days,price,description,features,is_active,is_featured) VALUES (?,?,?,?,?,?,?)')
      .run(
        requireText(req.body.name, 'tên gói'),
        numberValue(req.body.duration_days, 'Thời hạn', { min: 1, integer: true }),
        numberValue(req.body.price, 'Giá'),
        nullableText(req.body.description),
        JSON.stringify(features),
        req.body.is_active === undefined ? 1 : integerFlag(req.body.is_active),
        integerFlag(req.body.is_featured),
      );
    success(res, parsePlan(db.prepare('SELECT * FROM plans WHERE id=?').get(info.lastInsertRowid)), 'Đã tạo gói tập', 201);
  } catch (err) {
    error(res, databaseMessage(err), 422);
  }
});

router.put('/:id', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM plans WHERE id=?').get(req.params.id);
    if (!current) return error(res, 'Không tìm thấy gói tập', 404);
    const next = { ...parsePlan(current), ...req.body };
    const features = (Array.isArray(next.features) ? next.features : String(next.features || '').split('\n'))
      .map((item) => item.trim()).filter(Boolean);
    db.prepare('UPDATE plans SET name=?,duration_days=?,price=?,description=?,features=?,is_active=?,is_featured=? WHERE id=?')
      .run(
        requireText(next.name, 'tên gói'),
        numberValue(next.duration_days, 'Thời hạn', { min: 1, integer: true }),
        numberValue(next.price, 'Giá'),
        nullableText(next.description),
        JSON.stringify(features),
        integerFlag(next.is_active),
        integerFlag(next.is_featured),
        req.params.id,
      );
    success(res, parsePlan(db.prepare('SELECT * FROM plans WHERE id=?').get(req.params.id)), 'Đã cập nhật gói tập');
  } catch (err) {
    error(res, databaseMessage(err), 422);
  }
});

router.delete('/:id', (req, res) => {
  const current = db.prepare('SELECT id FROM plans WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy gói tập', 404);
  db.prepare('UPDATE plans SET is_active=0 WHERE id=?').run(req.params.id);
  success(res, { id: current.id, is_active: 0 }, 'Đã ẩn gói tập');
});

export default router;
