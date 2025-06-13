import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/container";
import { TypingEffect } from "@/components/typing-effect";

const HeroSection = () => {
  const t = useTranslations("HomePage.MainView");

  return (
    <div className="overflow-hidden py-10 sm:py-16 lg:pb-16 xl:pb-18">
      <Container>
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
          <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
            <h1 className="text-4xl font-medium tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg text-foreground/75">
              {t("description")}
            </p>
            <div className="mt-6 text-lg text-foreground/50">
              <TypingEffect />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-4">
              <Button
                size="sm"
                className="rounded-2xl bg-purple-500 text-white shadow hover:bg-purple-800"
                asChild
              >
                <Link href="/problemset">{t("quickStart")}</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-2xl bg-accent text-accent-foreground shadow hover:bg-accent/50"
              >
                <Link href={siteConfig.url.repo.github}>{t("contactUs")}</Link>
              </Button>
            </div>
          </div>
          <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
            <div>
              <Image
                src="/background.png"
                alt=""
                width={2275}
                height={1280}
                className="rounded-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export { HeroSection };
