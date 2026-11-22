// Every shape lives in one float texture (xyz = position, w = brightness), one block of rows per shape.
// Each particle reads its position in shape A and shape B and blends between them by uMix.

export const pointsVertex = /* glsl */ `
  uniform sampler2D uShapes;
  uniform float uWidth;
  uniform float uRows;
  uniform float uShapeA;
  uniform float uShapeB;
  uniform float uMix;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uSize;
  uniform float uPortrait;
  uniform float uAlpha;
  uniform vec2 uMouse;

  attribute float aIndex;
  attribute float aRandom;

  varying float vAlpha;
  varying float vAgent;
  varying float vPortrait;

  vec3 hash3(vec3 p) {
    p = vec3(dot(p, vec3(127.1, 311.7, 74.7)), dot(p, vec3(269.5, 183.3, 246.1)), dot(p, vec3(113.5, 271.9, 124.6)));
    return fract(sin(p) * 43758.5453123) * 2.0 - 1.0;
  }

  vec4 shapeAt(float shape) {
    ivec2 cell = ivec2(int(mod(aIndex, uWidth)), int(floor(aIndex / uWidth) + shape * uRows));
    return texelFetch(uShapes, cell, 0);
  }

  void main() {
    vec4 a = shapeAt(uShapeA);
    vec4 b = shapeAt(uShapeB);

    // Staggered, eased blend so the morph ripples through the particles
    float t = clamp((uMix - aRandom * 0.3) / 0.7, 0.0, 1.0);
    t = t * t * (3.0 - 2.0 * t);

    vec3 pos = mix(a.xyz, b.xyz, t);
    float bright = mix(a.w, b.w, t);

    // Particles scatter mid-transition, then settle into the next shape
    pos += hash3(vec3(aIndex * 0.0137, aRandom * 7.1, 1.3)) * sin(t * 3.14159) * 0.7;

    // Gentle idle drift (none on the portrait, so the face stays crisp)
    pos += vec3(sin(uTime * 0.7 + aRandom * 40.0), cos(uTime * 0.5 + aRandom * 31.0), 0.0) * 0.012 * (1.0 - uPortrait);

    // Pointer pushes particles away
    vec2 toMouse = pos.xy - uMouse;
    float force = smoothstep(0.5, 0.0, length(toMouse));
    pos.xy += normalize(toMouse + 1e-5) * force * 0.16;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float agent = step(0.975, aRandom) * (1.0 - uPortrait);
    gl_PointSize = uSize * (0.45 + bright * 0.75 + agent * 1.2) * uPixelRatio / -mvPosition.z;

    vAlpha = (0.15 + bright * 0.85) * uAlpha;
    vAgent = agent;
    vPortrait = uPortrait;
  }
`;

export const pointsFragment = /* glsl */ `
  uniform vec3 uColorPortrait;
  uniform vec3 uColorShape;
  uniform vec3 uColorAgent;

  varying float vAlpha;
  varying float vAgent;
  varying float vPortrait;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    // Crisper dots on the portrait, softer glow on the abstract shapes
    float edge = mix(0.0, 0.32, vPortrait);
    float soft = smoothstep(0.5, edge, d);
    vec3 color = mix(uColorShape, uColorPortrait, vPortrait);
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
