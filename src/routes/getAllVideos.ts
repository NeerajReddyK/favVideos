import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { videoSchema } from "../schemas/videoSchema";
import FavYoutubeVideosModel from "../db/fav-youtube-model";

export const getAllVideos = (app: OpenAPIHono) => {
  const route = createRoute({
    method: 'get',
    path: '/videos',
    responses: {
      200: {
        content: {
          'application/json' : {
            schema: videoSchema,
          },
        },
        description: 'Add video details to the database'
      },
      400: {
        description: 'Unable to fetch video details',
      }
    }
  });

  app.openapi(route, async (c) => {

    try {  
      const vidoes = await FavYoutubeVideosModel.find();
      return c.json(vidoes.map((video) => video.toObject()), 200);
    }
    catch (error) {
      return c.json({ message: (error as any)?.message || 'Internal Server Error' }, 500);
    }
  })
}