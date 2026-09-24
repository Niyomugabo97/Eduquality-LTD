"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  MapPin,
  Heart,
  ArrowRight,
} from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  date: string;
  location?: string;
  media?: {
    images?: string[];
    mainImage?: string;
  };
  createdAt?: string;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities");
      const data = await response.json();

      if (data.success) {
        setActivities(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityImage = (activity: Activity) => {
    return (
      activity.media?.mainImage ||
      activity.media?.images?.[0] ||
      "/images/profile.jpg"
    );
  };

  const formatDate = (date: string) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />

        <div className="container mx-auto px-4 max-w-7xl py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />

            <p className="mt-4 text-gray-600">
              Loading activities...
            </p>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ================= HERO ================= */}
      <section
        className="relative min-h-[50vh] sm:min-h-[60vh] bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "linear-gradient(rgba(15, 23, 42, 0.75), rgba(30, 64, 175, 0.75)), url('/images/footer-bg.jpg')",
        }}
      >
        <Header />

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 max-w-7xl">

            <div className="text-white max-w-3xl pt-20 sm:pt-28">

              {/* Breadcrumb */}
              <nav className="mb-5">
                <div className="flex items-center space-x-2 text-sm">

                  <Link
                    href="/"
                    className="text-gray-300 hover:text-white transition-colors"
                  >
                    Home
                  </Link>

                  <span className="text-gray-400">
                    {" > "}
                  </span>

                  <span className="text-white font-medium">
                    Activities
                  </span>

                </div>
              </nav>

              <Badge className="mb-5 bg-white/20 text-white border border-white/30">
                NIBEZA FOUNDATION
              </Badge>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-5 leading-tight">
                OUR ACTIVITIES
              </h1>

              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed">
                Discover the activities and events through which
                NIBEZA Foundation supports orphaned and vulnerable
                children and communities.
              </p>

            </div>
          </div>
        </div>
      </section>

      {/* ================= ACTIVITIES ================= */}
      <section className="container mx-auto px-4 sm:px-6 max-w-7xl py-12 sm:py-16">

        {/* Section heading */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">

          <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
            NIBEZA FOUNDATION
          </span>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Activities & Events
          </h2>

          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            Explore the activities and events that reflect our
            commitment to supporting children, families and communities.
          </p>

        </div>

        {/* ================= POSTS ================= */}
        {activities.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

            {activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                getActivityImage={getActivityImage}
                formatDate={formatDate}
              />
            ))}

          </div>

        ) : (

          /* ================= NO ACTIVITIES ================= */
          <div className="text-center py-16">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto p-8 sm:p-12">

              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarDays className="w-10 h-10 text-blue-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">
                No Activities Yet
              </h3>

              <p className="text-gray-600 leading-relaxed">
                Our activities and events will appear here as
                NIBEZA Foundation continues its work with children
                and communities.
              </p>

            </div>

          </div>
        )}

      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-700">

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl py-14 sm:py-20 text-center text-white">

          <Heart className="w-10 h-10 mx-auto mb-5" />

          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Every Child Matters
          </h2>

          <p className="text-blue-100 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed mb-8">
            Through education, spiritual guidance, mentorship,
            protection and holistic support, we work together to
            help children grow, learn and realise their full potential.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Involved
            <ArrowRight className="w-4 h-4" />
          </Link>

        </div>

      </section>

      <Footer />

    </main>
  );
}


/* =========================================================
   ACTIVITY CARD
========================================================= */

function ActivityCard({
  activity,
  getActivityImage,
  formatDate,
}: {
  activity: Activity;
  getActivityImage: (activity: Activity) => string;
  formatDate: (date: string) => string;
}) {

  const [imageSrc, setImageSrc] = useState(
    getActivityImage(activity)
  );

  return (
    <Card className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white">

      {/* ================= PHOTO ================= */}
      <div className="relative h-56 sm:h-64 overflow-hidden">

        <img
          src={imageSrc}
          alt={activity.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={() => setImageSrc("/images/profile.jpg")}
        />

        {/* Image overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      </div>


      {/* ================= CONTENT ================= */}
      <CardContent className="p-5 sm:p-6">

        {/* Activity title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {activity.title}
        </h3>


        {/* Description */}
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-4 mb-5">
          {activity.description}
        </p>


        {/* Date */}
        {activity.date && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">

            <CalendarDays className="w-4 h-4 text-blue-600 shrink-0" />

            <span>
              {formatDate(activity.date)}
            </span>

          </div>
        )}


        {/* Location */}
        {activity.location && (
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-5">

            <MapPin className="w-4 h-4 text-blue-600 shrink-0" />

            <span className="truncate">
              {activity.location}
            </span>

          </div>
        )}


        {/* Read More */}
        <Link
          href={`/activities/${activity.id}`}
          className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors"
        >
          Read More

          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>

      </CardContent>

    </Card>
  );
}