import Link from "next/link";
import { getPublishable } from "@/lib/publishable";

export default function HomePage() {
  const data = getPublishable();

  return (
    <>
      <section className="card">
        <p className="pill">UK · reward-based · independent</p>
        <h1>Kind, evidence-linked training for you and your dog</h1>
        <p className="muted">
          {data.productName} turns our research knowledge base into practical lessons—each
          step traceable to professional UK guidance and safety rules. We are not affiliated
          with IMDT Ltd; we share the same force-free values.
        </p>
        <p>
          <Link href="/learn" className="btn">
            Start learning
          </Link>{" "}
          <Link href="/ethics" className="btn btn-secondary">
            Our standards
          </Link>
        </p>
      </section>

      <section className="grid-modules">
        {data.modules.map((mod) => (
          <article key={mod.id} className="card">
            <h2>{mod.title}</h2>
            <p className="muted">{mod.lessonIds.length} lessons ready</p>
            <Link href={`/learn/${mod.id}`}>View module →</Link>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Built on provenance, not copy-paste</h2>
        <p className="muted">
          Every published lesson links to claims and sources in our registry. High-risk
          topics stay out until human review clears them.
        </p>
      </section>
    </>
  );
}
