export const text = (value) => String(value ?? '').trim();

export const nullableText = (value) => {
  const normalized = text(value);
  return normalized || null;
};

export const numberValue = (value, label, { min = 0, integer = false } = {}) => {
  if (value === null || value === undefined || value === '') {
    throw new Error(`Vui lòng nhập ${label}`);
  }
  const normalized = Number(value);
  if (!Number.isFinite(normalized) || normalized < min || (integer && !Number.isInteger(normalized))) {
    throw new Error(`${label} không hợp lệ`);
  }
  return normalized;
};

export const integerFlag = (value) => (Number(value) === 1 ? 1 : 0);

export const requireText = (value, label) => {
  const normalized = text(value);
  if (!normalized) throw new Error(`Vui lòng nhập ${label}`);
  return normalized;
};

export const oneOf = (value, values, label) => {
  if (!values.includes(value)) throw new Error(`${label} không hợp lệ`);
  return value;
};

export const validEmail = (value, required = false) => {
  const email = nullableText(value)?.toLowerCase() || null;
  if (!email && !required) return null;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Email không hợp lệ');
  return email;
};

export const databaseMessage = (err) => {
  if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') return 'Dữ liệu đã tồn tại trong hệ thống';
  if (err.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') return 'Dữ liệu đang được sử dụng và không thể xóa';
  if (err.code?.startsWith('SQLITE_CONSTRAINT')) return 'Dữ liệu không hợp lệ';
  return err.message || 'Không thể xử lý yêu cầu';
};
