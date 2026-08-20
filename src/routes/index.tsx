import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { feed, images } from "@/lib/kala-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kalakhata — Indian Ancient Arts, Told by the Artists" },
      {
        name: "description",
        content:
          "A direct platform for India's ancient art forms. Read artists' own stories, explore crafts by region on an interactive map, and buy straight from the maker.",
      },
      { property: "og:title", content: "Kalakhata — Indian Ancient Arts, Told by the Artists" },
      {
        property: "og:description",
        content:
          "Stories, crafts and works from India's traditional artists. No galleries, no middlemen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Hero */}
      <section className="grain relative flex min-h-screen flex-col justify-end overflow-hidden px-6 pb-10 pt-32 md:px-10">
        <div className="mx-auto grid w-full max-w-[1400px] flex-1 grid-cols-12 items-center gap-6">
          <div className="col-span-12 space-y-8 md:col-span-3">
            <p className="reveal max-w-xs text-sm leading-relaxed text-muted-foreground">
              A living ledger of the crafts India has practised for four thousand years —
              written, priced and sold by the artists themselves.
            </p>
            <Link
              to="/explore"
              className="reveal group inline-flex items-center gap-3 text-sm text-foreground"
              style={{ animationDelay: "120ms" }}
            >
              <span className="grid size-10 place-items-center rounded-full border border-border transition-colors group-hover:bg-copper group-hover:text-primary-foreground">
                <ArrowUpRight className="size-4" />
              </span>
              Enter the archive
            </Link>
          </div>

          <div className="col-span-12 md:col-span-6">
            <div className="mask-rise overflow-hidden">
              <img
                src={images.madhubani}
                alt="Detail of a Madhubani painting in copper pigment"
                width={1024}
                height={1280}
                className="aspect-[4/3] w-full object-cover"
                style={{ animation: "slow-zoom 2.4s cubic-bezier(0.22,1,0.36,1) both" }}
              />
            </div>
          </div>

          <div className="col-span-12 hidden gap-4 md:col-span-3 md:grid">
            <img
              src={images.dhokra}
              alt="Dhokra bell metal figurine"
              loading="lazy"
              width={1024}
              height={1024}
              className="mask-rise ml-auto w-32 grayscale transition-all duration-700 hover:grayscale-0"
              style={{ animationDelay: "300ms" }}
            />
            <img
              src={images.bluePottery}
              alt="Jaipur blue pottery vase"
              loading="lazy"
              width={1024}
              height={1024}
              className="mask-rise w-44 grayscale transition-all duration-700 hover:grayscale-0"
              style={{ animationDelay: "450ms" }}
            />
            <span className="flex items-center justify-end gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              Scroll <ArrowDown className="size-3" />
            </span>
          </div>
        </div>

        <h1 className="mask-rise mx-auto mt-10 w-full max-w-[1400px] font-display text-[15vw] leading-[0.82] tracking-tight text-foreground">
          Kala<em className="italic">khata</em>
        </h1>
      </section>

      {/* Feed */}
      <section className="px-6 py-24 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between border-b border-border/60 pb-6">
            <h2 className="font-display text-4xl md:text-6xl">The Feed</h2>
            <p className="max-w-xs text-sm text-muted-foreground">
              Dispatches from workshops, looms and mud walls across the country.
            </p>
          </div>

          <div className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {feed.map((item, i) => (
              <Link
                key={item.id}
                to="/artists/$artistId"
                params={{ artistId: item.artistId }}
                className="hover-lift group block"
              >
                <div className="overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className={`w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 ${
                      i % 3 === 1 ? "aspect-[4/5]" : "aspect-square"
                    }`}
                  />
                </div>
                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-copper">
                      {item.craft}
                    </p>
                    <h3 className="mt-2 font-display text-2xl leading-tight">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{item.blurb}</p>
                    <p className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.place}
                    </p>
                  </div>
                  <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-copper" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map teaser */}
      <section className="border-y border-border/60 px-6 py-24 md:px-10">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-copper">
              Interactive map
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.05] md:text-6xl">
              Touch a place, and the crafts of that soil answer back.
            </h2>
          </div>
          <Link
            to="/map"
            className="group inline-flex items-center gap-3 whitespace-nowrap text-sm"
          >
            <span className="grid size-12 place-items-center rounded-full border border-border transition-colors group-hover:bg-copper group-hover:text-primary-foreground">
              <ArrowUpRight className="size-4" />
            </span>
            Open the map
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
