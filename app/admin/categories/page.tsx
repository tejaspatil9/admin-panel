"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";

export default function CategoriesPage() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    const { data } = await supabase
      .from("categories")
      .select("id, name, imageurl")
      .order("name");

    setCats(data ?? []);
    setLoading(false);
  }

  async function remove(id: string) {
    if (!confirm("Delete this category?")) return;
    await supabase.from("categories").delete().eq("id", id);
    load();
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-title">Categories</div>
        <Link href="/admin/categories/add" className="btn">+ Add Category</Link>
      </header>

      {loading ? <p>Loading...</p> : (
        <div className="admin-grid" style={{ marginTop: 24 }}>
          {cats.map((c) => (
            <div key={c.id} className="admin-item">
              <img
                src={c.imageurl || "/murli-logo.png"}
                style={{ width: 64, height: 64, borderRadius: 8, objectFit: "cover" }}
              />

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name}</div>
              </div>

              <Link href={`/admin/categories/${c.id}/edit`} className="btn">Edit</Link>
              <button onClick={() => remove(c.id)} className="btn-danger btn">Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
