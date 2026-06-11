import { Router } from 'express';
import db from '../../db/database.js';
import { success } from '../../utils/response.js';

const router = Router();
router.get('/', (req, res) => {
  const rows = db.prepare(`
    SELECT m.*, e.name equipment_name, emp.full_name employee_name
    FROM maintenance_logs m JOIN equipment e ON e.id=m.equipment_id
    LEFT JOIN employees emp ON emp.id=m.employee_id
    WHERE (? IS NULL OR m.equipment_id = ?) ORDER BY m.maintenance_date DESC
  `).all(req.query.equipment_id || null, req.query.equipment_id || null);
  success(res, rows);
});
router.post('/', (req, res) => {
  const v = req.body;
  const info = db.prepare('INSERT INTO maintenance_logs (equipment_id,employee_id,maintenance_date,type,description,cost,status) VALUES (?,?,?,?,?,?,?)')
    .run(v.equipment_id, v.employee_id || null, v.maintenance_date, v.type, v.description, v.cost || 0, v.status || 'completed');
  success(res, db.prepare('SELECT * FROM maintenance_logs WHERE id=?').get(info.lastInsertRowid), 'Da ghi log bao tri', 201);
});
export default router;
