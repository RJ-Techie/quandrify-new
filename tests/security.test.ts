import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHmac } from 'crypto';
import { validSignature } from '../src/lib/security';
import { hashPassword, verifyPassword } from '../src/lib/adminAuth';
import { validateListing } from '../src/lib/validation';
import { publicListing } from '../src/lib/publicListing';
test('signatures reject changed payloads, wrong secrets and malformed digests', () => {
  const signature = createHmac('sha256', 'secret').update('order|payment').digest('hex');
  assert.equal(validSignature('order|payment', signature, 'secret'), true);
  assert.equal(validSignature('order|other', signature, 'secret'), false);
  assert.equal(validSignature('order|payment', signature, 'wrong'), false);
  assert.equal(validSignature('order|payment', 'bad', 'secret'), false);
});
test('salted admin credentials cannot authenticate with legacy hashes', () => {
  const hash = hashPassword('long-secret-password');
  assert.equal(verifyPassword('long-secret-password', hash), true);
  assert.equal(verifyPassword('wrong', hash), false);
  assert.notEqual(hashPassword('long-secret-password'), hash);
  assert.equal(verifyPassword('Admin123!', 'legacy'), false);
});
test('public serialization removes bearer tokens, contact details and private metrics', () => {
  const result = publicListing({ managementToken: 'secret', managementTokenHash: 'hash', contactEmail: 'private@example.com', mrr: '100', arr: '500', publicMetricsJson: '["mrr"]' });
  assert.equal(result.managementToken, ''); assert.equal(result.contactEmail, ''); assert.equal(result.mrr, '100'); assert.equal(result.arr, null);
});
test('unsafe protocols, wrong input types and oversized descriptions are rejected', () => {
  assert.equal(validateListing({ websiteUrl: 'javascript:alert(1)' }, true).success, false);
  assert.equal(validateListing({ wantsTop10Addon: 'true' }, true).success, false);
  assert.equal(validateListing({ fullDescription: 'x'.repeat(20001) }, true).success, false);
});
test('empty optional links do not throw during a full listing submission', () => {
  const listing = {
    title: 'Example', tagline: 'Example product', shortDescription: 'Description',
    fullDescription: 'Full description', websiteUrl: 'https://example.com',
    logoUrl: 'https://example.com/logo.png', contactName: 'Seller',
    contactEmail: 'seller@example.com',
  };
  for (const key of 'coverImageUrl demoUrl videoUrl linkWebsite linkX linkLinkedIn linkInstagram linkYouTube linkGitHub linkProductHunt linkAppStore linkGooglePlay'.split(' ')) {
    assert.equal(validateListing({ ...listing, [key]: '' }).success, true, key);
  }
  for (const value of ['', 'not-a-url', 'https://', 'javascript:alert(1)']) {
    assert.equal(validateListing({ ...listing, websiteUrl: value }).success, false);
    assert.equal(validateListing({ demoUrl: value }, true).success, value === '');
  }
});
