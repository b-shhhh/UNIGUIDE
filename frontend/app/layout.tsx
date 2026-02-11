// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "AI University Finder - UniGuide",
  description: "Find your ideal university with modern search, filters, and personalized recommendations.",
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
