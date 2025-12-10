import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import router from './routes/index.js'

import authRouter from './routes/auth.router.js';
import adminRouter from './routes/admin.router.js';
import assoRouter from "./routes/asso.router.js";

const app = new Hono()

app.use('/api/*', cors())
app.route('/', router)

app.route('/api/auth', authRouter);
app.route('/api/admin', adminRouter);
app.route("api/asso", assoRouter);

app.get('/', (c) => c.json({ ok: true }));

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
