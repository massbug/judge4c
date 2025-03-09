import { SquareCheckIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TerminalLayoutProps {
  testcase: React.ReactNode;
}

export default function TerminalLayout({ testcase }: TerminalLayoutProps) {
  return (
    <Tabs defaultValue="testcase" className="h-full flex flex-col">
      <ScrollArea className="h-9 flex-none bg-muted">
        <TabsList>
          <TabsTrigger value="testcase">
            <SquareCheckIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Testcase
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="testcase" className="h-full mt-0">
        {testcase}
      </TabsContent>
    </Tabs>
  );
}
