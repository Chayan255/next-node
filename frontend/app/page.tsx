"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

interface NewsItem {
  id: number;
  title: string;
  content: string;
  image_url: string;
  created_at?: string;
}

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/news")
      .then((res) => setNews(res.data))
      .catch(() => alert("Failed to fetch news"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-black">
        <p className="text-lg text-gray-600 dark:text-gray-300 animate-pulse">
          Loading latest news...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black py-10 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
        📰 Latest News
      </h1>

      {news.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No news available right now.
        </p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {news.map((item) => (
            <div
              key={item.id}
              className="rounded-xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:scale-[1.02] transition-transform duration-200"
            >
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {item.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {item.content.slice(0, 120)}...
                </p>
                <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  Read More →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
