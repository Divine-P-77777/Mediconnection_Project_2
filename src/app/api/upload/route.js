import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { Readable } from "stream";

import { createClient } from "@supabase/supabase-js";
import busboy from "busboy";


// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Supabase server client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Needs service role for update
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const { searchParams } = new URL(req.url);
    const appointmentId = searchParams.get("appointmentId");
    const fileType = searchParams.get("fileType"); // "reports" | "bills" | "prescriptions"

    if (!appointmentId || !fileType) {
      return NextResponse.json({ message: "Missing appointmentId or fileType" }, { status: 400 });
    }

    const contentType = req.headers.get("content-type");
    if (!contentType?.includes("multipart/form-data")) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const bb = busboy({ headers: { "content-type": contentType } });
let fileBuffer = null;
let fileName = "";

bb.on("file", (_, file, info) => {
  fileName = info.filename;
  const chunks = [];
  file.on("data", (chunk) => chunks.push(chunk));
  file.on("end", () => {
    fileBuffer = Buffer.concat(chunks);
  });
});

await new Promise((resolve, reject) => {
  bb.on("finish", resolve);
  bb.on("error", reject);

  const reader = req.body.getReader();
  const stream = new Readable({ read() {} });

  (async () => {
    let done, value;
    while ({ done, value } = await reader.read(), !done) {
      stream.push(Buffer.from(value));
    }
    stream.push(null);
  })();

  stream.pipe(bb);
});


    if (!fileBuffer) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "appointments", resource_type: "auto" },
        (err, res) => {
          if (err) reject(err);
          else resolve(res);
        }
      );
      uploadStream.end(fileBuffer);
    });

    const fileUrl = result.secure_url;

    // Fetch existing field
    const { data: existing, error: fetchError } = await supabase
      .from("appointments")
      .select(fileType)
      .eq("id", appointmentId)
      .single();

    if (fetchError) throw fetchError;

    const oldFiles = existing?.[fileType] || [];

    // Update appointment row
    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        [fileType]: [...oldFiles, fileUrl],
      })
      .eq("id", appointmentId);

    if (updateError) throw updateError;

    return NextResponse.json({ url: fileUrl });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
