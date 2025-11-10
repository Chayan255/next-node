"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at?: string;
}

export default function AdminDashboard() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // 🧠 Fetch all news
  const fetchNews = async () => {
    const res = await api.get("/news");
    const data = res.data;
    setNews(
      sortOrder === "newest"
        ? data.sort((a: any, b: any) => b.id - a.id)
        : data.sort((a: any, b: any) => a.id - b.id)
    );
  };

  useEffect(() => {
    fetchNews();
  }, [sortOrder]);

  // 🧱 Add News (with multer)
  const addNews = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      alert("❗ Please fill all required fields.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await api.post("/news", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ News added successfully!");
      setTitle("");
      setContent("");
      setImageFile(null);
      setPreview(null);
      fetchNews();
    } catch (err) {
      alert("❌ Failed to add news!");
      console.error(err);
    }
  };

  // 🧠 Image Preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // 🗑️ Delete News
  const deleteNews = async (id: number) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
    try {
      await api.delete(`/news/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Deleted successfully!");
      fetchNews();
    } catch (err) {
      alert("❌ Failed to delete news!");
      console.error(err);
    }
  };

  // 🔍 Filtered + Paginated Data
  const filteredNews = news.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedNews = filteredNews.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        📰 Admin Dashboard
      </h1>

      {/* ======== ADD NEWS FORM ======== */}
      <form
        onSubmit={addNews}
        className="max-w-lg mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center mb-3">➕ Add News</h2>

        <input
          type="text"
          placeholder="News Title"
          className="w-full p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="News Content"
          className="w-full p-2 border rounded h-28"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="space-y-2">
          <label className="block font-medium text-gray-700 dark:text-gray-300">
            Upload Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded"
          />
          {preview && (
            <div className="mt-2">
              <p className="text-sm text-gray-500 mb-1">🖼️ Image Preview:</p>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg shadow-md"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          Add News
        </button>
      </form>

      {/* ======== FILTERS & CONTROLS ======== */}
      <div className="flex flex-col md:flex-row justify-between items-center mt-10 mb-6 gap-3">
        {/* Search */}
        <input
          type="text"
          placeholder="🔍 Search news by title..."
          className="border rounded p-2 w-full md:w-1/3"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="font-medium text-gray-700 dark:text-gray-300">
            Sort:
          </label>
          <select
            className="border rounded p-2"
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "newest" | "oldest")
            }
          >
            <option value="newest">🆕 Newest</option>
            <option value="oldest">📅 Oldest</option>
          </select>
        </div>
      </div>

      {/* ======== NEWS LIST ======== */}
      {displayedNews.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No news found 😕</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {displayedNews.map((n) => (
            <div
              key={n.id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
            >
              {n.image_url && (
                <img
                  src={`http://localhost:5000${n.image_url}`}
                  alt={n.title}
                  className="w-full h-40 object-cover rounded"
                />
              )}
              <h3 className="text-lg font-bold mt-3 text-gray-900 dark:text-white">
                {n.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                {n.content.slice(0, 100)}...
              </p>

              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/admin/edit/${n.id}`}
                  className="text-blue-500 hover:underline"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => deleteNews(n.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ======== PAGINATION ======== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            ⬅️ Prev
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
}
