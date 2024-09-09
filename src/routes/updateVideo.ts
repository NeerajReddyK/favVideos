import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { z } from '@hono/zod-openapi'
import { videoSchema } from "../schemas/videoSchema";
import FavYoutubeVideosModel from "../db/fav-youtube-model";
import { isValidObjectId } from "mongoose";


export const updateVideo = (app: OpenAPIHono) => {
  const route = createRoute({
    method: 'patch',
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
          },
        },
        description: 'Update the data related to a video',
      },
      400: {
        description: 'User with given id doesnot exist',
      }
    },
  })

  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');
    if (!isValidObjectId(id)) return c.json('Invalid object id', 400);

    try {
      const formData = await c.req.json();
      if (!formData.thumbnailUrl) delete formData.thumbnailUrl;

      const updatedDocument = await FavYoutubeVideosModel.findByIdAndUpdate(id, formData, { new: true });
      if (!updatedDocument) return c.json('Document not found', 404);

      return c.json(updatedDocument.toObject(), 200);
    } catch (error) {
      return c.json((error as any)?.message || "Internal server error", 500);
    }
  })
}