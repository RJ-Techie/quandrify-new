import { createHash, createHmac, timingSafeEqual } from 'crypto';
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export function validSignature(payload: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
  return timingSafeEqual(Buffer.from(signature, 'hex'), createHmac('sha256', secret).update(payload).digest());
}
