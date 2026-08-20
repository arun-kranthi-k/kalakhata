import { Link } from "@tanstack/react-router";

const links = [
  { to: "/", label: "Feed" },
  { to: "/explore", label: "Explore" },
  { to: "/map", label: "Map" },
];

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-10">
        <nav className="flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              className="transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-full border border-border/70 font-display text-sm text-foreground">
            क
          </span>
          <span className="hidden font-display text-lg tracking-wide text-foreground sm:block">
            Kalakhata
          </span>
        </Link>

        <Link
          to="/explore"
          className="rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-accent"
        >
          Meet an artist
        </Link>
      </div>
    </header>
  );
}
