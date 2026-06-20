import { Router } from 'express';
import bcrypt from 'bcryptjs';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { paginate } from '../helpers.js';
import { databaseMessage, nullableText, oneOf, requireText, validEmail } from './utils.js';

const router = Router();
router.get('/', (req, res) => {
  const { limit, offset, page } = paginate(req);
  const params = [];
  let where = 'WHERE 1=1';
  if (req.query.search) {
    where += ' AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ?)';
    const s = `%${req.query.search}%`;
    params.push(s, s, s);
  }
  if (req.query.status) {
    where += ' AND status = ?';
    params.push(req.query.status);
  }
  const total = db.prepare(`SELECT COUNT(*) count FROM users ${where}`).get(...params).count;
  const rows = db.prepare(`SELECT id, full_name, email, phone, dob, gender, avatar_url, status, created_at FROM users ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`).all(...params, limit, offset);
  success(res, { rows, page, limit, total });
});
router.get('/:id', (req, res) => {
  const user = db.prepare('SELECT id, full_name, email, phone, dob, gender, avatar_url, status, created_at FROM users WHERE id=?').get(req.params.id);
  if (!user) return error(res, 'Không tìm thấy hội viên', 404);
  const memberships = db.prepare('SELECT m.*, p.name plan_name FROM memberships m JOIN plans p ON p.id=m.plan_id WHERE m.user_id=?').all(req.params.id);
  success(res, { ...user, memberships });
});
router.post('/', (req, res) => {
  try {
    const fullName = requireText(req.body.full_name, 'họ tên');
    const email = validEmail(req.body.email, true);
    const password = requireText(req.body.password, 'mật khẩu');
    if (password.length < 6) return error(res, 'Mật khẩu phải có ít nhất 6 ký tự', 422);
    const gender = req.body.gender ? oneOf(req.body.gender, ['male', 'female', 'other'], 'Giới tính') : null;
    const status = oneOf(req.body.status || 'active', ['active', 'inactive', 'banned'], 'Trạng thái');
    const avatarUrl = nullableText(req.body.avatar_url) || `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`;
    const info = db.prepare(`
      INSERT INTO users (full_name,email,password_hash,phone,dob,gender,avatar_url,status)
      VALUES (?,?,?,?,?,?,?,?)
    `).run(
      fullName,
      email,
      bcrypt.hashSync(password, 10),
      nullableText(req.body.phone),
      nullableText(req.body.dob),
      gender,
      avatarUrl,
      status,
    );
    success(res, db.prepare('SELECT id, full_name, email, phone, dob, gender, avatar_url, status, created_at FROM users WHERE id=?').get(info.lastInsertRowid), 'Đã tạo hội viên', 201);
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.put('/:id', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM users WHERE id=?').get(req.params.id);
    if (!current) return error(res, 'Không tìm thấy hội viên', 404);
    const next = { ...current, ...req.body };
    const fullName = requireText(next.full_name, 'họ tên');
    const email = validEmail(next.email, true);
    const gender = next.gender ? oneOf(next.gender, ['male', 'female', 'other'], 'Giới tính') : null;
    const status = oneOf(next.status, ['active', 'inactive', 'banned'], 'Trạng thái');
    db.prepare('UPDATE users SET full_name=?, email=?, phone=?, dob=?, gender=?, avatar_url=?, status=? WHERE id=?')
      .run(fullName, email, nullableText(next.phone), nullableText(next.dob), gender, nullableText(next.avatar_url), status, req.params.id);
    success(res, db.prepare('SELECT id, full_name, email, phone, dob, gender, avatar_url, status, created_at FROM users WHERE id=?').get(req.params.id), 'Đã cập nhật hội viên');
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.delete('/:id', (req, res) => {
  const current = db.prepare('SELECT id, status FROM users WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy hội viên', 404);
  db.prepare("UPDATE users SET status='banned' WHERE id=?").run(req.params.id);
  success(res, { ...current, status: 'banned' }, 'Đã khóa hội viên');
});
export default router;
