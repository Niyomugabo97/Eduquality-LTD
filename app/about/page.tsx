"use client";

import { useEffect, useRef, useState } from "react";
import { Mail, Phone, MapPin, Users, Heart, Target, Award } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const boardMembers = [
    {
      name: "Board Chairperson",
      role: "Strategic Leadership",
      description: "Leading the vision and strategic direction of MY EDUQUALITY PARTNER LTD"
    },
    {
      name: "Operations Director",
      role: "Service Management",
      description: "Overseeing all service operations and quality assurance"
    },
    {
      name: "Finance Director",
      role: "Financial Planning",
      description: "Managing financial strategies and budget planning"
    },
    {
      name: "Community Relations Director",
      role: "Foundation & Outreach",
      description: "Leading charitable activities and community engagement"
    }
  ];

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About MY EDUQUALITY PARTNER LTD
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Your trusted multi-service partner dedicated to excellence in education, 
              business, beauty, delivery, and community service
            </p>
          </div>
        </div>
      </section>

      {/* Company Background */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Our Story</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                  MY EDUQUALITY PARTNER LTD is a multi-service company based in Kigali, Nyarugenge, Rwanda, 
                  committed to providing comprehensive solutions that address diverse community needs. 
                  Founded on the principles of quality, reliability, and social responsibility, we have grown 
                  to become a trusted partner for individuals and organizations across various sectors.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our integrated approach combines educational support, business services, beauty care, 
                  delivery solutions, and charitable activities to create a holistic service ecosystem 
                  that serves our community 24/7.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">5+</div>
                    <div className="text-sm text-gray-600">Service Categories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                    <div className="text-sm text-gray-600">Service Availability</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                    <div className="text-sm text-gray-600">Customer Satisfaction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">Kigali</div>
                    <div className="text-sm text-gray-600">Based in Rwanda</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Vision & Mission</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
                <div className="flex items-center mb-4">
                  <Target className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">Our Vision</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To be the leading multi-service provider in Rwanda, recognized for excellence, 
                  innovation, and positive community impact through integrated service solutions.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-indigo-100">
                <div className="flex items-center mb-4">
                  <Heart className="w-8 h-8 text-indigo-600 mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">Our Mission</h3>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  To provide comprehensive, high-quality services that empower individuals, 
                  support businesses, and contribute to community development while maintaining 
                  the highest standards of professionalism and integrity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Board of Directors */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Board of Directors</h2>
              <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
              <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
                Led by experienced professionals committed to excellence and innovation
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {boardMembers.map((member, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold text-blue-600 mb-2">{member.role}</p>
                  <p className="text-sm text-gray-600 text-center">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Appreciation */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-500 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
            <Award className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Our Appreciation</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              We extend our heartfelt gratitude to all our customers, partners, and community members 
              who have placed their trust in MY EDUQUALITY PARTNER LTD. Your continued support 
              inspires us to maintain the highest standards of service excellence and innovation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Together, we are building a stronger, more connected community through quality services 
              and unwavering commitment to your success and well-being.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 delay-600 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Get in Touch</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <Mail className="w-8 h-8 mb-3" />
                <p className="font-semibold">Email</p>
                <p className="text-blue-100">myeduqualitypartner@gmail.com</p>
              </div>
              <div className="flex flex-col items-center">
                <Phone className="w-8 h-8 mb-3" />
                <p className="font-semibold">Phone</p>
                <p className="text-blue-100">+250 788 676 421</p>
              </div>
              <div className="flex flex-col items-center">
                <MapPin className="w-8 h-8 mb-3" />
                <p className="font-semibold">Location</p>
                <p className="text-blue-100">Kigali, Nyarugenge</p>
                <p className="text-blue-100">Rwanda</p>
              </div>
            </div>
            <div className="mt-8 flex flex-col items-center">
              <Link
                href="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-400 transition-colors duration-300"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m7 7 7 7 7"
                  />
                </svg>
                <span className="font-semibold">Back to Home</span>
              </Link>
              <p className="text-xl font-semibold">Working Hours: 24/7</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-400">MY EDUQUALITY PARTNER</h3>
              <p className="text-gray-300 leading-relaxed">
                Multi-service company providing comprehensive solutions for educational, business, and community needs in Rwanda.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-blue-400 transition-colors">Home</Link></li>
                <li><Link href="/about" className="text-gray-300 hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/services" className="text-gray-300 hover:text-blue-400 transition-colors">Services</Link></li>
                <li><Link href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
            
            {/* Services */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Our Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li>School Strategic Planning</li>
                <li>Beauty & Personal Care</li>
                <li>Snack Production</li>
                <li>Delivery Services</li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-400">Contact Info</h4>
              <div className="space-y-2 text-gray-300">
                <p>📍 Kigali, Nyarugenge, Rwanda</p>
                <p>📞 +250 788 676 421</p>
                <p>✉️ myeduqualitypartner@gmail.com</p>
                <p>🕐 24/7 Service Available</p>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © MY EDUQUALITY PARTNER LTD 2026. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
