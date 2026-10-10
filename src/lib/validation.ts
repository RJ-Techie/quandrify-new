import { z } from 'zod';
const url = z.string().trim().max(2048, 'Link must be at most 2,048 characters. Use a public image URL, not a base64 image.').url('Enter a valid URL beginning with https:// or http://').refine(v => {
  try {
    return ['https:', 'http:'].includes(new URL(v).protocol);
  } catch {
    return false;
  }
}, 'Use an HTTP or HTTPS URL');
export function validateListing(body: unknown, partial = false): z.SafeParseReturnType<unknown, Record<string, any>> {
  const optional: Record<string, z.ZodTypeAny> = {};
  const texts = 'primaryCtaText category companyName founderName foundedDate country city teamSize companyStage revenueModel mrr arr monthlyRevenue annualRevenue usersCount mauCount customersCount payingCustomersCount growthRate techFrontend techBackend techDatabase techCloud techAi techPayment customTech founderStoryWhy founderStoryProblem founderStoryNext contactPhone';
  for (const key of texts.split(' ')) optional[key] = z.string().max(5000).optional();
  for (const key of 'coverImageUrl demoUrl videoUrl linkWebsite linkX linkLinkedIn linkInstagram linkYouTube linkGitHub linkProductHunt linkAppStore linkGooglePlay'.split(' ')) optional[key] = z.union([url, z.literal('')]).optional();
  const schema = z.object({ ...optional, title: z.string().trim().min(1, 'This field is required').max(150), tagline: z.string().trim().min(1, 'Tagline is required').max(250), shortDescription: z.string().trim().min(1, 'Short description is required').max(1000), fullDescription: z.string().trim().min(1, 'Full description is required').max(20000), websiteUrl: url, logoUrl: url, contactName: z.string().trim().min(1, 'Contact name is required').max(150), contactEmail: z.string().trim().email('Enter a valid email address').max(254), publicMetrics: z.array(z.string().max(40)).max(10).optional(), wantsTop10Addon: z.boolean().optional(), couponCode: z.string().trim().max(40).optional() });
  return (partial ? schema.partial() : schema).safeParse(body);
}
