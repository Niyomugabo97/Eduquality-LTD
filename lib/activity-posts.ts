import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

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

const DATA_FILE = path.join(process.cwd(), "data", "activities.json");

export async function readActivityPosts(): Promise<ActivityPost[]> {
  try {
    await mkdir(path.dirname(DATA_FILE), { recursive: true });
    const fileContents = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(fileContents);

    if (Array.isArray(parsed)) {
      return parsed as ActivityPost[];
    }

    return [];
  } catch {
    try {
      await mkdir(path.dirname(DATA_FILE), { recursive: true });
      await writeFile(DATA_FILE, "[]", "utf-8");
    } catch {
      // Keep the public posts page empty when storage is unavailable.
    }

    return [];
  }
}

export async function writeActivityPosts(posts: ActivityPost[]) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(posts, null, 2), "utf-8");
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
