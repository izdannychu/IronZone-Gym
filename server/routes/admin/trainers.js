import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { databaseMessage, nullableText, numberValue, oneOf, requireText, validEmail } from './utils.js';

const router = Router();
const fields = ['full_name', 'email', 'phone', 'specialty', 'certifications', 'hourly_rate', 'bio', 'avatar_url', 'status'];

router.get('/', (req, res) => success(res, db.prepare('SELECT * FROM trainers ORDER BY id DESC').all()));
router.post('/', (req, res) => {
  try {
    const v = Object.fromEntries(fields.map((f) => [f, req.body[f] ?? null]));
    const info = db.prepare('INSERT INTO trainers (full_name,email,phone,specialty,certifications,hourly_rate,bio,avatar_url,status) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(
        requireText(v.full_name, 'họ tên'),
        validEmail(v.email),
        nullableText(v.phone),
        requireText(v.specialty, 'chuyên môn'),
        nullableText(v.certifications),
        numberValue(v.hourly_rate, 'Giá theo giờ'),
        nullableText(v.bio),
        nullableText(v.avatar_url),
        oneOf(v.status || 'active', ['active', 'inactive'], 'Trạng thái'),
      );
    success(res, db.prepare('SELECT * FROM trainers WHERE id=?').get(info.lastInsertRowid), 'Đã tạo HLV', 201);
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.put('/:id', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM trainers WHERE id=?').get(req.params.id);
    if (!current) return error(res, 'Không tìm thấy HLV', 404);
    const v = { ...current, ...req.body };
    db.prepare('UPDATE trainers SET full_name=?,email=?,phone=?,specialty=?,certifications=?,hourly_rate=?,bio=?,avatar_url=?,status=? WHERE id=?')
      .run(
        requireText(v.full_name, 'họ tên'),
        validEmail(v.email),
        nullableText(v.phone),
        requireText(v.specialty, 'chuyên môn'),
        nullableText(v.certifications),
        numberValue(v.hourly_rate, 'Giá theo giờ'),
        nullableText(v.bio),
        nullableText(v.avatar_url),
        oneOf(v.status, ['active', 'inactive'], 'Trạng thái'),
        req.params.id,
      );
    success(res, db.prepare('SELECT * FROM trainers WHERE id=?').get(req.params.id), 'Đã cập nhật HLV');
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.delete('/:id', (req, res) => {
  const current = db.prepare('SELECT id FROM trainers WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy HLV', 404);
  db.prepare("UPDATE trainers SET status='inactive' WHERE id=?").run(req.params.id);
  success(res, { id: current.id, status: 'inactive' }, 'Đã ẩn HLV');
});
export default router;
