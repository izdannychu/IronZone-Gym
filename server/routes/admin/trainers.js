import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';

const router = Router();
const fields = ['full_name', 'email', 'phone', 'specialty', 'certifications', 'hourly_rate', 'bio', 'avatar_url', 'status'];

router.get('/', (req, res) => success(res, db.prepare('SELECT * FROM trainers ORDER BY id DESC').all()));
router.post('/', (req, res) => {
  const v = Object.fromEntries(fields.map((f) => [f, req.body[f] ?? null]));
  const info = db.prepare('INSERT INTO trainers (full_name,email,phone,specialty,certifications,hourly_rate,bio,avatar_url,status) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(v.full_name, v.email, v.phone, v.specialty, v.certifications, v.hourly_rate, v.bio, v.avatar_url, v.status || 'active');
  success(res, db.prepare('SELECT * FROM trainers WHERE id=?').get(info.lastInsertRowid), 'Da tao HLV', 201);
});
router.put('/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM trainers WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Khong tim thay HLV', 404);
  const v = { ...current, ...req.body };
  db.prepare('UPDATE trainers SET full_name=?,email=?,phone=?,specialty=?,certifications=?,hourly_rate=?,bio=?,avatar_url=?,status=? WHERE id=?')
    .run(v.full_name, v.email, v.phone, v.specialty, v.certifications, v.hourly_rate, v.bio, v.avatar_url, v.status, req.params.id);
  success(res, db.prepare('SELECT * FROM trainers WHERE id=?').get(req.params.id), 'Da cap nhat HLV');
});
router.delete('/:id', (req, res) => {
  db.prepare("UPDATE trainers SET status='inactive' WHERE id=?").run(req.params.id);
  success(res, null, 'Da an HLV');
});
export default router;
