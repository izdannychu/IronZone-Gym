export const parsePlan = (plan) => plan ? ({ ...plan, features: JSON.parse(plan.features || '[]') }) : null;
export const paginate = (req) => {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 20), 1), 100);
  return { page, limit, offset: (page - 1) * limit };
};

export const validatePromotion = (promo, amount) => {
  const today = new Date().toISOString().slice(0, 10);
  if (!promo) return { valid: false, message: 'Ma giam gia khong ton tai' };
  if (!promo.is_active) return { valid: false, message: 'Ma giam gia da tat' };
  if (promo.start_date && promo.start_date > today) return { valid: false, message: 'Ma giam gia chua den ngay su dung' };
  if (promo.end_date && promo.end_date < today) return { valid: false, message: 'Ma giam gia da het han' };
  if (promo.used_count >= promo.usage_limit) return { valid: false, message: 'Ma giam gia da het luot' };
  if (amount < promo.min_order_amount) return { valid: false, message: 'Don hang chua dat gia tri toi thieu' };
  const raw = promo.discount_type === 'percent' ? amount * Number(promo.discount_value) / 100 : Number(promo.discount_value);
  const discount = Math.min(Math.round(raw), amount);
  return { valid: true, discount_amount: discount, final_amount: amount - discount };
};
