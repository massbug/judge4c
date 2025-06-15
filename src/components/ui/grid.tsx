import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
      },
      gap: {
        0: "gap-0",
        2: "gap-2",
        4: "gap-4",
        6: "gap-6",
        8: "gap-8",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: 4,
    },
  }
)

type GridProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof gridVariants> & {
    as?: React.ElementType
  }

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, as: Comp = "div", ...props }, ref) => {
    return (
      <Comp
        className={cn(gridVariants({ cols, gap }), className)}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Grid }