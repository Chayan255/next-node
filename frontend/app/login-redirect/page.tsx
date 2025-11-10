"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function LoginRedirectPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🧠 Load guestCart + pendingProduct from localStorage
  useEffect(() => {
    const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
    const pending = localStorage.getItem("pendingProduct");
    if (pending) {
      const p = JSON.parse(pending);
      const merged = mergeCartItems(guestCart, [p]);
      setCartItems(merged);
    } else {
      setCartItems(guestCart);
    }
  }, []);

  // 🧩 Merge helper
  const mergeCartItems = (guest: any[], pending: any[]) => {
    const merged = [...guest];
    for (const p of pending) {
      const existing = merged.find((item) => item.id === p.id);
      if (existing) existing.quantity += 1;
      else merged.push({ ...p, quantity: 1 });
    }
    return merged;
  };

  // 🔐 Handle login & cart sync
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ 1. Login
      const res = await api.post("/auth/login", { email, password });
      const user = res.data.user;
      localStorage.setItem("userToken", res.data.token);
      localStorage.setItem("userName", user.name);

      // ✅ 2. Sync all guest cart items
      if (cartItems.length > 0) {
        for (const item of cartItems) {
          await api.post("/cart", {
            user_id: user.id,
            product_id: item.id,
            quantity: item.quantity || 1,
          });
        }
      }

      // ✅ 3. Clear localStorage
      localStorage.removeItem("guestCart");
      localStorage.removeItem("pendingProduct");

      alert("✅ Login successful! Your cart has been synced.");
      router.replace("/cart");
    } catch (err) {
      console.error("❌ Login error:", err);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* 🛍️ LEFT SIDE — All guest cart items preview */}
      <div className="flex-1 bg-gray-100 dark:bg-gray-800 flex flex-col items-center p-8 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Your Cart Items
        </h2>

        {cartItems.length > 0 ? (
          cartItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between w-full max-w-sm bg-white dark:bg-gray-700 p-4 rounded-lg shadow mb-4"
            >
              <img
                src={
                  item.image_url?.startsWith("http")
                    ? item.image_url
                    : `http://localhost:5000${item.image_url}`
                }
                alt={item.name}
                className="w-16 h-16 object-contain rounded"
              />
              <div className="flex-1 ml-4">
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  ₹{Number(item.price).toFixed(2)} × {item.quantity}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-300">No items found.</p>
        )}
      </div>

      {/* 🔐 RIGHT SIDE — Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 p-10">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-lg"
        >
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            🔐 Login to Continue
          </h1>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full mb-6 p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded font-semibold text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login & Continue"}
          </button>

          <p className="text-center text-sm text-gray-500 mt-4">
            New here?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
