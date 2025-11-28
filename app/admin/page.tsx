"use client";

import Link from "next/link";

export default function AdminIndex() {
  return (
    <div className="admin-container">
      <header className="admin-header">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img
            src="/murli-logo.png"
            alt="logo"
            style={{ width: 48, height: 48, borderRadius: 8 }}
          />
          <div className="admin-title">Admin Dashboard</div>
        </div>

        <Link href="/menu" className="btn">View Menu →</Link>
      </header>

      <div className="admin-grid" style={{ marginTop: 28 }}>
        <div className="admin-card">
          <h3 className="admin-heading">Categories</h3>
          <p style={{ color: "var(--text-dim)" }}>Create, edit and manage menu sections.</p>
          <Link href="/admin/categories" className="btn" style={{ marginTop: 12 }}>Open</Link>
        </div>

        <div className="admin-card">
          <h3 className="admin-heading">Dishes</h3>
          <p style={{ color: "var(--text-dim)" }}>Add dishes, update pricing, upload images.</p>
          <Link href="/admin/dishes" className="btn" style={{ marginTop: 12 }}>Open</Link>
        </div>

        <div className="admin-card">
          <h3 className="admin-heading">Settings</h3>
          <p style={{ color: "var(--text-dim)" }}>Restaurant logo, theme & more.</p>
          <button className="btn" style={{ marginTop: 12 }}>Coming soon</button>
        </div>
      </div>
    </div>
  );
}
