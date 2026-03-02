import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();

    const upload = await cloudinary.uploader.upload(image, {
      folder: "focusflow/avatars",
      transformation: [
        { width: 300, height: 300, crop: "fill", gravity: "face" },
        { quality: "auto", fetch_format: "auto" },
      ],
    });

    return NextResponse.json({ url: upload.secure_url });
  } catch (error) {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
