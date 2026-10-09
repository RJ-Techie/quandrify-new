import { db } from '../src/lib/db';
import { hashPassword } from '../src/lib/adminAuth';
async function main() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 16) throw new Error('Set ADMIN_EMAIL and a password with at least 16 characters');
  await db.adminUser.upsert({ where: { email: ADMIN_EMAIL.toLowerCase() }, create: { email: ADMIN_EMAIL.toLowerCase(), name: 'Administrator', passwordHash: hashPassword(ADMIN_PASSWORD) }, update: { passwordHash: hashPassword(ADMIN_PASSWORD) } });
  await db.adminSession.deleteMany();
}
main().finally(() => db.$disconnect());
