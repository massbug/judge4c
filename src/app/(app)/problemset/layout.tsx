import { Banner } from "@/components/banner";
import { AvatarButton } from "@/components/avatar-button";

interface ProblemsetLayoutProps {
  children: React.ReactNode;
}

export default function ProblemsetLayout({ children }: ProblemsetLayoutProps) {
  return (
    <div className="relative flex flex-col">
      <Banner />
      <div className="absolute top-2 right-4">
        <AvatarButton />
      </div>
      <main className="container mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
