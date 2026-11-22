// Particle target shapes. Every shape fills `count` xyz positions, roughly inside a 3.4-unit box.

export type Random = () => number;
export type Shape = { positions: Float32Array; brightness: Float32Array };

export const createRandom = (seed: number): Random => {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
};

const createShape = (count: number, fill: (i: number, out: [number, number, number]) => number): Shape => {
  const positions = new Float32Array(count * 3);
  const brightness = new Float32Array(count);
  const point: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < count; i += 1) {
    brightness[i] = fill(i, point);
    positions.set(point, i * 3);
  }
  return { positions, brightness };
};

const jitter = (random: Random, amount: number) => (random() - 0.5) * amount;

// Hero: the portrait. Bright pixels attract more particles; dark hair keeps a faint silhouette.
export const portraitShape = async (src: string, count: number, random: Random): Promise<Shape> => {
  const image = new Image();
  image.decoding = "async";
  image.src = src;
  await image.decode();

  const width = 320;
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
  const scale = 3.5 / height;
  let placed = 0;
  let attempts = 0;
  while (placed < count && attempts < count * 60) {
    attempts += 1;
    const x = random() * width;
    const y = random() * height;
    const index = (Math.floor(y) * width + Math.floor(x)) * 4;
    if (data[index + 3] < 128) continue;
    const luminance = (data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114) / 255;
    const bottomFade = Math.min(1, Math.max(0, (1 - y / height) / 0.2));
    if (random() > (0.06 + Math.pow(luminance, 1.4) * 1.05) * bottomFade) continue;
    positions[placed * 3] = (x - width / 2) * scale;
    positions[placed * 3 + 1] = -(y - height / 2) * scale + 0.4;
    positions[placed * 3 + 2] = (luminance - 0.5) * 0.25;
    brightness[placed] = luminance;
    placed += 1;
  }
  if (placed < count * 0.5) throw new Error("Portrait too dark to sample");
  for (let i = placed; i < count; i += 1) {
    const source = Math.floor(random() * placed);
    positions.copyWithin(i * 3, source * 3, source * 3 + 3);
    brightness[i] = brightness[source];
  }
  return { positions, brightness };
};

// Fallback when no portrait is available: a soft ellipsoid cloud
export const cloudShape = (count: number, random: Random) =>
  createShape(count, (_, out) => {
    const u = random() * 2 - 1;
    const theta = random() * Math.PI * 2;
    const radius = Math.cbrt(random());
    const s = Math.sqrt(1 - u * u);
    out[0] = s * Math.cos(theta) * radius * 1.15;
    out[1] = u * radius * 1.45;
    out[2] = s * Math.sin(theta) * radius * 0.6;
    return 0.35 + radius * 0.65;
  });

// After the hero: a knowledge graph (clustered nodes linked by edges)
export const createGraph = (nodeCount: number, random: Random) => {
  const nodes = new Float32Array(nodeCount * 3);
  const clusters = 5;
  for (let i = 0; i < nodeCount; i += 1) {
    const angle = ((i % clusters) / clusters) * Math.PI * 2;
    nodes[i * 3] = Math.cos(angle) * 1.25 + jitter(random, 1.2);
    nodes[i * 3 + 1] = Math.sin(angle) * 0.75 + jitter(random, 1.0);
    nodes[i * 3 + 2] = jitter(random, 1.4);
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
    for (const [j] of distances.slice(0, i % clusters === 0 ? 4 : 2)) {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j]);
    }
  }
  return { nodes, edges };
};

export const graphShape = (count: number, random: Random, graph: ReturnType<typeof createGraph>) => {
  const nodeCount = graph.nodes.length / 3;
  return createShape(count, (_, out) => {
    if (random() < 0.4) {
      const node = Math.floor(random() * nodeCount) * 3;
      for (let axis = 0; axis < 3; axis += 1) out[axis] = graph.nodes[node + axis] + jitter(random, 0.08);
      return 1;
    }
    const [a, b] = graph.edges[Math.floor(random() * graph.edges.length)];
    const t = random();
    for (let axis = 0; axis < 3; axis += 1) {
      out[axis] = graph.nodes[a * 3 + axis] * (1 - t) + graph.nodes[b * 3 + axis] * t + jitter(random, 0.02);
    }
    return 0.7;
  });
};

// Services: a multi-agent orbit. A core sphere with five tilted rings, one per service.
export const orbitShape = (count: number, random: Random) =>
  createShape(count, (_, out) => {
    if (random() < 0.22) {
      const u = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = 0.42 + jitter(random, 0.04);
      out[0] = s * Math.cos(theta) * r;
      out[1] = u * r;
      out[2] = s * Math.sin(theta) * r;
      return 1;
    }
    const ring = Math.floor(random() * 5);
    const radius = 0.85 + ring * 0.2;
    const tilt = (ring / 5) * Math.PI;
    const angle = random() * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    out[0] = x;
    out[1] = z * Math.sin(tilt) + jitter(random, 0.03);
    out[2] = z * Math.cos(tilt);
    return 0.75;
  });

// Work: a layered stack, one plane per case study (app → services → frameworks → BSP → HAL)
export const layersShape = (count: number, random: Random) =>
  createShape(count, (_, out) => {
    const layer = Math.floor(random() * 5);
    const size = 1.5 - layer * 0.12;
    const onEdge = random() < 0.35;
    let x = jitter(random, size * 2);
    let z = jitter(random, size * 2);
    if (onEdge) {
      if (random() < 0.5) x = Math.sign(x) * size;
      else z = Math.sign(z) * size;
    }
    out[0] = x;
    out[1] = (layer - 2) * 0.48 + jitter(random, 0.02);
    out[2] = z;
    return onEdge ? 1 : 0.55;
  });

// Process: a rising double helix, the pipeline from discovery to shipping
export const helixShape = (count: number, random: Random) =>
  createShape(count, (i, out) => {
    const t = random();
    const angle = t * Math.PI * 6 + (i % 2) * Math.PI;
    const radius = 0.75;
    if (random() < 0.12) {
      // rungs between the strands
      const k = random();
      out[0] = Math.cos(angle) * radius * (1 - 2 * k);
      out[2] = Math.sin(angle) * radius * (1 - 2 * k);
    } else {
      out[0] = Math.cos(angle) * radius + jitter(random, 0.05);
      out[2] = Math.sin(angle) * radius + jitter(random, 0.05);
    }
    out[1] = (t - 0.5) * 3.2;
    return 0.85;
  });

// Story: level-up stairs. Four cubes rising in size, LV.01 → LV.04
export const stairsShape = (count: number, random: Random) =>
  createShape(count, (_, out) => {
    const level = Math.floor(random() * 4);
    const size = 0.32 + level * 0.12;
    const cx = -1.35 + level * 0.9;
    const cy = -0.9 + level * 0.55;
    const face = Math.floor(random() * 6);
    const u = jitter(random, size * 2);
    const v = jitter(random, size * 2);
    const w = face % 2 === 0 ? size : -size;
    const axis = Math.floor(face / 2);
    const p = axis === 0 ? [w, u, v] : axis === 1 ? [u, w, v] : [u, v, w];
    out[0] = cx + p[0];
    out[1] = cy + p[1];
    out[2] = p[2];
    return 0.6 + level * 0.13;
  });

// Stack: the toolkit as an icosahedron (vertices + edges)
export const polyhedronShape = (count: number, random: Random) => {
  const phi = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
    [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
    [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
  ];
  const scale = 1.25 / Math.hypot(1, phi);
  const vertices = raw.map((v) => v.map((c) => c * scale));
  const edges: Array<[number, number]> = [];
  for (let i = 0; i < vertices.length; i += 1) {
    for (let j = i + 1; j < vertices.length; j += 1) {
      const d = Math.hypot(...vertices[i].map((c, k) => c - vertices[j][k]));
      if (d < 2.1 * scale) edges.push([i, j]);
    }
  }
  return createShape(count, (_, out) => {
    if (random() < 0.2) {
      const v = vertices[Math.floor(random() * vertices.length)];
      for (let axis = 0; axis < 3; axis += 1) out[axis] = v[axis] + jitter(random, 0.1);
      return 1;
    }
    const [a, b] = edges[Math.floor(random() * edges.length)];
    const t = random();
    for (let axis = 0; axis < 3; axis += 1) {
      out[axis] = vertices[a][axis] * (1 - t) + vertices[b][axis] * t + jitter(random, 0.025);
    }
    return 0.7;
  });
};

// Contact: a globe with latitude and longitude lines (remote, worldwide)
export const globeShape = (count: number, random: Random) =>
  createShape(count, (_, out) => {
    const radius = 1.35;
    let lat: number;
    let lon: number;
    if (random() < 0.5) {
      lat = ((Math.floor(random() * 9) + 1) / 10) * Math.PI - Math.PI / 2;
      lon = random() * Math.PI * 2;
    } else {
      lon = (Math.floor(random() * 12) / 12) * Math.PI * 2;
      lat = (random() - 0.5) * Math.PI;
    }
    out[0] = Math.cos(lat) * Math.cos(lon) * radius;
    out[1] = Math.sin(lat) * radius;
    out[2] = Math.cos(lat) * Math.sin(lon) * radius;
    return 0.8;
  });
