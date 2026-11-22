import * as THREE from "three";
import { linesFragment, linesVertex, pointsFragment, pointsVertex } from "./shaders";
import { createCloud, createGraph, createRandom, samplePortrait } from "./layouts";

type SceneOptions = {
  canvas: HTMLCanvasElement;
  portraitSrc?: string;
  isMobile: boolean;
};

const COLORS = {
  noise: new THREE.Color("#edebe6"),
  graph: new THREE.Color("#5b76ff"),
  agent: new THREE.Color("#c6ff3d"),
  edge: new THREE.Color("#3d5bff"),
};

// "Signal from Noise": particles morph from a portrait/cloud into a knowledge graph.
export class SignalScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private group = new THREE.Group();
  private points?: THREE.Points<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private lines?: THREE.LineSegments<THREE.BufferGeometry, THREE.ShaderMaterial>;
  private timer = new THREE.Timer();
  private frame = 0;
  private running = false;
  private progress = 0;
  private mouse = new THREE.Vector2(99, 99);
  private mouseTarget = new THREE.Vector2(99, 99);
  private resizeObserver: ResizeObserver;

  constructor(private options: SceneOptions) {
    const { canvas } = options;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    this.camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    this.camera.position.set(0, 0, 6.2);
    this.scene.add(this.group);
    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(canvas);
    this.resize();
  }

  async init() {
    const random = createRandom(7);
    const count = this.options.isMobile ? 6000 : 14000;

    let noise: { positions: Float32Array; brightness: Float32Array };
    try {
      if (!this.options.portraitSrc) throw new Error("No portrait");
      noise = await samplePortrait(this.options.portraitSrc, count, random);
    } catch {
      noise = createCloud(count, random);
    }

    const graph = createGraph(this.options.isMobile ? 34 : 48, random);
    const edgeA = new Float32Array(count * 3);
    const edgeB = new Float32Array(count * 3);
    const flow = new Float32Array(count * 2);
    const randoms = new Float32Array(count);
    const nodeCount = graph.nodes.length / 3;

    for (let i = 0; i < count; i += 1) {
      randoms[i] = random();
      const onNode = random() < 0.38;
      if (onNode) {
        const node = Math.floor(random() * nodeCount);
        const spread = 0.07;
        for (let axis = 0; axis < 3; axis += 1) {
          const value = graph.nodes[node * 3 + axis] + (random() - 0.5) * spread;
          edgeA[i * 3 + axis] = value;
          edgeB[i * 3 + axis] = value;
        }
        flow[i * 2] = 0;
        flow[i * 2 + 1] = 0;
      } else {
        const [a, b] = graph.edges[Math.floor(random() * graph.edges.length)];
        for (let axis = 0; axis < 3; axis += 1) {
          edgeA[i * 3 + axis] = graph.nodes[a * 3 + axis];
          edgeB[i * 3 + axis] = graph.nodes[b * 3 + axis];
        }
        flow[i * 2] = random();
        flow[i * 2 + 1] = randoms[i] > 0.82 ? 0.06 + random() * 0.08 : 0;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(noise.positions.slice(), 3));
    geometry.setAttribute("aNoise", new THREE.BufferAttribute(noise.positions, 3));
    geometry.setAttribute("aEdgeA", new THREE.BufferAttribute(edgeA, 3));
    geometry.setAttribute("aEdgeB", new THREE.BufferAttribute(edgeB, 3));
    geometry.setAttribute("aFlow", new THREE.BufferAttribute(flow, 2));
    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    geometry.setAttribute("aBright", new THREE.BufferAttribute(noise.brightness, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);

    const material = new THREE.ShaderMaterial({
      vertexShader: pointsVertex,
      fragmentShader: pointsFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uSize: { value: this.options.isMobile ? 26 : 30 },
        uMouse: { value: this.mouse },
        uMouseStrength: { value: 1 },
        uColorA: { value: COLORS.noise },
        uColorB: { value: COLORS.graph },
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
      sides[index * 2] = 0;
      sides[index * 2 + 1] = 1;
    });
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute("aSide", new THREE.BufferAttribute(sides, 1));
    const lineMaterial = new THREE.ShaderMaterial({
      vertexShader: linesVertex,
      fragmentShader: linesFragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uOpacity: { value: 0 }, uColor: { value: COLORS.edge } },
    });
    this.lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    this.group.add(this.lines);
  }

  setProgress(value: number) {
    this.progress = value;
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

  render() {
    if (!this.points || !this.lines) return;
    this.timer.update();
    const elapsed = this.timer.getElapsed();
    const uniforms = this.points.material.uniforms;
    uniforms.uTime.value = elapsed;
    uniforms.uProgress.value += (this.progress - uniforms.uProgress.value) * 0.08;
    this.mouse.lerp(this.mouseTarget, 0.1);

    const p = uniforms.uProgress.value as number;
    this.lines.material.uniforms.uOpacity.value = Math.max(0, (p - 0.6) / 0.4) * 0.45;
    this.group.rotation.y = p * 0.9 + Math.sin(elapsed * 0.15) * 0.05 * p;
    this.group.rotation.x = p * 0.18;
    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    const { canvas } = this.options;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    // Keep the subject framed on narrow screens
    this.camera.position.z = this.camera.aspect < 0.8 ? 8.2 : 6.2;
    this.camera.updateProjectionMatrix();
    if (!this.running) this.render();
  }

  dispose() {
    this.stop();
    this.resizeObserver.disconnect();
    this.timer.dispose();
    this.points?.geometry.dispose();
    this.points?.material.dispose();
    this.lines?.geometry.dispose();
    this.lines?.material.dispose();
    this.renderer.dispose();
  }
}
