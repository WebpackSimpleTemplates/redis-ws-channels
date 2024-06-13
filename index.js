require('dotenv').config();
const http = require('http');
const { Redis } = require('ioredis');
const Koa = require('koa');
const { koaBody } = require('koa-body');
const Router = require('koa-router');
const { Server } = require('socket.io');

const port = process.argv[2] || +process.env.PORT;

const client = new Redis();

client.sadd('channels/operators', `http://${process.env.LOCAL_IP}:${port}/operators`);

const router = new Router();

router.get('/operators', (ctx) => {
  const { event, data } = ctx.request.body;

  console.log('subscribe operators', event, data);
  ctx.status = 204;
});

router.get('/operator/:id', (ctx) => {
  const { id } = ctx.params;
  const { event, data } = ctx.request.body;
  
  console.log('subscribe operator', id, event, data);
  ctx.status = 204;
});

const koa = new Koa();

koa.use(koaBody());
koa.use(router.routes());
koa.use(router.allowedMethods());

const server = http.createServer(koa.callback())

const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', async (socket) => {
  
});

io.listen(port);
console.log('http://localhost:' + port);
