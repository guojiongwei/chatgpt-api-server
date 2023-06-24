const { PassThrough } = require("stream");

const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const bodyParser = require("koa-bodyparser");
const cors = require("@koa/cors");
const { writeStream } = require("./chatgpt.js");

app.use(cors());
app.use(bodyParser());

router.get("/", async (ctx, next) => {
  ctx.body = "Hello World";
});

router.post("/chat", async (ctx, next) => {
  const { messages } = ctx.request.body;
  const stream = new PassThrough();
  ctx.set({
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });
  ctx.body = stream;
  ctx.status = 200;

  // 写入流: 调用 openai 往 stream 不断写入流
  writeStream({
    stream,
    messages,
  });
});

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => console.log("server started: http://localhost:3000"));
