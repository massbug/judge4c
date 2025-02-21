import { Banner } from "@/components/banner";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex flex-1 flex-col">
      <Banner />
      <main className="flex flex-1 flex-col">
        {children}
      </main>
    </div>
  );
}
