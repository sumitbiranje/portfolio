import { ImageResponse } from "next/og";
import { person } from "@/content/site";

export const alt = `${person.name}, AI Engineer`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#050507",
          color: "#edebe6",
          backgroundImage: "radial-gradient(ellipse 60% 60% at 70% 40%, rgba(61,91,255,0.35), transparent 70%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 22, letterSpacing: 4, color: "#9a9aa3" }}>
          <div style={{ width: 14, height: 14, background: "#3d5bff" }} />
          AI ENGINEER · AGENTIC SYSTEMS · RAG · KNOWLEDGE GRAPHS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 120, lineHeight: 1, letterSpacing: -3 }}>{person.name}</div>
          <div style={{ fontSize: 38, color: "#9a9aa3" }}>{person.headline}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 22, color: "#c6ff3d" }}>
          <div style={{ width: 10, height: 10, borderRadius: 10, background: "#c6ff3d" }} />
          AVAILABLE FOR PROJECTS · PUNE, INDIA · REMOTE WORLDWIDE
        </div>
      </div>
    ),
    size,
  );
}
