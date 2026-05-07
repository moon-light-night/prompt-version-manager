export default function Page() {
  return (
    <main style={{ fontFamily: "monospace", padding: "2rem" }}>
      <h1>Prompt Version Manager — API</h1>
      <ul>
        <li>
          <a href="/api/health">/api/health</a>
        </li>
        <li>
          <a href="/api/trpc">/api/trpc</a>
        </li>
        <li>
          <a href="/api/graphql">/api/graphql</a>
        </li>
      </ul>
    </main>
  );
}
