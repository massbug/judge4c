// import ProblemDescriptionFooter from "@/features/playground/problem/description/footer";

interface ProblemDescriptionLayoutProps {
  children: React.ReactNode;
}

export default function ProblemDescriptionLayout({
  children,
}: ProblemDescriptionLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1">
        {children}
      </div>
      {/* <ProblemDescriptionFooter /> */}
    </div>
  );
}
