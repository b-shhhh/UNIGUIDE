import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "AI University Finder - UniGuide",
  description: "Find your ideal university with modern search, filters, and personalized recommendations.",
  applicationName: "UniGuide",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "UniGuide",
  },
  icons: {
    icon: [
      { url: "/api/pwa-icon/192", sizes: "192x192", type: "image/png" },
      { url: "/api/pwa-icon/512", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0E6F86",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className="bg-white text-[#333333] antialiased">
        {children}
      </body>
    </html>
  );
}
