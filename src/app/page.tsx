"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChat } from "@ai-sdk/react";

export default function HomePage() {
  const [input, setInput] = useState(""); //输入框的值
  const messagesEndRef = useRef<HTMLDivElement>(null); //获取消息结束的ref
  //useChat 内部封装了流式响应 默认会向/api/chat 发送请求
  const { messages, sendMessage } = useChat({
    onFinish: () => {
      setInput("");
    },
  });

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  //回车发送消息
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage({ text: input });
      }
    }
  };

  return (
    <div className="flex h-screen flex-col bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* 头部标题 */}
      <div className="border-b border-gray-200 bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent">
            AI 智能助手
          </h1>
          <p className="mt-1 text-sm text-gray-500">随时为您解答问题</p>
        </div>
      </div>

      {/* 消息区域 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 rounded-full bg-linear-to-br from-blue-100 to-purple-100 p-6">
                <svg
                  className="h-12 w-12 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-700">
                开始对话
              </h2>
              <p className="text-gray-500">输入您的问题，我会尽力帮助您</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div
                  className={`flex max-w-[80%] gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* 头像 */}
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-semibold text-white ${
                      message.role === "user"
                        ? "bg-linear-to-br from-blue-500 to-blue-600"
                        : "bg-linear-to-br from-purple-500 to-purple-600"
                    }`}
                  >
                    {message.role === "user" ? "你" : "AI"}
                  </div>

                  {/* 消息内容 */}
                  <div
                    className={`flex flex-col ${message.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        message.role === "user"
                          ? "bg-linear-to-br from-blue-500 to-blue-600 text-white"
                          : "border border-gray-200 bg-white text-gray-800"
                      }`}
                    >
                      {message.parts.map((part, index) => {
                        switch (part.type) {
                          case "text":
                            return (
                              <div
                                key={message.id + index}
                                className="wrap-break-word whitespace-pre-wrap"
                              >
                                {part.text}
                              </div>
                            );
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="border-t border-gray-200 bg-white/80 shadow-lg backdrop-blur-sm">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-end gap-3">
            <div className="relative flex-1">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="请输入你的问题... (按 Enter 发送，Shift + Enter 换行)"
                className="max-h-[200px] min-h-[60px] resize-none rounded-xl border-gray-300 shadow-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <Button
              onClick={() => {
                if (input.trim()) {
                  sendMessage({ text: input });
                }
              }}
              disabled={!input.trim()}
              className="h-[60px] rounded-xl bg-linear-to-r from-blue-500 to-purple-600 px-6 shadow-md transition-all hover:from-blue-600 hover:to-purple-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
