export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-6 py-12 md:px-10">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="font-display text-3xl leading-none text-foreground">Kalakhata</p>
        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          A ledger of Indian ancient art. Artists write their own pages, set their own
          prices, and are paid in full. No middlemen, no galleries, no commission.
        </p>
      </div>
    </footer>
  );
}
