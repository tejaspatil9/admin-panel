// app/admin/components/DeleteModal.tsx
"use client";
import React from "react";

export default function DeleteModal({
  open,
  title,
  description,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 60
    }}>
      <div style={{ background: "#111", padding: 20, borderRadius: 10, width: 420 }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        {description && <p className="small-muted">{description}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
          <button onClick={onCancel} style={{ padding: "8px 12px", borderRadius: 8, background: "#222", color: "#eee", border: "1px solid #333" }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: "8px 12px", borderRadius: 8, background: "#b91c1c", color: "white", border: "none" }}>Delete</button>
        </div>
      </div>
    </div>
  );
}
