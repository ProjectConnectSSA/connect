import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

const BACKGROUND_BUCKET_NAME = "linkimage";
const BACKGROUND_SUBFOLDER = "backgrounds";
const MAX_BACKGROUND_FILE_SIZE_MB = 5;

class BackgroundUploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackgroundUploadError";
  }
}

function validateFile(file: File): void {
  if (file.size > MAX_BACKGROUND_FILE_SIZE_MB * 1024 * 1024) {
    throw new BackgroundUploadError(`File size exceeds ${MAX_BACKGROUND_FILE_SIZE_MB}MB limit.`);
  }

  if (!file.type.startsWith("image/")) {
    throw new BackgroundUploadError("Invalid file type. Please upload an image.");
  }
}

function generateFilePath(fileName: string): string {
  const fileExt = fileName.split(".").pop();
  const uniqueFileName = `${crypto.randomUUID()}.${fileExt}`;
  return `${BACKGROUND_SUBFOLDER}/${uniqueFileName}`;
}

export async function uploadBackgroundImage(file: File): Promise<string> {
  validateFile(file);

  const filePath = generateFilePath(file.name);

  const { data, error: uploadError } = await supabase.storage.from(BACKGROUND_BUCKET_NAME).upload(filePath, file);

  if (uploadError) {
    console.error("Background Upload error:", uploadError);

    if (uploadError.message.includes("Bucket not found")) {
      throw new BackgroundUploadError(`Storage bucket "${BACKGROUND_BUCKET_NAME}" not found.`);
    }

    throw new BackgroundUploadError(`Background image upload failed: ${uploadError.message}`);
  }

  if (!data?.path) {
    console.error("Background Upload error: No path returned from storage upload.");
    throw new BackgroundUploadError("Background image upload failed: No path returned.");
  }

  const { data: publicUrlData } = supabase.storage.from(BACKGROUND_BUCKET_NAME).getPublicUrl(data.path);

  if (!publicUrlData?.publicUrl) {
    console.error("Failed to get public URL for path:", data.path);
    throw new BackgroundUploadError("Failed to get public URL after upload.");
  }

  return publicUrlData.publicUrl;
}
