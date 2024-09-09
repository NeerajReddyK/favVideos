import FavYoutubeVideosModel from "../db/fav-youtube-model"
import { createVideoSchema } from "../schemas/videoSchema";
import { createRoute, OpenAPIHono } from "@hono/zod-openapi";

export const createVideo = (app: OpenAPIHono) => {

  const route = createRoute({
    method: 'post',
    path: '/video',
    request: {
      body: {
        content: {
          'application/json': {
            schema: createVideoSchema,  
          },
        },
      },
    },
    responses: {
      200: {
        content: {
          'application/json' : {
            schema: createVideoSchema,
          },
        },
        description: 'Add user to the database'
      },
      400: {
        description: 'Invalid user data',
      }
    }
  });

  app.openapi(route, async (c) => {
    try {
      const formData = await c.req.json();
      if(!formData.thumbnailUrl) delete formData.thumbnailUrl;
      const video = await FavYoutubeVideosModel.create(formData);
      
      return c.json(video.toObject(), 200);
    }
    catch (error) {
      return c.json({message: (error as any)?.message} || "Internal server error");
    }
  })
}

