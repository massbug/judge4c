import { SquarePenIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkspaceLayoutProps {
  editor: React.ReactNode;
}

export default function WorkspaceLayout({ editor }: WorkspaceLayoutProps) {
  return (
    <Tabs defaultValue="editor" className="h-full flex flex-col">
      <ScrollArea className="h-9 flex-none bg-muted">
        <TabsList>
          <TabsTrigger value="editor">
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
      <TabsContent value="editor" className="h-full mt-0">
        {editor}
      </TabsContent>
    </Tabs>
  );
}
