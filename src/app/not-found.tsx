import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container" style={{ minHeight: "80vh", display: "grid", placeContent: "center", gap: 24, textAlign: "center" }}>
      <p className="label">Error 404 · Quest not found</p>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(3rem, 10vw, 8rem)", lineHeight: 0.9 }}>
        Lost in the <em>graph</em>.
      </h1>
      <Link href="/" style={{ textDecoration: "underline", minHeight: 44, display: "inline-flex", alignItems: "center", justifySelf: "center" }}>
        Back to home
      </Link>
    </section>
  );
}
