"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, RotateCcw, Search } from "lucide-react";
import { atlasClusters, atlasFamilies, atlasProjects, type AtlasFamily } from "@/content/site";
import { createRandom } from "@/components/three/shapes";
import styles from "./SkillAtlas.module.scss";

type AtlasPoint = {
  x: number;
  y: number;
  label: string;
  cluster: string;
  family: AtlasFamily;
  kind: "item" | "project";
  slug?: string;
};
type Dust = { x: number; y: number; family: AtlasFamily };
type View = { zoom: number; cx: number; cy: number };

const FAMILIES = Object.keys(atlasFamilies) as AtlasFamily[];
const MIN_ZOOM = 1;
const MAX_ZOOM = 6;
const LABEL_ZOOM = 1.7;
const HIT_RADIUS = 16;
const START_VIEW: View = { zoom: 1, cx: 0.05, cy: 0 };

// --- Data: labelled points, faint neighbourhood dots and density contours (computed once) ---

const buildAtlas = () => {
  const random = createRandom(11);
  const gaussian = () => {
    const u = Math.max(random(), 1e-6);
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * random());
  };

  const points: AtlasPoint[] = [];
  for (const cluster of atlasClusters) {
    cluster.items.forEach((label, index) => {
      const angle = index * 2.39996 + random() * 0.4; // golden-angle spread around the cluster centre
      const radius = 0.05 + Math.sqrt((index + 1) / cluster.items.length) * 0.13;
      points.push({
        x: cluster.x + Math.cos(angle) * radius,
        y: cluster.y + Math.sin(angle) * radius,
        label,
        cluster: cluster.label,
        family: cluster.family,
        kind: "item",
      });
    });
  }
  for (const project of atlasProjects) {
    points.push({ ...project, cluster: "Case study", kind: "project" });
  }

  const dust: Dust[] = [];
  for (const point of points) {
    const amount = point.kind === "project" ? 34 : 22;
    for (let i = 0; i < amount; i += 1) {
      dust.push({ x: point.x + gaussian() * 0.055, y: point.y + gaussian() * 0.055, family: point.family });
    }
  }

  // Kernel density on a grid, then marching squares for a few contour levels
  const cols = 140;
  const rows = 100;
  const bounds = { x0: -1.15, x1: 1.15, y0: -1, y1: 1 };
  const density = new Float32Array(cols * rows);
  // Fast kernel density: splat every sample into the grid, then apply a separable Gaussian blur
  const bandwidth = 0.075;
  const cellX = (bounds.x1 - bounds.x0) / (cols - 1);
  const cellY = (bounds.y1 - bounds.y0) / (rows - 1);
  for (const sample of [...points, ...dust]) {
    const c = Math.round((sample.x - bounds.x0) / cellX);
    const r = Math.round((sample.y - bounds.y0) / cellY);
    if (c >= 0 && c < cols && r >= 0 && r < rows) density[r * cols + c] += 1;
  }
  const blur = (sigmaCells: number, horizontal: boolean) => {
    const radius = Math.ceil(sigmaCells * 3);
    const kernel = Array.from({ length: radius * 2 + 1 }, (_, i) => Math.exp(-0.5 * ((i - radius) / sigmaCells) ** 2));
    const source = density.slice();
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        let sum = 0;
        for (let k = -radius; k <= radius; k += 1) {
          const cc = horizontal ? c + k : c;
          const rr = horizontal ? r : r + k;
          if (cc < 0 || cc >= cols || rr < 0 || rr >= rows) continue;
          sum += source[rr * cols + cc] * kernel[k + radius];
        }
        density[r * cols + c] = sum;
      }
    }
  };
  blur(bandwidth / cellX, true);
  blur(bandwidth / cellY, false);
  const peak = density.reduce((max, value) => Math.max(max, value), 0);
  const contours: Array<[number, number, number, number]> = [];
  for (const level of [0.08, 0.2, 0.38, 0.6].map((f) => f * peak)) {
    for (let r = 0; r < rows - 1; r += 1) {
      for (let c = 0; c < cols - 1; c += 1) {
        const v = [density[r * cols + c], density[r * cols + c + 1], density[(r + 1) * cols + c + 1], density[(r + 1) * cols + c]];
        const corner = (i: number) => {
          const cc = c + (i === 1 || i === 2 ? 1 : 0);
          const rr = r + (i >= 2 ? 1 : 0);
          return [bounds.x0 + ((bounds.x1 - bounds.x0) * cc) / (cols - 1), bounds.y0 + ((bounds.y1 - bounds.y0) * rr) / (rows - 1)];
        };
        const crossings: number[][] = [];
        for (let e = 0; e < 4; e += 1) {
          const a = v[e];
          const b = v[(e + 1) % 4];
          if ((a < level) === (b < level)) continue;
          const t = (level - a) / (b - a);
          const pa = corner(e);
          const pb = corner((e + 1) % 4);
          crossings.push([pa[0] + (pb[0] - pa[0]) * t, pa[1] + (pb[1] - pa[1]) * t]);
        }
        if (crossings.length >= 2) contours.push([crossings[0][0], crossings[0][1], crossings[1][0], crossings[1][1]]);
        if (crossings.length === 4) contours.push([crossings[2][0], crossings[2][1], crossings[3][0], crossings[3][1]]);
      }
    }
  }
  return { points, dust, contours };
};

type AtlasData = ReturnType<typeof buildAtlas>;
const EMPTY_ATLAS: AtlasData = { points: [], dust: [], contours: [] };

const nearestNeighbours = (points: AtlasPoint[], target: AtlasPoint, count: number) =>
  points
    .filter((p) => p !== target)
    .map((p) => ({ p, d: Math.hypot(p.x - target.x, p.y - target.y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, count)
    .map((entry) => entry.p);

export const SkillAtlas = () => {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [atlas, setAtlas] = useState<AtlasData>(EMPTY_ATLAS);
  const viewRef = useRef<View>({ ...START_VIEW });
  const frameRef = useRef(0);
  const [hidden, setHidden] = useState<Set<AtlasFamily>>(new Set());
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<AtlasPoint | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number } | null>(null);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return new Set(atlas.points.filter((p) => p.label.toLowerCase().includes(q) || p.cluster.toLowerCase().includes(q)));
  }, [atlas.points, query]);

  const toScreen = useCallback((x: number, y: number, width: number, height: number) => {
    const { zoom, cx, cy } = viewRef.current;
    const k = Math.min(width / 2.4, height / 2.1) * zoom;
    return [(x - cx) * k + width / 2, -(y - cy) * k + height / 2] as const;
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (canvas.width !== Math.round(width * dpr) || canvas.height !== Math.round(height * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);
    const css = getComputedStyle(document.documentElement);
    const text = css.getPropertyValue("--text").trim() || "#edebe6";
    const muted = css.getPropertyValue("--text-muted").trim() || "#9a9aa3";
    const monoFont = css.getPropertyValue("--font-jetbrains").trim() || "ui-monospace, monospace";
    const bodyFont = css.getPropertyValue("--font-dmsans").trim() || "system-ui, sans-serif";
    const surface = "#0c0d14";
    const zoom = viewRef.current.zoom;
    const visible = (family: AtlasFamily) => !hidden.has(family);
    const lit = (point: AtlasPoint) => (matches ? matches.has(point) : true);

    // Density glow per labelled point
    context.globalCompositeOperation = "lighter";
    for (const point of atlas.points) {
      if (!visible(point.family)) continue;
      const [sx, sy] = toScreen(point.x, point.y, width, height);
      const radius = 46 * Math.sqrt(zoom);
      const glow = context.createRadialGradient(sx, sy, 0, sx, sy, radius);
      glow.addColorStop(0, `${atlasFamilies[point.family].color}26`);
      glow.addColorStop(1, `${atlasFamilies[point.family].color}00`);
      context.fillStyle = glow;
      context.fillRect(sx - radius, sy - radius, radius * 2, radius * 2);
    }
    context.globalCompositeOperation = "source-over";

    // Density contours
    context.strokeStyle = "rgba(255, 255, 255, 0.12)";
    context.lineWidth = 1;
    context.beginPath();
    for (const [x1, y1, x2, y2] of atlas.contours) {
      const [a, b] = toScreen(x1, y1, width, height);
      const [c, d] = toScreen(x2, y2, width, height);
      context.moveTo(a, b);
      context.lineTo(c, d);
    }
    context.stroke();

    // Neighbourhood dots
    for (const dot of atlas.dust) {
      const [sx, sy] = toScreen(dot.x, dot.y, width, height);
      if (sx < -4 || sy < -4 || sx > width + 4 || sy > height + 4) continue;
      context.globalAlpha = visible(dot.family) ? (matches ? 0.12 : 0.4) : 0.05;
      context.fillStyle = atlasFamilies[dot.family].color;
      context.fillRect(sx - 0.9, sy - 0.9, 1.8, 1.8);
    }
    context.globalAlpha = 1;

    // Lines to the nearest neighbours of the hovered point
    if (hovered) {
      const [hx, hy] = toScreen(hovered.x, hovered.y, width, height);
      context.setLineDash([3, 4]);
      context.strokeStyle = "rgba(255, 255, 255, 0.45)";
      for (const neighbour of nearestNeighbours(atlas.points, hovered, 3)) {
        const [nx, ny] = toScreen(neighbour.x, neighbour.y, width, height);
        context.beginPath();
        context.moveTo(hx, hy);
        context.lineTo(nx, ny);
        context.stroke();
      }
      context.setLineDash([]);
    }

    // Labelled points: skills (r 4) and projects (r 7, white ring), each with a surface ring
    for (const point of atlas.points) {
      const [sx, sy] = toScreen(point.x, point.y, width, height);
      const on = visible(point.family);
      context.globalAlpha = !on ? 0.12 : lit(point) ? 1 : 0.25;
      const radius = point.kind === "project" ? 7 : point.family === "exploring" ? 4.5 : 4;
      context.beginPath();
      context.arc(sx, sy, radius + 2, 0, Math.PI * 2);
      context.fillStyle = surface;
      context.fill();
      context.beginPath();
      context.arc(sx, sy, radius, 0, Math.PI * 2);
      if (point.family === "exploring") {
        context.strokeStyle = atlasFamilies.exploring.color;
        context.setLineDash([2, 2]);
        context.lineWidth = 1.5;
        context.stroke();
        context.setLineDash([]);
      } else {
        context.fillStyle = atlasFamilies[point.family].color;
        context.fill();
      }
      if (point.kind === "project" || point === hovered) {
        context.lineWidth = 2;
        context.strokeStyle = point === hovered ? text : "rgba(255, 255, 255, 0.85)";
        context.stroke();
      }
    }
    context.globalAlpha = 1;

    // Labels: cluster names always; projects always; skills when zoomed in, searched or hovered
    context.textBaseline = "middle";
    context.font = `500 11px ${monoFont}`;
    context.textAlign = "center";
    for (const cluster of atlasClusters) {
      if (!visible(cluster.family)) continue;
      const [sx, sy] = toScreen(cluster.x, cluster.y + 0.24, width, height);
      context.fillStyle = muted;
      context.fillText(cluster.label.toUpperCase(), sx, sy);
    }
    context.textAlign = "left";
    for (const point of atlas.points) {
      if (!visible(point.family)) continue;
      const show = point.kind === "project" || zoom >= LABEL_ZOOM || point === hovered || (matches?.has(point) ?? false);
      if (!show) continue;
      const [sx, sy] = toScreen(point.x, point.y, width, height);
      context.font = point.kind === "project" ? `600 12px ${bodyFont}` : `12px ${bodyFont}`;
      context.lineWidth = 4;
      context.strokeStyle = "rgba(8, 9, 14, 0.9)";
      context.strokeText(point.label, sx + 10, sy);
      context.fillStyle = point.kind === "project" ? text : muted;
      context.fillText(point.label, sx + 10, sy);
    }
  }, [atlas, hidden, hovered, matches, toScreen]);

  const requestDraw = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(draw);
  }, [draw]);

  useEffect(() => {
    requestDraw();
  }, [requestDraw]);

  // Build the map only when it is about to scroll into view, and only while the browser is idle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let idleId: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const build = () => setAtlas(buildAtlas());
        if (typeof window.requestIdleCallback === "function") idleId = window.requestIdleCallback(build, { timeout: 800 });
        else build();
      },
      { rootMargin: "800px 0px" },
    );
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new ResizeObserver(requestDraw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [requestDraw]);

  const zoomAt = useCallback(
    (factor: number, sx?: number, sy?: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const view = viewRef.current;
      const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, view.zoom * factor));
      const px = sx ?? width / 2;
      const py = sy ?? height / 2;
      // Keep the point under the cursor fixed while zooming
      const k = Math.min(width / 2.4, height / 2.1);
      const wx = view.cx + (px - width / 2) / (k * view.zoom);
      const wy = view.cy - (py - height / 2) / (k * view.zoom);
      view.cx = wx - (px - width / 2) / (k * next);
      view.cy = wy + (py - height / 2) / (k * next);
      view.zoom = next;
      requestDraw();
    },
    [requestDraw],
  );

  // Pointer: hover, drag to pan, pinch to zoom, click a project to open it
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const pointers = new Map<number, { x: number; y: number }>();
    let moved = 0;
    let pinchDistance = 0;

    const local = (event: PointerEvent | WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const pick = (x: number, y: number) => {
      let best: AtlasPoint | null = null;
      let bestDistance = HIT_RADIUS;
      for (const point of atlas.points) {
        if (hidden.has(point.family)) continue;
        const [sx, sy] = toScreen(point.x, point.y, canvas.clientWidth, canvas.clientHeight);
        const d = Math.hypot(sx - x, sy - y);
        if (d < bestDistance) {
          best = point;
          bestDistance = d;
        }
      }
      return best;
    };

    const onDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, local(event));
      moved = 0;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDistance = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };
    const onMove = (event: PointerEvent) => {
      const point = local(event);
      const previous = pointers.get(event.pointerId);
      if (previous) {
        pointers.set(event.pointerId, point);
        if (pointers.size === 2) {
          const [a, b] = [...pointers.values()];
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (pinchDistance > 0) zoomAt(distance / pinchDistance, (a.x + b.x) / 2, (a.y + b.y) / 2);
          pinchDistance = distance;
          return;
        }
        const dx = point.x - previous.x;
        const dy = point.y - previous.y;
        moved += Math.abs(dx) + Math.abs(dy);
        const view = viewRef.current;
        const k = Math.min(canvas.clientWidth / 2.4, canvas.clientHeight / 2.1) * view.zoom;
        view.cx -= dx / k;
        view.cy += dy / k;
        requestDraw();
        return;
      }
      const hit = pick(point.x, point.y);
      setHovered(hit);
      setTooltip(hit ? point : null);
      canvas.style.cursor = hit?.kind === "project" ? "pointer" : hit ? "help" : "grab";
    };
    const onUp = (event: PointerEvent) => {
      pointers.delete(event.pointerId);
      if (pointers.size < 2) pinchDistance = 0;
      if (moved < 5) {
        const point = local(event);
        const hit = pick(point.x, point.y);
        if (hit?.slug) router.push(`/work/${hit.slug}`);
      }
    };
    const onLeave = () => {
      setHovered(null);
      setTooltip(null);
    };
    // Plain wheel scrolls the page; Ctrl/⌘ + wheel (and trackpad pinch) zooms the map
    const onWheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      const point = local(event);
      zoomAt(Math.exp(-event.deltaY * 0.004), point.x, point.y);
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [atlas.points, hidden, requestDraw, router, toScreen, zoomAt]);

  const toggleFamily = (family: AtlasFamily) =>
    setHidden((previous) => {
      const next = new Set(previous);
      if (next.has(family)) next.delete(family);
      else next.add(family);
      return next;
    });

  const reset = () => {
    viewRef.current = { ...START_VIEW };
    requestDraw();
  };

  return (
    <div className={styles.atlas} data-reveal>
      <div className={styles.toolbar}>
        <div className={styles.legend} role="group" aria-label="Show or hide skill families">
          {FAMILIES.map((family) => (
            <button
              key={family}
              type="button"
              className={styles.chip}
              aria-pressed={!hidden.has(family)}
              onClick={() => toggleFamily(family)}
            >
              <span
                className={styles.swatch}
                data-family={family}
                style={{ ["--swatch" as string]: atlasFamilies[family].color }}
                aria-hidden="true"
              />
              {atlasFamilies[family].label}
            </button>
          ))}
        </div>
        <label className={styles.search}>
          <Search size={15} aria-hidden="true" />
          <span className="sr-only">Search skills</span>
          <input
            id="atlas-search"
            type="search"
            placeholder="Search skills, e.g. graph"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>

      <div className={styles.stage}>
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          role="img"
          aria-label="Skill atlas: Sumit's skills and five case studies arranged by topic. The list view below has the same content."
        />
        {hovered && tooltip && (
          <div className={styles.tooltip} style={{ left: tooltip.x, top: tooltip.y }} role="status">
            <span className={styles.tooltipTitle}>{hovered.label}</span>
            <span className={styles.tooltipMeta}>
              <span className={styles.swatch} style={{ ["--swatch" as string]: atlasFamilies[hovered.family].color }} />
              {hovered.cluster} · {atlasFamilies[hovered.family].label}
            </span>
            <span className={styles.tooltipMeta}>
              Near: {nearestNeighbours(atlas.points, hovered, 3).map((p) => p.label).join(", ")}
            </span>
            {hovered.slug && <span className={styles.tooltipAction}>Click to open the case study</span>}
          </div>
        )}
        <div className={styles.controls}>
          <button type="button" onClick={() => zoomAt(1.4)} aria-label="Zoom in">
            <Plus size={16} aria-hidden="true" />
          </button>
          <button type="button" onClick={() => zoomAt(1 / 1.4)} aria-label="Zoom out">
            <Minus size={16} aria-hidden="true" />
          </button>
          <button type="button" onClick={reset} aria-label="Reset view">
            <RotateCcw size={15} aria-hidden="true" />
          </button>
        </div>
        <p className={styles.hint}>Drag to pan · Ctrl/⌘ + scroll or pinch to zoom · Hover a dot</p>
      </div>
    </div>
  );
};
