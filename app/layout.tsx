import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">{children}</body>
    </html>
  );
}
