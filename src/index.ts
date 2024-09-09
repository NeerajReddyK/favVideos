import { serve } from '@hono/node-server'
import dbConnect from './db/connect'
import { OpenAPIHono } from '@hono/zod-openapi';
import { createVideo } from './routes/createVideo';
import { getAllVideos } from './routes/getAllVideos';
import { getVideoById } from './routes/getVideoById';
import { updateVideo } from './routes/updateVideo';
import { deleteVideo } from './routes/deleteVideo';
import { streamVideoDescription } from './routes/streamVideoDescription';
import { swaggerUI } from '@hono/swagger-ui'

const app = new OpenAPIHono()

dbConnect();


app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'API Developed by Neeraj',
  },
})

app.get('/ui', swaggerUI({ url: '/doc' }))

createVideo(app);
getAllVideos(app);
getVideoById(app);
updateVideo(app);
streamVideoDescription(app);
deleteVideo(app);


serve({
  fetch: app.fetch,
  port: 3000,
})

export default app;