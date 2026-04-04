"use client";
import { useEffect } from "react";
import {
  X,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  MessageCircle,
} from "lucide-react";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-[#F17105]/90 backdrop-blur-sm text-white z-50 transform transition-all duration-100 ease-in-out overflow-y-auto shadow-2xl ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 bg-[#F17105]/90 backdrop-blur-sm flex justify-between items-center p-6 border-b border-orange-200/30 transform transition-all duration-100 delay-100 ${
            isOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">EDUQUALITY</span>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-orange-200 transition-colors hover:rotate-90 transform duration-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Company Info */}
          <div
            className={`transform transition-all duration-100 delay-200 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 text-orange-200">
              About EDUQUALITY
            </h3>
            <p className="text-orange-100/90 mb-4 leading-relaxed text-sm">
              EDUQUALITY LTD is your trusted partner for quality education solutions and professional services. We are committed to transforming educational experiences through innovative solutions, expert consulting, and comprehensive support services tailored to meet your unique needs.
            </p>
            <div className="flex space-x-3">
              <Facebook className="w-4 h-4 hover:text-orange-200 cursor-pointer transition-all duration-100 hover:scale-125 hover:-translate-y-1" />
              <Twitter className="w-4 h-4 hover:text-orange-200 cursor-pointer hover:scale-110 transition-transform" />
              <Instagram className="w-4 h-4 hover:text-orange-200 cursor-pointer transition-all duration-100 hover:scale-125 hover:-translate-y-1" />
              <Youtube className="w-4 h-4 hover:text-orange-200 cursor-pointer transition-all duration-100 hover:scale-125 hover:-translate-y-1" />
              <a
                href="https://wa.me/250788123456"
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 hover:text-orange-200 cursor-pointer transition-all duration-100 hover:scale-125 hover:-translate-y-1" />
              </a>
            </div>
          </div>
          {/* Animated Divider */}
          <div
            className={`border-t border-orange-200/30 transform transition-all duration-100 delay-300 ${
              isOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
          />
          {/* Our Services */}
          <div
            className={`transform transition-all duration-100 delay-400 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 text-orange-200">
              Our Services
            </h3>
            <div className="space-y-3">
              {[
                "Educational Consulting",
                "Quality Management Systems",
                "Educational Technology Solutions",
                "Curriculum Development",
                "Teacher Training Programs",
                "Student Assessment Services",
                "Educational Resource Management",
                "Learning Analytics",
                "Educational Project Management",
                "Institutional Development",
                "Educational Research & Analysis",
                "Professional Development Programs",
              ].map((service, index) => (
                <div
                  key={service}
                  className={`group transform transition-all duration-100 ${
                    isOpen
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-4 opacity-0"
                  }`}
                  style={{ transitionDelay: `${500 + index * 50}ms` }}
                >
                  <span className="text-orange-100/90 hover:text-orange-200 transition-all duration-100 cursor-pointer block text-sm hover:translate-x-2 hover:font-medium relative">
                    <span className="absolute left-0 w-0 h-0.5 bg-orange-200 bottom-0 transition-all duration-100 group-hover:w-full"></span>
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Animated Divider */}
          <div
            className={`border-t border-orange-200/30 transform transition-all duration-100 delay-700 ${
              isOpen ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
            }`}
          />
          {/* Contact Us */}
          <div
            className={`transform transition-all duration-100 delay-800 ${
              isOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <h3 className="text-lg font-semibold mb-4 text-orange-200">
              Contact Us
            </h3>
            <div className="space-y-4">
              <div className="group hover:bg-orange-800/20 p-2 rounded transition-all duration-100">
                <h4 className="text-sm font-semibold mb-1 text-orange-200">
                  We're Open
                </h4>
                <p className="text-orange-100/90 text-sm">Monday - Friday: 8:00 AM - 6:00 PM<br/>Saturday: 9:00 AM - 4:00 PM</p>
              </div>
              <div className="group hover:bg-orange-800/20 p-2 rounded transition-all duration-100">
                <h4 className="text-sm font-semibold mb-1 text-orange-200">
                  Office Location
                </h4>
                <p className="text-orange-100/90 text-sm">Kigali, Rwanda</p>
              </div>
              <div className="group hover:bg-orange-800/20 p-2 rounded transition-all duration-100">
                <h4 className="text-sm font-semibold mb-1 text-orange-200">
                  Send a Message
                </h4>
                <p className="text-orange-100/90 hover:text-orange-200 transition-colors cursor-pointer text-sm hover:underline">
                  myeduquality@gmail.com
                </p>
              </div>
            </div>
          </div>
          {/* Bottom spacing */}
          <div className="h-8"></div>
        </div>
      </div>
    </>
  );
}
