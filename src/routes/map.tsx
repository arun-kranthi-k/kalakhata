import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { regions, artists } from "@/lib/kala-data";
import indiaMap from "@/assets/india-map.png.asset.json";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Interactive Map of Indian Art Forms — Kalakhata" },
      {
        name: "description",
        content:
          "Click any region of India to see the ancient art forms practised there, and the artists keeping them alive.",
      },
      { property: "og:title", content: "Interactive Map of Indian Art Forms — Kalakhata" },
      {
        property: "og:description",
        content: "Click a region of India to reveal its ancient crafts and living artists.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage;
});

function MapPage() {
  return null;
}
