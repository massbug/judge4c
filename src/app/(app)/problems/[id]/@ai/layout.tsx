import { BotIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AiLayoutProps {
  bot: React.ReactNode;
}

export default function AiLayout({
  bot,
}: AiLayoutProps) {
  return (
    <Tabs defaultValue="bot" className="h-full flex flex-col">
      <ScrollArea className="h-9 flex-none bg-muted">
        <TabsList>
          <TabsTrigger value="bot">
            <BotIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Bot
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="bot" className="h-full mt-0">
        {bot}
      </TabsContent>
    </Tabs>
  );
}
