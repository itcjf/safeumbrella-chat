import React from "react";
import Chat, { Bubble, useMessages, RichText } from "@chatui/core";
import "@chatui/core/dist/index.css";
import { tcbLogin, getApp } from './tcb';

const app = getApp();

const initialMessages = [
  {
    type: "text",
    content: { text: "你好呀，我是你的AI助理小安，有什么我可以帮助的？" },
    user: {
      avatar:
        "https://lowcode-8gm18ro0fce002c9-1256452533.tcloudbaseapp.com/resources/2022-03/lowcode-214255"
    }
  }
];

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: "message",
    name: "联系人工服务",
    isNew: true,
    isHighlight: true
  },
  {
    name: "网址风险评估",
    isNew: true
  },
  {
    name: "智能识别短信诈骗",
    isHighlight: true
  },
  {
    name: "你好",
    isHighlight: true
  }
];

function App() {
  tcbLogin()
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  // 发送回调
  function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });
      setTyping(true);
      app
        .callFunction({
          name: "tbpSafeUmbrella",
          data: { content: val }
        })
        .then((res) => {
          let result = res.result; //云函数执行结果
          console.log('%c [ result ]: ', 'color: #bf2c9f; background: pink; font-size: 13px;', result)
          result = result.ResponseText
          // result = result.ResponseText + '\n情感分析：' + result.Sentiment.Sentiment
          appendMsg({
            type: "text",
            content: { text: result },
            user: {
              avatar:
                "https://lowcode-8gm18ro0fce002c9-1256452533.tcloudbaseapp.com/resources/2022-03/lowcode-214255"
            }
          });

        });

    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item) {
    handleSend("text", item.name);
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return (
          <Bubble type="text">
            <RichText content={content.text} />
          </Bubble>
        )

      case "image":
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }

  return (
    <Chat
      navbar={{ title: "和我聊聊吧" }}
      placeholder='请告诉我你需要什么帮助呀'
      messages={messages}
      renderMessageContent={renderMessageContent}
      // quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
    />
  );
}

export default App;
