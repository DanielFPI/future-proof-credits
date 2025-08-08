export default function Home() {
  return (
    <main>
      <h1>Future Proof (Prototype)</h1>
      <p>Deployed on Vercel. Use the API links to poke the DB.</p>
      <ul>
        <li><a href="/api/health">API Health</a></li>
        <li><a href="/api/listings">GET /api/listings</a></li>
      </ul>
    </main>
  );
}
