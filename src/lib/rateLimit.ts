import { db } from './db';
export async function rateLimit(key: string, limit = 30) {
  const bucket = Math.floor(Date.now() / 60000);
  const row = await db.rateLimit.upsert({ where: { key: `${key}:${bucket}` }, create: { key: `${key}:${bucket}`, count: 1, expiresAt: new Date((bucket + 2) * 60000) }, update: { count: { increment: 1 } } });
  if (Math.random() < 0.01) await db.rateLimit.deleteMany({ where: { expiresAt: { lt: new Date() } } });
  return row.count <= limit;
}
