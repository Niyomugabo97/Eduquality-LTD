"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
  MapPin,
  Phone,
  Mail,
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
      <footer className="bg-gray-950 text-white py-14">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {/* Foundation */}

            <div>

              <h3 className="text-xl font-bold text-blue-400 mb-4">
                NIBEZA FOUNDATION
              </h3>

              <p className="text-gray-400 leading-7">
                A foundation committed to supporting orphaned and vulnerable
                children through education, faith, protection, mentorship and
                holistic community support.
              </p>

            </div>


            {/* Quick Links */}

            <div>

              <h4 className="text-lg font-semibold text-blue-400 mb-4">
                Quick Links
              </h4>

              <ul className="space-y-3">

                <li>
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>

                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/services"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Programs & Services
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    Contact
                  </Link>
                </li>

              </ul>

            </div>


            {/* Contact */}

            <div>

              <h4 className="text-lg font-semibold text-blue-400 mb-4">
                Contact Information
              </h4>

              <div className="space-y-3 text-gray-400">

                <p className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  Rwanda
                </p>

                <p className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-blue-400" />
                  +250 788 676 421
                </p>

                <p className="flex items-center gap-3 break-all">
                  <Mail className="w-4 h-4 text-blue-400" />
                  info@nibezafoundation.org
                </p>

              </div>

            </div>

          </div>


          {/* Bottom */}

          <div className="border-t border-gray-800 mt-10 pt-8 text-center">

            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NIBEZA FOUNDATION. All rights reserved.
            </p>

          </div>

        </div>

      </footer>
  );
}
