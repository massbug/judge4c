import Link from "next/link";
import { Logo } from "@/components/logo";
import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleSwitcher } from "@/components/locale-switcher";

export const Header = () => {
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
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </Container>
      </nav>
    </header>
  );
};
