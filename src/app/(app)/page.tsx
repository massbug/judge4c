import FAQs from "@/components/faqs";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MainView } from "@/components/main-view";
import { PrimaryFeatures } from "@/components/primary-features";

export default function HomePage() {
  return (
    <>
      <Header />
      <MainView />
      <PrimaryFeatures />
      <FAQs />
      <Footer />
    </>
  )
}
