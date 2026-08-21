import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Camera, Download, RotateCcw, X } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { artists, images } from "@/lib/kala-data";

type ArSearch = { art?: string };

export const Route = createFileRoute("/ar")({
  validateSearch: (search: Record<string, unknown>): ArSearch => ({
    art: typeof search.art === "string" ? search.art : undefined,
  }),
  head: () => ({
    meta: [
      { title: "AR Studio — See the Art on Your Wall | Kalakhata" },
      {
        name: "description",
        content:
          "Hold up your camera and place a handmade Indian artwork on your own wall — scale it, frame it, and capture the room before you buy direct from the artist.",
      },
      { property: "og:title", content: "AR Studio — See the Art on Your Wall" },
      {
        property: "og:description",
        content:
          "Place Madhubani, Pattachitra, Warli and more on your wall in augmented reality.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArStudio,
});

const pieces = artists.map((a) => ({
  id: a.id,
  name: a.craft,
  artist: a.name,
  image: a.image,
}));

function ArStudio() {
  const { art } = Route.useSearch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState(
    pieces.find((p) => p.id === art) ?? pieces[0],
  );
  const [pos, setPos] = useState({ x: 50, y: 45 });
  const [scale, setScale] = useState(45);
  const [tilt, setTilt] = useState(0);
  const [framed, setFramed] = useState(true);
  const [shot, setShot] = useState<string | null>(null);
  const dragging = useRef(false);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setLive(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setLive(true);
    } catch {
      setError(
        "Camera access was blocked. Allow the camera in your browser, or open Kalakhata on your phone for the best AR view.",
      );
    }
  };

  const move = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({
      x: Math.min(95, Math.max(5, ((clientX - r.left) / r.width) * 100)),
      y: Math.min(95, Math.max(5, ((clientY - r.top) / r.height) * 100)),
    });
  };

  const capture = async () => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage || !live) return;
    const w = stage.clientWidth;
    const h = stage.clientHeight;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // cover-fit the video frame
    const vr = video.videoWidth / video.videoHeight;
    const sr = w / h;
    let dw = w;
    let dh = h;
    if (vr > sr) dw = h * vr;
    else dh = w / vr;
    ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);

    const img = new Image();
    img.src = selected.image;
    await new Promise((res) => {
      img.onload = res;
      img.onerror = res;
    });
    const aw = (scale / 100) * w;
    const ah = aw * (img.naturalHeight / img.naturalWidth || 1);
    ctx.save();
    ctx.translate((pos.x / 100) * w, (pos.y / 100) * h);
    ctx.rotate((tilt * Math.PI) / 180);
    ctx.shadowColor = "rgba(0,0,0,0.55)";
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 18;
    if (framed) {
      const pad = aw * 0.05;
      ctx.fillStyle = "#141210";
      ctx.fillRect(-aw / 2 - pad, -ah / 2 - pad, aw + pad * 2, ah + pad * 2);
    }
    ctx.shadowColor = "transparent";
    ctx.drawImage(img, -aw / 2, -ah / 2, aw, ah);
    ctx.restore();
    setShot(canvas.toDataURL("image/jpeg", 0.92));
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />

      <section className="px-6 pt-32 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            Augmented reality
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.95] md:text-7xl">
            See the art on your own wall
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Point your camera at a wall, place the piece, scale it to the room and
            capture it. What you see is the artist's actual work — buy it directly
            from them, no middleman.
          </p>
        </div>
      </section>

      <section className="px-6 py-14 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Stage */}
          <div
            ref={stageRef}
            className="relative aspect-[4/5] w-full overflow-hidden border border-border/60 bg-secondary/30 md:aspect-[16/10]"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
              move(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => dragging.current && move(e.clientX, e.clientY)}
            onPointerUp={() => (dragging.current = false)}
            onPointerLeave={() => (dragging.current = false)}
          >
            <video
              ref={videoRef}
              playsInline
              muted
              className={`absolute inset-0 size-full object-cover ${live ? "opacity-100" : "opacity-0"}`}
            />

            {!live && (
              <div className="absolute inset-0 grid place-items-center p-8 text-center">
                <div>
                  <p className="font-display text-3xl">Start the camera</p>
                  <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-muted-foreground">
                    {error ??
                      "Kalakhata will ask for camera permission. Nothing is uploaded — the preview stays on your device."}
                  </p>
                  <button
                    onClick={start}
                    className="mt-6 inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <Camera className="size-4" /> Enable camera
                  </button>
                </div>
              </div>
            )}

            {/* Artwork overlay */}
            <div
              className="pointer-events-none absolute select-none transition-[width] duration-150"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                width: `${scale}%`,
                transform: `translate(-50%, -50%) rotate(${tilt}deg)`,
              }}
            >
              <div
                className={
                  framed
                    ? "bg-[#141210] p-[5%] shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                    : "shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                }
              >
                <img
                  src={selected.image}
                  alt={`${selected.name} artwork by ${selected.artist} previewed in augmented reality`}
                  className="block w-full"
                />
              </div>
            </div>

            {live && (
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                <button
                  onClick={capture}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background"
                >
                  <Camera className="size-4" /> Capture
                </button>
                <button
                  onClick={stop}
                  className="rounded-full border border-border/70 bg-background/70 px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] backdrop-blur"
                >
                  Stop
                </button>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-8 border border-border/60 p-6">
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Choose a piece
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {pieces.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className={`group overflow-hidden border transition-colors ${
                      selected.id === p.id ? "border-copper" : "border-border/60"
                    }`}
                  >
                    <img src={p.image} alt={p.name} className="aspect-square w-full object-cover" />
                    <span className="block px-1 py-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                      {p.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Slider label="Size" value={scale} min={12} max={90} onChange={setScale} />
            <Slider label="Tilt" value={tilt} min={-15} max={15} onChange={setTilt} />

            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                Frame
              </span>
              <button
                onClick={() => setFramed((f) => !f)}
                className="rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-accent"
              >
                {framed ? "On" : "Off"}
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-border/60 pt-6">
              <button
                onClick={() => {
                  setPos({ x: 50, y: 45 });
                  setScale(45);
                  setTilt(0);
                }}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" /> Reset
              </button>
              <Link
                to="/artists/$artistId"
                params={{ artistId: selected.id }}
                className="text-[11px] uppercase tracking-[0.22em] text-copper hover:underline"
              >
                Buy from {selected.artist.split(" ")[0]}
              </Link>
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Tip: drag anywhere on the view to move the artwork. On a phone, hold the
              camera steady and step back until the piece matches your wall.
            </p>
          </div>
        </div>
      </section>

      {shot && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-background/90 p-6 backdrop-blur">
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between pb-4">
              <p className="font-display text-2xl">Your room</p>
              <button onClick={() => setShot(null)} aria-label="Close preview">
                <X className="size-5" />
              </button>
            </div>
            <img src={shot} alt="Captured augmented reality preview of your room" className="w-full border border-border/60" />
            <a
              href={shot}
              download="kalakhata-ar.jpg"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-copper px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-primary-foreground"
            >
              <Download className="size-4" /> Save image
            </a>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        <span>{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 w-full accent-[var(--copper,#b87333)]"
      />
    </div>
  );
}
