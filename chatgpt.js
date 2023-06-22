const { Configuration, OpenAIApi  } = require('openai');

// 封装方法
const writeStream =  async ({ stream, messages }) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  // 开启 stream 配置并设置 responseType
  const completion = await openai.createChatCompletion({
    messages,
    stream: true,
    model: 'gpt-3.5-turbo',
  },  { responseType: 'stream' });

  // 监听事件
  completion.data.on('data', (data) => {
    try {
      // 对每次推送的数据进行格式化, 得到的是 JSON 字符串、或者 [DONE] 表示流结束
      const message = data
        .toString()
        .trim()
        .replace(/^data: /, '');
		
      // 流结束
      if (message.endsWith('[DONE]')) {
   	stream.end()
	return;
      }

      // 解析数据
      const parsed = JSON.parse(message);

      // 写入流
      stream.write(parsed.choices[0].delta.content || '');
    } catch (e) {
      // 出现错误, 结束
     // stream.end()
    }
  });
}

module.exports = {
  writeStream
}
