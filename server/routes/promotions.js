import { Router } from 'express';
import { body } from 'express-validator';
import db from '../db/database.js';
import { auth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { success, error } from '../utils/response.js';
import { validatePromotion } from './helpers.js';

const router = Router();
router.post('/validate', auth, [
  body('code').trim().notEmpty().withMessage('Vui lòng nhập mã giảm giá'),
  body('order_amount').isFloat({ min: 0 }).withMessage('Gia tri don hang khong hop le')
], validate, (req, res) => {
  const promo = db.prepare('SELECT * FROM promotions WHERE code = ?').get(req.body.code.toUpperCase());
  const result = validatePromotion(promo, Number(req.body.order_amount));
  if (!result.valid) return error(res, result.message, 400);
  success(res, { promotion: promo, ...result }, 'Mã giảm giá hợp lệ');
});
export default router;
