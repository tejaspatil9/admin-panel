"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/lib/supabaseClient";

export default function MenuPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);
  
  async function loadData() {
    setLoading(true);
    try {
      const { data: cats } = await supabase
        .from("categories")
        .select("id, name, imageurl, position")
        .order("position", { ascending: true });

      const { data: food } = await supabase
        .from("dishes")
        .select("id, name, description, price, imageurl, category_id")
        .order("name", { ascending: true });

      setCategories(cats || []);
      setDishes(food || []);

      if (cats && cats.length > 0) {
        setActiveCat((prev) => prev ?? cats[0].id);
      }
    } catch (err) {
      console.error("Load error:", err);
    } finally {
      setLoading(false);
    }
  }

  function dishesForCategory(catId: string) {
    const all = dishes.filter((d) => String(d.category_id) === String(catId));
    if (!query.trim()) return all;
    const q = query.trim().toLowerCase();
    return all.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.description?.toLowerCase().includes(q)
    );
  }

  function formatPrice(p: any) {
    if (!p) return "—";
    const n = Number(p);
    return Number.isNaN(n) ? p : n.toLocaleString("en-IN");
  }

  // open modal with image
  function openModal(url: string | null) {
    if (!url) return;
    setModalImage(url);
    setModalOpen(true);
    // prevent body scroll
    if (typeof window !== "undefined") document.body.style.overflow = "hidden";
  }
  function closeModal() {
    setModalOpen(false);
    setModalImage(null);
    if (typeof window !== "undefined") document.body.style.overflow = "";
  }

  return (
    <div className="menu-root">
      {/* HERO */}
      <header className="mp-hero">
        <div className="mp-hero-inner">
          <div>
            <h1 className="mp-title">Murli Pure Veg</h1>
            <p className="mp-sub">Authentic • Fresh • Pure Veg</p>
          </div>

          <div className="mp-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes (e.g. dosa, paneer, roll)..."
            />
            <button onClick={() => setQuery("")} aria-label="Clear search">
              ✕
            </button>
          </div>
        </div>
      </header>

      {/* CATEGORY BAR (sticky) */}
      <nav className="mp-catbar">
        <div className="mp-catbar-row">
          {loading && categories.length === 0 ? (
            // skeleton categories
            Array.from({ length: 5 }).map((_, i) => (
              <div className="mp-cat-skeleton" key={i} />
            ))
          ) : (
            categories.map((cat) => (
              <button
                key={cat.id}
                className={`mp-cat-item ${activeCat === cat.id ? "active" : ""}`}
                onClick={() => setActiveCat(cat.id)}
                aria-pressed={activeCat === cat.id}
              >
                <div className="mp-cat-avatar" aria-hidden>
                  {cat.imageurl ? (
                    <Image
                      src={cat.imageurl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 64px, 96px"
                      className="mp-cat-img"
                      style={{ objectFit: "cover" }}
                    />
                  ) : (
                    <div className="mp-cat-fallback" />
                  )}
                </div>
                <div className="mp-cat-label">{cat.name}</div>
              </button>
            ))
          )}
        </div>
      </nav>

      {/* MAIN — only active category visible; grid keyed by activeCat so it remounts on change */}
      <main className="mp-main">
        {loading ? (
          <div className="mp-grid" key="skeleton">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="mp-card mp-card-skeleton" key={i}>
                <div className="mp-card-media-wrap-skeleton" />
                <div className="mp-card-body-skeleton">
                  <div className="s-line s-line-title" />
                  <div className="s-line s-line-desc" />
                  <div className="s-line s-line-price" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          categories
            .filter((cat) => cat.id === activeCat)
            .map((cat) => {
              const list = dishesForCategory(cat.id);
              return (
                <section key={cat.id} className="mp-section">
                  <div className="mp-section-header">
                    <h2>{cat.name}</h2>
                  </div>

                  <div className="mp-section-inner">
                    {list.length === 0 ? (
                      <p className="mp-empty">No dishes in this category.</p>
                    ) : (
                      // key on activeCat to restart animation on change
                      <div className="mp-grid" key={activeCat}>
                        {list.map((dish: any) => (
                          <article key={dish.id} className="mp-card fade-up">
                            <div
                              className="mp-card-media"
                              role="button"
                              tabIndex={0}
                              onClick={() => openModal(dish.imageurl)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") openModal(dish.imageurl);
                              }}
                              aria-label={`Open image for ${dish.name}`}
                            >
                              <div className="mp-card-media-wrap">
                                <Image
                                  src={dish.imageurl}
                                  alt={dish.name}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  style={{ objectFit: "cover" }}
                                />
                              </div>
                            </div>

                            <div className="mp-card-body">
                              <h3 className="mp-card-title">{dish.name}</h3>
                              <p className="mp-card-desc">{dish.description}</p>

                              <div className="mp-card-footer">
                                <div className="mp-price">₹ {formatPrice(dish.price)}</div>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            })
        )}
      </main>

      <footer className="mp-footer">
        © {new Date().getFullYear()} Murli Pure Veg — Premium Menu
      </footer>

      {/* IMAGE MODAL */}
      {modalOpen && modalImage && (
        <div className="image-modal" role="dialog" aria-modal="true" onClick={closeModal}>
          <button className="modal-close" onClick={closeModal} aria-label="Close image">
            ✕
          </button>
          <div className="image-modal-inner" onClick={(e) => e.stopPropagation()}>
            <Image src={modalImage} alt="Dish image" width={1200} height={1200} style={{ objectFit: "contain" }} />
          </div>
        </div>
      )}
    </div>
  );
}
