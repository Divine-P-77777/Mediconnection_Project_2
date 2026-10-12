import { NextResponse } from "next/server";
import { deleteMediaFromRow } from "@/lib/cloudinary";

/* -------------------------------------------------------------------------- */
/* SUPABASE DATABASE WEBHOOK: CLOUDINARY ASSET CLEANUP ON ROW DELETION        */
/* -------------------------------------------------------------------------- */
/**
 * Receives DELETE webhook events from Supabase for tables:
 * - appointments
 * - liveconsult
 * - doctors
 * - health_centers
 *
 * Automatically purges all associated media files from Cloudinary.
 */

interface WebhookPayload {
  type: "INSERT" | "UPDATE" | "DELETE";
  table: string;
  schema: string;
  record: Record<string, any> | null;
  old_record: Record<string, any> | null;
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // Optional webhook secret validation if configured
    const webhookSecret = process.env.SUPABASE_WEBHOOK_SECRET;
    if (webhookSecret) {
      const authHeader = req.headers.get("x-webhook-secret");
      if (authHeader !== webhookSecret) {
        return NextResponse.json({ error: "Unauthorized webhook" }, { status: 401 });
      }
    }

    const payload: WebhookPayload = await req.json();
    const { type, table, old_record } = payload;

    // Only process DELETE events
    if (type !== "DELETE" || !old_record) {
      return NextResponse.json({
        message: "Ignored: not a DELETE event or missing old_record",
      });
    }

    console.log(`🧹 Cleaning up Cloudinary media for deleted row in '${table}'...`);

    const result = await deleteMediaFromRow(table, old_record);

    console.log(`✅ Cloudinary cleanup complete for '${table}':`, result);

    return NextResponse.json({
      success: true,
      table,
      deletedAssets: result.deleted,
      failedAssets: result.failed,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Cleanup failed";
    console.error("❌ Cloudinary webhook cleanup error:", message);

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
