import prisma from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TestcaseTableProps {
  problemId: string;
}

export const TestcaseTable = async ({ problemId }: TestcaseTableProps) => {
  const t = await getTranslations("Testcase.Table");
  const testcases = await prisma.testcase.findMany({
    where: { problemId },
    include: { inputs: true },
    orderBy: { createdAt: "asc" },
  });

  if (testcases.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 text-center">
          No testcases found for this problem.
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue={testcases[0].id} className="items-center px-5 py-4">
      <TabsList className="bg-transparent p-0">
        {testcases.map((testcase, index) => (
          <TabsTrigger
            key={testcase.id}
            value={testcase.id}
            className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
          >
            {t("Case")} {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>

      {testcases.map((testcase) => (
        <TabsContent key={testcase.id} value={testcase.id}>
          <div className="space-y-4">
            {testcase.inputs
              .sort((a, b) => a.index - b.index)
              .map((input) => (
                <div key={input.id} className="space-y-2">
                  <Label>{input.name} =</Label>
                  <Input
                    type="text"
                    placeholder={`Enter ${input.name}`}
                    readOnly
                    className="bg-muted border-transparent shadow-none rounded-lg h-10"
                    value={input.value}
                  />
                </div>
              ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
