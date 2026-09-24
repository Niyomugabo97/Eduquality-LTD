
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Target,
  Heart,
  ShieldCheck,
  Sparkles,
  Users,
  BookOpen,
  HandHeart,
  CheckCircle,
  Lightbulb,
  Cross,
} from "lucide-react";

// ============================================================
// CORE VALUES
// ============================================================

const CORE_VALUES = [
  {
    number: 1,
    title: "Christ-Centeredness",
    icon: Cross,
    verse: "Whatever you do, do it all for the glory of God. (1 Corinthians 10:31)",
    description:
      "We acknowledge Jesus Christ as the foundation of our work and seek to reflect His love, compassion and truth in everything we do.",
  },
  {
    number: 2,
    title: "Compassion",
    icon: Heart,
    verse: "Be kind and compassionate to one another. (Ephesians 4:32)",
    description:
      "We serve every child with love, dignity, mercy and genuine concern for their wellbeing.",
  },
  {
    number: 3,
    title: "Integrity",
    icon: ShieldCheck,
    verse: "The integrity of the upright guides them. (Proverbs 11:3)",
    description:
      "We uphold honesty, transparency, accountability and ethical stewardship in all our actions and use of resources.",
  },
  {
    number: 4,
    title: "Excellence",
    icon: Sparkles,
    verse: "Whatever you do, work at it with all your heart. (Colossians 3:23)",
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
// MAIN COMPONENT
// ============================================================

export default function AboutUsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // ==========================================================
  // INTERSECTION OBSERVER
  // ==========================================================

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: "-50px 0px",
      }
    );

    const currentSection = sectionRef.current;

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20 md:py-28"
    >
      {/* ======================================================
          BACKGROUND DECORATIONS
      ====================================================== */}

      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl" />

      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ====================================================
            SECTION HEADER
        ==================================================== */}

        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-bold uppercase tracking-widest mb-5">
            About NIBEZA Foundation
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
            Who We Are
          </h2>

          <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full mb-6" />

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            NIBEZA FOUNDATION is committed to transforming the lives of
            orphaned and vulnerable children through education, spiritual
            guidance, protection, mentorship and holistic support.
          </p>
        </div>

        {/* ====================================================
            VISION & MISSION
        ==================================================== */}

        <div className="grid lg:grid-cols-2 gap-8 mb-24">
          {/* VISION */}

          <div
            className={`group relative overflow-hidden rounded-3xl bg-white shadow-xl border border-blue-100 p-8 md:p-10 transition-all duration-1000 hover:-translate-y-2 hover:shadow-2xl ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/60 rounded-full -translate-y-20 translate-x-20" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
                    Our Vision
                  </p>

                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                    The Foundation Vision
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

          <div
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-700 to-indigo-800 shadow-xl p-8 md:p-10 transition-all duration-1000 hover:-translate-y-2 hover:shadow-2xl ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-24 translate-x-24" />

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>

                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-200">
                    Our Mission
                  </p>

                  <h3 className="text-2xl md:text-3xl font-bold text-white">
                    The Foundation Mission
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

        {/* ====================================================
            CORE VALUES HEADER
        ==================================================== */}

        <div
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-flex items-center px-5 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-widest mb-4">
            What Guides Us
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-5">
            Our Core Values
          </h2>

          <div className="w-24 h-1.5 bg-indigo-600 mx-auto rounded-full mb-5" />

          <p className="max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            These values guide how we serve children, work with communities,
            manage resources and build partnerships.
          </p>
        </div>

        {/* ====================================================
            CORE VALUES GRID
        ==================================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_VALUES.map((value, index) => {
            const Icon = value.icon;

            return (
              <div
                key={value.number}
                className={`group relative bg-white rounded-2xl border border-gray-100 shadow-md p-7 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${index * 80}ms`,
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
                <h3 className="relative text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">
                  {value.title}
                </h3>

                {/* Bible verse */}
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

                {/* Bottom line */}
                <div className="mt-6 h-1 w-10 rounded-full bg-blue-600 group-hover:w-20 transition-all duration-300" />
              </div>
            );
          })}
        </div>

        {/* ====================================================
            CLOSING STATEMENT
        ==================================================== */}

        <div
          className={`mt-20 transition-all duration-1000 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 p-8 md:p-12 text-center shadow-2xl">
            {/* Decorations */}
            <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white/5 -translate-x-20 -translate-y-20" />

            <div className="absolute bottom-0 right-0 w-60 h-60 rounded-full bg-white/5 translate-x-20 translate-y-20" />

            <div className="relative z-10">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <Heart className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-5">
                Together, We Can Make a Difference
              </h3>

              <p className="max-w-3xl mx-auto text-lg text-white/90 leading-8">
                Through faith, compassion, education, protection and
                empowerment, NIBEZA FOUNDATION works toward a future where
                every orphaned and vulnerable child has the opportunity to
                thrive and contribute positively to society.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

