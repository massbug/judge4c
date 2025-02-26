import { Header } from "@/components/header";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
