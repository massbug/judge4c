import { FAQs } from "@/components/faqs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { PrimaryFeatures } from "@/components/primary-features";

export default function RootPage() {
  <>
    <Header />
    <HeroSection />
    <PrimaryFeatures />
    <FAQs />
    <Footer />
  </>;
}
