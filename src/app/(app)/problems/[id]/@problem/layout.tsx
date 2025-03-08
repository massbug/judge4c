import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleCheckBigIcon, FileTextIcon, FlaskConicalIcon } from "lucide-react";

interface ProblemLayoutProps {
  description: React.ReactNode;
  solution: React.ReactNode;
  submission: React.ReactNode;
}

export default function ProblemLayout({
  description,
  solution,
  submission,
}: ProblemLayoutProps) {
  return (
    <Tabs defaultValue="description" className="h-full flex flex-col">
      <ScrollArea className="bg-muted">
        <TabsList>
          <TabsTrigger value="description">
            <FileTextIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Description
          </TabsTrigger>
          <TabsTrigger value="solution" className="group">
            <FlaskConicalIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Solution
          </TabsTrigger>
          <TabsTrigger value="submission" className="group">
            <CircleCheckBigIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            Submission
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="description" className="h-full mt-0">
        {description}
      </TabsContent>
      <TabsContent value="solution">
        {solution}
      </TabsContent>
      <TabsContent value="submission">
        {submission}
      </TabsContent>
    </Tabs>
  );
}
