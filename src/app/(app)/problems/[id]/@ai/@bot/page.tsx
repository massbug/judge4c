"use client";

import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";
import MdxPreview from "@/components/mdx-preview";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

export default function AiBotPage() {
  const { problemId, problem, currentLang, currentValue } = useProblem();
  const { messages, input, handleInputChange, setMessages, handleSubmit } = useChat({
    initialMessages: [
      {
        id: problemId,
        role: "system",
        content: `Problem description:\n${problem.description}`,
      },
    ],
  });

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!input.trim()) return;

      const currentCodeMessage = {
        id: problemId,
        role: "system" as const,
        content: `Current code:\n\`\`\`${currentLang}\n${currentValue}\n\`\`\``,
      };

      setMessages([...messages, currentCodeMessage]);
      handleSubmit();
    },
    [currentLang, currentValue, handleSubmit, input, messages, problemId, setMessages]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-238px)]">
          <ChatMessageList>
            {messages
              .filter((message) => message.role === "user" || message.role === "assistant")
              .map((message) => (
                <ChatBubble key={message.id} layout="ai">
                  <ChatBubbleAvatar src="" fallback={message.role === "user" ? "US" : "AI"} />
                  <ChatBubbleMessage layout="ai">
                    <MdxPreview source={message.content} />
                  </ChatBubbleMessage>
                </ChatBubble>
              ))}
          </ChatMessageList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
      <footer className="h-36 flex flex-none">
        <form onSubmit={handleFormSubmit} className="w-full p-4 pt-0 relative">
          <Textarea
            value={input}
            onChange={handleInputChange}
            className="h-full bg-muted border-transparent shadow-none rounded-lg"
            placeholder="Bot will automatically get your current code"
          />
          <Button type="submit" variant="ghost" className="absolute bottom-6 right-6 h-6 w-auto px-2">
            <SendHorizonal className="size-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
