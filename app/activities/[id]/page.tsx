import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { readActivityPosts } from "@/lib/activity-posts";

const activities = [
  {
    id: "school-support-2025",
    title: "School Support for Children in Need",
    description:
      "Our team provided school materials, mentorship, and encouragement to children facing financial hardship so they could remain in school and concentrate on learning.",
    fullDescription:
      "This outreach focused on helping children stay engaged in school through the provision of essential learning materials, one-on-one encouragement, and mentoring support. We partnered with families and community leaders to reduce barriers that prevent vulnerable children from continuing their education.",
    date: "2025-05-18",
    location: "Kigali, Rwanda",
    media: {
      mainImage: "/images/footer-bg.jpg",
      images: ["/images/footer-bg.jpg", "/images/profile.jpg"],
    },
    createdAt: "2025-05-18T09:00:00.000Z",
  },
  {
    id: "community-feeding-drive",
    title: "Community Feeding and Care Drive",
    description:
      "We mobilized volunteers and local partners to deliver food support, care packages, and compassionate outreach to families experiencing hardship.",
    fullDescription:
      "The feeding drive brought communities together around practical action. Families received food support, households were connected to further care, and volunteers created a safe and welcoming space for vulnerable members to receive support with dignity.",
    date: "2025-04-14",
    location: "Rubavu, Rwanda",
    media: {
      mainImage: "/images/profile.jpg",
      images: ["/images/profile.jpg", "/images/footer-bg.jpg"],
    },
    createdAt: "2025-04-14T09:00:00.000Z",
  },
  {
    id: "child-protection-awareness",
    title: "Child Protection Awareness Session",
    description:
      "Through community dialogue and practical guidance, we strengthened awareness around child rights, protection, and safe reporting practices.",
    fullDescription:
      "This child protection session helped parents, caregivers, and community members better understand safeguarding, reporting channels, and the importance of creating safe spaces for children. The sessions combined practical examples with community discussion to improve everyday protection practices.",
    date: "2025-02-22",
    location: "Huye, Rwanda",
    media: {
      mainImage: "/images/footer-bg.jpg",
      images: ["/images/footer-bg.jpg", "/images/profile.jpg"],
    },
    createdAt: "2025-02-22T09:00:00.000Z",
  },
];

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity =
    (await readActivityPosts()).find((item) => item.id === id) ??
    activities.find((item) => item.id === id);

  if (!activity) {
    notFound();
  }

  const mainImage = activity.media?.mainImage || "/images/profile.jpg";
  const images = activity.media?.images ?? [];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="container mx-auto max-w-5xl px-4 py-10 sm:py-16">
        <Link
          href="/posts"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to activities
        </Link>

        <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
          <div className="relative h-80 w-full overflow-hidden sm:h-[420px]">
            <img
              src={mainImage}
              alt={activity.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" />
          </div>

          <div className="space-y-6 p-6 sm:p-10">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                NIBEZA FOUNDATION
              </p>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {activity.title}
              </h1>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              {activity.date && (
                <div className="inline-flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  <span>
                    {new Date(activity.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}

              {activity.location && (
                <div className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span>{activity.location}</span>
                </div>
              )}
            </div>

            <p className="text-lg leading-relaxed text-gray-700">
              {activity.fullDescription || activity.description}
            </p>

            {images.length > 0 && (
              <div className="grid gap-4 pt-4 sm:grid-cols-2">
                {images.slice(0, 2).map((image, index) => (
                  <img
                    key={`${activity.id}-${index}`}
                    src={image}
                    alt={`${activity.title} ${index + 1}`}
                    className="h-56 w-full rounded-2xl object-cover shadow-sm"
                  />
                ))}
              </div>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}
