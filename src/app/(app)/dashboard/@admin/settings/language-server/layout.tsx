import { Separator } from "@/components/ui/separator";

interface SettingsLanguageServerLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLanguageServerLayout({
  children,
}: SettingsLanguageServerLayoutProps) {
  return (
    <div className="container mx-auto max-w-[1024px] space-y-6">
      <div>
        <h3 className="text-lg font-medium">Language Server Settings</h3>
        <p className="text-sm text-muted-foreground">
          Configure the language server connection settings.
        </p>
      </div>
      <Separator />
      {children}
    </div>
  );
}
