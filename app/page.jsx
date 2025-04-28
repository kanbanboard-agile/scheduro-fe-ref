import AboutSection from "@/components/AboutSection";
import CTASection from "@/components/CTASection";
import FAQSection from "@/components/FAQSection";
import FeatureSection from "@/components/FeatureSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      {/* Navigation */}
      <Navbar />
      <main></main>
      {/* Hero Section */}
      <HeroSection />
      {/* About Section */}
      <AboutSection />
      {/* Feature Section */}
      <FeatureSection />
      {/* FAQ Section */}
      <FAQSection />
      {/* CTA Section */}
      <CTASection />
      {/* Footer Section */}
      <Footer />
    </>
  );
}
