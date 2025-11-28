"use client";

import React, { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import { useParams, useRouter } from "next/navigation";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [name, setName] = useState("");
  const [preview, setPreview] = useState<string|null>(null);
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    async function load() {
      const { data } = await supabase.from("categories").select("id, name, imageurl").eq("id", id).single();
      if (data) {
        setName(data.name);
        setPreview(data.imageurl ?? null);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function upload(fileToUpload: File) {
    const path = `category-images/${Date.now()}-${fileToUpload.name.replace(/\s+/g,"-")}`;
    const { error } = await supabase.storage.from("category-images").upload(path, fileToUpload);
    if (error) throw error;
    const { data } = supabase.storage.from("category-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handle(e: React.FormEvent) {
    e.preventDefault();
    try {
      let url = preview;
      if (file) url = await upload(file);
      await supabase.from("categories").update({ name: name.trim(), imageurl: url }).eq("id", id);
      router.push("/admin/categories");
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Loading...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Edit Category</h2>
      <form onSubmit={handle} style={{ maxWidth: 640 }}>
        <label>
          <div>Name</div>
          <input value={name} onChange={e=>setName(e.target.value)} />
        </label>

        <label style={{ marginTop: 12, display: "block" }}>
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
