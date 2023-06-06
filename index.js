const { OpenAIApi } = require("openai");
const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
console.log(process.env.OPENAI_API_KEY)
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });
app.use(cors());
app.use(bodyParser());

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
});

router.post('/chat', async (ctx, next) => {
  const { prompt } = ctx.request.body;
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    onProgress: (partialResponse) => console.log(1111, partialResponse.text)
  });
  ctx.body = completion.messages;
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => console.log('server started: http://localhost:3000'));
