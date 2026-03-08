import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UniGuide",
    short_name: "UniGuide",
    description: "Find your ideal university with modern search, filters, and personalized recommendations.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0E6F86",
    icons: [
      {
        src: "/api/pwa-icon/192",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/api/pwa-icon/512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
