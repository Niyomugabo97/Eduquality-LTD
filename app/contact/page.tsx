import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ContactSection from "@/components/ContactSection";

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <div
        className="relative min-h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.7), rgba(99, 102, 241, 0.7)), url('/images/contact-phone.jpg')`,
        }}
      >
        <Header />

        <div className="absolute inset-0 flex items-center justify-start">
          <div className="container mx-auto px-[3rem] sm:px-[3rem] md:px-[3rem] lg:px-[4rem] max-w-7xl">
            <div className="text-white max-w-2xl pt-32">
              <nav className="mb-6">
                <div className="flex items-center space-x-2 text-sm">
                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>
                  <span className="text-gray-300">{">"}</span>
                  <span className="text-white font-medium">Contact</span>
                </div>
              </nav>

              <h1 className="text-5xl md:text-5xl font-bold mb-6 leading-tight text-white">
                CONTACT
              </h1>

              <p className="text-xl md:text-[14px] text-gray-200 font-light">
                Get in Touch with MY EDUQUALITY PARTNER LTD!
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl">
        <ContactSection />
      </div>

      <Footer />
    </main>
  );
}
