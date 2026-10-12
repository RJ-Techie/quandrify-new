import {z} from 'zod';
export const collections=[
 {key:'free-ai-tools',title:'Free AI tools',description:'AI tools with a useful free plan or free offering. Check each product for current limits.',icon:'✦'},
 {key:'for-freelancers',title:'Tools for freelancers',description:'Products to help independent professionals create, organize and deliver their work.',icon:'↗'},
 {key:'build-your-saas',title:'Build your first SaaS',description:'Tools for building, launching and running a software business.',icon:'⚡'},
] as const;
export const collectionKeysSchema=z.array(z.enum(['free-ai-tools','for-freelancers','build-your-saas'])).max(3).refine(keys=>new Set(keys).size===keys.length,'Choose each collection only once');
