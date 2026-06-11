import { error } from '../utils/response.js';

export const adminOnly = (req, res, next) => {
    if (req.user?.type !== 'admin') return error(res, 'Chi quan tri vien moi co quyen truy cap', 403);
    next();
};
