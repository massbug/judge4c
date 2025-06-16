import { useTranslations } from "next-intl";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const t = useTranslations("Video");

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {children}
      <div className="relative hidden bg-muted lg:block">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src="/sign-in.mp4" type="video/mp4" />
          {t("unsupportedBrowser")}
        </video>
      </div>
    </div>
  );
}
