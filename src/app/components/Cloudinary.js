"use client";

import { useState } from "react";
import Image from "next/image";


export default function CloudinaryUpload({ onUpload, currentImage }){
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );

      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      }
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {currentImage ? (
        <Image
          src={currentImage}
          alt="Profile"
          width={120}
          height={120}
          className="rounded-full border shadow"
        />
      ) : (
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-sm text-gray-500">
          No Image
        </div>
      )}

      <label className="cursor-pointer bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded-lg text-sm">
        {uploading ? "Uploading..." : "Change Picture"}
        <input
  type="file"
  accept="image/*"
  className="hidden"
  onChange={handleUpload}
  disabled={uploading}
/>

      </label>
    </div>
  );
}
