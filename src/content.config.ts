import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional(),
  }),
});

const cartoons = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cartoons' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string(),
  }),
});

export const collections = { blog, notes, cartoons };
