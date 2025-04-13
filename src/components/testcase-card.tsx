import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TestcaseWithDetails } from "@/types/prisma";
import TestcaseForm from "@/components/testcase-form";
import { useTranslations } from "next-intl";

const t = useTranslations('test');
interface TestcaseCardProps {
  testcases: TestcaseWithDetails;
}

export default function TestcaseCard({ testcases }: TestcaseCardProps) {
  return (
    <Tabs defaultValue="case-1" className="items-center px-5 py-4">
      <TabsList className="bg-transparent p-0">
        {testcases.map((_, index) => (
          <TabsTrigger
            key={`tab-${index}`}
            value={`case-${index + 1}`}
            className="data-[state=active]:bg-muted data-[state=active]:shadow-none"
          >
            {t('case')} {index + 1}
          </TabsTrigger>
        ))}
      </TabsList>

      {testcases.map((testcase, index) => {
        const formData = testcase.data.reduce((acc, field) => {
          acc[field.label] = field.value;
          return acc;
        }, {} as Record<string, string>);

        return (
          <TabsContent key={`content-${index}`} value={`case-${index + 1}`}>
            <TestcaseForm {...formData} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
