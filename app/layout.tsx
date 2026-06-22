import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/Context/AuthContext";
export const metadata: Metadata = {
  title: "Rush Launch",
  description: "Next.js app with Bun and SQLite",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
