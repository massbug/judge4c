import { ReactNode } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { LightbulbIcon } from "lucide-react";

interface AccordionProps {
  title: string;
  children: ReactNode;
}

export const AccordionComponent = ({ title, children }: AccordionProps) => {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={title}>
        <AccordionTrigger className="py-0">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 p-0.5">
              <LightbulbIcon className="h-4 w-4" />
            </div>
            {title}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pl-7 pb-0">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
