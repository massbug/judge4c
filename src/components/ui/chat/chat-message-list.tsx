import * as React from "react";
import { ArrowDown } from "lucide-react";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Button } from "@/components/ui/button";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  smooth?: boolean;
}

const ScrollToBottomButton = () => {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) {
    return null;
  }

  return (
    <Button
      onClick={() => {
        scrollToBottom();
      }}
      size="icon"
      variant="outline"
      className="absolute bottom-2 left-1/2 inline-flex -translate-x-1/2 rounded-full shadow-md"
      aria-label="Scroll to bottom"
    >
      <ArrowDown className="h-4 w-4" />
    </Button>
  );
};

const ChatMessageList = ({
  className,
  children,
  smooth = false,
  ...props
}: ChatMessageListProps) => {
  const animation = smooth ? "smooth" : "instant";

  return (
    <StickToBottom
      className="relative h-full w-full"
      initial="instant"
      resize={animation}
    >
      <StickToBottom.Content
        className="flex flex-col gap-6"
        scrollClassName={`h-full w-full p-4 ${className ?? ""}`}
        {...props}
      >
        {children}
      </StickToBottom.Content>

      <ScrollToBottomButton />
    </StickToBottom>
  );
};

export { ChatMessageList };
