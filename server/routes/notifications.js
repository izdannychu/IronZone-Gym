import { Router } from 'express';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';
import { success } from '../utils/response.js';

const router = Router();
router.use(auth);
router.get('/my', (req, res) => success(res, db.prepare('SELECT * FROM notifications WHERE user_id=? ORDER BY is_read ASC, sent_at DESC').all(req.user.id)));
router.patch('/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET is_read=1 WHERE id=? AND user_id=?').run(req.params.id, req.user.id);
  success(res, null, 'Đã đánh dấu đã đọc');
});
router.patch('/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET is_read=1 WHERE user_id=?').run(req.user.id);
  success(res, null, 'Đã đánh dấu tất cả');
});
export default router;
