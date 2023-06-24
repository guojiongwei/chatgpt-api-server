const { Configuration, OpenAIApi } = require("openai");

// 封装方法
const writeStream = async ({ stream, messages }) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  // 开启 stream 配置并设置 responseType
  const completion = await openai.createChatCompletion(
    {
      messages,
      stream: true,
      model: "gpt-3.5-turbo",
    },
    { responseType: "stream" }
  );

  let isOne = true;
  // 监听事件
  completion.data.on("data", (data) => {
    try {
      // 对每次推送的数据进行格式化, 得到的是 JSON 字符串、或者 [DONE] 表示流结束
      const value = data.toString("utf8").trim();
      const message = isOne ? value.split("\ndata: ")[1] : value.substr(6);
      isOne = false;
      // 流结束
      if (message && message.endsWith("[DONE]")) {
        stream.end();
        return;
      }
      // 解析数据
      const parsed = JSON.parse(message);
      const msg = parsed.choices[0].delta.content;
      // 写入流
      stream.write(msg || "");
    } catch (e) {
      console.log(e.message);
    }
  });
};

module.exports = {
  writeStream,
};
