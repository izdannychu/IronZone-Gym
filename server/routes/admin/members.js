import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { paginate } from '../helpers.js';

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
router.put('/:id', (req, res) => {
  const current = db.prepare('SELECT * FROM users WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy hội viên', 404);
  const next = { ...current, ...req.body };
  db.prepare('UPDATE users SET full_name=?, email=?, phone=?, dob=?, gender=?, status=? WHERE id=?').run(next.full_name, next.email, next.phone, next.dob, next.gender, next.status, req.params.id);
  success(res, db.prepare('SELECT id, full_name, email, phone, dob, gender, status FROM users WHERE id=?').get(req.params.id), 'Đã cập nhật hội viên');
});
router.delete('/:id', (req, res) => {
  db.prepare("UPDATE users SET status='banned' WHERE id=?").run(req.params.id);
  success(res, null, 'Đã khóa hội viên');
});
export default router;
