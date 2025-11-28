"use client";

import React, { useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddCategoryPage() {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!name.trim()) return alert("Category name required!");

    try {
      setLoading(true);

      let imageUrl = null;

      // upload image if selected
      if (file) {
        const ext = file.name.split(".").pop();
        const filePath = `category-${Date.now()}.${ext}`;

        const { error: uploadErr } = await supabase.storage
          .from("category-images")
          .upload(filePath, file);

        if (uploadErr) throw uploadErr;

        const { data } = supabase.storage
          .from("category-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // insert category
      const { error } = await supabase.from("categories").insert({
        name,
        imageurl: imageUrl,
      });

      if (error) throw error;

      alert("Category added!");
      router.push("/admin/categories");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error adding category");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Add Category</h2>

      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <label>Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
        />

        <label style={{ marginTop: 12 }}>Image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button className="button" style={{ marginTop: 16 }} disabled={loading}>
          {loading ? "Saving..." : "Add Category"}
        </button>
      </form>
    </div>
  );
}
