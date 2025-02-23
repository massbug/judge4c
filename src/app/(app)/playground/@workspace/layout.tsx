import { CodeXmlIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
}

export default function WorkspaceLayout({ children }: WorkspaceLayoutProps) {
  return (
    <Tabs defaultValue="code">
      <ScrollArea className="h-11 flex items-center pt-1 px-1">
        <TabsList className="gap-1 bg-transparent">
          <TabsTrigger
            value="code"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            <CodeXmlIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Code
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="code" className="mt-0 border-t border-muted">
        {children}
      </TabsContent>
    </Tabs>
  );
}
