
"use client";

import Header from "@/components/Header";
import { Mail, Phone, MapPin, Heart, Target, ShieldCheck, Sparkles, Users, BookOpen, HandHeart, CheckCircle, Lightbulb, Cross } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ============================================================
// CORE VALUES
// ============================================================

const CORE_VALUES = [
  {
    number: 1,
    title: "Christ-Centeredness",
    icon: Cross,
    verse:
      "Whatever you do, do it all for the glory of God. (1 Corinthians 10:31)",
    description:
      "We acknowledge Jesus Christ as the foundation of our work and seek to reflect His love, compassion and truth in everything we do.",
  },
  {
    number: 2,
    title: "Compassion",
    icon: Heart,
    verse:
      "Be kind and compassionate to one another. (Ephesians 4:32)",
    description:
      "We serve every child with love, dignity, mercy and genuine concern for their wellbeing.",
  },
  {
    number: 3,
    title: "Integrity",
    icon: ShieldCheck,
    verse:
      "The integrity of the upright guides them. (Proverbs 11:3)",
    description:
      "We uphold honesty, transparency, accountability and ethical stewardship in all our actions and use of resources.",
  },
  {
    number: 4,
    title: "Excellence",
    icon: Sparkles,
    verse:
      "Whatever you do, work at it with all your heart. (Colossians 3:23)",
    description:
      "We strive for the highest standards in service delivery, education support and organisational management.",
  },
  {
    number: 5,
    title: "Respect and Human Dignity",
    icon: Users,
    verse: "",
    description:
      "Every child is created in the image of God and deserves to be treated with respect, fairness and dignity regardless of their background.",
  },
  {
    number: 6,
    title: "Discipline and Responsibility",
    icon: CheckCircle,
    verse: "",
    description:
      "We promote good behaviour, obedience, hard work, respect for authority and responsible use of opportunities entrusted to our beneficiaries.",
  },
  {
    number: 7,
    title: "Education and Lifelong Learning",
    icon: BookOpen,
    verse: "",
    description:
      "We believe education is the most powerful tool for breaking the cycle of poverty and empowering future generations.",
  },
  {
    number: 8,
    title: "Servant Leadership",
    icon: HandHeart,
    verse:
      "For even the Son of Man did not come to be served, but to serve. (Mark 10:45)",
    description:
      "We lead by serving others with humility, sacrifice and commitment to the common good.",
  },
  {
    number: 9,
    title: "Accountability",
    icon: ShieldCheck,
    verse: "",
    description:
      "We are responsible to God, our beneficiaries, donors, partners and the communities we serve, ensuring faithful stewardship of every resource entrusted to us.",
  },
  {
    number: 10,
    title: "Empowerment",
    icon: Lightbulb,
    verse: "",
    description:
      "We equip children and young people with knowledge, skills, values and confidence to become self-reliant, productive and positive contributors to society.",
  },
];

// ============================================================
// ABOUT PAGE
// ============================================================

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(true);
    };

    setIsVisible(true);

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />

      {/* ======================================================
          HERO SECTION
      ====================================================== */}

      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-800 to-indigo-950 text-white py-24 md:py-32 px-4">

        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-white/5 rounded-full -translate-x-40 -translate-y-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-40 translate-y-40" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">

          <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-bold uppercase tracking-widest mb-6">
            About NIBEZA Foundation
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6">
            Who We Are
          </h1>

          <div className="w-24 h-1.5 bg-white mx-auto rounded-full mb-7" />

          <p className="text-lg sm:text-xl md:text-2xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
            Transforming the lives of orphaned and vulnerable children through
            faith, education, protection, mentorship and holistic support.
          </p>

        </div>
      </section>


      {/* ======================================================
          INTRODUCTION
      ====================================================== */}

      <section className="py-16 md:py-20 px-4">

        <div className="max-w-5xl mx-auto">

          <div className="bg-white rounded-3xl shadow-xl border border-blue-100 p-8 md:p-12 text-center">

            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-blue-600" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About NIBEZA Foundation
            </h2>

            <p className="text-lg md:text-xl text-gray-700 leading-8 max-w-4xl mx-auto">
              NIBEZA FOUNDATION is dedicated to protecting, supporting and
              empowering orphaned and vulnerable children. Through education,
              spiritual guidance, mentorship, protection and community
              partnerships, we work to create opportunities that enable every
              child to grow, learn and realise their full potential.
            </p>

          </div>

        </div>

      </section>


      {/* ======================================================
          VISION & MISSION
      ====================================================== */}

      <section className="py-16 md:py-24 px-4 bg-white">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <span className="inline-flex px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-widest mb-4">
              Our Direction
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
              Vision & Mission
            </h2>

            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />

          </div>


          <div className="grid lg:grid-cols-2 gap-8">

            {/* VISION */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-8 md:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">

              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-200/30 rounded-full -translate-y-24 translate-x-24" />

              <div className="relative z-10">

                <div className="flex items-center gap-4 mb-7">

                  <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                      The Foundation
                    </p>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                      Vision
                    </h3>
                  </div>

                </div>

                <p className="text-lg md:text-xl text-gray-700 leading-8">
                  A society where every orphaned and vulnerable child has the
                  opportunity to grow in Christ, receive quality education,
                  realise their full potential and become a responsible,
                  self-reliant citizen.
                </p>

              </div>

            </div>


            {/* MISSION */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-900 p-8 md:p-10 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 text-white">

              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24" />

              <div className="relative z-10">

                <div className="flex items-center gap-4 mb-7">

                  <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white" />
                  </div>

                  <div>
                    <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                      The Foundation
                    </p>

                    <h3 className="text-2xl md:text-3xl font-bold">
                      Mission
                    </h3>
                  </div>

                </div>

                <p className="text-lg md:text-xl text-white/95 leading-8">
                  To transform the lives of orphaned and vulnerable children by
                  providing access to education, spiritual guidance, mentorship,
                  protection and holistic support through partnerships,
                  compassion and sustainable community development.
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          CORE VALUES
      ====================================================== */}

      <section className="py-20 md:py-28 px-4">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <span className="inline-flex px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-widest mb-4">
              What Guides Us
            </span>

            <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-5">
              Our Core Values
            </h2>

            <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-6" />

            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our values guide how we serve children, work with families,
              engage communities, manage resources and build partnerships.
            </p>

          </div>


          {/* Values */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {CORE_VALUES.map((value, index) => {

              const Icon = value.icon;

              return (

                <div
                  key={value.number}
                  className={`group relative bg-white rounded-2xl border border-gray-100 shadow-md p-7 hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 ${
                    isVisible
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  }`}
                  style={{
                    transitionDelay: `${index * 70}ms`,
                  }}
                >

                  {/* Number */}

                  <div className="absolute top-5 right-5 text-5xl font-black text-blue-50 group-hover:text-blue-100 transition-colors">
                    {String(value.number).padStart(2, "0")}
                  </div>


                  {/* Icon */}

                  <div className="relative w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors duration-300">

                    <Icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />

                  </div>


                  {/* Title */}

                  <h3 className="relative text-xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors">

                    {value.title}

                  </h3>


                  {/* Verse */}

                  {value.verse && (

                    <div className="relative mb-4 p-3 rounded-xl bg-blue-50 border-l-4 border-blue-500">

                      <p className="text-sm italic text-blue-800 leading-relaxed">

                        {value.verse}

                      </p>

                    </div>

                  )}


                  {/* Description */}

                  <p className="relative text-gray-600 leading-7">

                    {value.description}

                  </p>


                  {/* Bottom decoration */}

                  <div className="mt-6 h-1 w-10 rounded-full bg-blue-600 group-hover:w-20 transition-all duration-300" />

                </div>

              );

            })}

          </div>

        </div>

      </section>


      {/* ======================================================
          CHILDREN FOCUS SECTION
      ====================================================== */}

      <section className="py-20 px-4 bg-white">

        <div className="max-w-6xl mx-auto">

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-8 md:p-14 text-white shadow-2xl">

            <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/5 -translate-y-36 translate-x-36" />

            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-white/5 translate-y-32 -translate-x-32" />

            <div className="relative z-10 text-center">

              <div className="w-20 h-20 mx-auto mb-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">

                <Heart className="w-10 h-10 text-white" />

              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">

                Every Child Matters

              </h2>

              <p className="text-lg md:text-xl text-white/90 leading-8 max-w-4xl mx-auto">

                We believe that every orphaned and vulnerable child deserves
                love, protection, quality education, spiritual guidance and
                opportunities to develop their God-given potential. Through
                compassion, partnership and sustainable community development,
                we seek to help children become responsible, self-reliant and
                positive contributors to society.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* ======================================================
          CONTACT SECTION
      ====================================================== */}

      <section className="py-20 px-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">

        <div className="max-w-5xl mx-auto text-center">

          <span className="inline-flex px-5 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-bold uppercase tracking-widest mb-5">
            Connect With Us
          </span>

          <h2 className="text-3xl md:text-5xl font-bold mb-5">
            Get in Touch
          </h2>

          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-12">
            We welcome partnerships, support and collaboration that help us
            improve the lives of orphaned and vulnerable children.
          </p>


          <div className="grid md:grid-cols-3 gap-6">

            {/* EMAIL */}

            <a
              href="mailto:info@nibezafoundation.org"
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2"
            >

              <Mail className="w-9 h-9 mx-auto mb-4 group-hover:scale-110 transition-transform" />

              <h3 className="font-bold text-lg mb-2">
                Email
              </h3>

              <p className="text-blue-100 break-all">
                info@nibezafoundation.org
              </p>

            </a>


            {/* PHONE */}

            <a
              href="tel:+250788676421"
              className="group bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2"
            >

              <Phone className="w-9 h-9 mx-auto mb-4 group-hover:scale-110 transition-transform" />

              <h3 className="font-bold text-lg mb-2">
                Phone
              </h3>

              <p className="text-blue-100">
                +250 788 676 421
              </p>

            </a>


            {/* LOCATION */}

            <div className="group bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-7">

              <MapPin className="w-9 h-9 mx-auto mb-4" />

              <h3 className="font-bold text-lg mb-2">
                Location
              </h3>

              <p className="text-blue-100">
                Rwanda
              </p>

            </div>

          </div>


          {/* Back home */}

          <div className="mt-12">

            <Link
              href="/"
              className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-white text-blue-700 font-semibold hover:bg-blue-50 transition-colors"
            >
              ← Back to Home
            </Link>

          </div>

        </div>

      </section>


      {/* ======================================================
          FOOTER
      ====================================================== */}

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

    </div>
  );
}
