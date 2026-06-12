import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { parsePlan } from '../helpers.js';

const router = Router();

router.get('/', (req, res) => {
  success(res, db.prepare('SELECT * FROM plans ORDER BY id DESC').all().map(parsePlan));
});

router.post('/', (req, res) => {
  const v = req.body;
  const features = Array.isArray(v.features) ? v.features : String(v.features || '').split('\n').filter(Boolean);
  const info = db.prepare('INSERT INTO plans (name,duration_days,price,description,features,is_active,is_featured) VALUES (?,?,?,?,?,?,?)')
    .run(v.name, v.duration_days, v.price, v.description, JSON.stringify(features), v.is_active ?? 1, v.is_featured ?? 0);
  success(res, parsePlan(db.prepare('SELECT * FROM plans WHERE id=?').get(info.lastInsertRowid)), 'Đã tạo gói tập', 201);
});

router.put('/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM plans WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy gói tập', 404);
  const next = { ...parsePlan(current), ...req.body };
  const features = Array.isArray(next.features) ? next.features : String(next.features || '').split('\n').filter(Boolean);
  db.prepare('UPDATE plans SET name=?,duration_days=?,price=?,description=?,features=?,is_active=?,is_featured=? WHERE id=?')
    .run(next.name, next.duration_days, next.price, next.description, JSON.stringify(features), next.is_active, next.is_featured, req.params.id);
  success(res, parsePlan(db.prepare('SELECT * FROM plans WHERE id=?').get(req.params.id)), 'Đã cập nhật gói tập');
});

router.delete('/:id', (req, res) => {
  db.prepare('UPDATE plans SET is_active=0 WHERE id=?').run(req.params.id);
  success(res, null, 'Đã ẩn gói tập');
});

export default router;
