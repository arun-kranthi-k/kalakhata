import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { artists } from "@/lib/kala-data";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Artists & Crafts — Kalakhata" },
      {
        name: "description",
        content:
          "Search India's traditional artists by craft, region or name. Read their stories and buy their work directly.",
      },
      { property: "og:title", content: "Explore Artists & Crafts — Kalakhata" },
      {
        property: "og:description",
        content: "Search India's traditional artists by craft, region or name.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Explore,
});

const filters = ["All", "Painting", "Textile", "Metal", "Clay"] as const;

const bucket: Record<string, string> = {
  Madhubani: "Painting",
  Pattachitra: "Painting",
  Warli: "Painting",
  Dhokra: "Metal",
  "Blue Pottery": "Clay",
  "Banarasi Weaving": "Textile",
};

function Explore() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string>("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return artists.filter((a) => {
      const inFilter = active === "All" || bucket[a.craft] === active;
      const inQuery =
        !q ||
        [a.name, a.craft, a.place, a.quote].some((f) => f.toLowerCase().includes(q));
      return inFilter && inQuery;
    });
  }, [query, active]);

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="px-6 pb-16 pt-36 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <h1 className="reveal font-display text-6xl leading-[0.9] md:text-8xl">
            Search the <em className="italic">khata</em>
          </h1>

          <div className="reveal mt-12 flex items-center gap-4 border-b border-border pb-4">
            <Search className="size-5 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'Madhubani', 'Varanasi', 'bronze'…"
              className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-muted-foreground md:text-3xl"
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                  active === f
                    ? "border-copper bg-copper text-primary-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            {results.length} artist{results.length === 1 ? "" : "s"}
          </p>

          <div className="mt-10 divide-y divide-border/60 border-y border-border/60">
            {results.map((a) => (
              <Link
                key={a.id}
                to="/artists/$artistId"
                params={{ artistId: a.id }}
                className="group grid grid-cols-12 items-center gap-4 py-6 transition-colors hover:bg-accent/40"
              >
                <div className="col-span-3 sm:col-span-2">
                  <img
                    src={a.image}
                    alt={a.craft}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="aspect-square w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                </div>
                <div className="col-span-6 sm:col-span-4">
                  <h2 className="font-display text-3xl leading-tight">{a.name}</h2>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.22em] text-copper">
                    {a.craft}
                  </p>
                </div>
                <p className="col-span-3 hidden text-sm text-muted-foreground sm:block">
                  {a.place}
                </p>
                <p className="col-span-2 hidden text-sm text-muted-foreground lg:block">
                  {a.generations}
                </p>
                <div className="col-span-3 flex justify-end sm:col-span-1">
                  <ArrowUpRight className="size-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-copper" />
                </div>
              </Link>
            ))}
            {results.length === 0 && (
              <p className="py-16 text-center font-display text-2xl text-muted-foreground">
                No entry in the khata for that yet.
              </p>
            )}
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
