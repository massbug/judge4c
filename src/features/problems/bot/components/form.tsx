"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { useTranslations } from "next-intl";
import MdxPreview from "@/components/mdx-preview";
import { Textarea } from "@/components/ui/textarea";
import { BotIcon, SendHorizonal } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PreDetail } from "@/components/content/pre-detail";
import { TooltipButton } from "@/components/tooltip-button";
import { useProblemEditorStore } from "@/stores/problem-editor";
import { MdxComponents } from "@/components/content/mdx-components";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";

interface BotFormProps {
  description: string;
}

export const BotForm = ({ description }: BotFormProps) => {
  const t = useTranslations("Bot");
  const { problem, language, value } = useProblemEditorStore();

  const { messages, input, handleInputChange, setMessages, handleSubmit } =
    useChat({
      initialMessages: [
        {
          id: problem?.problemId || "",
          role: "system",
          content: `Problem description:\n${description}`,
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
        id: problem?.problemId || "",
        role: "system" as const,
        content: `Current code:\n\`\`\`${language}\n${value}\n\`\`\``,
      };

      setMessages((prev) => [...prev, currentCodeMessage]);
      handleSubmit();
    },
    [handleSubmit, input, language, problem?.problemId, setMessages, value]
  );

  return (
    <div className="h-full flex flex-col">
      {messages.some(
        (message) => message.role === "user" || message.role === "assistant"
      ) ? (
        <div className="relative flex-1">
          <div className="absolute h-full w-full">
            <ScrollArea className="h-full [&>[data-radix-scroll-area-viewport]>div:min-w-0 [&>[data-radix-scroll-area-viewport]>div]:!block">
              <ChatMessageList>
                {messages
                  .filter(
                    (message) =>
                      message.role === "user" || message.role === "assistant"
                  )
                  .map((message) => (
                    <ChatBubble
                      key={message.id}
                      layout="ai"
                      className="border-b pb-4"
                    >
                      <ChatBubbleMessage layout="ai">
                        <MdxPreview
                          source={message.content}
                          components={{ ...MdxComponents, pre: PreDetail }}
                        />
                      </ChatBubbleMessage>
                    </ChatBubble>
                  ))}
              </ChatMessageList>
            </ScrollArea>
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <BotIcon />
          <span>{t("title")}</span>
          <span className="font-thin text-xs">{t("description")}</span>
        </div>
      )}

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

          <TooltipButton
            tooltipContent="Ctrl + Enter"
            type="submit"
            variant="ghost"
            className="absolute bottom-6 right-6 h-6 w-auto px-2"
            aria-label="Send Message"
          >
            <SendHorizonal className="size-4" />
          </TooltipButton>
        </form>
      </footer>
    </div>
  );
};
