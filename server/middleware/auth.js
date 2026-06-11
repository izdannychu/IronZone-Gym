import db from '../db/database.js';
import { error } from '../utils/response.js';
import { verifyToken } from '../utils/jwt.js';

export const auth = (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return error(res, 'Vui long dang nhap', 401);

    try {
        const payload = verifyToken(token);
        if (payload.type === 'admin') {
            const admin = db.prepare('SELECT id, username, email, role FROM admins WHERE id = ?').get(payload.id);
            if (!admin) return error(res, 'Tai khoan khong ton tai', 401);
            req.user = { ...admin, type: 'admin' };
        } else {
            const user = db.prepare('SELECT id, full_name, email, phone, dob, gender, avatar_url, status FROM users WHERE id = ?').get(payload.id);
            if (!user || user.status !== 'active') return error(res, 'Tai khoan khong hop le', 401);
            req.user = { ...user, type: 'user' };
        }
        next();
    } catch {
        error(res, 'Token khong hop le hoac da het han', 401);
    }
};
