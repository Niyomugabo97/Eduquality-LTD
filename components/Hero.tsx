"use client";

import { useState, useEffect } from "react";

// ============================================================
// HERO IMAGES
// ============================================================

const HERO_IMAGES = [
  "/images/eduquality1.png",
  "/images/eduquality2.png",
  "/images/eduquality3.jpeg",
  "/images/eduquality4.jpeg",
  "/images/eduquality5.jpeg",
];

const CAROUSEL_INTERVAL = 5000;
const TRANSITION_DURATION = 1000;

// ============================================================
// MISSION CARDS
// ============================================================

const MISSION_CARDS = [
  {
    title: "Our Commitment",
    icon: "🛡️",
    text: "NIBEZA FOUNDATION is committed to protecting and promoting the rights, dignity, safety and wellbeing of every child under its care, sponsorship, programmes or activities.",
  },
  {
    title: "Supporting Vulnerable Children",
    icon: "❤️",
    text: "The Foundation supports orphans, abandoned children and other vulnerable children, particularly children who are willing and able to study but whose families or guardians face financial difficulties.",
  },
  {
    title: "Education & Welfare",
    icon: "📚",
    text: "NIBEZA FOUNDATION provides education sponsorship, school fees, feeding, scholastic materials, mentorship, welfare support and other assistance according to the needs of individual beneficiaries.",
  },
  {
    title: "Child Protection",
    icon: "👶",
    text: "Because NIBEZA FOUNDATION works directly with children and their families, child protection is not an optional activity but a fundamental responsibility.",
  },
  {
    title: "A Safe Environment",
    icon: "🌱",
    text: "Every child has the right to grow, learn and develop in an environment free from violence, abuse, exploitation, neglect, discrimination, humiliation and all other forms of harm.",
  },
];

// ============================================================
// MAIN HERO COMPONENT
// ============================================================

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Automatically change images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % HERO_IMAGES.length
      );
    }, CAROUSEL_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Handle carousel indicator click
  const handleDotClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* ======================================================
          BACKGROUND CAROUSEL
      ====================================================== */}

      <CarouselBackground
        images={HERO_IMAGES}
        currentIndex={currentImageIndex}
      />

      {/* ======================================================
          OVERLAY
      ====================================================== */}

      <Overlay />

      {/* ======================================================
          HERO CONTENT
      ====================================================== */}

      <HeroContent />

      {/* ======================================================
          CAROUSEL INDICATORS
      ====================================================== */}

      <CarouselIndicators
        totalImages={HERO_IMAGES.length}
        currentIndex={currentImageIndex}
        onDotClick={handleDotClick}
      />

      {/* ======================================================
          ANIMATIONS
      ====================================================== */}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

// ============================================================
// CAROUSEL BACKGROUND
// ============================================================

interface CarouselBackgroundProps {
  images: string[];
  currentIndex: number;
}

function CarouselBackground({
  images,
  currentIndex,
}: CarouselBackgroundProps) {
  return (
    <div className="absolute inset-0">
      {/* Current image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity ease-in-out"
        style={{
          backgroundImage: `url(${images[currentIndex]})`,
          transitionDuration: `${TRANSITION_DURATION}ms`,
        }}
      />

      {/* Slight zoom effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"
        style={{
          backgroundImage: `url(${
            images[(currentIndex + 1) % images.length]
          })`,
        }}
      />
    </div>
  );
}

// ============================================================
// OVERLAY
// ============================================================

function Overlay() {
  return (
    <>
      {/* Main dark blue gradient */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-br
          from-blue-950/90
          via-blue-800/65
          to-indigo-950/90
        "
      />

      {/* Additional overlay */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Bottom gradient for smooth transition */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          h-64
          bg-gradient-to-t
          from-black/50
          to-transparent
        "
      />
    </>
  );
}

// ============================================================
// HERO CONTENT
// ============================================================

function HeroContent() {
  return (
    <div
      className="
        relative
        z-10
        w-full
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        pt-32
        pb-28
      "
    >
      {/* ======================================================
          FOUNDATION TITLE
      ====================================================== */}

      <div
        className="
          text-center
          text-white
          mb-10
          animate-fadeInUp
        "
        style={{
          animationDelay: "0.2s",
        }}
      >
        <h1
          className="
            text-4xl
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            font-extrabold
            tracking-tight
            mb-5
            drop-shadow-2xl
          "
        >
          NIBEZA FOUNDATION
        </h1>

        <div
          className="
            w-24
            h-1
            bg-white
            rounded-full
            mx-auto
            mb-5
          "
        />

        <p
          className="
            text-base
            sm:text-lg
            md:text-xl
            text-white/95
            max-w-3xl
            mx-auto
            leading-relaxed
            drop-shadow-lg
          "
        >
          Protecting children, supporting education and building
          a safer and brighter future for vulnerable children.
        </p>
      </div>

      {/* ======================================================
          OUR MISSION HEADING
      ====================================================== */}

      <div
        className="
          text-center
          text-white
          mb-8
          animate-fadeInUp
        "
        style={{
          animationDelay: "0.5s",
        }}
      >
        <span
          className="
            inline-flex
            items-center
            px-5
            py-2
            rounded-full
            bg-white/15
            backdrop-blur-md
            border
            border-white/30
            text-xs
            sm:text-sm
            font-bold
            uppercase
            tracking-[0.2em]
            shadow-lg
          "
        >
          Our Mission
        </span>

        <h2
          className="
            mt-4
            text-2xl
            sm:text-3xl
            md:text-4xl
            font-bold
            drop-shadow-xl
          "
        >
          Protecting Children. Supporting Their Future.
        </h2>

        <p
          className="
            mt-3
            max-w-2xl
            mx-auto
            text-sm
            sm:text-base
            text-white/85
          "
        >
          Our work is built around protecting children's rights,
          supporting their education and promoting their wellbeing.
        </p>
      </div>

      {/* ======================================================
          MISSION CARDS
      ====================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-5
        "
      >
        {MISSION_CARDS.map((card, index) => (
          <MissionCard
            key={card.title}
            title={card.title}
            icon={card.icon}
            text={card.text}
            animationDelay={`${0.7 + index * 0.15}s`}
          />
        ))}
      </div>

      {/* ======================================================
          RESPONSIBILITY CARD
      ====================================================== */}

      <div
        className="
          mt-6
          rounded-2xl
          bg-blue-950/75
          backdrop-blur-xl
          border
          border-white/20
          p-6
          sm:p-8
          md:p-10
          text-center
          text-white
          shadow-2xl
          animate-fadeInUp
        "
        style={{
          animationDelay: "1.6s",
        }}
      >
        {/* Icon */}
        <div
          className="
            w-16
            h-16
            mx-auto
            mb-4
            flex
            items-center
            justify-center
            rounded-full
            bg-white/15
            border
            border-white/20
            text-3xl
          "
        >
          🤝
        </div>

        <h3
          className="
            text-xl
            sm:text-2xl
            md:text-3xl
            font-bold
            mb-4
          "
        >
          Our Responsibility
        </h3>

        <p
          className="
            text-sm
            sm:text-base
            md:text-lg
            text-white/90
            leading-7
            max-w-4xl
            mx-auto
          "
        >
          This policy establishes the standards, procedures and
          responsibilities that all NIBEZA FOUNDATION staff,
          volunteers, caregivers, mentors, representatives, board
          members, partners, contractors and other persons working
          with or representing the Foundation must follow.
        </p>
      </div>

      {/* ======================================================
          FINAL STATEMENT
      ====================================================== */}

      <div
        className="
          mt-8
          text-center
          text-white
          animate-fadeInUp
        "
        style={{
          animationDelay: "1.9s",
        }}
      >
        <p
          className="
            text-sm
            sm:text-base
            md:text-lg
            font-medium
            text-white/90
            max-w-3xl
            mx-auto
            leading-relaxed
          "
        >
          Every child deserves the opportunity to grow, learn,
          feel safe and reach their full potential.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// MISSION CARD
// ============================================================

interface MissionCardProps {
  title: string;
  icon: string;
  text: string;
  animationDelay: string;
}

function MissionCard({
  title,
  icon,
  text,
  animationDelay,
}: MissionCardProps) {
  return (
    <div
      className="
        group
        relative
        rounded-2xl
        bg-white/95
        backdrop-blur-xl
        border
        border-white/40
        shadow-2xl
        p-6
        sm:p-7
        text-gray-800
        transition-all
        duration-500
        hover:-translate-y-2
        hover:bg-white
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)]
        animate-fadeInUp
      "
      style={{
        animationDelay,
      }}
    >
      {/* Top decoration */}
      <div
        className="
          absolute
          top-0
          left-6
          right-6
          h-1
          bg-gradient-to-r
          from-blue-500
          via-indigo-500
          to-blue-600
          rounded-b-full
        "
      />

      {/* Icon */}
      <div
        className="
          w-14
          h-14
          flex
          items-center
          justify-center
          rounded-2xl
          bg-blue-100
          text-3xl
          mb-5
          shadow-sm
          group-hover:scale-110
          group-hover:rotate-2
          transition-all
          duration-300
        "
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className="
          text-lg
          sm:text-xl
          font-bold
          text-blue-950
          mb-3
        "
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className="
          text-sm
          sm:text-base
          text-gray-700
          leading-7
        "
      >
        {text}
      </p>

      {/* Bottom accent */}
      <div
        className="
          mt-5
          h-1
          w-12
          rounded-full
          bg-blue-600
          group-hover:w-20
          transition-all
          duration-300
        "
      />
    </div>
  );
}

// ============================================================
// CAROUSEL INDICATORS
// ============================================================

interface CarouselIndicatorsProps {
  totalImages: number;
  currentIndex: number;
  onDotClick: (index: number) => void;
}

function CarouselIndicators({
  totalImages,
  currentIndex,
  onDotClick,
}: CarouselIndicatorsProps) {
  return (
    <div
      className="
        absolute
        z-30
        bottom-6
        left-0
        right-0
        flex
        justify-center
        items-center
        gap-2
      "
    >
      {Array.from({ length: totalImages }).map((_, index) => (
        <button
          key={index}
          type="button"
          aria-label={`Go to image ${index + 1}`}
          aria-current={index === currentIndex}
          onClick={() => onDotClick(index)}
          className={`
            rounded-full
            transition-all
            duration-300
            focus:outline-none
            focus:ring-2
            focus:ring-white
            focus:ring-offset-2
            focus:ring-offset-blue-900

            ${
              index === currentIndex
                ? "w-9 h-2.5 bg-white shadow-lg"
                : "w-2.5 h-2.5 bg-white/50 hover:bg-white/80"
            }
          `}
        />
      ))}
    </div>
  );
}