import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from '@hono/zod-openapi'
import { videoSchema } from "../schemas/videoSchema";
import FavYoutubeVideosModel from "../db/fav-youtube-model";


export const getVideoById = (app: OpenAPIHono) => {

  const route = createRoute({
    method: 'get',
    path: '/:id',
    request: {
      params: z.object({
        id: z.string().openapi({param: {name: 'id', in: 'path'}, example: '1212121'}),
      }),
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: videoSchema,
          }
        },
        description: 'Get the details of a particular video', 
      },
      400: {
        description: 'User with given id doesnot exist',
      }
    }
  });

  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');
    try {
      const video = await FavYoutubeVideosModel.findById(id);
      return c.json(video?.toObject())
    }
    catch(error) {
      return c.json({message: (error as any)?.message} || "Internal server error");
    }
  });
}