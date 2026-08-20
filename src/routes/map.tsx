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
  component: MapPage,
});

function MapPage() {
  const [activeId, setActiveId] = useState<string>("bihar");
  const active = regions.find((r) => r.id === activeId)!;
  const localArtists = artists.filter((a) => a.region === active.id);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="px-6 pb-20 pt-32 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Map */}
          <div className="grain relative">
            <div className="relative mx-auto w-full max-w-[640px]">
              <img
                src={indiaMap.url}
                alt="Outline map of India"
                className="w-full select-none opacity-70"
                draggable={false}
              />
              {regions.map((r) => {
                const isActive = r.id === activeId;
                return (
                  <button
                    key={r.id}
                    onClick={() => setActiveId(r.id)}
                    aria-label={r.name}
                    className="group absolute -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${r.x}%`, top: `${r.y}%` }}
                  >
                    <span className="relative grid place-items-center">
                      {isActive && (
                        <span
                          className="absolute size-3 rounded-full bg-copper"
                          style={{ animation: "pulse-ring 2s ease-out infinite" }}
                        />
                      )}
                      <span
                        className={`size-2.5 rounded-full transition-all duration-500 ${
                          isActive
                            ? "scale-150 bg-copper"
                            : "bg-muted-foreground group-hover:scale-150 group-hover:bg-copper-glow"
                        }`}
                      />
                    </span>
                    <span
                      className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[10px] uppercase tracking-[0.18em] transition-opacity duration-300 ${
                        isActive
                          ? "text-copper opacity-100"
                          : "text-muted-foreground opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {r.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel */}
          <div className="lg:pt-10">
            <p className="text-[11px] uppercase tracking-[0.22em] text-copper">
              Interactive map · {regions.length} regions
            </p>

            <div key={active.id} className="reveal">
              <h1 className="mt-4 font-display text-5xl leading-[0.95] md:text-7xl">
                {active.name}
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                {active.note}
              </p>

              <ul className="mt-10 divide-y divide-border/60 border-y border-border/60">
                {active.forms.map((f) => (
                  <li
                    key={f}
                    className="py-4 font-display text-2xl transition-colors hover:text-copper"
                  >
                    {f}
                  </li>
                ))}
              </ul>

              {localArtists.length > 0 && (
                <div className="mt-10">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Artists here
                  </p>
                  <div className="mt-4 space-y-3">
                    {localArtists.map((a) => (
                      <Link
                        key={a.id}
                        to="/artists/$artistId"
                        params={{ artistId: a.id }}
                        className="group flex items-center gap-4 border border-border/60 p-3 transition-colors hover:bg-accent/40"
                      >
                        <img
                          src={a.image}
                          alt={a.name}
                          loading="lazy"
                          width={1024}
                          height={1024}
                          className="size-14 object-cover"
                        />
                        <span className="flex-1">
                          <span className="block font-display text-xl">{a.name}</span>
                          <span className="block text-xs uppercase tracking-[0.18em] text-muted-foreground">
                            {a.craft}
                          </span>
                        </span>
                        <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-copper" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
