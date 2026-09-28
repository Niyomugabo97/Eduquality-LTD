import prisma from "@/lib/prisma";

export interface ActivityPost {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  date: string;
  location?: string;
  media?: {
    images?: string[];
    mainImage?: string;
  };
  createdAt?: string;
}

export async function readActivityPosts(): Promise<ActivityPost[]> {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return activities.map(activity => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      fullDescription: activity.fullDescription || undefined,
      date: activity.date,
      location: activity.location || undefined,
      media: {
        mainImage: activity.mainImage || undefined,
        images: activity.images || []
      },
      createdAt: activity.createdAt.toISOString()
    }));
  } catch (error) {
    console.error("Error reading activities from database:", error);
    return [];
  }
}

export async function writeActivityPosts(posts: ActivityPost[]) {
  // This function is deprecated - use individual Prisma operations instead
  // Kept for backward compatibility but should be replaced
  console.warn("writeActivityPosts is deprecated - use individual Prisma operations");
}

export async function createActivityPost(post: ActivityPost): Promise<ActivityPost> {
  try {
    const activity = await prisma.activity.create({
      data: {
        title: post.title,
        description: post.description,
        fullDescription: post.fullDescription || null,
        date: post.date,
        location: post.location || null,
        mainImage: post.media?.mainImage || null,
        images: post.media?.images || []
      }
    });

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      fullDescription: activity.fullDescription || undefined,
      date: activity.date,
      location: activity.location || undefined,
      media: {
        mainImage: activity.mainImage || undefined,
        images: activity.images || []
      },
      createdAt: activity.createdAt.toISOString()
    };
  } catch (error) {
    console.error("Error creating activity in database:", error);
    throw error;
  }
}

export async function updateActivityPost(id: string, post: Partial<ActivityPost>): Promise<ActivityPost | null> {
  try {
    const activity = await prisma.activity.update({
      where: { id },
      data: {
        title: post.title,
        description: post.description,
        fullDescription: post.fullDescription || null,
        date: post.date,
        location: post.location || null,
        mainImage: post.media?.mainImage || null,
        images: post.media?.images || []
      }
    });

    return {
      id: activity.id,
      title: activity.title,
      description: activity.description,
      fullDescription: activity.fullDescription || undefined,
      date: activity.date,
      location: activity.location || undefined,
      media: {
        mainImage: activity.mainImage || undefined,
        images: activity.images || []
      },
      createdAt: activity.createdAt.toISOString()
    };
  } catch (error) {
    console.error("Error updating activity in database:", error);
    return null;
  }
}

export async function deleteActivityPost(id: string): Promise<boolean> {
  try {
    await prisma.activity.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error("Error deleting activity from database:", error);
    return false;
  }
}

export function buildActivityFromInput(input: any): ActivityPost {
  const title = String(input?.title || "").trim();
  const description = String(input?.description || "").trim();
  const date = String(input?.date || new Date().toISOString().slice(0, 10)).trim();
  const location = String(input?.location || "").trim();
  const imageUrl = String(input?.imageUrl || input?.mainImage || "/images/profile.jpg").trim();

  const mainImage = imageUrl || "/images/profile.jpg";

  return {
    id:
      String(input?.id || `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`),
    title,
    description,
    date,
    location: location || undefined,
    media: {
      mainImage,
      images: [mainImage, "/images/footer-bg.jpg"],
    },
    createdAt: new Date().toISOString(),
  };
}
