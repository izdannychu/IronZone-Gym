import { Router } from 'express';
import db from '../db/database.js';
import { success, error } from '../utils/response.js';
import { parsePlan } from './helpers.js';

const router = Router();
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM plans WHERE is_active = 1 ORDER BY price ASC').all().map(parsePlan);
  success(res, rows);
});
router.get('/:id', (req, res) => {
  const plan = parsePlan(db.prepare('SELECT * FROM plans WHERE id = ? AND is_active = 1').get(req.params.id));
  if (!plan) return error(res, 'Khong tim thay goi tap', 404);
  success(res, plan);
});
export default router;
