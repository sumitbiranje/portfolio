import * as THREE from "three";
import { linesFragment, linesVertex, pointsFragment, pointsVertex } from "./shaders";
import {
  cloudShape,
  createGraph,
  createRandom,
  globeShape,
  graphShape,
  helixShape,
  layersShape,
  orbitShape,
  polyhedronShape,
  portraitShape,
  stairsShape,
  type Shape,
} from "./shapes";

// Where each shape sits on screen and how strongly it shows (index matches SHAPE_ORDER).
export type ShapeLayout = { x: number; y: number; alpha: number; scale: number };

export const SHAPE_ORDER = ["portrait", "graph", "orbit", "layers", "helix", "stairs", "polyhedron", "globe"] as const;

const DESKTOP_LAYOUT: ShapeLayout[] = [
  { x: 0, y: 0, alpha: 1, scale: 1 },
  { x: 0, y: 0, alpha: 1, scale: 1 },
  { x: 1.3, y: -0.85, alpha: 0.5, scale: 0.85 },
  { x: 0, y: 0, alpha: 0.45, scale: 1.05 },
  { x: 1.9, y: 0, alpha: 0.6, scale: 0.9 },
  { x: -0.3, y: 0, alpha: 0.45, scale: 0.95 },
  { x: 1.9, y: 0, alpha: 0.6, scale: 0.9 },
  { x: -1.7, y: -0.3, alpha: 0.45, scale: 0.9 },
];

const MOBILE_LAYOUT: ShapeLayout[] = DESKTOP_LAYOUT.map((layout, index) => ({
  x: 0,
  y: index < 2 ? 0 : 0.3,
  alpha: index < 2 ? 1 : 0.32,
  scale: index < 2 ? 1 : 0.8,
}));

const TEXTURE_WIDTH = 256;
const GRAPH_SHAPE = 1;

const COLORS = {
  portrait: new THREE.Color("#f2f0ea"),
  shape: new THREE.Color("#5b76ff"),
  agent: new THREE.Color("#c6ff3d"),
  edge: new THREE.Color("#3d5bff"),
};

type SceneOptions = { canvas: HTMLCanvasElement; isMobile: boolean; portraitSrc?: string };

export class ParticleScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
  private group = new THREE.Group();
  private points?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private lines?: THREE.LineSegments<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private texture?: THREE.DataTexture;
  private timer = new THREE.Timer();
  private frame = 0;
  private running = false;
  private target = 0;
  private current = 0;
  private layout: ShapeLayout[];
  private mouse = new THREE.Vector2(99, 99);
  private mouseTarget = new THREE.Vector2(99, 99);
  private resizeObserver: ResizeObserver;

  constructor(private options: SceneOptions) {
    this.layout = options.isMobile ? MOBILE_LAYOUT : DESKTOP_LAYOUT;
    this.renderer = new THREE.WebGLRenderer({ canvas: options.canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.camera.position.set(0, 0, 6.2);
    this.scene.add(this.group);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(options.canvas);
    this.resize();
  }

  async init() {
    const random = createRandom(7);
    const count = this.options.isMobile ? 10000 : 26000;

    let portrait: Shape;
    try {
      if (!this.options.portraitSrc) throw new Error("No portrait");
      portrait = await portraitShape(this.options.portraitSrc, count, random);
    } catch {
      portrait = cloudShape(count, random);
    }
    const graph = createGraph(this.options.isMobile ? 34 : 48, random);
    const shapes: Shape[] = [
      portrait,
      graphShape(count, random, graph),
      orbitShape(count, random),
      layersShape(count, random),
      helixShape(count, random),
      stairsShape(count, random),
      polyhedronShape(count, random),
      globeShape(count, random),
    ];

    // Pack every shape into one RGBA float texture
    const rows = Math.ceil(count / TEXTURE_WIDTH);
    const data = new Float32Array(TEXTURE_WIDTH * rows * shapes.length * 4);
    shapes.forEach((shape, shapeIndex) => {
      const base = shapeIndex * rows * TEXTURE_WIDTH * 4;
      for (let i = 0; i < count; i += 1) {
        data.set(shape.positions.subarray(i * 3, i * 3 + 3), base + i * 4);
        data[base + i * 4 + 3] = shape.brightness[i];
      }
    });
    this.texture = new THREE.DataTexture(data, TEXTURE_WIDTH, rows * shapes.length, THREE.RGBAFormat, THREE.FloatType);
    this.texture.needsUpdate = true;

    const indices = new Float32Array(count);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      indices[i] = i;
      randoms[i] = random();
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geometry.setAttribute("aIndex", new THREE.BufferAttribute(indices, 1));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 8);

    const material = new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uShapes: { value: this.texture },
        uWidth: { value: TEXTURE_WIDTH },
        uRows: { value: rows },
        uShapeA: { value: 0 },
        uShapeB: { value: 1 },
        uMix: { value: 0 },
        uTime: { value: 0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uSize: { value: 20 },
        uPortrait: { value: 1 },
        uAlpha: { value: 1 },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uColorPortrait: { value: COLORS.portrait },
        uColorShape: { value: COLORS.shape },
        uColorAgent: { value: COLORS.agent },
      },
    });
    this.points = new THREE.Points(geometry, material);
    this.group.add(this.points);

    const linePositions = new Float32Array(graph.edges.length * 6);
    const sides = new Float32Array(graph.edges.length * 2);
    graph.edges.forEach(([a, b], index) => {
      linePositions.set(graph.nodes.subarray(a * 3, a * 3 + 3), index * 6);
      linePositions.set(graph.nodes.subarray(b * 3, b * 3 + 3), index * 6 + 3);
      sides[index * 2 + 1] = 1;
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("aSide", new THREE.BufferAttribute(sides, 1));
    this.lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.ShaderMaterial({
        vertexShader: linesVertex,
        fragmentShader: linesFragment,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: { uOpacity: { value: 0 }, uColor: { value: COLORS.edge } },
      }),
    );
    this.group.add(this.lines);
  }

  // progress in shape units: 0 = portrait, 1 = graph, … 7 = globe
  setProgress(value: number) {
    this.target = Math.min(Math.max(value, 0), SHAPE_ORDER.length - 1);
  }

  // x, y in normalised device coordinates (-1..1)
  setPointer(x: number, y: number) {
    const height = 2 * Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2)) * this.camera.position.z;
    this.mouseTarget.set((x * height * this.camera.aspect) / 2, (y * height) / 2);
  }

  start() {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this.render();
      this.frame = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this.frame);
  }

  private render() {
    if (!this.points || !this.lines) return;
    this.timer.update();
    const elapsed = this.timer.getElapsed();
    this.current += (this.target - this.current) * 0.075;

    const last = SHAPE_ORDER.length - 1;
    const shapeA = Math.min(Math.floor(this.current), last);
    const shapeB = Math.min(shapeA + 1, last);
    const mix = shapeA === last ? 0 : this.current - shapeA;

    // Blend per-shape layout so the object glides to its spot for each section
    const from = this.layout[shapeA];
    const to = this.layout[shapeB];
    const lerp = (a: number, b: number) => a + (b - a) * mix;
    const scale = lerp(from.scale, to.scale);
    this.group.position.set(lerp(from.x, to.x), lerp(from.y, to.y), 0);
    this.group.scale.setScalar(scale);

    const portrait = Math.max(0, 1 - this.current);
    const uniforms = this.points.material.uniforms;
    uniforms.uShapeA.value = shapeA;
    uniforms.uShapeB.value = shapeB;
    uniforms.uMix.value = mix;
    uniforms.uTime.value = elapsed;
    uniforms.uPortrait.value = portrait;
    uniforms.uAlpha.value = lerp(from.alpha, to.alpha) * (this.options.isMobile ? 1 : 0.9 + portrait * 0.1);
    uniforms.uSize.value = (this.options.isMobile ? 17 : 19) * (1 - portrait) + (this.options.isMobile ? 12 : 12.5) * portrait;

    // Pointer in the group's local space
    this.mouse.lerp(this.mouseTarget, 0.1);
    uniforms.uMouse.value.set((this.mouse.x - this.group.position.x) / scale, (this.mouse.y - this.group.position.y) / scale);

    const graphWeight = Math.max(0, 1 - Math.abs(this.current - GRAPH_SHAPE) * 2.5);
    this.lines.material.uniforms.uOpacity.value = graphWeight * 0.45;

    // Face the camera on the portrait; slowly turn every other shape
    const spin = 1 - portrait;
    this.group.rotation.y = spin * (elapsed * 0.12 + this.current * 0.8);
    this.group.rotation.x = spin * (0.18 + Math.sin(elapsed * 0.2) * 0.05);

    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    const { canvas } = this.options;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.position.z = this.camera.aspect < 0.8 ? 8.4 : 6.2;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.stop();
    this.resizeObserver.disconnect();
    this.timer.dispose();
    this.points?.geometry.dispose();
    this.points?.material.dispose();
    this.lines?.geometry.dispose();
    this.lines?.material.dispose();
    this.texture?.dispose();
    this.renderer.dispose();
  }
}
