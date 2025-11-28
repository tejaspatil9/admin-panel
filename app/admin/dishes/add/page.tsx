"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddDishPage() {
  const [name, setName] = useState("");
  const [description, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, name")
      .order("name", { ascending: true });

    setCategories(data || []);
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!name.trim()) return alert("Dish name required!");
    if (!price) return alert("Price required!");
    if (!categoryId) return alert("Select a category!");
    if (!imageFile) return alert("Dish image required!");

    try {
      setLoading(true);

      const ext = imageFile.name.split(".").pop();
      const filePath = `dish-${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from("dish-images")
        .upload(filePath, imageFile);

      if (uploadErr) throw uploadErr;

      const { data } = supabase.storage
        .from("dish-images")
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      const { error } = await supabase.from("dishes").insert({
        name,
        description,
        price: Number(price),
        imageurl: imageUrl,
        category_id: categoryId,
      });

      if (error) throw error;

      alert("Dish added!");
      router.push("/admin/dishes");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error adding dish");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Add Dish</h2>

      <form onSubmit={handleSubmit}>
        <label>Dish Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />

        <label>Description</label>
        <textarea value={description} onChange={(e) => setDesc(e.target.value)} />

        <label>Price</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <label>Category</label>
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Dish Image</label>
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />

        <button className="button" disabled={loading} style={{ marginTop: 16 }}>
          {loading ? "Saving..." : "Add Dish"}
        </button>
      </form>
    </div>
  );
}
