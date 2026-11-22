import type { Project } from "@/content/site";
import styles from "./Diagram.module.scss";

type Box = { x: number; y: number; w: number; label: string; tone?: "accent" | "signal" };
type Spec = { boxes: Box[]; links: Array<[number, number]> };

// Redrawn, generic architecture diagrams: no internal screenshots or confidential details.
const SPECS: Record<Project["diagram"], Spec> = {
  selection: {
    boxes: [
      { x: 20, y: 40, w: 110, label: "Build A" },
      { x: 20, y: 150, w: 110, label: "Build B" },
      { x: 175, y: 95, w: 120, label: "Diff entities" },
      { x: 340, y: 95, w: 130, label: "Graph traversal", tone: "accent" },
      { x: 515, y: 40, w: 105, label: "Impacted" },
      { x: 515, y: 150, w: 105, label: "Min. tests", tone: "signal" },
    ],
    links: [[0, 2], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  graph: {
    boxes: [
      { x: 20, y: 30, w: 110, label: "Java / Kotlin" },
      { x: 20, y: 95, w: 110, label: "C / C++" },
      { x: 20, y: 160, w: 110, label: "XML / HAL" },
      { x: 180, y: 95, w: 120, label: "tree-sitter" },
      { x: 345, y: 95, w: 125, label: "Link usages" },
      { x: 515, y: 95, w: 105, label: "Neo4j", tone: "accent" },
    ],
    links: [[0, 3], [1, 3], [2, 3], [3, 4], [4, 5]],
  },
  trace: {
    boxes: [
      { x: 20, y: 40, w: 110, label: "SRS" },
      { x: 20, y: 150, w: 110, label: "SDS" },
      { x: 180, y: 40, w: 130, label: "Explore code" },
      { x: 180, y: 150, w: 130, label: "Behaviour flow" },
      { x: 360, y: 95, w: 120, label: "Agent", tone: "accent" },
      { x: 520, y: 95, w: 100, label: "Trace map", tone: "signal" },
    ],
    links: [[0, 4], [1, 4], [2, 3], [3, 4], [4, 5]],
  },
  review: {
    boxes: [
      { x: 20, y: 95, w: 110, label: "Test cases" },
      { x: 180, y: 20, w: 120, label: "Agent 1–2" },
      { x: 180, y: 95, w: 120, label: "Agent 3–5", tone: "accent" },
      { x: 180, y: 170, w: 120, label: "Agent 6–7" },
      { x: 350, y: 95, w: 120, label: "Pydantic" },
      { x: 515, y: 95, w: 105, label: "Report", tone: "signal" },
    ],
    links: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4], [4, 5]],
  },
  feasibility: {
    boxes: [
      { x: 20, y: 40, w: 110, label: "Manual tests" },
      { x: 20, y: 150, w: 110, label: "JSON criteria" },
      { x: 180, y: 95, w: 130, label: "LangChain", tone: "accent" },
      { x: 360, y: 95, w: 120, label: "Validate" },
      { x: 520, y: 40, w: 100, label: "Automate" , tone: "signal" },
      { x: 520, y: 150, w: 100, label: "Keep manual" },
    ],
    links: [[0, 2], [1, 2], [2, 3], [3, 4], [3, 5]],
  },
};

const BOX_H = 36;

export const Diagram = ({ type, title }: { type: Project["diagram"]; title: string }) => {
  const { boxes, links } = SPECS[type];
  return (
    <svg className={styles.diagram} viewBox="0 0 640 230" role="img" aria-label={`Architecture diagram: ${title}`}>
      {links.map(([from, to]) => {
        const a = boxes[from];
        const b = boxes[to];
        const x1 = a.x + a.w;
        const y1 = a.y + BOX_H / 2;
        const x2 = b.x;
        const y2 = b.y + BOX_H / 2;
        const mid = (x1 + x2) / 2;
        return (
          <path
            key={`${from}-${to}`}
            className={styles.link}
            d={`M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}`}
          />
        );
      })}
      {boxes.map((box) => (
        <g key={box.label} className={styles.box} data-tone={box.tone}>
          <rect x={box.x} y={box.y} width={box.w} height={BOX_H} rx="3" />
          <text x={box.x + box.w / 2} y={box.y + BOX_H / 2 + 4} textAnchor="middle">
            {box.label}
          </text>
        </g>
      ))}
    </svg>
  );
};
