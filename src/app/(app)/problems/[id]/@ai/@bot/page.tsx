"use client";

import { useChat } from "@ai-sdk/react";
import { SendHorizonal } from "lucide-react";
import { Button } from "@/components/ui/button";
import MdxPreview from "@/components/mdx-preview";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";

export default function AiBotPage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-238px)]">
          <ChatMessageList>
            {messages.map((message, index) => (
              <ChatBubble key={index} layout="ai">
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
        <form onSubmit={handleSubmit} className="w-full p-4 pt-0 relative">
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
