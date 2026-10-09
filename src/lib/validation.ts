import { z } from 'zod';
const url = z.string().max(2048).url().refine(v => ['https:', 'http:'].includes(new URL(v).protocol), 'Use an HTTP or HTTPS URL');
export function validateListing(body: unknown, partial = false): z.SafeParseReturnType<unknown, Record<string, any>> {
  const optional: Record<string, z.ZodTypeAny> = {};
  const texts = 'primaryCtaText category companyName founderName foundedDate country city teamSize companyStage revenueModel mrr arr monthlyRevenue annualRevenue usersCount mauCount customersCount payingCustomersCount growthRate techFrontend techBackend techDatabase techCloud techAi techPayment customTech founderStoryWhy founderStoryProblem founderStoryNext contactPhone';
  for (const key of texts.split(' ')) optional[key] = z.string().max(5000).optional();
  for (const key of 'coverImageUrl demoUrl videoUrl linkWebsite linkX linkLinkedIn linkInstagram linkYouTube linkGitHub linkProductHunt linkAppStore linkGooglePlay'.split(' ')) optional[key] = z.union([url, z.literal('')]).optional();
  const schema = z.object({ ...optional, title: z.string().trim().min(1).max(150), tagline: z.string().trim().min(1).max(250), shortDescription: z.string().min(1).max(1000), fullDescription: z.string().min(1).max(20000), websiteUrl: url, logoUrl: url, contactName: z.string().min(1).max(150), contactEmail: z.string().email().max(254), publicMetrics: z.array(z.string().max(40)).max(10).optional(), wantsTop10Addon: z.boolean().optional() });
  return (partial ? schema.partial() : schema).safeParse(body);
}
