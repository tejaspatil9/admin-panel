"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Link from "next/link";

export default function DishesList() {
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ fetchDishes(); }, []);

  async function fetchDishes() {
    setLoading(true);
    const { data } = await supabase.from("dishes").select("id, name, price, imageurl, category_id").order("name");
    setDishes(data ?? []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this dish?")) return;
    await supabase.from("dishes").delete().eq("id", id);
    fetchDishes();
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
        <h2>Dishes</h2>
        <Link href="/admin/dishes/add" className="button">+ Add Dish</Link>
      </div>

      {loading ? <p>Loading...</p> : (
        <div style={{ display: "grid", gap: 12 }}>
          {dishes.map(d => (
            <div key={d.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 12, background: "#0f0f0f", borderRadius: 8 }}>
              <img src={d.imageurl ?? "/murli-logo.png"} alt={d.name} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700 }}>{d.name}</div>
                <div style={{ marginTop: 6 }}>₹ {d.price}</div>
                <div style={{ marginTop: 8 }}>
                  <Link href={`/admin/dishes/${d.id}/edit`} className="button">Edit</Link>
                  <button onClick={()=>handleDelete(d.id)} style={{ marginLeft: 8 }} className="button">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
