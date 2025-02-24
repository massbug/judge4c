import { Banner } from "@/components/banner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Banner />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
