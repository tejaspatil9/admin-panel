"use client";

import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-hero">
      <div className="home-hero-overlay" />

      <div className="home-hero-content">
        <Image
          src="/murli-logo.png"
          width={120}
          height={120}
          alt="Logo"
          className="home-logo"
        />

        <h1 className="home-title gold-shine">Murli Pure Veg</h1>
        <p className="home-subtitle">Authentic • Fresh • Royal Hospitality</p>

        <div className="home-buttons">
          <Link href="/menu" className="home-btn primary gold-button">
            View Menu
          </Link>
        </div>
      </div>

      {/* Small Admin Link */}
      <Link href="/admin" className="admin-small-link">
        Admin Panel
      </Link>
    </main>
  );
}
