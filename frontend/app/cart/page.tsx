"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 🧠 Check login (but don't redirect immediately)
  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setUser(decoded);
      } catch {
        localStorage.removeItem("userToken");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // 🛒 Fetch cart data (guest or logged-in)
  const fetchCart = async () => {
    try {
      if (user?.id) {
        // Backend cart
        const res = await api.get(`/cart/${user.id}`);
        const normalized = res.data.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          quantity: item.quantity || 1,
        }));
        setCart(normalized);
      } else {
        // Guest cart (localStorage)
        const local = JSON.parse(localStorage.getItem("guestCart") || "[]");
        setCart(local);
      }
    } catch (err) {
      console.error("❌ Cart fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // ❌ Remove item
  const removeItem = async (id: number) => {
    if (user?.id) {
      await api.delete(`/cart/${id}`);
      fetchCart();
    } else {
      const updated = cart.filter((item) => item.id !== id);
      setCart(updated);
      localStorage.setItem("guestCart", JSON.stringify(updated));
    }
  };

  // 💰 Total
  const total = cart.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (item.quantity || 1),
    0
  );

  // ✅ Handle Checkout Button
  const handleCheckout = () => {
    if (!user) {
      router.push("/login-redirect");
    } else {
      router.push("/checkout");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <h1 className="text-3xl font-bold mb-6 text-center">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty 😕</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item, index) => (
            <div
              key={item.id || `${item.product_id}-${index}`}
              className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={
                    item.image_url?.startsWith("http")
                      ? item.image_url
                      : `http://localhost:5000${item.image_url}`
                  }
                  alt={item.name}
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p>₹{Number(item.price).toFixed(2)} × {item.quantity}</p>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          ))}

          <div className="text-right font-bold text-xl mt-4">
            Total: ₹{total.toFixed(2)}
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg mt-6"
          >
            ✅ Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
