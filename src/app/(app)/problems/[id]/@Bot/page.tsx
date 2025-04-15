"use client";

import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useProblem } from "@/hooks/use-problem";
import MdxPreview from "@/components/mdx-preview";
import { Textarea } from "@/components/ui/textarea";
import { BotIcon, SendHorizonal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";

export default function Bot() {
  const t = useTranslations("Bot");
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
    <div className="flex flex-col h-full border border-t-0 border-muted rounded-b-3xl bg-background">
      <div className="flex-1 relative">
        {!messages.some(
          (message) => message.role === "user" || message.role === "assistant"
        ) && (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <BotIcon />
              <span>{t("title")}</span>
              <span className="font-thin text-xs">{t("description")}</span>
            </div>
          )}

        <div className="absolute h-full w-full">
          <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]>div:min-w-0 [&>[data-radix-scroll-area-viewport]>div]:!block">
            <ChatMessageList>
              {messages
                .filter(
                  (message) => message.role === "user" || message.role === "assistant"
                )
                .map((message) => (
                  <ChatBubble key={message.id} layout="ai" className="border-b pb-4">
                    <ChatBubbleMessage layout="ai">
                      <MdxPreview source={message.content} />
                    </ChatBubbleMessage>
                  </ChatBubble>
                ))}
            </ChatMessageList>
          </ScrollArea>
        </div>
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
            placeholder={t("placeholder")}
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
