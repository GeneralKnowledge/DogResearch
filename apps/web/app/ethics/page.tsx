import { getPublishable } from "@/lib/publishable";

export default function EthicsPage() {
  const { ethics, professionalRoles } = getPublishable();

  return (
    <>
      <h1>Our standards</h1>
      <p className="muted">{ethics.disclaimer}</p>

      {(professionalRoles?.length ?? 0) > 0 ? (
        <section className="card">
          <h2>Professional roles (UK)</h2>
          <p className="muted">
            KindTrail is owner guidance, not clinical behaviour therapy. These points are paraphrased
            from our knowledge base—find ABTC-registered practitioners for hands-on help.
          </p>
          <ul>
            {professionalRoles!.map((c) => (
              <li key={c.id}>{c.statement}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {ethics.safetyRules.map((rule) => (
        <article key={rule.id} className="card">
          <h2>{rule.title}</h2>
          <p>{rule.rule}</p>
          {rule.referralText ? <p className="muted">{rule.referralText}</p> : null}
        </article>
      ))}

      <section className="card provenance">
        <h2>Traceability</h2>
        <p className="muted">These principles are linked to claims in our knowledge base:</p>
        <ul>
          {ethics.supportingClaims.map((c) => (
            <li key={c.id}>{c.statement}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
