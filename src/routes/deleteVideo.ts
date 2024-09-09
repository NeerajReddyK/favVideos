import { createRoute, OpenAPIHono } from "@hono/zod-openapi";
import { isValidObjectId } from "mongoose";
import FavYoutubeVideosModel from "../db/fav-youtube-model";
import { z } from '@hono/zod-openapi'

export const deleteVideo = (app: OpenAPIHono) => {
  const route = createRoute({
    method: 'delete',
    path: '/:id',
    request: {
      params: z.object({
        id: z.string().openapi({param: {name: 'id', in: 'path'}, example: '1212121'}),
      }),
    },
    responses: {
      200: {
        description: 'The details of the video with given id is deleted', 
      },
      400: {
        description: 'User with given id doesnot exist',
      }
    }
  })

  app.openapi(route, async (c) => {
    const { id } = c.req.valid('param');
    if (!isValidObjectId(id)) return c.json('Invalid object id', 400);

  try {
    const deletedDocument = await FavYoutubeVideosModel.findByIdAndDelete(id);
    if (!deletedDocument) return c.json('Document not found', 404);

    return c.json(deletedDocument.toObject(), 200);
  } catch (error) {
    return c.json((error as any)?.message || "Internal server error", 500);
  }
  })
}