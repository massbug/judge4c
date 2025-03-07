import { Banner } from "@/components/banner";

interface ProblemsetLayoutProps {
  children: React.ReactNode;
}

export default function ProblemsetLayout({ children }: ProblemsetLayoutProps) {
  return (
    <div className="flex flex-col">
      <Banner />
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
