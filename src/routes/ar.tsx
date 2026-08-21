import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Camera,
  ChevronDown,
  ChevronUp,
  Copy,
  Download,
  Layers,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { artists } from "@/lib/kala-data";

type ArSearch = { art?: string | undefined; mode?: "single" | "gallery" };

export const Route = createFileRoute("/ar")({
  validateSearch: (search: Record<string, unknown>): ArSearch => ({
    art: typeof search["art"] === "string" ? (search["art"] as string) : undefined,
    mode: search["mode"] === "gallery" ? "gallery" : "single",
  }),
  head: () => ({
    meta: [
      { title: "AR Studio — See the Art on Your Wall | Kalakhata" },
      {
        name: "description",
        content:
          "Hold up your camera and place one artwork — or curate a whole wall gallery — directly in your room. Scale, frame and capture before buying direct from the artist.",
      },
      { property: "og:title", content: "AR Studio — See the Art on Your Wall" },
      {
        property: "og:description",
        content:
          "Place Madhubani, Pattachitra, Warli and more on your wall in augmented reality, alone or as a curated gallery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ArStudio,
});

type SourcePiece = {
  id: string;
  name: string;
  artist: string;
  image: string;
};

type PlacedPiece = {
  instanceId: string;
  artistId: string;
  x: number;
  y: number;
  scale: number;
  tilt: number;
  framed: boolean;
  zIndex: number;
};

const sourcePieces: SourcePiece[] = artists.map((a) => ({
  id: a.id,
  name: a.craft,
  artist: a.name,
  image: a.image,
}));

let idCounter = 1;
const nextId = () => String(idCounter++);

function ArStudio() {
  const { art, mode: urlMode } = Route.useSearch();
  const [mode, setMode] = useState<"single" | "gallery">(urlMode);

  const initialArtistId = useMemo(
    () => sourcePieces.find((p) => p.id === art)?.id ?? sourcePieces[0]!.id,
    [art],
  );

  const [placed, setPlaced] = useState<PlacedPiece[]>([
    {
      instanceId: nextId(),
      artistId: initialArtistId,
      x: 50,
      y: 45,
      scale: 45,
      tilt: 0,
      framed: true,
      zIndex: 0,
    },
  ]);
  const [selectedId, setSelectedId] = useState<string>(placed[0]!.instanceId);

  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [live, setLive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shot, setShot] = useState<string | null>(null);

  const selected = useMemo(
    () => placed.find((p) => p.instanceId === selectedId) ?? placed[0] ?? null,
    [placed, selectedId],
  );

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

  const updatePiece = (instanceId: string, updates: Partial<PlacedPiece>) => {
    setPlaced((prev) =>
      prev.map((p) => (p.instanceId === instanceId ? { ...p, ...updates } : p)),
    );
  };

  const addPiece = (artistId: string) => {
    const maxZ = placed.length > 0 ? Math.max(...placed.map((p) => p.zIndex)) : 0;
    const count = placed.length;
    const newPiece: PlacedPiece = {
      instanceId: nextId(),
      artistId,
      x: 50 + (count % 3 - 1) * 8,
      y: 45 + Math.floor(count / 3) * 8,
      scale: 45,
      tilt: 0,
      framed: true,
      zIndex: maxZ + 1,
    };
    setPlaced((prev) => [...prev, newPiece]);
    setSelectedId(newPiece.instanceId);
  };

  const removePiece = (instanceId: string) => {
    setPlaced((prev) => {
      const next = prev.filter((p) => p.instanceId !== instanceId);
      if (next.length === 0) return next;
      if (!next.some((p) => p.instanceId === selectedId)) {
        setSelectedId(next[0]!.instanceId);
      }
      return next;
    });
  };

  const duplicateSelected = () => {
    if (!selected) return;
    const maxZ = placed.length > 0 ? Math.max(...placed.map((p) => p.zIndex)) : 0;
    const copy: PlacedPiece = {
      ...selected,
      instanceId: nextId(),
      x: Math.min(90, selected.x + 6),
      y: Math.min(90, selected.y + 6),
      zIndex: maxZ + 1,
    };
    setPlaced((prev) => [...prev, copy]);
    setSelectedId(copy.instanceId);
  };

  const bringForward = () => {
    if (!selected) return;
    const maxZ = Math.max(...placed.map((p) => p.zIndex));
    updatePiece(selected.instanceId, { zIndex: maxZ + 1 });
  };

  const sendBackward = () => {
    if (!selected) return;
    const minZ = Math.min(...placed.map((p) => p.zIndex));
    updatePiece(selected.instanceId, { zIndex: minZ - 1 });
  };

  const clearWall = () => {
    setPlaced([]);
    setSelectedId("");
  };

  const resetSelected = () => {
    if (!selected) return;
    updatePiece(selected.instanceId, { x: 50, y: 45, scale: 45, tilt: 0 });
  };

  const setSingleArtist = (artistId: string) => {
    if (!selected) return;
    updatePiece(selected.instanceId, { artistId });
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

    const vr = video.videoWidth / video.videoHeight;
    const sr = w / h;
    let dw = w;
    let dh = h;
    if (vr > sr) dw = h * vr;
    else dh = w / vr;
    ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);

    const sorted = [...placed].sort((a, b) => a.zIndex - b.zIndex);
    const imageMap = new Map<string, HTMLImageElement>();
    await Promise.all(
      sorted.map(async (piece) => {
        const source = sourcePieces.find((p) => p.id === piece.artistId);
        if (!source) return;
        if (imageMap.has(source.image)) return;
        const img = new Image();
        img.src = source.image;
        await new Promise<void>((res) => {
          img.onload = () => res();
          img.onerror = () => res();
        });
        if (img.complete && img.naturalWidth > 0) imageMap.set(source.image, img);
      }),
    );

    for (const piece of sorted) {
      const source = sourcePieces.find((p) => p.id === piece.artistId);
      if (!source) continue;
      const img = imageMap.get(source.image);
      if (!img) continue;
      const aw = (piece.scale / 100) * w;
      const ah = aw * (img.naturalHeight / img.naturalWidth || 1);
      ctx.save();
      ctx.translate((piece.x / 100) * w, (piece.y / 100) * h);
      ctx.rotate((piece.tilt * Math.PI) / 180);
      ctx.shadowColor = "rgba(0,0,0,0.55)";
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 18;
      if (piece.framed) {
        const pad = aw * 0.05;
        ctx.fillStyle = "#141210";
        ctx.fillRect(-aw / 2 - pad, -ah / 2 - pad, aw + pad * 2, ah + pad * 2);
      }
      ctx.shadowColor = "transparent";
      ctx.drawImage(img, -aw / 2, -ah / 2, aw, ah);
      ctx.restore();
    }

    setShot(canvas.toDataURL("image/jpeg", 0.92));
  };

  const visiblePieces = mode === "single" ? placed.filter((p) => p.instanceId === selectedId) : placed;

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
            Point your camera at a wall, place one piece or curate a whole gallery, scale each to the
            room and capture it. What you see is the artist's actual work — buy it directly from them,
            no middleman.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setMode("gallery");
                if (placed.length === 0) addPiece(initialArtistId);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-accent"
            >
              <Layers className="size-4" /> Start a wall gallery
            </button>
          </div>
        </div>
      </section>

      <section className="px-6 py-14 md:px-10">
        <div className="mx-auto grid max-w-[1400px] gap-8 lg:grid-cols-[1.6fr_1fr]">
          {/* Stage */}
          <div
            ref={stageRef}
            className="relative aspect-[4/5] w-full overflow-hidden border border-border/60 bg-secondary/30 md:aspect-[16/10]"
            onPointerDown={(e) => {
              if (mode === "gallery" && e.target === e.currentTarget) {
                setSelectedId("");
              }
            }}
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

            {visiblePieces.map((piece) => (
              <ArtworkOverlay
                key={piece.instanceId}
                piece={piece}
                isSelected={piece.instanceId === selectedId}
                stageRef={stageRef}
                draggable={mode === "gallery"}
                onSelect={() => setSelectedId(piece.instanceId)}
                onChange={(updates) => updatePiece(piece.instanceId, updates)}
              />
            ))}

            {mode === "single" && selected && (
              <SingleDragLayer stageRef={stageRef} piece={selected} onChange={updatePiece} />
            )}

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
            <div className="flex gap-1 border border-border/60 p-1">
              <button
                onClick={() => setMode("single")}
                className={`flex-1 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  mode === "single"
                    ? "bg-copper text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Single piece
              </button>
              <button
                onClick={() => {
                  setMode("gallery");
                  if (placed.length === 0) addPiece(initialArtistId);
                }}
                className={`flex-1 py-2 text-[11px] uppercase tracking-[0.18em] transition-colors ${
                  mode === "gallery"
                    ? "bg-copper text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Wall gallery
              </button>
            </div>

            {mode === "single" ? (
              <>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Choose a piece
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {sourcePieces.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSingleArtist(p.id)}
                        className={`group overflow-hidden border transition-colors ${
                          selected?.artistId === p.id ? "border-copper" : "border-border/60"
                        }`}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="aspect-square w-full object-cover"
                        />
                        <span className="block px-1 py-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {selected && (
                  <>
                    <Slider
                      label="Size"
                      value={selected.scale}
                      min={12}
                      max={90}
                      onChange={(v) => updatePiece(selected.instanceId, { scale: v })}
                    />
                    <Slider
                      label="Tilt"
                      value={selected.tilt}
                      min={-15}
                      max={15}
                      onChange={(v) => updatePiece(selected.instanceId, { tilt: v })}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        Frame
                      </span>
                      <button
                        onClick={() => updatePiece(selected.instanceId, { framed: !selected.framed })}
                        className="rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-accent"
                      >
                        {selected.framed ? "On" : "Off"}
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                    Add to wall
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {sourcePieces.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => addPiece(p.id)}
                        className="group overflow-hidden border border-border/60 transition-colors hover:border-copper"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="aspect-square w-full object-cover"
                        />
                        <span className="block px-1 py-2 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                          {p.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      On the wall
                    </p>
                    <button
                      onClick={clearWall}
                      className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      Clear wall
                    </button>
                  </div>
                  {placed.length === 0 ? (
                    <p className="mt-4 text-xs text-muted-foreground">
                      Add artworks above to start building your wall.
                    </p>
                  ) : (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {placed.map((p) => {
                        const source = sourcePieces.find((s) => s.id === p.artistId)!;
                        const isSelected = p.instanceId === selectedId;
                        return (
                          <button
                            key={p.instanceId}
                            onClick={() => setSelectedId(p.instanceId)}
                            className={`relative size-14 overflow-hidden border transition-colors ${
                              isSelected ? "border-copper" : "border-border/60"
                            }`}
                            title={source.name}
                          >
                            <img
                              src={source.image}
                              alt={source.name}
                              className="size-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {selected && (
                  <>
                    <Slider
                      label="Size"
                      value={selected.scale}
                      min={12}
                      max={90}
                      onChange={(v) => updatePiece(selected.instanceId, { scale: v })}
                    />
                    <Slider
                      label="Tilt"
                      value={selected.tilt}
                      min={-15}
                      max={15}
                      onChange={(v) => updatePiece(selected.instanceId, { tilt: v })}
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                        Frame
                      </span>
                      <button
                        onClick={() => updatePiece(selected.instanceId, { framed: !selected.framed })}
                        className="rounded-full border border-border/70 px-4 py-2 text-[11px] uppercase tracking-[0.22em] transition-colors hover:bg-accent"
                      >
                        {selected.framed ? "On" : "Off"}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 border-t border-border/60 pt-6">
                      <button
                        onClick={duplicateSelected}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-accent"
                      >
                        <Copy className="size-3.5" /> Duplicate
                      </button>
                      <button
                        onClick={bringForward}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-accent"
                      >
                        <ChevronUp className="size-3.5" /> Forward
                      </button>
                      <button
                        onClick={sendBackward}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-3 py-2 text-[10px] uppercase tracking-[0.16em] transition-colors hover:bg-accent"
                      >
                        <ChevronDown className="size-3.5" /> Back
                      </button>
                      <button
                        onClick={() => removePiece(selected.instanceId)}
                        className="inline-flex items-center gap-1.5 rounded-full border border-destructive/50 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-destructive transition-colors hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" /> Remove
                      </button>
                    </div>
                  </>
                )}
              </>
            )}

            <div className="flex items-center justify-between border-t border-border/60 pt-6">
              <button
                onClick={resetSelected}
                disabled={!selected}
                className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
              >
                <RotateCcw className="size-3.5" /> Reset
              </button>
              {selected && (
                <Link
                  to="/artists/$artistId"
                  params={{ artistId: selected.artistId }}
                  className="text-[11px] uppercase tracking-[0.22em] text-copper hover:underline"
                >
                  Buy from {sourcePieces.find((p) => p.id === selected.artistId)?.artist.split(" ")[0]}
                </Link>
              )}
            </div>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Tip: {mode === "gallery" ? "tap an artwork to select it, then drag to move." : "drag anywhere on the view to move the artwork."}{" "}
              On a phone, hold the camera steady and step back until the piece matches your wall.
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
            <img
              src={shot}
              alt="Captured augmented reality preview of your room"
              className="w-full border border-border/60"
            />
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

function ArtworkOverlay({
  piece,
  isSelected,
  stageRef,
  draggable,
  onSelect,
  onChange,
}: {
  piece: PlacedPiece;
  isSelected: boolean;
  stageRef: React.RefObject<HTMLDivElement | null>;
  draggable: boolean;
  onSelect: () => void;
  onChange: (updates: Partial<PlacedPiece>) => void;
}) {
  const source = sourcePieces.find((p) => p.id === piece.artistId)!;
  const dragging = useRef(false);

  const move = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onChange({
      x: Math.min(95, Math.max(5, ((clientX - r.left) / r.width) * 100)),
      y: Math.min(95, Math.max(5, ((clientY - r.top) / r.height) * 100)),
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    move(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggable || !dragging.current) return;
    e.preventDefault();
    move(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  return (
    <div
      className={`absolute select-none transition-[width] duration-150 ${
        isSelected ? "ring-2 ring-copper ring-offset-2 ring-offset-background/50" : ""
      } ${draggable ? "cursor-move" : "pointer-events-none"}`}
      style={{
        left: `${piece.x}%`,
        top: `${piece.y}%`,
        width: `${piece.scale}%`,
        transform: `translate(-50%, -50%) rotate(${piece.tilt}deg)`,
        zIndex: piece.zIndex,
        touchAction: draggable ? "none" : "auto",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <div
        className={
          piece.framed
            ? "bg-[#141210] p-[5%] shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
            : "shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
        }
      >
        <img
          src={source.image}
          alt={`${source.name} artwork by ${source.artist} previewed in augmented reality`}
          className="block w-full"
          draggable={false}
        />
      </div>
    </div>
  );
}

function SingleDragLayer({
  stageRef,
  piece,
  onChange,
}: {
  stageRef: React.RefObject<HTMLDivElement | null>;
  piece: PlacedPiece;
  onChange: (instanceId: string, updates: Partial<PlacedPiece>) => void;
}) {
  const dragging = useRef(false);

  const move = (clientX: number, clientY: number) => {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    onChange(piece.instanceId, {
      x: Math.min(95, Math.max(5, ((clientX - r.left) / r.width) * 100)),
      y: Math.min(95, Math.max(5, ((clientY - r.top) / r.height) * 100)),
    });
  };

  return (
    <div
      className="absolute inset-0"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as Element).setPointerCapture?.(e.pointerId);
        move(e.clientX, e.clientY);
      }}
      onPointerMove={(e) => dragging.current && move(e.clientX, e.clientY)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    />
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
