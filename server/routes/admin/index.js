import { Router } from 'express';
import db from '../../db/database.js';
import { auth } from '../../middleware/auth.js';
import { adminOnly } from '../../middleware/adminOnly.js';
import { success } from '../../utils/response.js';
import members from './members.js';
import plans from './plans.js';
import trainers from './trainers.js';
import equipment from './equipment.js';
import maintenance from './maintenance.js';
import promotions from './promotions.js';
import orders from './orders.js';

const router = Router();
router.use(auth, adminOnly);

router.get('/stats', (req, res) => {
  const revenueByMonthRows = db.prepare(`
    SELECT strftime('%Y-%m', ordered_at) month, COALESCE(SUM(total_amount), 0) revenue
    FROM orders
    WHERE ordered_at >= date('now', 'start of month', '-5 months')
      AND status != 'cancelled'
    GROUP BY strftime('%Y-%m', ordered_at)
    ORDER BY month
  `).all();
  const revenueByMonthMap = new Map(revenueByMonthRows.map((row) => [row.month, Number(row.revenue)]));
  const revenue_series = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - (5 - index));
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return { month, revenue: revenueByMonthMap.get(month) || 0 };
  });

  const revenue_month = Number(db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) total
    FROM orders
    WHERE strftime('%Y-%m', ordered_at) = strftime('%Y-%m', 'now')
      AND status != 'cancelled'
  `).get().total);
  const revenue_previous_month = Number(db.prepare(`
    SELECT COALESCE(SUM(total_amount), 0) total
    FROM orders
    WHERE strftime('%Y-%m', ordered_at) = strftime('%Y-%m', 'now', '-1 month')
      AND status != 'cancelled'
  `).get().total);
  const revenue_growth = revenue_previous_month
    ? ((revenue_month - revenue_previous_month) / revenue_previous_month) * 100
    : revenue_month ? 100 : 0;

  const stats = {
    total_members: db.prepare('SELECT COUNT(*) count FROM users').get().count,
    active_memberships: db.prepare("SELECT COUNT(*) count FROM memberships WHERE status='active'").get().count,
    revenue_month,
    revenue_previous_month,
    revenue_growth,
    total_orders: db.prepare('SELECT COUNT(*) count FROM orders').get().count,
    pending_orders: db.prepare("SELECT COUNT(*) count FROM orders WHERE status='pending'").get().count,
    new_members_month: db.prepare("SELECT COUNT(*) count FROM users WHERE strftime('%Y-%m', created_at)=strftime('%Y-%m','now')").get().count,
    equipment_attention: db.prepare("SELECT COUNT(*) count FROM equipment WHERE condition IN ('fair','poor')").get().count,
    top_plans: db.prepare(`SELECT p.name, COUNT(m.id) sold FROM plans p LEFT JOIN memberships m ON m.plan_id=p.id GROUP BY p.id ORDER BY sold DESC LIMIT 5`).all(),
    latest_orders: db.prepare(`SELECT o.*, u.full_name FROM orders o JOIN users u ON u.id=o.user_id ORDER BY o.ordered_at DESC LIMIT 6`).all(),
    latest_members: db.prepare(`SELECT id, full_name, email, avatar_url, created_at, status FROM users ORDER BY created_at DESC LIMIT 6`).all(),
    revenue_series,
    revenue_by_plan: db.prepare(`
      SELECT p.name, COALESCE(SUM(
        CASE WHEN o.status != 'cancelled' THEN oi.quantity * oi.unit_price ELSE 0 END
      ), 0) revenue
      FROM plans p
      LEFT JOIN order_items oi ON oi.plan_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id
      GROUP BY p.id
      HAVING revenue > 0
      ORDER BY revenue DESC
      LIMIT 5
    `).all().map((row) => ({ ...row, revenue: Number(row.revenue) })),
    order_statuses: db.prepare(`
      SELECT status, COUNT(*) value
      FROM orders
      GROUP BY status
      ORDER BY value DESC
    `).all()
  };
  success(res, stats);
});

router.use('/members', members);
router.use('/plans', plans);
router.use('/trainers', trainers);
router.use('/equipment', equipment);
router.use('/maintenance', maintenance);
router.use('/promotions', promotions);
router.use('/orders', orders);

export default router;
