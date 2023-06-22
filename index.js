const { PassThrough } = require('stream');

const Koa = require('koa');
const app = new Koa();
const Router = require('koa-router');
const router = new Router();
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { writeStream } = require('./chatgpt.js')
console.log(process.env.OPENAI_API_KEY)

app.use(cors());
app.use(bodyParser());

router.get('/', async (ctx, next) => {
  ctx.body = 'Hello World';
});

router.post('/chat', async (ctx, next) => {
  const { messages } = ctx.request.body;
  const stream = new PassThrough();
  ctx.set({
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache',
    'Content-Type': 'text/event-stream',
  });
  console.log(messages)
  ctx.body = stream;
  ctx.status = 200;

  // 写入流: 调用 openai 往 stream 不断写入流
  writeStream({ 
    stream, 
    messages
  })
})

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => console.log('server started: http://localhost:3000'));

async function main() {
	// 开启 stream 配置并设置 responseType
const completion = await openai.createChatCompletion({
  stream: true,
  model: 'gpt-3.5-turbo',
  messages: [{ role: 'user', content: 'js Map 类型怎么用' }],
},  { responseType: 'stream' });

// 监听事件
completion.data.on('data', (data) => {
  
	// 对每次推送的数据进行格式化, 得到的是 JSON 字符串、或者 [DONE] 表示流结束
  const message = data
    .toString()
    .trim()
    .replace(/^data: /, '');

  // 流结束
  if (message === '[DONE]') {
    console.log('流结束');
    return;
  }
	
  try {
  
  // 解析数据
  const parsed = JSON.parse(message);

  // 打印有效内容
  console.log('=>', parsed.choices[0].delta.content);
	} catch(err) {
		//console.log(err)
	}
  });
}

// main()
