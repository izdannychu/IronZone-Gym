import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'development_secret_key_change_me_32_chars';
const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

export const signToken = (payload) => jwt.sign(payload, secret, { expiresIn });
export const verifyToken = (token) => jwt.verify(token, secret);
