**# chatgpt 服务 api**

koa2 + openai 实现一个 chatgpt 服务，支持 stream 流式响应结果和感知上下文。

#### 安装依赖

```
npm i
```

#### 启动项目

```
npm run dev
```

#### 请求示例

```
curl --location 'http://localhost:3000/chat' \

--header 'Content-Type: application/json' \

--data '{

    "messages": [

        {

            "role": "user",

            "content": "1+1"

        }

    ]

}
```
