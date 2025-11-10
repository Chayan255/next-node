"use client";
import Link from "next/link";
import { useTheme } from "@/app/context/ThemeContext";
import { FaSun, FaMoon, FaShoppingCart, FaUserCircle, FaUserShield } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { HiMenu, HiX } from "react-icons/hi";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔹 Detect click outside dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 Sync user & admin login/logout instantly
  useEffect(() => {
    const loadData = () => {
      setUserName(localStorage.getItem("userName"));
      setAdminName(localStorage.getItem("adminName"));
    };

    loadData();

    window.addEventListener("user-login", loadData);
    window.addEventListener("user-logout", loadData);
    window.addEventListener("admin-login", loadData);
    window.addEventListener("admin-logout", loadData);

    return () => {
      window.removeEventListener("user-login", loadData);
      window.removeEventListener("user-logout", loadData);
      window.removeEventListener("admin-login", loadData);
      window.removeEventListener("admin-logout", loadData);
    };
  }, []);

  // 🔹 Prevent both being logged in at once
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    if (adminToken && userToken) {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      alert("⚠️ Session conflict fixed. Please login again.");
      router.replace("/login");
    }
  }, []);

  // 🔹 Logout handler (for both user & admin)
  const handleLogout = (type: "user" | "admin") => {
    if (type === "user") {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userName");
      window.dispatchEvent(new Event("user-logout"));
      setUserName(null);
      alert("👋 User logged out!");
      router.push("/");
    } else {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminName");
      window.dispatchEvent(new Event("admin-logout"));
      setAdminName(null);
      alert("👋 Admin logged out!");
      router.push("/admin/login");
    }
    setDropdownOpen(false);
  };

  // Navigation links
  const navItems = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: "Products", href: "/products" },
    { label: "Cart", href: "/cart", icon: <FaShoppingCart /> },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      } shadow-md`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-blue-600 dark:text-blue-400">Softa</span>Technologies
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all duration-200 ${
                pathname === item.href
                  ? "text-blue-600 dark:text-blue-400 font-semibold"
                  : "hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {item.icon && <span>{item.icon}</span>}
              {item.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-110 transition-transform"
          >
            {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon />}
          </button>

          {/* User/Admin Dropdown */}
          {(userName || adminName) ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {adminName ? (
                  <>
                    <FaUserShield size={20} className="text-yellow-500" />
                    <span className="font-medium">{adminName.split(" ")[0]}</span>
                  </>
                ) : (
                  <>
                    <FaUserCircle size={20} />
                    <span className="font-medium">{userName?.split(" ")[0]}</span>
                  </>
                )}
              </button>

              {dropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-44 rounded-lg shadow-lg border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {adminName ? (
                    <>
                      <Link
                        href="/admin/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🏠 Dashboard
                      </Link>
                      <Link
                        href="/admin/products"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        📦 Manage Products
                      </Link>
                      <button
                        onClick={() => handleLogout("admin")}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        🚪 Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        👤 Profile
                      </Link>
                      <Link
                        href="/cart"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        🛍️ My Orders
                      </Link>
                      <button
                        onClick={() => handleLogout("user")}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        🚪 Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                href="/admin/login"
                className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition"
              >
                Admin Login
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>
      </div>
    </nav>
  );
}
