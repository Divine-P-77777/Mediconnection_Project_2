import cloudinary from "cloudinary";

/* -------------------- CONFIGURATION -------------------- */
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;

/**
 * Extracts Cloudinary public_id from a URL.
 * Example URL:
 * https://res.cloudinary.com/cloud/image/upload/v1712345678/mediconnection/appointments/reports/abc123xyz.pdf
 * Returns: "mediconnection/appointments/reports/abc123xyz"
 */
export function extractPublicId(url: string): string | null {
  if (!url || typeof url !== "string") return null;

  try {
    const urlObj = new URL(url);
    if (!urlObj.hostname.includes("cloudinary.com")) return null;

    // Pattern: /upload/(optional v[0-9]+/)?(public_id_with_or_without_ext)
    const match = urlObj.pathname.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    if (!match || !match[1]) return null;

    return decodeURIComponent(match[1]);
  } catch {
    // If not a full URL, attempt regex on the raw string
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
    return match && match[1] ? decodeURIComponent(match[1]) : null;
  }
}

/**
 * Deletes one or multiple assets from Cloudinary.
 * Tries resource_type "image" first, then "raw" (for PDFs/documents).
 */
export async function deleteFromCloudinary(
  urlOrUrls: string | string[] | null | undefined
): Promise<{ deleted: string[]; failed: string[] }> {
  if (!urlOrUrls) return { deleted: [], failed: [] };

  const urls = (Array.isArray(urlOrUrls) ? urlOrUrls : [urlOrUrls]).filter(Boolean);
  const deleted: string[] = [];
  const failed: string[] = [];

  for (const url of urls) {
    const publicId = extractPublicId(url);
    if (!publicId) continue;

    try {
      // 1. Try deleting as image / auto
      const res = await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });

      if (res.result === "ok") {
        deleted.push(publicId);
        continue;
      }

      // 2. Fallback: Try deleting as raw (PDFs, docs)
      const rawRes = await cloudinary.v2.uploader.destroy(publicId, {
        resource_type: "raw",
        invalidate: true,
      });

      if (rawRes.result === "ok") {
        deleted.push(publicId);
      } else {
        failed.push(publicId);
      }
    } catch (err) {
      console.error(`Error deleting ${publicId} from Cloudinary:`, err);
      failed.push(publicId);
    }
  }

  return { deleted, failed };
}

/**
 * Inspects any deleted row from Supabase and automatically purges all
 * associated media from Cloudinary.
 */
export async function deleteMediaFromRow(
  table: string,
  row: Record<string, any>
): Promise<{ deleted: string[]; failed: string[] }> {
  if (!row) return { deleted: [], failed: [] };

  const urlsToDelete: string[] = [];

  // Appointments table
  if (table === "appointments") {
    if (Array.isArray(row.reports)) urlsToDelete.push(...row.reports);
    if (Array.isArray(row.bills)) urlsToDelete.push(...row.bills);
    if (Array.isArray(row.prescriptions)) urlsToDelete.push(...row.prescriptions);
  }

  // Live consultation table
  if (table === "liveconsult") {
    if (Array.isArray(row.reports)) urlsToDelete.push(...row.reports);
    if (Array.isArray(row.bills)) urlsToDelete.push(...row.bills);
    if (Array.isArray(row.prescriptions)) urlsToDelete.push(...row.prescriptions);
  }

  // Doctors table
  if (table === "doctors") {
    if (row.profile) urlsToDelete.push(row.profile);
    if (row.document_proof) urlsToDelete.push(row.document_proof);
  }

  // Health centers table
  if (table === "health_centers") {
    if (row.document_proof) urlsToDelete.push(row.document_proof);
  }

  return deleteFromCloudinary(urlsToDelete);
}
