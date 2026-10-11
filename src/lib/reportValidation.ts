import { z } from 'zod';
export const reportSchema=z.object({listingId:z.string().uuid(),reason:z.enum(['BROKEN_LINK','MISLEADING','INAPPROPRIATE','OTHER']),details:z.string().trim().min(10,'Describe the issue in at least 10 characters.').max(1000)});
