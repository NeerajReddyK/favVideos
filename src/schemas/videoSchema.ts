import { z } from '@hono/zod-openapi';

export const videoSchema = z.object({
  _id: z.string().openapi({example: '64b0f88c867b193f3a5f2df7'}),
  title: z.string().min(3).openapi({example: "Sample video title"}),
  description: z.string().min(10).openapi({example: 'Sample video description'}),
  thumbnailUrl: z.string().url().optional().openapi({example: 'https://www.youtube.com'}),
  watched: z.boolean().default(false).openapi({example: false}),
  youtuberName: z.string().min(3).openapi({example: 'Some random youtuber'}),
});

export const createVideoSchema = z.object({
  title: z.string().min(3).openapi({example: "Sample video title"}),
  description: z.string().min(10).openapi({example: 'Sample video description'}),
  thumbnailUrl: z.string().url().optional().openapi({example: 'https://www.youtube.com'}),
  watched: z.boolean().default(false).openapi({example: false}),
  youtuberName: z.string().min(3).openapi({example: 'Some random youtuber'}),
})