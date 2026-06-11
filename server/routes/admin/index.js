import { Router } from 'express';
import db from '../../db/database.js';
import { auth } from '../../middleware/auth.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { success } from '../../utils/response.js';
import members from './members.js';
import trainers from './trainers.js';
import equipment from './equipment.js';
import maintenance from './maintenance.js';
import promotions from './promotions.js';
import orders from './orders.js';

const router = Router();
router.use(auth, adminOnly);

router.get('/stats', (req, res) => {
  const stats = {
    total_members: db.prepare('SELECT COUNT(*) count FROM users').get().count,
    active_memberships: db.prepare("SELECT COUNT(*) count FROM memberships WHERE status='active'").get().count,
    revenue_month: db.prepare("SELECT COALESCE(SUM(total_amount),0) total FROM orders WHERE strftime('%Y-%m', ordered_at)=strftime('%Y-%m','now')").get().total,
    equipment_attention: db.prepare("SELECT COUNT(*) count FROM equipment WHERE condition IN ('fair','poor')").get().count,
    top_plans: db.prepare(`SELECT p.name, COUNT(m.id) sold FROM plans p LEFT JOIN memberships m ON m.plan_id=p.id GROUP BY p.id ORDER BY sold DESC LIMIT 5`).all(),
    latest_orders: db.prepare(`SELECT o.*, u.full_name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.ordered_at DESC LIMIT 6`).all(),
    latest_members: db.prepare(`SELECT id, full_name, email, created_at, status FROM users ORDER BY created_at DESC LIMIT 6`).all()
  };
  success(res, stats);
});

router.use('/members', members);
router.use('/trainers', trainers);
router.use('/equipment', equipment);
router.use('/maintenance', maintenance);
router.use('/promotions', promotions);
router.use('/orders', orders);

export default router;
