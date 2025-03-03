"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTabsStore } from "@/store/useTabsStore";
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
  const { hydrated, problemTab, setProblemTab } = useTabsStore();

  if (!hydrated) return (
    <div className="h-9 w-full flex items-center px-2 py-1 bg-muted gap-1">
      <Skeleton className="h-full w-[136px] rounded-3xl" />
      <Skeleton className="h-full w-[111px] rounded-3xl" />
      <Skeleton className="h-full w-32 rounded-3xl" />
    </div>
  )

  const handleTabChange = (value: string) => {
    setProblemTab(value);
  };

  return (
    <Tabs value={problemTab} onValueChange={handleTabChange} className="h-full flex flex-col">
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
          <TabsTrigger
            value="submission"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
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
      <TabsContent value="solution" className="h-full mt-0">
        {solution}
      </TabsContent>
      <TabsContent value="submission" className="flex-1 mt-0">
        {submission}
      </TabsContent>
    </Tabs>
  );
}
