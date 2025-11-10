"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"checking" | "authorized" | "unauthorized">("checking");

  // 🧠 List of routes that DON'T need protection
  const publicPaths = ["/admin/login"];

  useEffect(() => {
    // If current path is public, don’t check token
    if (publicPaths.includes(pathname)) {
      setStatus("authorized");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

    if (!token) {
      setStatus("unauthorized");
      router.replace("/admin/login");
    } else {
      setStatus("authorized");
    }
  }, [pathname, router]);

  const menu = [
    { label: "🏠 Dashboard", href: "/admin/dashboard" },
    { label: "🛍️ Products", href: "/admin/products" },
  ];

  const logout = () => {
    localStorage.removeItem("adminToken");
    setStatus("unauthorized");
    router.replace("/admin/login");
  };

  // 🕓 Show loading or redirecting message
  if (status === "checking" || status === "unauthorized") {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600 dark:text-gray-300">
        {status === "checking"
          ? "Checking admin access..."
          : "Redirecting to admin login..."}
      </div>
    );
  }

  // ✅ Allow normal layout rendering for protected routes or public login
  if (publicPaths.includes(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col justify-between">
        <div>
          <h2 className="text-2xl font-bold text-center py-6 border-b border-gray-200 dark:border-gray-700">
            ⚙️ Admin Panel
          </h2>
          <nav className="mt-4 space-y-2 px-4">
            {menu.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-3 py-2 rounded-md transition ${
                  pathname === item.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded"
          >
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Logged in as <strong>Admin</strong>
          </span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
