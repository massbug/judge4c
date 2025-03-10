import { HTMLAttributes } from "react";
import { Pre } from "@/components/content/pre";

export const MdxComponents = {
  pre: (props: HTMLAttributes<HTMLPreElement>) => <Pre {...props} />,
  ol: (props: HTMLAttributes<HTMLOListElement>) => <ol style={{ listStyle: "revert" }} {...props} />,
  ul: (props: HTMLAttributes<HTMLUListElement>) => <ul style={{ listStyle: "revert" }} {...props} />,
};
