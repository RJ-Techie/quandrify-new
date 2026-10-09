import { cookies } from 'next/headers';
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';
import { db } from './db';
import { digest } from './security';
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString('hex');
  return `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
}
export function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, hash] = stored.split(':');
  if (algorithm !== 'scrypt' || !salt || !hash || hash.length !== 128) return false;
  return timingSafeEqual(scryptSync(password, salt, 64), Buffer.from(hash, 'hex'));
}
export async function verifyAdminAuth() {
  const token = (await cookies()).get('quandrify_admin_session')?.value;
  if (!token) return null;
  const session = await db.adminSession.findUnique({ where: { tokenHash: digest(token) } });
  if (!session || session.expiresAt < new Date()) return null;
  return db.adminUser.findUnique({ where: { id: session.adminId } });
}
