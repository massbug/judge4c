"use client";

import { toast } from "sonner";
import { useCallback } from "react";
import { useChat } from "@ai-sdk/react";
import { MarkerSeverity } from "monaco-editor";
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
import type { Locale } from "@/generated/client";

interface BotFormProps {
  description: string;
  locale: Locale;
  problemId: string;
  submissionId?: string;
}

export const BotForm = ({
  description,
  locale,
  problemId,
  submissionId,
}: BotFormProps) => {
  const t = useTranslations("Bot");
  const { problem, language, value, markers } = useProblemEditorStore();

  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    initialMessages: [
      {
        id: problem?.problemId || "",
        role: "system",
        content: `Problem description:\n${description}`,
      },
    ],
    body: {
      locale,
      problemId,
      submissionId,
    },
    maxSteps: 3,
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === "getCurrentCode") {
        return {
          language,
          code: value,
        };
      }

      if (toolCall.toolName === "getEditorDiagnostics") {
        const diagnostics = markers.map((marker) => ({
          severity: getMarkerSeverityLabel(marker.severity),
          message: marker.message,
          source: marker.source,
          code: marker.code,
          startLineNumber: marker.startLineNumber,
          startColumn: marker.startColumn,
          endLineNumber: marker.endLineNumber,
          endColumn: marker.endColumn,
        }));

        return {
          errors: diagnostics.filter((item) => item.severity === "error"),
          warnings: diagnostics.filter((item) => item.severity === "warning"),
          diagnostics,
        };
      }
    },
  });

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (!input.trim()) {
        toast.error("Input cannot be empty");
        return;
      }

      handleSubmit();
    },
    [handleSubmit, input]
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
                  .map((message) => {
                    const isUserMessage = message.role === "user";
                    const isEmptyAssistantMessage =
                      message.role === "assistant" &&
                      !message.content.trim() &&
                      status !== "ready";

                    return (
                      <ChatBubble
                        key={message.id}
                        variant={isUserMessage ? "sent" : "received"}
                        className={isUserMessage ? "self-end" : "max-w-full"}
                      >
                        <ChatBubbleMessage
                          variant={isUserMessage ? "sent" : "received"}
                          isLoading={isEmptyAssistantMessage}
                          className={
                            isUserMessage
                              ? "max-w-[85%] rounded-2xl px-3 py-2"
                              : "w-full rounded-none bg-transparent p-0"
                          }
                        >
                          {isUserMessage ? (
                            message.content
                          ) : (
                            <MdxPreview
                              source={message.content}
                              components={{ ...MdxComponents, pre: PreDetail }}
                            />
                          )}
                        </ChatBubbleMessage>
                      </ChatBubble>
                    );
                  })}
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

const getMarkerSeverityLabel = (severity: MarkerSeverity) => {
  switch (severity) {
    case MarkerSeverity.Error:
      return "error";
    case MarkerSeverity.Warning:
      return "warning";
    case MarkerSeverity.Info:
      return "info";
    case MarkerSeverity.Hint:
      return "hint";
    default:
      return "unknown";
  }
};
