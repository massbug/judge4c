import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useTranslations } from "next-intl";

const MobileFriendlyCard = () => {
  const t = useTranslations("HomePage.PrimaryFeatures.MobileFriendlyCard");

  return (
    <Card className="relative lg:row-span-2">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
        <CardHeader>
          <CardTitle className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
            {t("title")}
          </CardTitle>
          <CardDescription className="mt-2 max-w-lg text-sm/6 max-lg:text-center">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
          <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
            <Image
              className="size-full object-cover object-top"
              src="/mobile.png"
              alt=""
              fill
            />
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

const DockerCard = () => {
  const t = useTranslations("HomePage.PrimaryFeatures.DockerCard");

  return (
    <Card className="relative max-lg:row-start-1">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
        <CardHeader>
          <CardTitle className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
            {t("title")}
          </CardTitle>
          <CardDescription className="mt-2 max-w-lg text-sm/6 max-lg:text-center">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
          <Image
            className="max-lg:max-w-xs"
            src="/docker.png"
            alt=""
            height={250}
            width={250}
          />
        </CardContent>
      </div>
    </Card>
  );
};

const LSPCard = () => {
  const t = useTranslations("HomePage.PrimaryFeatures.LSPCard");

  return (
    <Card className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
        <CardHeader>
          <CardTitle className="mt-2 text-lg/7 font-medium tracking-tight max-lg:text-center">
            {t("title")}
          </CardTitle>
          <CardDescription className="mt-2 max-w-lg text-sm/6 max-lg:text-center">
            {t("description")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
          <Image
            className="rounded-xl"
            src="/lsp.png"
            alt=""
            height={1200}
            width={800}
          />
        </CardContent>
      </div>
    </Card>
  );
};

const PrimaryFeatures = () => {
  const t = useTranslations("HomePage.PrimaryFeatures");

  return (
    <div className="bg-background py-24 sm:py-32 border-t">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        <p className="mx-auto mt-2 max-w-lg text-pretty text-center text-4xl font-medium tracking-tight text-foreground sm:text-5xl">
          {t("title")}
        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-2 lg:grid-rows-2">
          <MobileFriendlyCard />
          <DockerCard />
          <LSPCard />
        </div>
      </div>
    </div>
  );
};

export { PrimaryFeatures };
