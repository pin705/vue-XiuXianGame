import jwt from 'jsonwebtoken';
import { getHeader, createError } from 'nitro/h3';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
const JWT_EXPIRES_IN = '7d';

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export function extractToken(event) {
  const authHeader = getHeader(event, 'authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

export async function requireAuth(event) {
  const token = extractToken(event);
  
  if (!token) {
    throw createError({
      statusCode: 401,
      message: 'Vui lòng đăng nhập'
    });
  }

  const decoded = verifyToken(token);
  
  if (!decoded) {
    throw createError({
      statusCode: 401,
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }

  return decoded.userId;
}
