import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AboutSection from "@/components/aboutUsSection";
import ContactSection from "@/components/ContactSection";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
