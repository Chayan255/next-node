"use client";
import { useState } from "react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🚫 Prevent login if admin is already logged in
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      alert("⚠️ Please logout from your admin account before logging in as a user.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });
      const { token, user } = res.data;

      // ✅ Store login info
      localStorage.setItem("userToken", token);
      localStorage.setItem("userName", user.name);

      // 🔔 Notify Navbar immediately (no refresh needed)
      window.dispatchEvent(new Event("user-login"));

      alert("✅ User login successful!");
      router.push("/cart");
    } catch (err: any) {
      alert(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-96 space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">🔐 User Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Login
        </button>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
