import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSettings } from "@/components/language-settings";

const Header = () => {
  return (
    <header>
      <nav>
        <Container className="relative z-50 flex justify-between py-8">
          <div className="relative z-10 flex items-center gap-16">
            <Link href="/" aria-label="Home">
              <Logo className="h-10 w-auto flex items-center" />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSettings />
            <ThemeToggle />
          </div>
        </Container>
      </nav>
    </header>
  );
};

export { Header };
