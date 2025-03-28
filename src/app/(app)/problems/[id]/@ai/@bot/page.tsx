"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";
import MdxPreview from "@/components/mdx-preview";
import { Textarea } from "@/components/ui/textarea";
import { BotIcon, SendHorizonal } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
      if (!input.trim()) {
        toast.error("Input cannot be empty");
        return;
      }

      const currentCodeMessage = {
        id: problemId,
        role: "system" as const,
        content: `Current code:\n\`\`\`${currentLang}\n${currentValue}\n\`\`\``,
      };

      setMessages((prev) => [...prev, currentCodeMessage]);
      handleSubmit();
    },
    [currentLang, currentValue, handleSubmit, input, problemId, setMessages]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 relative">
        {!messages.some((message) => message.role === "user" || message.role === "assistant") && (
          <div className="absolute bottom-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground flex flex-col items-center gap-2">
            <BotIcon />
            <span>Ask Bot</span>
            <span className="font-thin text-xs">Powered by Vercel Ai SDK</span>
          </div>
        )}
        <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100vh-238px)] [&>[data-radix-scroll-area-viewport]>div:min-w-0 [&>[data-radix-scroll-area-viewport]>div]:!block">
          <ChatMessageList>
            {messages
              .filter((message) => message.role === "user" || message.role === "assistant")
              .map((message) => (
                <ChatBubble key={message.id} layout="ai" className="border-b pb-4">
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
            onKeyDown={(e) => {
              if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                e.preventDefault();
                if (input.trim()) {
                  handleFormSubmit(e);
                } else {
                  toast.error("Input cannot be empty");
                }
              }
            }}
            className="h-full bg-muted border-transparent shadow-none rounded-lg"
            placeholder="Bot will automatically get your current code"
          />
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  variant="ghost"
                  className="absolute bottom-6 right-6 h-6 w-auto px-2"
                  aria-label="Send Message"
                >
                  <SendHorizonal className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="px-2 py-1 text-xs">Ctrl + Enter</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </form>
      </footer>
    </div>
  );
}
