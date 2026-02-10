// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "UniGuide",
  description: "UniGuide - Register/Login",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white">
        {children}
      </body>
    </html>
  );
}
