import { validationResult } from 'express-validator';
import { error } from '../utils/response.js';

export const validate = (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        return error(res, result.array()[0].msg, 422);
    }
    next();
};
