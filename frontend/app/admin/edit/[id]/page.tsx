"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import api from "@/utils/api";

export default function EditNews() {
  const { id } = useParams();
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [oldImage, setOldImage] = useState<string | null>(null);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // 🧠 Fetch existing news data
  useEffect(() => {
    if (id) {
      api.get(`/news/${id}`).then((res) => {
        const d = res.data;
        setTitle(d.title);
        setContent(d.content);
        setOldImage(d.image_url);
      });
    }
  }, [id]);

  // 🧩 Update news handler
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (newImage) {
      formData.append("image", newImage); // নতুন image থাকলে multer handle করবে
    } else if (oldImage) {
      formData.append("image_url", oldImage); // পুরনো image রেখে দাও
    }

    try {
      await api.put(`/news/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ News updated successfully!");
      router.push("/admin/dashboard");
    } catch (error) {
      alert("❌ Failed to update news!");
      console.error(error);
    }
  };

  // 🧠 Image preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h2 className="text-2xl mb-5 text-center font-semibold">
        ✏️ Edit News
      </h2>

      <form
        onSubmit={handleUpdate}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow space-y-4"
      >
        {/* Title */}
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Content */}
        <textarea
          className="w-full p-2 border rounded h-32"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* Image section */}
        <div className="space-y-3">
          <label className="block font-medium text-gray-700 dark:text-gray-300">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded"
            onChange={handleFileChange}
          />

          {/* Preview section */}
          {(preview || oldImage) && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-1">
                {preview ? "🆕 New Image Preview:" : "🖼️ Current Image:"}
              </p>
              <img
                src={
                  preview
                    ? preview
                    : `http://localhost:5000${oldImage || ""}`
                }
                alt="Preview"
                className="rounded-lg shadow-md object-cover w-full h-48"
              />
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium"
        >
          Update News
        </button>
      </form>
    </div>
  );
}
