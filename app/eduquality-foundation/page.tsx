"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Award, TrendingUp, Heart, Quote, HandHeart, School, BookOpen, Target, Globe } from "lucide-react";

export default function EduqualityFoundationPage() {
  const [stats, setStats] = useState({
    beneficiariesSupported: 0,
    communitiesReached: 0,
    yearsActive: 0,
    charitableProjects: 0
  });

  useEffect(() => {
    // Animate stats on mount
    const timer = setTimeout(() => {
      setStats({
        beneficiariesSupported: 500,
        communitiesReached: 25,
        yearsActive: 8,
        charitableProjects: 45
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const charitableActivities = [
    {
      title: "Educational Support",
      description: "Providing scholarships, school supplies, and educational resources to underprivileged students",
      icon: School,
      impact: "200+ students supported"
    },
    {
      title: "Community Development",
      description: "Building infrastructure and providing essential services to rural communities",
      icon: Globe,
      impact: "15 communities empowered"
    },
    {
      title: "Healthcare Initiatives",
      description: "Organizing medical camps and providing healthcare support to vulnerable populations",
      icon: Heart,
      impact: "500+ medical checkups"
    },
    {
      title: "Skills Training",
      description: "Offering vocational training and skill development programs for youth and women",
      icon: BookOpen,
      impact: "100+ trained individuals"
    },
    {
      title: "Environmental Conservation",
      description: "Promoting sustainable practices and environmental awareness campaigns",
      icon: Target,
      impact: "10+ green initiatives"
    },
    {
      title: "Emergency Relief",
      description: "Providing immediate assistance during crises and natural disasters",
      icon: HandHeart,
      impact: "Emergency response teams"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              NIBEZA LOIM FOUNDATION
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Transforming Communities Through Compassion
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Charitable Activities dedicated to creating lasting positive change in the lives of those who need it most
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <p className="text-sm text-blue-100">Founded</p>
                <p className="text-2xl font-bold">2017</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <p className="text-sm text-blue-100">Mission</p>
                <p className="text-lg font-semibold">Service to Humanity</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Foundation Description */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                About NIBEZA LOIM FOUNDATION
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our charitable activities transform lives and build sustainable communities through compassion and service
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="p-6 border-none shadow-lg">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-4 text-green-600">Our Vision</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To create a world where every individual has access to basic necessities, education, 
                    and opportunities for growth regardless of their background or circumstances. 
                    We envision empowered communities where compassion drives sustainable development 
                    and collective prosperity.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 border-none shadow-lg">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-4 text-blue-600">Our Mission</h3>
                  <p className="text-gray-700 leading-relaxed">
                    To provide comprehensive charitable support through targeted interventions in education, 
                    healthcare, community development, and emergency relief. We work tirelessly to address 
                    immediate needs while building long-term solutions for sustainable community development.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card className="p-8 border-none shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Commitment to Service</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  NIBEZA LOIM FOUNDATION is dedicated to serving humanity through structured charitable activities 
                  that address real community needs. Our approach combines immediate relief with long-term 
                  development strategies, ensuring that our interventions create lasting positive change.
                </p>
                <p className="text-gray-700 leading-relaxed mb-6">
                  We believe that charitable work should be sustainable, transparent, and community-driven. 
                  Our team of dedicated volunteers and partners work tirelessly to identify needs, 
                  develop solutions, and implement programs that transform lives and empower communities.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="font-semibold text-gray-900">Compassion</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="font-semibold text-gray-900">Excellence</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="font-semibold text-gray-900">Impact</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="font-semibold text-gray-900">Community</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Charitable Impact
            </h2>
            <p className="text-xl text-blue-100">
              Transforming lives through measurable charitable activities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <Users className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {stats.beneficiariesSupported}+
                </div>
                <p className="text-blue-100">Beneficiaries Supported</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <Globe className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {stats.communitiesReached}
                </div>
                <p className="text-blue-100">Communities Reached</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {stats.yearsActive}
                </div>
                <p className="text-blue-100">Years Active</p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <HandHeart className="w-12 h-12 mx-auto mb-4" />
                <div className="text-4xl font-bold mb-2">
                  {stats.charitableProjects}+
                </div>
                <p className="text-blue-100">Charitable Projects</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Charitable Activities Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Our Charitable Activities
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive support programs addressing critical community needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {charitableActivities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <Card key={index} className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2 text-gray-900">{activity.title}</h3>
                        <p className="text-gray-600 mb-3 leading-relaxed">{activity.description}</p>
                        <div className="bg-green-50 rounded-lg px-3 py-2 inline-block">
                          <p className="text-sm font-semibold text-green-700">{activity.impact}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Thank You Message */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Thank You to Our Supporters and Partners
            </h2>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              To all the donors, volunteers, community leaders, and organizations who have supported NIBEZA LOIM FOUNDATION - 
              we are deeply grateful for your generosity and commitment to our charitable mission. Your support makes it possible 
              for us to continue transforming lives and building stronger communities.
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Together, we are making a meaningful difference through our charitable activities. Your trust and support inspire us 
              to continue our work with dedication, transparency, and compassion. Every contribution helps us reach more people 
              and create lasting positive change in communities that need it most.
            </p>
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold mb-4 text-green-600">Join Our Charitable Mission</h3>
              <p className="text-gray-700 mb-6">
                Become part of our growing community of changemakers. Whether through donations, volunteering, or partnerships, 
                your involvement helps us expand our charitable activities and reach more beneficiaries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                  Get Involved Today
                </a>
                <a 
                  href="/services"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
