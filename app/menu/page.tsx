"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "@/lib/supabaseClient";

export default function MenuPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [dishes, setDishes] = useState<any[]>([]);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  /** LOAD CATEGORIES + DISHES */
  async function loadData() {
    const { data: rawCats } = await supabase
      .from("categories")
      .select("id, name, imageurl, position")
      .order("position", { ascending: true });

    const cats = rawCats || [];
    setCategories(cats);

    const { data: rawDishes } = await supabase
      .from("dishes")
      .select("id, name, description, price, imageurl, category_id")
      .order("name", { ascending: true });

    setDishes(rawDishes || []);

    if (cats.length > 0) {
      setActiveCat(cats[0].id); // Default: show first category
    }
  }

  /** FILTER DISHES FOR ACTIVE CATEGORY */
  function dishesForCategory(catId: string) {
    const filtered = dishes.filter(d => String(d.category_id) === String(catId));

    if (!query.trim()) return filtered;

    const q = query.trim().toLowerCase();
    return filtered.filter(d =>
      d.name?.toLowerCase().includes(q) ||
      d.description?.toLowerCase().includes(q)
    );
  }

  function scrollToCategory(catId: string) {
    setActiveCat(catId); // No scrolling anymore → switch category
  }

  return (
    <div>

      {/* HERO */}
      <header className="mp-hero">
        <div className="mp-hero-inner">
          <h1 className="mp-title">Murli Pure Veg</h1>
          <p className="mp-sub">Authentic • Fresh • Pure Veg</p>

          <div className="mp-search">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes..."
            />
            <button onClick={() => setQuery("")}>✕</button>
          </div>
        </div>
      </header>

      {/* CATEGORY BAR */}
      <nav className="mp-catbar">
        <div className="mp-catbar-row">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`mp-cat-item ${activeCat === cat.id ? "active" : ""}`}
              onClick={() => scrollToCategory(cat.id)}
            >
              <div className="mp-cat-avatar">
                {cat.imageurl ? (
                  <Image
                    src={cat.imageurl}
                    alt={cat.name}
                    fill
                    className="mp-cat-img"
                    sizes="80px"
                  />
                ) : (
                  <div className="mp-cat-fallback" />
                )}
              </div>
              <div className="mp-cat-label">{cat.name}</div>
            </button>
          ))}
        </div>
      </nav>

      {/* DISH GRID — SHOW ONLY ACTIVE CATEGORY */}
      <main className="mp-main">
        {activeCat && (
          <div className="mp-section-inner">
            {dishesForCategory(activeCat).length === 0 ? (
              <p className="mp-empty">No dishes in this category.</p>
            ) : (
              <div className="mp-grid">
                {dishesForCategory(activeCat).map((dish) => (
                  <article key={dish.id} className="mp-card fade-up">

                    {/* IMAGE */}
                    <div className="mp-card-media">
                      {dish.imageurl ? (
                        <div className="mp-card-media-wrap">
                          <Image
                            src={dish.imageurl}
                            alt={dish.name}
                            fill
                            className="mp-card-img"
                            sizes="250px"
                          />
                        </div>
                      ) : (
                        <div className="mp-card-media-wrap mp-card-media-placeholder">
                          No image
                        </div>
                      )}
                    </div>

                    {/* BODY */}
                    <div className="mp-card-body">
                      <h3 className="mp-card-title">{dish.name}</h3>
                      <p className="mp-card-desc">{dish.description}</p>

                      <div className="mp-card-footer">
                        <div className="mp-price">₹ {dish.price}</div>
                        <button className="mp-add-btn">Add</button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="mp-footer">
        © {new Date().getFullYear()} Murli Pure Veg — Premium Menu
      </footer>
    </div>
  );
}
