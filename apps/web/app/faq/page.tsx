import { getPublishable } from "@/lib/publishable";

export default function FaqPage() {
  const { ownerQuestions } = getPublishable();

  return (
    <>
      <h1>Common questions</h1>
      <p className="muted">From our owner-question taxonomy (discovery themes, not medical advice).</p>
      {ownerQuestions.map((cat) => (
        <section key={cat.id} className="card">
          <h2>{cat.label}</h2>
          <ul>
            {cat.questions.map((q) => (
              <li key={q.id}>
                <strong>{q.text}</strong>
                {q.subthemes?.length ? (
                  <ul className="muted">
                    {q.subthemes.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
