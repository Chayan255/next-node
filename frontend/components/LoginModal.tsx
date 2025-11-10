"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

interface LoginModalProps {
  onClose: () => void;
}

export default function LoginModal({ onClose }: LoginModalProps) {
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Load pending product if exists (when adding to cart before login)
  useEffect(() => {
    const saved = localStorage.getItem("pendingProduct");
    if (saved) setProduct(JSON.parse(saved));
  }, []);

  // 🔐 Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("userToken", res.data.token);

      // ✅ If product waiting, auto add to cart
      if (product) {
        await api.post("/cart", {
          product_id: product.id,
          quantity: 1,
        });
        localStorage.removeItem("pendingProduct");
      }

      alert("✅ Logged in successfully!");
      onClose();
      router.push("/cart");
    } catch (error) {
      console.error(error);
      alert("❌ Invalid credentials or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-end z-50">
      {/* Side Login Panel */}
      <div className="w-full sm:w-[420px] h-full bg-white dark:bg-gray-900 shadow-2xl p-8 animate-slide-in relative overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 text-2xl"
        >
          ✕
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          🔐 Login to Continue
        </h2>

        {/* Product Preview (if any) */}
        {product && (
          <div className="flex items-center gap-4 mb-6 border-b pb-4">
            <img
              src={
                product.image_url?.startsWith("http")
                  ? product.image_url
                  : `http://localhost:5000${product.image_url}`
              }
              alt={product.name}
              className="w-16 h-16 object-contain rounded-md shadow"
            />
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {product.name}
              </p>
              <p className="text-blue-600 font-bold">
                ₹{Number(product.price).toFixed(2)}
              </p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-2 border rounded-md bg-gray-50 dark:bg-gray-800"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login & Continue"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          New user?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => {
              onClose();
              router.push("/register");
            }}
          >
            Create an account
          </span>
        </p>
      </div>
    </div>
  );
}
