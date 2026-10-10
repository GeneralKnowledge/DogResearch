import { getPublishable } from "@/lib/publishable";

export default function ReferralsPage() {
  const { referrals } = getPublishable();

  return (
    <>
      <h1>Get professional help</h1>
      <p className="muted">
        KindTrail teaches everyday skills. Some problems need a vet or qualified behaviourist.
      </p>

      <article className="card">
        <h2>{referrals.vetFirst.title}</h2>
        <p>{referrals.vetFirst.body}</p>
      </article>

      <article className="card">
        <h2>{referrals.abtcRegister.title}</h2>
        <p>{referrals.abtcRegister.body}</p>
        <p>
          <a href={referrals.abtcRegister.url} target="_blank" rel="noopener noreferrer">
            ABTC owner information →
          </a>
        </p>
      </article>

      <article className="card">
        <h2>{referrals.dogsTrustBehaviourLine.title}</h2>
        <p>{referrals.dogsTrustBehaviourLine.body}</p>
        <p>
          <a
            href={referrals.dogsTrustBehaviourLine.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Dogs Trust support →
          </a>
        </p>
      </article>
    </>
  );
}
