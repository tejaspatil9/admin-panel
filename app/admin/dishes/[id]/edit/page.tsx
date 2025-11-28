"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function EditDishPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState<string|null>(null);
  const [preview, setPreview] = useState<string|null>(null);
  const [file, setFile] = useState<File|null>(null);

  useEffect(()=> {
    async function load() {
      const { data: cats } = await supabase.from("categories").select("id, name").order("name");
      setCategories(cats ?? []);
      const { data } = await supabase.from("dishes").select("id, name, description, price, imageurl, category_id").eq("id", id).single();
      if (data) {
        setName(data.name);
        setDesc(data.description ?? "");
        setPrice(String(data.price ?? ""));
        setPreview(data.imageurl ?? null);
        setCategoryId(String(data.category_id));
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function uploadFile(fileToUpload: File) {
    const path = `dishes/${Date.now()}-${fileToUpload.name.replace(/\s+/g,"-")}`;
    const { error } = await supabase.storage.from("dishes").upload(path, fileToUpload);
    if (error) throw error;
    const { data } = supabase.storage.from("dishes").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    try {
      let url = preview;
      if (file) url = await uploadFile(file);
      await supabase.from("dishes").update({ name: name.trim(), description: desc.trim(), price: Number(price || 0), imageurl: url, category_id: categoryId }).eq("id", id);
      router.push("/admin/dishes");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Edit Dish</h2>
      <form onSubmit={handle} style={{ maxWidth: 720 }}>
        <label><div>Name</div><input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label style={{ display: "block", marginTop: 10 }}><div>Description</div><textarea value={desc} onChange={e=>setDesc(e.target.value)} /></label>
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          <label style={{ flex: 1 }}><div>Price</div><input value={price} onChange={e=>setPrice(e.target.value)} /></label>
          <label style={{ flex: 1 }}><div>Category</div>
            <select value={categoryId ?? ""} onChange={e=>setCategoryId(e.target.value)}>
              {categories.map(c=> <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
        </div>

        <label style={{ display: "block", marginTop: 10 }}>
          <div>Image (optional)</div>
          <input type="file" accept="image/*" onChange={(e)=>{ const f = e.target.files?.[0] ?? null; setFile(f); if (f) setPreview(URL.createObjectURL(f)); }} />
        </label>

        {preview && <div style={{ marginTop: 12 }}><img src={preview} alt="preview" style={{ width: 160, height: 100, objectFit: "cover" }} /></div>}

        <div style={{ marginTop: 12 }}>
          <button className="button">Save</button>
        </div>
      </form>
    </div>
  );
}
