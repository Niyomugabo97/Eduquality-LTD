"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setAnimationKey((prev) => prev + 1);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold: 0.2,
        rootMargin: "-50px 0px",
      }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  const services = [
    "NIBEZA LOIM FOUNDATION",
    "NIBEZA LOIM SALON",
    "NIBEZA LOIM SNACKS",
    "NIBEZA LOIM DELIVERY",
    "OTHER PROFESSIONAL SERVICES",
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com" },
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Instagram, href: "https://instagram.com" },
    { icon: Youtube, href: "https://youtube.com" },
    { icon: MessageCircle, href: "https://wa.me/250788676421" },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative bg-cover bg-center bg-no-repeat text-white px-[3rem] sm:px-[3rem] md:px-[3rem] lg:px-[4rem]"
      style={{ backgroundImage: "url(/images/footer-bg.jpg)" }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-indigo-900/90"></div>
      <div className="absolute inset-0 bg-blue-600/5"></div>
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-6 gap-6">
            {/* Company Info */}
            <div
              key={`company-${animationKey}`}
              className={`lg:col-span-2 transition-all duration-100 ${
                isVisible
                  ? "animate-fadeInLeft"
                  : "opacity-0 translate-x-[-50px]"
              }`}
            >
              <Link
                href="/"
                key={`logo-${animationKey}`}
                className={`flex items-center space-x-2 mb-4 transition-all duration-100 ${
                  isVisible
                    ? "animate-fadeInUp animation-delay-200"
                    : "opacity-0 translate-y-[30px]"
                }`}
              >
                <span className="text-xl font-bold hover:text-blue-400 transition-colors duration-100">
                  MY EDUQUALITY PARTNER
                </span>
              </Link>
              <p
                key={`company-desc-${animationKey}`}
                className={`text-gray-300 mb-4 leading-relaxed text-sm transition-all duration-100 ${
                  isVisible
                    ? "animate-fadeInUp animation-delay-400"
                    : "opacity-0 translate-y-[30px]"
                }`}
              >
                Your trusted multi-service partner providing educational support, 
                business services, beauty care, delivery solutions, and charitable activities. 
                Contact us today to discover how we can meet your diverse needs with 
                professional excellence and community commitment.
              </p>
              <div
                key={`social-${animationKey}`}
                className={`flex space-x-3 transition-all duration-100 ${
                  isVisible
                    ? "animate-fadeInUp animation-delay-600"
                    : "opacity-0 translate-y-[30px]"
                }`}
              >
                {socialLinks.map(({ icon: Icon, href }, index) => (
                  <a
                    key={`social-${index}-${animationKey}`}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-400 transition-all duration-100"
                  >
                    <Icon
                      className="w-4 h-4 cursor-pointer hover:scale-125 hover:-translate-y-1 transition-transform"
                      style={{
                        animationDelay: `${200 + index * 50}ms`,
                        transitionDelay: isVisible
                          ? `${200 + index * 50}ms`
                          : "0ms",
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
            {/* Our Services */}
            <div
              key={`services-${animationKey}`}
              className={`lg:col-span-3 transition-all duration-100 ${
                isVisible
                  ? "animate-fadeInUp animation-delay-400"
                  : "opacity-0 translate-y-[50px]"
              }`}
            >
              <h3
                key={`services-title-${animationKey}`}
                className={`text-lg font-semibold mb-4 text-center lg:text-left transition-all duration-100 ${
                  isVisible
                    ? "animate-fadeInUp animation-delay-600"
                    : "opacity-0 translate-y-[30px]"
                }`}
              >
                Our Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {services.slice(0, 6).map((service, index) => (
                    <div
                      key={`service-left-${index}-${animationKey}`}
                      className={`group transition-all duration-100 ${
                        isVisible
                          ? "animate-fadeInLeft"
                          : "opacity-0 translate-x-[-30px]"
                      }`}
                      style={{
                        animationDelay: `${800 + index * 100}ms`,
                        transitionDelay: isVisible
                          ? `${800 + index * 100}ms`
                          : "0ms",
                      }}
                    >
                      <span className="text-gray-300 hover:text-blue-400 transition-all duration-100 cursor-pointer block text-sm hover:translate-x-2 hover:font-medium relative">
                        <span className="absolute left-0 w-0 h-0.5 bg-blue-400 bottom-0 transition-all duration-100 group-hover:w-full"></span>
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {services.slice(6).map((service, index) => (
                    <div
                      key={`service-right-${index}-${animationKey}`}
                      className={`group transition-all duration-100 ${
                        isVisible
                          ? "animate-fadeInRight"
                          : "opacity-0 translate-x-[30px]"
                      }`}
                      style={{
                        animationDelay: `${800 + index * 100}ms`,
                        transitionDelay: isVisible
                          ? `${800 + index * 100}ms`
                          : "0ms",
                      }}
                    >
                      <span className="text-gray-300 hover:text-blue-400 transition-all duration-100 cursor-pointer block text-sm hover:translate-x-2 hover:font-medium relative">
                        <span className="absolute left-0 w-0 h-0.5 bg-blue-400 bottom-0 transition-all duration-100 group-hover:w-full"></span>
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Contact Info */}
            <div
              key={`contact-info-${animationKey}`}
              className={`lg:col-span-1 transition-all duration-100 ${
                isVisible
                  ? "animate-fadeInRight animation-delay-800"
                  : "opacity-0 translate-x-[50px]"
              }`}
            >
              <div className="space-y-4">
                {[
                  { title: "We're Open", info: "24/7", delay: 1000 },
                  {
                    title: "Office Location",
                    info: "Nyarugenge, Kigali",
                    delay: 1200,
                  },
                  {
                    title: "Send a Message",
                    info: "myeduqualitypartner@gmail.com",
                    delay: 1400,
                  },
                ].map((item, index) => (
                  <div
                    key={`contact-${index}-${animationKey}`}
                    className={`hover:transform hover:scale-105 transition-all duration-100 ${
                      isVisible
                        ? "animate-fadeInUp"
                        : "opacity-0 translate-y-[30px]"
                    }`}
                    style={{
                      animationDelay: `${item.delay}ms`,
                      transitionDelay: isVisible ? `${item.delay}ms` : "0ms",
                    }}
                  >
                    <h3 className="text-lg font-semibold mb-2 hover:text-[#F17105] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-gray-300 text-sm hover:text-[#F17105] transition-colors cursor-pointer">
                      {item.info}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div
          key={`bottom-bar-${animationKey}`}
          className={`border-t border-blue-400/30 transition-all duration-100 ${
            isVisible
              ? "animate-fadeInUp animation-delay-1600"
              : "opacity-0 translate-y-[30px]"
          }`}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-center items-center">
              <p className="text-gray-300 text-sm mb-2 md:mb-0 hover:text-blue-400 transition-colors cursor-pointer">
                © MY EDUQUALITY PARTNER LTD 2026
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
