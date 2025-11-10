"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="py-10 px-5">
      <h1 className="text-3xl font-bold text-center mb-8">🛍️ All Products</h1>
      <div className="grid md:grid-cols-3 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
           <img
  src={
    p.image_url?.startsWith("http")
      ? p.image_url
      : `http://localhost:5000${p.image_url}`
  }
  alt={p.name}
  className="w-full h-40 object-cover rounded"
/>

            <div className="p-4">
              <h2 className="text-lg font-semibold">{p.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {p.description.slice(0, 80)}...
              </p>
              <p className="font-bold text-blue-600 mb-4">₹{p.price}</p>
              <Link
                href={`/products/${p.id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                View Details →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
