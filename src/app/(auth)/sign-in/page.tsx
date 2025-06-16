import Link from "next/link";
import { CodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { providerMap, signIn } from "@/lib/auth";
import { getTranslations } from "next-intl/server";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { CredentialsSignInForm } from "@/components/credentials-sign-in-form";

interface ProviderIconProps {
  providerId: string;
}

const ProviderIcon = ({ providerId }: ProviderIconProps) => {
  switch (providerId) {
    case "github":
      return <FaGithub />;
    case "google":
      return <FaGoogle />;
    default:
      return null;
  }
};

interface SignInPageProps {
  searchParams: Promise<{
    callbackUrl: string | undefined;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;
  const t = await getTranslations("SignInForm");

  return (
    <div className="flex flex-col gap-4 p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <Link
          href={callbackUrl ?? "/"}
          className="flex items-center gap-2 font-medium"
        >
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CodeIcon className="size-4" />
          </div>
          Judge4c
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1 className="text-2xl font-bold">{t("title")}</h1>
              <p className="text-balance text-sm text-muted-foreground">
                {t("description")}
              </p>
            </div>
            <CredentialsSignInForm callbackUrl={callbackUrl} />
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                {t("or")}
              </span>
            </div>
            {Object.values(providerMap).map((provider) => {
              return (
                <form
                  key={provider.id}
                  action={async () => {
                    "use server";
                    await signIn(provider.id, {
                      redirectTo: callbackUrl,
                    });
                  }}
                >
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-4"
                    type="submit"
                  >
                    <ProviderIcon providerId={provider.id} />
                    {t("oauth", { provider: provider.name })}
                  </Button>
                </form>
              );
            })}
            <div className="text-center text-sm">
              {t("noAccount")}{" "}
              <Link
                href={`/sign-up${
                  callbackUrl
                    ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                    : ""
                }`}
                className="underline underline-offset-4"
              >
                {t("signUp")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
