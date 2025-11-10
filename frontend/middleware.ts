import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 🔹 Protected admin routes
const protectedAdminRoutes = ["/admin/dashboard", "/admin/products"];

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = req.cookies.get("adminToken")?.value || null;

  // Check if route starts with /admin and is protected
  if (protectedAdminRoutes.some((r) => url.pathname.startsWith(r))) {
    if (!token) {
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  // ✅ Allow access
  return NextResponse.next();
}

// 🔧 Define routes where middleware will run
export const config = {
  matcher: ["/admin/:path*"], // applies to all admin pages
};
