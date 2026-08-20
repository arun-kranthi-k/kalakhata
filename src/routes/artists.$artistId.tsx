import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getArtist } from "@/lib/kala-data";

export const Route = createFileRoute("/artists/$artistId")({
  loader: ({ params }) => {
    const artist = getArtist(params.artistId);
    if (!artist) throw notFound();
    return artist;
  },
  head: ({ loaderData }) => {
    const title = loaderData
      ? `${loaderData.name} — ${loaderData.craft} · Kalakhata`
      : "Artist — Kalakhata";
    const description = loaderData
      ? `${loaderData.name}, ${loaderData.generations} ${loaderData.craft} artist from ${loaderData.place}. Read the story and buy directly.`
      : "An artist on Kalakhata.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "profile" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ArtistPage,
});

function ArtistPage() {
  const artist = Route.useLoaderData();
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <section className="px-6 pb-16 pt-32 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3" /> All artists
          </Link>

          <div className="mt-10 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="mask-rise overflow-hidden">
              <img
                src={artist.image}
                alt={`${artist.name}, ${artist.craft} artist`}
                width={1024}
                height={1280}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-copper">
                {artist.craft} · {artist.generations}
              </p>
              <h1 className="mt-4 font-display text-6xl leading-[0.9] md:text-8xl">
                {artist.name}
              </h1>
              <p className="mt-4 text-sm uppercase tracking-[0.18em] text-muted-foreground">
                {artist.place}
              </p>

              <blockquote className="mt-10 border-l border-copper pl-6 font-display text-3xl italic leading-snug md:text-4xl">
                “{artist.quote}”
              </blockquote>

              <div className="mt-10 space-y-5 text-base leading-relaxed text-muted-foreground">
                {artist.story.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Works */}
      <section className="border-t border-border/60 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex items-end justify-between border-b border-border/60 pb-6">
            <h2 className="font-display text-4xl md:text-5xl">Works for sale</h2>
            <p className="max-w-xs text-right text-xs uppercase tracking-[0.18em] text-muted-foreground">
              100% to the artist
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {artist.products.map((p) => (
              <div
                key={p.name}
                className="hover-lift flex flex-col justify-between border border-border/60 p-6"
              >
                <div>
                  <h3 className="font-display text-3xl leading-tight">{p.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{p.detail}</p>
                </div>
                <div className="mt-8 flex items-center justify-between">
                  <span className="font-display text-2xl text-copper">{p.price}</span>
                  <button className="rounded-full border border-border px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-copper hover:text-primary-foreground">
                    Buy direct
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct message */}
      <section className="border-t border-border/60 px-6 py-20 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-display text-4xl leading-tight md:text-5xl">
              Write to {artist.name.split(" ")[0]} directly
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              Commissions, sizes, timelines, or just a question about the craft. Messages
              go straight to the artist — nobody reads them in between.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
              setMessage("");
            }}
            className="space-y-4"
          >
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Namaste — I'd like to ask about…"
              className="w-full border border-border bg-transparent p-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-copper"
            />
            <button
              type="submit"
              className="rounded-full border border-copper bg-copper px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Send message
            </button>
            {sent && (
              <p className="flex items-center gap-2 text-sm text-copper">
                <Check className="size-4" /> Sent to {artist.name}. Replies usually come
                within two days.
              </p>
            )}
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
