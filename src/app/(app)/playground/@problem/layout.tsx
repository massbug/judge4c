import { FileTextIcon, FlaskConicalIcon } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProblemLayoutProps {
  description: React.ReactNode;
  solution: React.ReactNode;
}

export default function ProblemLayout({
  description,
  solution,
}: ProblemLayoutProps) {
  return (
    <Tabs defaultValue="description" className="h-full flex flex-col">
      <ScrollArea className="h-9 flex-none bg-muted px-1">
        <TabsList className="gap-1 bg-transparent">
          <TabsTrigger
            value="description"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            <FileTextIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Description
          </TabsTrigger>
          <TabsTrigger
            value="solution"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            <FlaskConicalIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Solution
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="description" className="grow mt-0">
        {description}
      </TabsContent>
      <TabsContent value="solution" className="grow mt-0">
        {solution}
      </TabsContent>
    </Tabs>
  );
}
