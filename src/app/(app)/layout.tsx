import { Banner } from "@/components/banner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <Banner />
      <main className="flex flex-1 min-h-0">
        {children}
      </main>
    </div>
  );
}
