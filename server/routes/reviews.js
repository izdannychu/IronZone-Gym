import { Router } from 'express';
import { body } from 'express-validator';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { success } from '../utils/response.js';

const router = Router();
router.get('/', (req, res) => {
  const { target_type = 'gym', target_id = 0 } = req.query;
  const rows = db.prepare(`SELECT r.*, u.full_name, u.avatar_url FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.is_approved=1 AND r.target_type=? AND r.target_id=? ORDER BY r.created_at DESC`)
    .all(target_type, target_id);
  success(res, rows);
});
router.post('/', auth, [
  body('target_type').isIn(['trainer', 'plan', 'gym']).withMessage('Loai review khong hop le'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating tu 1 den 5'),
  body('comment').trim().isLength({ min: 3 }).withMessage('Binh luan qua ngan')
], validate, (req, res) => {
  const info = db.prepare('INSERT INTO reviews (user_id,target_type,target_id,rating,comment) VALUES (?,?,?,?,?)')
    .run(req.user.id, req.body.target_type, req.body.target_id || 0, req.body.rating, req.body.comment);
  success(res, { id: info.lastInsertRowid }, 'Da gui review', 201);
});
export default router;
