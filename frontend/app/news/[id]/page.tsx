"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/utils/api";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

export default function NewsDetails() {
  const { id } = useParams(); // dynamic id from URL
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      api
        .get(`/news/${id}`)
        .then((res) => setNews(res.data))
        .catch(() => alert("Error loading news details"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          Loading details...
        </p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-gray-600 dark:text-gray-300">❌ News not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-10 px-5">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden">
       {news.image_url && (
  <img
    src={news.image_url}
    alt={news.title}
    className="w-full h-64 object-cover"
  />
)}


        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            {news.title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Published on {new Date(news.created_at).toLocaleDateString()}
          </p>
          <p className="text-lg leading-7 text-gray-700 dark:text-gray-300 whitespace-pre-line">
            {news.content}
          </p>

          <div className="mt-6">
            <Link
              href="/news"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              ← Back to All News
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
