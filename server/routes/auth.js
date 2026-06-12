import { Router } from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { body } from 'express-validator';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { signToken } from '../utils/jwt.js';
import { error, success } from '../utils/response.js';

const router = Router();
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50 });

const publicUser = (u) => ({ id: u.id, full_name: u.full_name, email: u.email, phone: u.phone, dob: u.dob, gender: u.gender, avatar_url: u.avatar_url, status: u.status });
const publicAdmin = (a) => ({ id: a.id, username: a.username, email: a.email, role: a.role, type: 'admin' });

router.post('/register', limiter, [
  body('full_name').trim().isLength({ min: 2 }).withMessage('Họ tên tối thiểu 2 ký tự'),
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').isLength({ min: 6 }).withMessage('Mật khẩu tối thiểu 6 ký tự')
], validate, (req, res) => {
  try {
    const { full_name, email, password, phone, dob, gender } = req.body;
    const exists = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (exists) return error(res, 'Email da duoc su dung', 409);
    const info = db.prepare('INSERT INTO users (full_name,email,password_hash,phone,dob,gender,avatar_url) VALUES (?,?,?,?,?,?,?)')
      .run(full_name, email.toLowerCase(), bcrypt.hashSync(password, 10), phone || null, dob || null, gender || null, `https://i.pravatar.cc/300?u=${encodeURIComponent(email)}`);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = signToken({ id: user.id, type: 'user' });
    success(res, { token, user: publicUser(user) }, 'Đăng ký thành công', 201);
  } catch (err) {
    error(res, err.message);
  }
});

router.post('/login', limiter, [
  body('email').isEmail().withMessage('Email không hợp lệ'),
  body('password').notEmpty().withMessage('Vui lòng nhập mật khẩu')
], validate, (req, res) => {
  const { email, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email.toLowerCase());
  if (admin && bcrypt.compareSync(password, admin.password_hash)) {
    return success(res, { token: signToken({ id: admin.id, type: 'admin' }), user: publicAdmin(admin) }, 'Đăng nhập admin thành công');
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) return error(res, 'Email hoặc mật khẩu không đúng', 401);
  if (user.status !== 'active') return error(res, 'Tài khoản không hoạt động', 403);
  success(res, { token: signToken({ id: user.id, type: 'user' }), user: publicUser(user) }, 'Đăng nhập thành công');
});

router.get('/me', auth, (req, res) => success(res, req.user));

router.put('/profile', auth, [
  body('full_name').optional().trim().isLength({ min: 2 }).withMessage('Họ tên tối thiểu 2 ký tự'),
  body('email').optional().isEmail().withMessage('Email không hợp lệ')
], validate, (req, res) => {
  if (req.user.type === 'admin') return error(res, 'Admin không cập nhật profile tại đây', 403);
  const current = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  const next = { ...current, ...req.body };
  db.prepare('UPDATE users SET full_name=?, email=?, phone=?, dob=?, gender=?, avatar_url=? WHERE id=?')
    .run(next.full_name, next.email, next.phone, next.dob, next.gender, next.avatar_url, req.user.id);
  success(res, publicUser(db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)), 'Cập nhật thành công');
});

router.put('/change-password', auth, [
  body('current_password').notEmpty().withMessage('Vui lòng nhập mật khẩu hiện tại'),
  body('new_password').isLength({ min: 6 }).withMessage('Mật khẩu mới tối thiểu 6 ký tự')
], validate, (req, res) => {
  const table = req.user.type === 'admin' ? 'admins' : 'users';
  const account = db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(req.user.id);
  if (!bcrypt.compareSync(req.body.current_password, account.password_hash)) return error(res, 'Mật khẩu hiện tại không đúng', 400);
  db.prepare(`UPDATE ${table} SET password_hash = ? WHERE id = ?`).run(bcrypt.hashSync(req.body.new_password, 10), req.user.id);
  success(res, null, 'Đổi mật khẩu thành công');
});

export default router;
