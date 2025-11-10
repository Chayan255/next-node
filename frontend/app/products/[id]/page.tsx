"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/utils/api";

export default function ProductDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (id) {
      api
        .get(`/products/${id}`)
        .then((res) => setProduct(res.data))
        .catch(() => alert("❌ Failed to load product"));
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);

    const token = localStorage.getItem("userToken");

    // 🔹 Not logged in → add to localStorage (guestCart)
    if (!token) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const existing = guestCart.find((item: any) => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        guestCart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      alert("🛒 Added to cart (guest)");
      setAdding(false);
      return;
    }

    // ✅ Logged in → backend cart
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      await api.post("/cart", {
        user_id: decoded.id,
        product_id: product.id,
        quantity: 1,
      });
      alert("✅ Product added to your cart!");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding to cart!");
    } finally {
      setAdding(false);
    }
  };

  if (!product)
    return (
      <div className="text-center py-20 text-gray-500">Loading product...</div>
    );

  return (
    <div className="max-w-3xl mx-auto py-10 px-5">
      <img
        src={
          product.image_url?.startsWith("http")
            ? product.image_url
            : `http://localhost:5000${product.image_url}`
        }
        alt={product.name}
        className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
      />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {product.description}
      </p>
      <p className="text-2xl font-bold text-blue-600 mb-4">
        ₹{Number(product.price).toFixed(2)}
      </p>

      <button
        onClick={handleAddToCart}
        disabled={adding}
        className={`px-6 py-2 rounded text-white font-semibold transition ${
          adding
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {adding ? "Adding..." : "🛒 Add to Cart"}
      </button>
    </div>
  );
}
