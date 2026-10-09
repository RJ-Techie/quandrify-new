import { db } from '../src/lib/db';
import { processSuccessfulPaymentAndAllocateSpot } from '../src/lib/allocation';
import crypto from 'crypto';

async function runConcurrencyTest() {
  console.log('=== CONCURRENCY SPOT ALLOCATION TEST ===');
  
  const testDate = '2099-01-01';
  
  // Initialize isolated test pool
  await db.dailySpotPool.create({
    data: {
      date: testDate,
      claimedSlots: 0,
      maxSlots: 10,
      isSoldOut: false,
    }
  });

  const paymentIds: string[] = [];

  for (let i = 1; i <= 20; i++) {
    const slug = `test-concurrent-listing-${i}-${Date.now()}`;
    const token = crypto.randomBytes(16).toString('hex');
    
    const listing = await db.listing.create({
      data: {
        slug,
        title: `Concurrent Test Product ${i}`,
        tagline: `Test tagline ${i}`,
        shortDescription: 'Test short description',
        fullDescription: 'Test full description',
        websiteUrl: 'https://example.com',
        logoUrl: 'https://picsum.photos/200',
        category: 'SaaS',
        contactName: `Tester ${i}`,
        contactEmail: `tester${i}@example.com`,
        status: 'PENDING',
        managementToken: token,
      },
    });

    const payment = await db.payment.create({
      data: {
        listingId: listing.id,
        amount: 14800,
        hasTop10Addon: true,
        status: 'PENDING',
      },
    });

    paymentIds.push(payment.id);
  }

  console.log(`Created 20 test listings and pending payments. Triggering simultaneous allocations...`);

  // Fire 20 simultaneous payment allocations
  const promises = paymentIds.map((id, index) =>
    processSuccessfulPaymentAndAllocateSpot({
      paymentId: id,
      razorpayPaymentId: `sim_sess_${index}_${Date.now()}`,
      overrideDate: testDate,
    }).catch((err) => ({ error: err.message }))
  );

  const results = await Promise.all(promises);

  // Fetch created daily spots for today
  const allocatedSpots = await db.dailySpot.findMany({
    where: { paymentId: { in: paymentIds } },
    orderBy: { position: 'asc' },
  });

  const positions = allocatedSpots.map((s) => s.position);
  console.log('Allocated Positions:', positions);

  // Verify criteria:
  const uniquePositions = new Set(allocatedSpots.map(s => `${s.date}:${s.position}`));
  const totalAllocated = allocatedSpots.length;

  console.log(`Total Allocated Spots: ${totalAllocated}`);
  console.log(`Unique Positions Count: ${uniquePositions.size}`);

  if (totalAllocated === 20 && uniquePositions.size === totalAllocated) {
    console.log('✅ CONCURRENCY TEST PASSED! Exactly allocated valid positions without duplicates.');
  } else {
    throw new Error('Allocation test failed');
  }

  // Cleanup test records
  await db.dailySpot.deleteMany({ where: { paymentId: { in: paymentIds } } });
  await db.payment.deleteMany({ where: { id: { in: paymentIds } } });
  await db.listing.deleteMany({ where: { slug: { startsWith: 'test-concurrent-listing-' } } });

  console.log('Cleaned up test records.');
}

runConcurrencyTest()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(() => db.$disconnect());
