import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/app/context/ThemeContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fullstack Project",
  description: "News + E-commerce + Booking platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Navbar />
          <main className="container mx-auto p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
