import { uploadImageToCloudinary } from "@/lib/cloudinary";

export async function readActivityPostInput(request: Request): Promise<Record<string, string>> {
  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return request.json();
  }

  const formData = await request.formData();
  const input: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") input[key] = value;
  }

  const image = formData.get("image");
  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) throw new Error("Image file must be an image.");
    if (image.size > 5 * 1024 * 1024) throw new Error("Image file must be smaller than 5 MB.");
    input.imageUrl = await uploadImageToCloudinary(image, "activity-posts");
  }

  return input;
}