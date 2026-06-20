import { Router } from 'express';
import db from '../../db/database.js';
import { success, error } from '../../utils/response.js';
import { databaseMessage, integerFlag, nullableText, numberValue, oneOf, requireText } from './utils.js';

const router = Router();
const normalizePromotion = (source, current = {}) => {
  const v = { ...current, ...source };
  const discountType = oneOf(v.discount_type || 'percent', ['percent', 'fixed'], 'Loại giảm giá');
  const discountValue = numberValue(v.discount_value, 'Giá trị giảm', { min: 0.01 });
  if (discountType === 'percent' && discountValue > 100) throw new Error('Giảm theo phần trăm không được vượt quá 100%');
  const startDate = requireText(v.start_date, 'ngày bắt đầu');
  const endDate = requireText(v.end_date, 'ngày kết thúc');
  if (endDate < startDate) throw new Error('Ngày kết thúc phải sau hoặc bằng ngày bắt đầu');
  const usageLimit = numberValue(v.usage_limit ?? 100, 'Giới hạn sử dụng', { min: 1, integer: true });
  if (usageLimit < Number(v.used_count || 0)) throw new Error('Giới hạn sử dụng không thể nhỏ hơn số lượt đã dùng');
  return {
    code: requireText(v.code, 'mã khuyến mãi').toUpperCase(),
    description: nullableText(v.description),
    discountType,
    discountValue,
    minOrderAmount: numberValue(v.min_order_amount ?? 0, 'Đơn tối thiểu'),
    startDate,
    endDate,
    usageLimit,
    isActive: v.is_active === undefined ? 1 : integerFlag(v.is_active),
  };
};

router.get('/', (req, res) => success(res, db.prepare('SELECT * FROM promotions ORDER BY id DESC').all()));
router.post('/', (req, res) => {
  try {
    const v = normalizePromotion(req.body);
    const info = db.prepare('INSERT INTO promotions (code,description,discount_type,discount_value,min_order_amount,start_date,end_date,usage_limit,is_active) VALUES (?,?,?,?,?,?,?,?,?)')
      .run(v.code, v.description, v.discountType, v.discountValue, v.minOrderAmount, v.startDate, v.endDate, v.usageLimit, v.isActive);
    success(res, db.prepare('SELECT * FROM promotions WHERE id=?').get(info.lastInsertRowid), 'Đã tạo mã giảm giá', 201);
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.put('/:id', (req, res) => {
  try {
    const current = db.prepare('SELECT * FROM promotions WHERE id=?').get(req.params.id);
    if (!current) return error(res, 'Không tìm thấy mã giảm giá', 404);
    const v = normalizePromotion(req.body, current);
    db.prepare('UPDATE promotions SET code=?,description=?,discount_type=?,discount_value=?,min_order_amount=?,start_date=?,end_date=?,usage_limit=?,is_active=? WHERE id=?')
      .run(v.code, v.description, v.discountType, v.discountValue, v.minOrderAmount, v.startDate, v.endDate, v.usageLimit, v.isActive, req.params.id);
    success(res, db.prepare('SELECT * FROM promotions WHERE id=?').get(req.params.id), 'Đã cập nhật mã giảm giá');
  } catch (err) {
    error(res, databaseMessage(err), err.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 409 : 422);
  }
});
router.delete('/:id', (req, res) => {
  const current = db.prepare('SELECT id FROM promotions WHERE id=?').get(req.params.id);
  if (!current) return error(res, 'Không tìm thấy mã giảm giá', 404);
  db.prepare('UPDATE promotions SET is_active=0 WHERE id=?').run(req.params.id);
  success(res, { id: current.id, is_active: 0 }, 'Đã tắt mã giảm giá');
});
export default router;
