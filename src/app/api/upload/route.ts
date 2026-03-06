import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import cloudinary from "cloudinary";
import busboy from "busboy";
import { Readable } from "stream";

/* -------------------- CLOUDINARY CONFIG -------------------- */

cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/* -------------------- SUPABASE ADMIN CLIENT -------------------- */

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only
);

/* -------------------- TYPES -------------------- */

type FileType = "reports" | "bills" | "prescriptions";
type TableName = "appointments" | "liveconsult";

/* -------------------- ROUTE HANDLER -------------------- */

export async function POST(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);

    const appointmentId = searchParams.get("appointmentId");
    const consultId = searchParams.get("consultId");
    const fileType = searchParams.get("fileType") as FileType | null;

    const id = appointmentId ?? consultId;
    const table: TableName = appointmentId ? "appointments" : "liveconsult";

    if (!id || !fileType) {
      return NextResponse.json(
        { message: "Missing appointmentId/consultId or fileType" },
        { status: 400 }
      );
    }

    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Invalid content type" },
        { status: 400 }
      );
    }

    /* -------------------- FILE PARSING -------------------- */

    const bb = busboy({ headers: { "content-type": contentType } });
    let fileBuffer: Buffer | null = null;

    bb.on("file", (_name, file) => {
      const chunks: Buffer[] = [];
      file.on("data", (chunk: Buffer) => chunks.push(chunk));
      file.on("end", () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    await new Promise<void>(async (resolve, reject) => {
      bb.on("finish", resolve);
      bb.on("error", reject);

      const reader = req.body?.getReader();
      if (!reader) return reject(new Error("Request body is empty"));

      const stream = new Readable({
        read() { },
      });

      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            stream.push(Buffer.from(value));
          }
          stream.push(null);
        } catch (err) {
          reject(err);
        }
      })();

      stream.pipe(bb);
    });

    if (!fileBuffer) {
      return NextResponse.json(
        { message: "No file uploaded" },
        { status: 400 }
      );
    }

    /* -------------------- CLOUDINARY UPLOAD -------------------- */

    const uploadResult = await new Promise<cloudinary.UploadApiResponse>(
      (resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "documents",
            resource_type: "auto",
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(fileBuffer);
      }
    );

    const fileUrl = uploadResult.secure_url;

    /* -------------------- FETCH EXISTING FILES -------------------- */

    const { data: existing, error: fetchError } = await supabase
      .from(table)
      .select(fileType)
      .eq("id", id)
      .single();

    if (fetchError) throw fetchError;

    const oldFiles: string[] = existing?.[fileType] ?? [];

    /* -------------------- UPDATE DB -------------------- */

    const { error: updateError } = await supabase
      .from(table)
      .update({
        [fileType]: [...oldFiles, fileUrl],
      })
      .eq("id", id);

    if (updateError) throw updateError;

    return NextResponse.json(
      { url: fileUrl },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Upload error:", err);

    const message =
      err instanceof Error ? err.message : "Upload failed";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
