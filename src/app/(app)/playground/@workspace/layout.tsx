import { SquarePenIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkspaceLayoutProps {
  editor: React.ReactNode;
}

export default function WorkspaceLayout({ editor }: WorkspaceLayoutProps) {
  return (
    <Tabs defaultValue="editor" className="h-full flex flex-col">
      <ScrollArea className="h-9 flex-none bg-muted px-1">
        <TabsList className="gap-1 bg-transparent">
          <TabsTrigger
            value="editor"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            <SquarePenIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Editor
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="editor" className="flex-1 mt-0">
        {editor}
      </TabsContent>
    </Tabs>
  );
}
