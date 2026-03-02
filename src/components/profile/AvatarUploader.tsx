"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash2, Shuffle } from "lucide-react";

interface AvatarUploaderProps {
  value?: string;
  fallback: string;
  onChange: (value: string) => void;
}

export default function AvatarUploader({
  value,
  fallback,
  onChange,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);

  /* ----------------------------- */
  /* Compress Image Before Upload  */
  /* ----------------------------- */
  const compressImage = async (file: File): Promise<Blob> => {
    const img = document.createElement("img");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    return new Promise((resolve) => {
      img.onload = () => {
        const MAX_WIDTH = 512;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;

        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => resolve(blob as Blob),
          "image/jpeg",
          0.75 // compression level
        );
      };

      img.src = URL.createObjectURL(file);
    });
  };

  /* ----------------------------- */
  /* Upload To Cloudinary         */
  /* ----------------------------- */
  const uploadToCloudinary = async (file: File) => {
    try {
      setUploading(true);

      const compressed = await compressImage(file);

      const formData = new FormData();
      formData.append("file", compressed);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        onChange(data.secure_url);
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  /* ----------------------------- */
  /* Handlers                      */
  /* ----------------------------- */
  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    uploadToCloudinary(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files.length) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const generateGradientAvatar = () => {
    const gradients = [
      "linear-gradient(135deg,#6366f1,#8b5cf6)",
      "linear-gradient(135deg,#06b6d4,#3b82f6)",
      "linear-gradient(135deg,#f97316,#ef4444)",
      "linear-gradient(135deg,#10b981,#14b8a6)",
      "linear-gradient(135deg,#ec4899,#8b5cf6)",
      "linear-gradient(135deg,#f59e0b,#ef4444)",
    ];

    const random = gradients[Math.floor(Math.random() * gradients.length)];

    onChange(`gradient:${random}`);
  };

  const removeAvatar = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-border bg-card/60 relative flex items-center gap-6 rounded-3xl border p-6 backdrop-blur-xl transition-all"
      >
        {/* Avatar Preview */}
        <Avatar className="h-24 w-24 shadow-md">
          {value && !value.startsWith("gradient:") && (
            <AvatarImage src={value} />
          )}

          {value?.startsWith("gradient:") ? (
            <div
              className="h-full w-full rounded-full"
              style={{ background: value.replace("gradient:", "") }}
            />
          ) : (
            <AvatarFallback className="bg-indigo-600 text-2xl font-semibold text-white">
              {fallback}
            </AvatarFallback>
          )}
        </Avatar>

        {/* Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              size="sm"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              {uploading ? "Uploading..." : "Upload Image"}
            </Button>

            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={generateGradientAvatar}
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Random Gradient
            </Button>

            {value && (
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={removeAvatar}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Remove
              </Button>
            )}
          </div>

          <p className="text-muted-foreground text-xs">
            Drag & drop an image or auto-generate a premium gradient avatar.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (!e.target.files?.length) return;
            handleFile(e.target.files[0]);
          }}
        />
      </div>
    </div>
  );
}
