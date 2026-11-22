// Points shader: morphs each particle from the "noise" (portrait/cloud) layout to the knowledge graph.

export const pointsVertex = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform vec2 uMouse;
  uniform float uMouseStrength;

  attribute vec3 aNoise;
  attribute vec3 aEdgeA;
  attribute vec3 aEdgeB;
  attribute vec2 aFlow;     // x: start t along edge, y: flow speed (0 = node particle)
  attribute float aRandom;
  attribute float aBright;  // portrait luminance (1.0 for the procedural cloud)

  varying float vAlpha;
  varying float vMix;
  varying float vAgent;

  // Cheap 3D hash noise for drift
  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123) * 2.0 - 1.0;
  }

  void main() {
    // Per-particle stagger so the morph ripples instead of moving in lockstep
    float delay = aRandom * 0.35;
    float t = clamp((uProgress - delay) / 0.65, 0.0, 1.0);
    float eased = t * t * (3.0 - 2.0 * t);

    float edgeT = fract(aFlow.x + uTime * aFlow.y);
    vec3 graphPos = mix(aEdgeA, aEdgeB, aFlow.y > 0.0 ? edgeT : aFlow.x);

    vec3 noisePos = aNoise;
    noisePos += hash3(aNoise * 3.1 + floor(uTime * 0.6)) * 0.004; // subtle shimmer

    vec3 pos = mix(noisePos, graphPos, eased);

    // Burst outward mid-transition: noise becomes structure
    float burst = sin(eased * 3.14159);
    pos += hash3(aNoise * 7.0) * burst * 0.55;

    // Mouse repulsion in world XY
    vec2 toMouse = pos.xy - uMouse;
    float d = length(toMouse);
    float force = smoothstep(0.55, 0.0, d) * uMouseStrength;
    pos.xy += normalize(toMouse + 1e-5) * force * 0.18;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float agent = step(0.0001, aFlow.y) * step(0.965, aRandom);
    float size = uSize * mix(0.55 + aBright * 0.75, 0.8 + agent * 1.6, eased);
    gl_PointSize = size * uPixelRatio * (1.0 / -mvPosition.z);

    vAlpha = mix(0.18 + aBright * 0.5, 0.5 + agent * 0.5, eased);
    vMix = eased;
    vAgent = agent * eased;
  }
`;

export const pointsFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorAgent;

  varying float vAlpha;
  varying float vMix;
  varying float vAgent;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorA, uColorB, vMix);
    color = mix(color, uColorAgent, vAgent);
    gl_FragColor = vec4(color, soft * vAlpha);
  }
`;

export const linesVertex = /* glsl */ `
  attribute float aSide;
  varying float vSide;
  void main() {
    vSide = aSide;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const linesFragment = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uColor;
  varying float vSide;
  void main() {
    gl_FragColor = vec4(uColor, uOpacity * (0.35 + 0.65 * vSide));
  }
`;
