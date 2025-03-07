import { HTMLAttributes } from "react";
import { Pre } from "@/components/content/pre";

export const MdxComponents = {
  pre: (props: HTMLAttributes<HTMLPreElement>) => <Pre {...props} />,
};
