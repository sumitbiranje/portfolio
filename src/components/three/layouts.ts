// Particle layouts: the "noise" state (portrait from a photo, or a procedural cloud) and the knowledge graph.

export type GraphLayout = {
  nodes: Float32Array; // xyz per node
  edges: Array<[number, number]>;
};

// Deterministic PRNG so the graph looks the same on every visit
export const createRandom = (seed: number) => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

export const createGraph = (nodeCount: number, random: () => number): GraphLayout => {
  const nodes = new Float32Array(nodeCount * 3);
  const clusters = 5;
  for (let i = 0; i < nodeCount; i += 1) {
    const cluster = i % clusters;
    const angle = (cluster / clusters) * Math.PI * 2;
    const cx = Math.cos(angle) * 1.25;
    const cy = Math.sin(angle) * 0.75;
    nodes[i * 3] = cx + (random() - 0.5) * 1.2;
    nodes[i * 3 + 1] = cy + (random() - 0.5) * 1.0;
    nodes[i * 3 + 2] = (random() - 0.5) * 1.4;
  }

  const edges: Array<[number, number]> = [];
  const seen = new Set<string>();
  for (let i = 0; i < nodeCount; i += 1) {
    const distances: Array<[number, number]> = [];
    for (let j = 0; j < nodeCount; j += 1) {
      if (i === j) continue;
      const dx = nodes[i * 3] - nodes[j * 3];
      const dy = nodes[i * 3 + 1] - nodes[j * 3 + 1];
      const dz = nodes[i * 3 + 2] - nodes[j * 3 + 2];
      distances.push([j, dx * dx + dy * dy + dz * dz]);
    }
    distances.sort((a, b) => a[1] - b[1]);
    const links = i % clusters === 0 ? 4 : 2;
    for (const [j] of distances.slice(0, links)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }
  return { nodes, edges };
};

// Procedural fallback: a dithered "head-like" ellipsoid cloud
export const createCloud = (count: number, random: () => number) => {
  const positions = new Float32Array(count * 3);
  const brightness = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const radius = Math.cbrt(random());
    const s = Math.sqrt(1 - u * u);
    positions[i * 3] = s * Math.cos(theta) * radius * 1.15;
    positions[i * 3 + 1] = u * radius * 1.45;
    positions[i * 3 + 2] = s * Math.sin(theta) * radius * 0.6;
    brightness[i] = 0.35 + radius * 0.65;
  }
  return { positions, brightness };
};

// Sample a portrait image: brighter pixels are more likely to become particles
export const samplePortrait = async (src: string, count: number, random: () => number) => {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  await image.decode();

  const width = 220;
  const height = Math.round((image.height / image.width) * width);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("2D canvas unavailable");
  context.drawImage(image, 0, 0, width, height);
  const { data } = context.getImageData(0, 0, width, height);

  const positions = new Float32Array(count * 3);
  const brightness = new Float32Array(count);
  const scale = 3.4 / height;
  let placed = 0;
  let attempts = 0;
  while (placed < count && attempts < count * 40) {
    attempts += 1;
    const x = Math.floor(random() * width);
    const y = Math.floor(random() * height);
    const index = (y * width + x) * 4;
    const alpha = data[index + 3] / 255;
    if (alpha < 0.5) continue;
    const luminance = (data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114) / 255;
    // Keep a faint floor so dark hair and clothes still read as a silhouette
    // Fade out the bottom edge so the shoulders dissolve instead of ending in a hard line
    const bottomFade = Math.min(1, Math.max(0, (1 - y / height) / 0.22));
    if (random() > (0.14 + luminance * luminance * 1.1) * bottomFade) continue;
    positions[placed * 3] = (x - width / 2) * scale;
    positions[placed * 3 + 1] = -(y - height / 2) * scale + 0.45; // lift the face above the hero name
    positions[placed * 3 + 2] = (luminance - 0.5) * 0.35;
    brightness[placed] = luminance;
    placed += 1;
  }
  if (placed < count * 0.5) throw new Error("Portrait too dark to sample");
  // Fill any leftovers by duplicating sampled points
  for (let i = placed; i < count; i += 1) {
    const source = Math.floor(random() * placed);
    positions.copyWithin(i * 3, source * 3, source * 3 + 3);
    brightness[i] = brightness[source];
  }
  return { positions, brightness };
};
