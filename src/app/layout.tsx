export const metadata = { title: "Future Proof" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui", margin: 0 }}>
        <div style={{ padding: 16, display: "grid", gap: 12 }}>
          <header style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <strong>Future Proof</strong>
            <span style={{ opacity: 0.6 }}>Credits & Collaboration</span>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
