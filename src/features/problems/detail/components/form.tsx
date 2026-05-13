import prisma from "@/lib/prisma";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTranslations } from "next-intl/server";

interface DetailFormProps {
  submissionId: string;
}

export const DetailForm = async ({ submissionId }: DetailFormProps) => {
  const t = await getTranslations("DetailsPage");

  const judge = await prisma.judge.findUnique({
    where: { submissionId },
    include: {
      judgeRuns: {
        orderBy: { createdAt: "desc" },
        include: {
          testcase: {
            include: { inputs: true },
          },
        },
      },
    },
  });

  const failedJudgeRun = judge?.judgeRuns.find((run) => run.status !== "ACCEPTED");
  if (failedJudgeRun?.testcase) {
    const sortedInputs = failedJudgeRun.testcase.inputs.sort(
      (a, b) => a.index - b.index
    );

    return (
      <div className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Accordion type="single" collapsible className="w-full -space-y-px">
            <AccordionItem
              value="input"
              className="bg-background has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative border px-4 py-1 outline-none first:rounded-t-md last:rounded-b-md last:border-b has-focus-visible:z-10 has-focus-visible:ring-[3px]"
            >
              <AccordionTrigger className="py-2 text-[15px] leading-6 hover:no-underline focus-visible:ring-0">
                <Label>{t("Input")}</Label>
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground pb-2">
                <div className="space-y-4">
                  {sortedInputs.map((input) => (
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
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        {failedJudgeRun.stdout && (
          <div className="flex flex-col space-y-2">
            <Label>输出</Label>
            <Input
              type="text"
              placeholder={`Enter output`}
              readOnly
              className="bg-muted border-transparent shadow-none rounded-lg h-10"
              value={failedJudgeRun.stdout}
            />
          </div>
        )}
        {failedJudgeRun.status === "WRONG_ANSWER" && (
          <div className="flex flex-col space-y-2">
            <Label>预期结果</Label>
            <Input
              type="text"
              placeholder={`Enter expected output`}
              readOnly
              className="bg-muted border-transparent shadow-none rounded-lg h-10"
              value={failedJudgeRun.testcase.expectedOutput}
            />
          </div>
        )}
      </div>
    );
  }
  return null;
};
