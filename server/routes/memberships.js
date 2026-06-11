import { Router } from 'express';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';
import { success } from '../utils/response.js';

const router = Router();
router.get('/my', auth, (req, res) => {
  const rows = db.prepare(`
    SELECT m.*, p.name plan_name, p.price, t.full_name trainer_name
    FROM memberships m JOIN plans p ON p.id=m.plan_id
    LEFT JOIN trainers t ON t.id=m.trainer_id
    WHERE m.user_id=? ORDER BY m.end_date DESC
  `).all(req.user.id);
  success(res, rows);
});
export default router;
