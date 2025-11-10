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

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/news")
      .then((res) => setNews(res.data))
      .catch(() => alert("Error loading news"))
      .finally(() => setLoading(false));
  }, []);

  // 🕓 Loading screen
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
    <div className="min-h-screen bg-gray-50 dark:bg-black py-10 px-5">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-900 dark:text-white">
        📰 Latest News
      </h1>

      {news.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400">
          No news available at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((n) => (
            <div
              key={n.id}
              className="group rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-800 hover:shadow-2xl transition-all duration-300 flex flex-col"
            >
              {n.image_url && (
                <img
  src={`http://localhost:5000${n.image_url}`}
  alt={n.title}
  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
/>

              )}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="font-semibold text-xl mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {n.title}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">
                  {n.content}
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/news/${n.id}`}
                    className="inline-block text-blue-600 dark:text-blue-400 font-medium hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
