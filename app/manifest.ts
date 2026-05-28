import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Autarkeia",
    short_name: "Autarkeia",
    description:
      "Global emergency readiness and self-sufficiency platform helping you live on your own terms.",
    start_url: "/",
    display: "standalone",
    theme_color: "#0d1b2a",
    background_color: "#0d1b2a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}
