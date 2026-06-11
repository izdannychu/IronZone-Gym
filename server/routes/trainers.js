import { Router } from 'express';
import db from '../db/database.js';
import { success, error } from '../utils/response.js';

const router = Router();
const withRating = (row) => ({ ...row, rating: Number(row.rating || 0).toFixed(1), review_count: row.review_count || 0 });

router.get('/', (req, res) => {
  const params = [];
  let where = "WHERE t.status = 'active'";
  if (req.query.specialty) {
    where += ' AND t.specialty = ?';
    params.push(req.query.specialty);
  }
  const rows = db.prepare(`
    SELECT t.*, AVG(r.rating) rating, COUNT(r.id) review_count
    FROM trainers t LEFT JOIN reviews r ON r.target_type='trainer' AND r.target_id=t.id AND r.is_approved=1
    ${where} GROUP BY t.id ORDER BY t.id
  `).all(...params).map(withRating);
  success(res, rows);
});

router.get('/:id', (req, res) => {
  const trainer = db.prepare(`
    SELECT t.*, AVG(r.rating) rating, COUNT(r.id) review_count
    FROM trainers t LEFT JOIN reviews r ON r.target_type='trainer' AND r.target_id=t.id AND r.is_approved=1
    WHERE t.id = ? GROUP BY t.id
  `).get(req.params.id);
  if (!trainer) return error(res, 'Khong tim thay HLV', 404);
  const reviews = db.prepare(`SELECT r.*, u.full_name, u.avatar_url FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.target_type='trainer' AND r.target_id=? ORDER BY r.created_at DESC`).all(req.params.id);
  success(res, { ...withRating(trainer), reviews });
});
export default router;
