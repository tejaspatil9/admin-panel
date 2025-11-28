// app/layout.tsx
import "./globals.css";
import React from "react";

export const metadata = {
  title: "Admin",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ padding: 0 }}>
          <header style={{ background: "#0f1724", padding: 12 }}>
            <div className="container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontWeight: 700 }}>Admin Dashboard</div>
              <nav><a href="/" className="small-muted" style={{textDecoration:'none'}}>View site</a></nav>
            </div>
          </header>

          <main>
            {children}
          </main>

          <footer style={{ padding: 24, textAlign: "center" }} className="small-muted">
            Built with ❤️
          </footer>
        </div>
      </body>
    </html>
  );
}
