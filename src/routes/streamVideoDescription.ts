import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from '@hono/zod-openapi'
import { videoSchema } from "../schemas/videoSchema";
import FavYoutubeVideosModel from "../db/fav-youtube-model";
import { streamText } from "hono/streaming";

export const streamVideoDescription = (app: OpenAPIHono) => {
  const route = createRoute({
    method: 'get',
    path: '/stream/:id',
    request: {
      params: z.object({
        id: z.string().openapi({param: {name: 'id', in: 'path'}, example: '1212121'}),
      }),
    },
    responses: {
      200: {
        description: 'Stream the description of a particular video', 
      },
      400: {
        description: 'Video with given id doesnot exist',
      }
    }
  })

  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');
    try {
      const document = await FavYoutubeVideosModel.findById(id);
      if (!document) return c.json('Document not found', 404);
  
      return streamText(c, async (stream) => {
        stream.onAbort(() => {
          console.log('Stream aborted!');
        });
  
        for (let i = 0; i < document.description.length; i++) {
          await stream.write(document.description[i]);
          await stream.sleep(100);
        }
      });
    } catch (error) {
      return c.json((error as any)?.message || "Internal server error", 500);
    }
  })
}