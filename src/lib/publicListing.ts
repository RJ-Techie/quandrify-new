export function publicListing<T extends Record<string, any>>(listing: T): T {
  const result = { ...listing, managementToken: '', managementTokenHash: null, contactEmail: '', contactPhone: null, contactName: '' };
  let visible: string[] = []; try { visible = JSON.parse(listing.publicMetricsJson || '[]'); } catch {}
  for (const key of ['mrr', 'arr', 'monthlyRevenue', 'annualRevenue', 'usersCount', 'mauCount', 'customersCount', 'payingCustomersCount', 'growthRate']) {
    if (!visible.includes(key)) (result as any)[key] = null;
  }
  return result;
}
