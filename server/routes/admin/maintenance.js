import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { databaseMessage, nullableText, numberValue, oneOf, requireText } from './utils.js';

const router = Router();
const types = ['routine', 'repair', 'replacement', 'inspection'];
const statuses = ['scheduled', 'in_progress', 'completed'];
const detailQuery = `
  SELECT m.*, e.name equipment_name, emp.full_name employee_name
  FROM maintenance_logs m
  JOIN equipment e ON e.id=m.equipment_id
  LEFT JOIN employees emp ON emp.id=m.employee_id
`;

router.get('/lookups', (req, res) => {
  success(res, {
    equipment: db.prepare("SELECT id, name, serial_number, condition FROM equipment WHERE condition != 'retired' ORDER BY name").all(),
    employees: db.prepare("SELECT id, full_name, position FROM employees WHERE status='active' ORDER BY full_name").all(),
  });
});
router.get('/', (req, res) => {
  const rows = db.prepare(`
    ${detailQuery}
    WHERE (? IS NULL OR m.equipment_id = ?) ORDER BY m.maintenance_date DESC
  `).all(req.query.equipment_id || null, req.query.equipment_id || null);
  success(res, rows);
});
router.post('/', (req, res) => {
  try {
    const v = req.body;
    const equipmentId = numberValue(v.equipment_id, 'Thiết bị', { min: 1, integer: true });
    if (!db.prepare('SELECT id FROM equipment WHERE id=?').get(equipmentId)) return error(res, 'Thiết bị không tồn tại', 422);
    const employeeId = v.employee_id ? numberValue(v.employee_id, 'Nhân viên', { min: 1, integer: true }) : null;
    if (employeeId && !db.prepare('SELECT id FROM employees WHERE id=?').get(employeeId)) return error(res, 'Nhân viên không tồn tại', 422);
    const info = db.prepare('INSERT INTO maintenance_logs (equipment_id,employee_id,maintenance_date,type,description,cost,status) VALUES (?,?,?,?,?,?,?)')
      .run(
        equipmentId,
        employeeId,
        requireText(v.maintenance_date, 'ngày bảo trì'),
        oneOf(v.type || 'routine', types, 'Loại bảo trì'),
        nullableText(v.description),
        numberValue(v.cost ?? 0, 'Chi phí'),
        oneOf(v.status || 'scheduled', statuses, 'Trạng thái'),
      );
    success(res, db.prepare(`${detailQuery} WHERE m.id=?`).get(info.lastInsertRowid), 'Đã tạo lịch bảo trì', 201);
  } catch (err) {
    error(res, databaseMessage(err), 422);
  }
});
router.put('/:id', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM maintenance_logs WHERE id=?').get(req.params.id);
    if (!current) return error(res, 'Không tìm thấy lịch bảo trì', 404);
    const v = { ...current, ...req.body };
    const equipmentId = numberValue(v.equipment_id, 'Thiết bị', { min: 1, integer: true });
    if (!db.prepare('SELECT id FROM equipment WHERE id=?').get(equipmentId)) return error(res, 'Thiết bị không tồn tại', 422);
    const employeeId = v.employee_id ? numberValue(v.employee_id, 'Nhân viên', { min: 1, integer: true }) : null;
    if (employeeId && !db.prepare('SELECT id FROM employees WHERE id=?').get(employeeId)) return error(res, 'Nhân viên không tồn tại', 422);
    db.prepare('UPDATE maintenance_logs SET equipment_id=?,employee_id=?,maintenance_date=?,type=?,description=?,cost=?,status=? WHERE id=?')
      .run(
        equipmentId,
        employeeId,
        requireText(v.maintenance_date, 'ngày bảo trì'),
        oneOf(v.type, types, 'Loại bảo trì'),
        nullableText(v.description),
        numberValue(v.cost ?? 0, 'Chi phí'),
        oneOf(v.status, statuses, 'Trạng thái'),
        req.params.id,
      );
    success(res, db.prepare(`${detailQuery} WHERE m.id=?`).get(req.params.id), 'Đã cập nhật lịch bảo trì');
  } catch (err) {
    error(res, databaseMessage(err), 422);
  }
});
router.delete('/:id', (req, res) => {
  const current = db.prepare('SELECT id FROM maintenance_logs WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy lịch bảo trì', 404);
  db.prepare('DELETE FROM maintenance_logs WHERE id=?').run(req.params.id);
  success(res, { id: current.id }, 'Đã xóa lịch bảo trì');
});
export default router;
