"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  Award,
  TrendingUp,
  Heart,
  HandHeart,
  School,
  BookOpen,
  Target,
  Globe,
} from "lucide-react";

export default function EduqualityFoundationPage() {
  const [stats, setStats] = useState({
    beneficiariesSupported: 0,
    communitiesReached: 0,
    yearsActive: 0,
    charitableProjects: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        beneficiariesSupported: 500,
        communitiesReached: 25,
        yearsActive: 8,
        charitableProjects: 45,
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const charitableActivities = [
    {
      title: "Educational Support",
      description:
        "Providing scholarships, school supplies, and educational resources to children and students from underserved communities.",
      icon: School,
      impact: "200+ students supported",
    },
    {
      title: "Community Development",
      description:
        "Supporting community initiatives, infrastructure development, and essential services that contribute to stronger communities.",
      icon: Globe,
      impact: "15 communities empowered",
    },
    {
      title: "Healthcare Initiatives",
      description:
        "Supporting healthcare initiatives and activities that improve access to essential health services for vulnerable communities.",
      icon: Heart,
      impact: "500+ people reached",
    },
    {
      title: "Skills Training",
      description:
        "Providing vocational training, digital skills, and personal development opportunities for youth and women.",
      icon: BookOpen,
      impact: "100+ individuals trained",
    },
    {
      title: "Environmental Conservation",
      description:
        "Promoting environmental awareness, sustainable practices, and community-based conservation initiatives.",
      icon: Target,
      impact: "10+ green initiatives",
    },
    {
      title: "Emergency Relief",
      description:
        "Supporting vulnerable individuals and communities through assistance during emergencies and difficult circumstances.",
      icon: HandHeart,
      impact: "Emergency support provided",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative container mx-auto px-4 pt-28 pb-20">
          <div className="text-center max-w-5xl mx-auto">

            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-2xl">
                <img
                  src="/images/Edquality-logo.jpeg"
                  alt="My Equality Partner Ltd Logo"
                  className="w-32 h-32 md:w-40 md:h-40 object-contain rounded-xl"
                />
              </div>
            </div>

            {/* FOUNDATION NAME */}
            <p className="text-lg md:text-xl font-semibold text-blue-100 mb-3">
              NIBEZA FOUNDATION
            </p>

            <h1 className="text-3xl md:text-5xl font-bold mb-6">
              Transforming Communities Through Compassion
            </h1>

            <p className="text-lg md:text-2xl mb-6 text-blue-100 leading-relaxed">
              Creating lasting positive change through education, community
              development, healthcare support, skills development, and
              charitable activities.
            </p>

            {/* SUPPORT STATEMENT */}
            <div className="max-w-3xl mx-auto mb-10">
              <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-6 py-5">
                <p className="text-sm md:text-base text-blue-100 mb-1">
                  Supported and funded by
                </p>

                <p className="text-xl md:text-2xl font-bold text-white">
                  My Equality Partner Ltd
                </p>
              </div>
            </div>

            {/* INFO CARDS */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <p className="text-sm text-blue-100">Founded</p>
                <p className="text-2xl font-bold">2017</p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <p className="text-sm text-blue-100">Mission</p>
                <p className="text-lg font-semibold">
                  Service to Humanity
                </p>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-6 py-3 border border-white/30">
                <p className="text-sm text-blue-100">Focus</p>
                <p className="text-lg font-semibold">
                  Community Development
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          ABOUT FOUNDATION
      ========================== */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">

            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <img
                  src="/images/Edquality-logo.jpeg"
                  alt="My Equality Partner Ltd"
                  className="w-24 h-24 object-contain rounded-lg shadow-md"
                />
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
                About NIBEZA Foundation
              </h2>

              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                NIBEZA Foundation is a charitable organization supported and
                funded by My Equality Partner Ltd, dedicated to improving
                lives and supporting sustainable community development.
              </p>
            </div>

            {/* VISION & MISSION */}
            <div className="grid md:grid-cols-2 gap-8 mb-12">

              <Card className="p-6 border-none shadow-lg">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-4 text-green-600">
                    Our Vision
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    To contribute to a society where every individual has
                    access to education, essential services, opportunities,
                    and the support needed to improve their quality of life.
                    We envision empowered communities where people work
                    together to achieve sustainable development and shared
                    prosperity.
                  </p>
                </CardContent>
              </Card>

              <Card className="p-6 border-none shadow-lg">
                <CardContent className="p-0">
                  <h3 className="text-2xl font-bold mb-4 text-blue-600">
                    Our Mission
                  </h3>

                  <p className="text-gray-700 leading-relaxed">
                    To support individuals and communities through charitable
                    activities in education, healthcare, community development,
                    skills training, environmental conservation, and emergency
                    assistance while promoting sustainable and community-driven
                    solutions.
                  </p>
                </CardContent>
              </Card>

            </div>

            {/* COMMITMENT */}
            <Card className="p-8 border-none shadow-lg bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-0">

                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  Our Commitment to Service
                </h3>

                <p className="text-gray-700 leading-relaxed mb-6">
                  NIBEZA Foundation is committed to serving communities through
                  structured charitable activities that respond to real and
                  identified community needs.
                </p>

                <p className="text-gray-700 leading-relaxed mb-6">
                  With the support and funding of My Equality Partner Ltd,
                  the foundation seeks to implement initiatives that promote
                  education, social wellbeing, skills development, environmental
                  responsibility, and sustainable community development.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
                    <p className="font-semibold text-gray-900">
                      Compassion
                    </p>
                  </div>

                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Award className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                    <p className="font-semibold text-gray-900">
                      Excellence
                    </p>
                  </div>

                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-500" />
                    <p className="font-semibold text-gray-900">
                      Impact
                    </p>
                  </div>

                  <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                    <p className="font-semibold text-gray-900">
                      Community
                    </p>
                  </div>

                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* =========================
          STATISTICS
      ========================== */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Charitable Impact
            </h2>

            <p className="text-xl text-blue-100">
              Supporting communities through meaningful charitable activities
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <Users className="w-12 h-12 mx-auto mb-4" />

                <div className="text-4xl font-bold mb-2">
                  {stats.beneficiariesSupported}+
                </div>

                <p className="text-blue-100">
                  Beneficiaries Supported
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <Globe className="w-12 h-12 mx-auto mb-4" />

                <div className="text-4xl font-bold mb-2">
                  {stats.communitiesReached}
                </div>

                <p className="text-blue-100">
                  Communities Reached
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <Award className="w-12 h-12 mx-auto mb-4" />

                <div className="text-4xl font-bold mb-2">
                  {stats.yearsActive}
                </div>

                <p className="text-blue-100">
                  Years Active
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                <HandHeart className="w-12 h-12 mx-auto mb-4" />

                <div className="text-4xl font-bold mb-2">
                  {stats.charitableProjects}+
                </div>

                <p className="text-blue-100">
                  Charitable Projects
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================
          CHARITABLE ACTIVITIES
      ========================== */}
      <section className="py-20">
        <div className="container mx-auto px-4">

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Our Charitable Activities
            </h2>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Supporting critical areas that contribute to individual
              wellbeing and sustainable community development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

            {charitableActivities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <Card
                  key={index}
                  className="p-6 border-none shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-0">

                    <div className="flex items-start gap-4">

                      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1">

                        <h3 className="text-xl font-bold mb-2 text-gray-900">
                          {activity.title}
                        </h3>

                        <p className="text-gray-600 mb-3 leading-relaxed">
                          {activity.description}
                        </p>

                        <div className="bg-green-50 rounded-lg px-3 py-2 inline-block">
                          <p className="text-sm font-semibold text-green-700">
                            {activity.impact}
                          </p>
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

      {/* =========================
          SUPPORTERS
      ========================== */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">

          <div className="max-w-4xl mx-auto text-center">

            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
              Supported by My Equality Partner Ltd
            </h2>

            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              NIBEZA Foundation carries out its charitable mission with the
              support and funding of My Equality Partner Ltd. This support
              contributes to the foundation's efforts to reach individuals,
              families, and communities through meaningful social and
              development initiatives.
            </p>

            {/* LOGO */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <img
                  src="/images/Edquality-logo.jpeg"
                  alt="My Equality Partner Ltd"
                  className="w-36 h-36 md:w-44 md:h-44 object-contain rounded-xl"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">

              <h3 className="text-2xl font-bold mb-4 text-green-600">
                Join Our Charitable Mission
              </h3>

              <p className="text-gray-700 mb-6">
                Become part of our growing community of changemakers.
                Whether through donations, volunteering, partnerships, or
                community initiatives, your involvement can contribute to
                positive and sustainable change.
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

      {/* =========================
          FOOTER
      ========================== */}
      <footer className="bg-gray-900 text-white py-10">
        <div className="container mx-auto px-4">

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">

            <img
              src="/images/Edquality-logo.jpeg"
              alt="My Equality Partner Ltd"
              className="w-20 h-20 object-contain rounded-lg bg-white p-2"
            />

            <div>
              <h3 className="text-xl font-bold">
                NIBEZA FOUNDATION
              </h3>

              <p className="text-gray-400 mt-2">
                A charitable organization supported and funded by
              </p>

              <p className="text-white font-semibold mt-1">
                My Equality Partner Ltd
              </p>
            </div>

          </div>

          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} NIBEZA Foundation. All rights reserved.
            </p>
          </div>

        </div>
      </footer>
    </div>
  );
}