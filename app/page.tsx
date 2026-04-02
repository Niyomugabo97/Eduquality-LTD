import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import AboutSection from "@/components/aboutUsSection";
import ContactSection from "@/components/ContactSection";
import { Server } from "node:http";
import ServicesSection from "@/components/ServicesSection";
import CategorizedProducts from "@/components/CategorizedProducts";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <CategorizedProducts />
      <ContactSection />
      <Footer />
    </main>
  );
}
