"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Users, Heart, Target, Award } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string;
  email?: string;
  phone?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function AboutUsSection() {
  const [teamworkers, setTeamworkers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team');
      
      if (!response.ok) {
        console.error('Failed to fetch team members:', response.status);
        useFallbackData();
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        setTeamworkers(data.data);
      } else {
        useFallbackData();
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
      useFallbackData();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackData = () => {
    console.log('Using fallback team data');
    setTeamworkers([
      {
        id: "1",
        name: "Board Chairperson",
        position: "Strategic Leadership",
        image: "/images/worker1.jpg",
        email: "contact@eduquality.rw",
        phone: "+250788676421",
        order: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Chief Executive Officer",
        position: "Operations Management",
        image: "/images/worker2.jpg",
        email: "contact@eduquality.rw",
        phone: "+250788676421",
        order: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        name: "Finance Director",
        position: "Financial Strategy",
        image: "/images/worker3.jpg",
        email: "contact@eduquality.rw",
        phone: "+250788676421",
        order: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        name: "Marketing Director",
        position: "Brand Development",
        image: "/images/worker4.jpg",
        email: "contact@eduquality.rw",
        phone: "+250788676421",
        order: 3,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "5",
        name: "Technical Lead",
        position: "Innovation & Technology",
        image: "/images/worker5.jpg",
        email: "contact@eduquality.rw",
        phone: "+250788676421",
        order: 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "6",
        name: "Customer Relations Manager",
        position: "Client Experience",
        image: "/images/profile.jpg",
        email: "contact@eduquality.rw",
        phone: "+250788676421",
        order: 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
    ]);
  };

  const [isVisible, setIsVisible] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const sectionRef = useRef(null);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <section
        ref={sectionRef}
        id="about"
        className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loading Team...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-16 px-4 bg-gradient-to-br from-blue-50 to-indigo-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className={`transition-all duration-1000 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Us</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Company Background */}
        <div className={`transition-all duration-1000 delay-200 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
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
            <div className="flex items-center justify-center bg-white p-12 rounded-2xl shadow-lg border border-blue-100">
              <div className="relative">
                <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-blue-50 rounded-full p-4 flex items-center justify-center">
                  <img
                    src="/images/logo.jpeg"
                    alt="MY EDUQUALITY PARTNER LTD Logo"
                    className="w-full h-full object-contain"
                    style={{ maxHeight: '100%', maxWidth: '100%' }}
                    onError={(e) => {
                      console.error('Logo failed to load:', e);
                      // Try alternative approach
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = '<div class="w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">MY EDUQUALITY<br/>PARTNER LTD</div>';
                      }
                    }}
                    onLoad={() => {
                      console.log('Logo loaded successfully');
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className={`transition-all duration-1000 delay-300 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
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

        {/* Board of Directors */}
        <div className={`transition-all duration-1000 delay-400 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Board of Directors</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
            <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
              Led by experienced professionals committed to excellence and innovation
            </p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {teamworkers.map((worker, index) => (
                <CarouselItem
                  key={worker.id}
                  className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/4"
                >
                  <Card
                    key={`card-${worker.id}-${animationKey}`}
                    className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-800 ${
                      isVisible
                        ? "animate-fadeInUp"
                        : "opacity-0 translate-y-[50px]"
                    }`}
                    style={{
                      animationDelay: `${600 + index * 100}ms`,
                      transitionDelay: isVisible
                        ? `${600 + index * 100}ms`
                        : "0ms",
                    }}
                  >
                    <div className="w-full h-48 overflow-hidden relative group">
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                      <img
                        src={worker.image || "/images/eduquality-team-placeholder.jpg"}
                        alt={worker.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center mb-2">
                        <Users className="w-4 h-4 text-blue-600 mr-2" />
                        <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {worker.name}
                        </h3>
                      </div>
                      <p className="text-xs text-blue-600 font-medium mb-2">
                        {worker.position}
                      </p>
                      <p className="text-xs text-gray-600 leading-relaxed mb-3">
                        Leading excellence and innovation in service delivery
                      </p>
                      
                      {/* Contact Options */}
                      <div className="flex flex-col space-y-2">
                        {worker.email && (
                          <button
                            onClick={() => window.open(`mailto:${worker.email}`, '_blank')}
                            className="flex items-center text-xs bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                            </svg>
                            Send Email
                          </button>
                        )}
                        
                        {worker.phone && (
                          <button
                            onClick={() => window.open(`tel:${worker.phone}`, '_blank')}
                            className="flex items-center text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                            </svg>
                            Call Now
                          </button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 hover:scale-110 transition-transform bg-blue-600 text-white border-blue-600" />
            <CarouselNext className="right-2 hover:scale-110 transition-transform bg-blue-600 text-white border-blue-600" />
          </Carousel>
        </div>

        {/* Appreciation */}
        <div className={`transition-all duration-1000 delay-500 mt-16 ${isVisible ? "animate-fadeInUp" : "opacity-0 translate-y-8"}`}>
          <div className="max-w-4xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-blue-100">
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
      </div>
    </section>
  );
}
