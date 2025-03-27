import { HTMLAttributes } from "react";
import { Pre } from "@/components/content/pre";
import { AccordionComponent } from "@/components/content/accordion";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const MdxComponents = {
  pre: (props: HTMLAttributes<HTMLPreElement>) => <Pre {...props} />,
  ol: (props: HTMLAttributes<HTMLOListElement>) => (
    <ol style={{ listStyle: "revert" }} {...props} />
  ),
  ul: (props: HTMLAttributes<HTMLUListElement>) => (
    <ul style={{ listStyle: "revert" }} {...props} />
  ),
  table: (props: HTMLAttributes<HTMLTableElement>) => (
    <ScrollArea>
      <table {...props} />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
  Accordion: AccordionComponent,
};
